require('dotenv').config();
const { uploadFile, listFiles } = require('../api/blob-storage');

async function testBlobStorage() {
  console.log('Testing Blob Storage Connection...\n');
  
  // Check environment variables
  console.log('✓ Checking environment variables...');
  if (!process.env.MUSHARAKA_SUPABASE_URL && !process.env.SUPABASE_URL) {
    console.error('✗ MUSHARAKA_SUPABASE_URL or SUPABASE_URL not set');
    return;
  }
  if (!process.env.MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('✗ MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY not set');
    return;
  }
  console.log('✓ Environment variables configured\n');
  
  // Test upload
  console.log('✓ Testing file upload...');
  try {
    const testFile = Buffer.from('Test content for blob storage - Musharaka Financial Services');
    const result = await uploadFile(testFile, 'test/test-file.txt');
    
    if (result.success) {
      console.log('✓ Upload successful!');
      console.log('  Path:', result.path);
      console.log('  URL:', result.publicUrl);
    } else {
      console.error('✗ Upload failed:', result.error);
    }
  } catch (error) {
    console.error('✗ Upload error:', error.message);
  }
  
  // Test list files
  console.log('\n✓ Testing file listing...');
  try {
    const result = await listFiles('musharaka-uploads', 'test');
    
    if (result.success) {
      console.log('✓ Files listed successfully!');
      console.log('  Found', result.files.length, 'files');
      result.files.forEach(file => {
        console.log('    -', file.name);
      });
    } else {
      console.error('✗ List failed:', result.error);
    }
  } catch (error) {
    console.error('✗ List error:', error.message);
  }
  
  console.log('\n✓ Blob storage test complete!');
}

testBlobStorage().catch(console.error);
