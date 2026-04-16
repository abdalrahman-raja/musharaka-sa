'use strict';
const supabase = require('./database');

/**
 * Upload file to Supabase Blob Storage
 * @param {Buffer|Blob} fileData - The file data to upload
 * @param {string} fileName - The name/path of the file
 * @param {string} bucket - The bucket name (default: 'musharaka-uploads')
 * @returns {Object} Upload result with public URL
 */
async function uploadFile(fileData, fileName, bucket = 'musharaka-uploads') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Download file from Supabase Blob Storage
 * @param {string} fileName - The name of the file
 * @param {string} bucket - The bucket name
 * @returns {Object} File data
 */
async function downloadFile(fileName, bucket = 'musharaka-uploads') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .download(fileName);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete file from Supabase Blob Storage
 * @param {string} fileName - The name of the file
 * @param {string} bucket - The bucket name
 * @returns {Object} Deletion result
 */
async function deleteFile(fileName, bucket = 'musharaka-uploads') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      throw error;
    }

    return {
      success: true,
      deleted: data
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List files in a bucket
 * @param {string} bucket - The bucket name
 * @param {string} path - Optional path prefix
 * @returns {Array} List of files
 */
async function listFiles(bucket = 'musharaka-uploads', path = '') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .list(path);

    if (error) {
      throw error;
    }

    return {
      success: true,
      files: data
    };
  } catch (error) {
    console.error('List files error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a signed URL for temporary access
 * @param {string} fileName - The name of the file
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
 * @param {string} bucket - The bucket name
 * @returns {Object} Signed URL
 */
async function generateSignedUrl(fileName, expiresIn = 3600, bucket = 'musharaka-uploads') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(fileName, expiresIn);

    if (error) {
      throw error;
    }

    return {
      success: true,
      signedUrl: data.signedUrl
    };
  } catch (error) {
    console.error('Generate signed URL error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles,
  generateSignedUrl
};
