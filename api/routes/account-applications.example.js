/**
 * Example: Integrating Supabase with Account Opening Form
 * 
 * This example shows how to save account opening applications
 * to Supabase database and upload documents to blob storage.
 */

const express = require('express');
const multer = require('multer');
const supabase = require('./database');
const { uploadFile } = require('./blob-storage');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * POST /api/submit-application
 * Submit a new account opening application
 */
router.post('/submit-application', upload.fields([
  { name: 'id_front', maxCount: 1 },
  { name: 'id_back', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
  { name: 'proof_of_address', maxCount: 1 }
]), async (req, res) => {
  try {
    const formData = req.body;
    const files = req.files;
    
    // Step 1: Validate required fields
    const requiredFields = ['full_name', 'email', 'phone', 'id_number', 'account_type'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Step 2: Create application record in database
    const applicationData = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      id_number: formData.id_number,
      account_type: formData.account_type,
      nationality: formData.nationality || null,
      date_of_birth: formData.date_of_birth || null,
      occupation: formData.occupation || null,
      annual_income: formData.annual_income || null,
      status: 'pending_review',
      submitted_at: new Date().toISOString()
    };
    
    const { data: application, error: dbError } = await supabase
      .from('account_applications')
      .insert([applicationData])
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save application to database');
    }
    
    console.log('✅ Application saved with ID:', application.id);
    
    // Step 3: Upload documents to blob storage (if any)
    const documentUrls = {};
    
    if (files) {
      for (const [fieldName, fileArray] of Object.entries(files)) {
        const file = fileArray[0];
        const fileName = `${application.id}/${fieldName}-${Date.now()}.${file.originalname.split('.').pop()}`;
        
        const uploadResult = await uploadFile(
          file.buffer,
          fileName,
          'musharaka-uploads'
        );
        
        if (uploadResult.success) {
          documentUrls[fieldName] = {
            url: uploadResult.publicUrl,
            path: uploadResult.path
          };
        } else {
          console.error(`Failed to upload ${fieldName}:`, uploadResult.error);
        }
      }
    }
    
    // Step 4: Update application with document URLs
    if (Object.keys(documentUrls).length > 0) {
      const { error: updateError } = await supabase
        .from('account_applications')
        .update({
          documents: documentUrls,
          has_documents: true
        })
        .eq('id', application.id);
      
      if (updateError) {
        console.error('Failed to update application with documents:', updateError);
      }
    }
    
    // Step 5: Send success response
    res.json({
      success: true,
      message: 'Application submitted successfully',
      application_id: application.id,
      reference_number: `MSHK-${application.id.toString().padStart(6, '0')}`,
      documents_uploaded: Object.keys(documentUrls).length
    });
    
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit application'
    });
  }
});

/**
 * GET /api/applications/:id
 * Get application details by ID
 */
router.get('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: application, error } = await supabase
      .from('account_applications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      data: application
    });
    
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/applications
 * Get all applications (admin only)
 */
router.get('/applications', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('account_applications')
      .select('*', { count: 'exact' })
      .order('submitted_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    
    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: applications, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: applications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/applications/:id/status
 * Update application status (admin only)
 */
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, rejection_reason } = req.body;
    
    // Validate status
    const validStatuses = ['pending_review', 'approved', 'rejected', 'needs_more_info'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const updateData = {
      status: status,
      reviewed_at: new Date().toISOString()
    };
    
    if (admin_notes) updateData.admin_notes = admin_notes;
    if (rejection_reason) updateData.rejection_reason = rejection_reason;
    
    const { data: application, error } = await supabase
      .from('account_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      message: 'Application status updated',
      data: application
    });
    
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/applications/:id
 * Delete an application (admin only)
 */
router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, get the application to find associated documents
    const { data: application, error: fetchError } = await supabase
      .from('account_applications')
      .select('documents')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }
      throw fetchError;
    }
    
    // Delete documents from storage if they exist
    if (application.documents) {
      const { deleteFile } = require('./blob-storage');
      
      for (const [docType, docInfo] of Object.entries(application.documents)) {
        await deleteFile(docInfo.path, 'musharaka-uploads');
      }
    }
    
    // Delete the application record
    const { error: deleteError } = await supabase
      .from('account_applications')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
