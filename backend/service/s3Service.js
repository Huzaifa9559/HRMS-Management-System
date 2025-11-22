const AWS = require('aws-sdk');
const path = require('path');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} folder - Folder path in S3 (e.g., 'documents', 'payslips', 'employees')
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} S3 key (path) of uploaded file
 */
async function uploadToS3(fileBuffer, fileName, folder, contentType) {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  const key = `${folder}/${Date.now()}-${fileName}`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'private', // Private by default, use signed URLs for access
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Key; // Return the S3 key (path)
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
}

/**
 * Get signed URL for downloading file from S3
 * @param {string} s3Key - S3 key (path) of the file
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} Signed URL
 */
async function getSignedUrl(s3Key, expiresIn = 3600) {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  if (!s3Key) {
    throw new Error('S3 key is required');
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Expires: expiresIn,
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

/**
 * Delete file from S3
 * @param {string} s3Key - S3 key (path) of the file
 * @returns {Promise<void>}
 */
async function deleteFromS3(s3Key) {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  if (!s3Key) {
    throw new Error('S3 key is required');
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error(`Failed to delete file from S3: ${error.message}`);
  }
}

/**
 * Check if file exists in S3
 * @param {string} s3Key - S3 key (path) of the file
 * @returns {Promise<boolean>}
 */
async function fileExistsInS3(s3Key) {
  if (!BUCKET_NAME || !s3Key) {
    return false;
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
  };

  try {
    await s3.headObject(params).promise();
    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * Get file stream from S3 for downloading
 * @param {string} s3Key - S3 key (path) of the file
 * @returns {Promise<AWS.S3.GetObjectOutput>}
 */
async function getFileStream(s3Key) {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  if (!s3Key) {
    throw new Error('S3 key is required');
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
  };

  try {
    return s3.getObject(params).createReadStream();
  } catch (error) {
    console.error('Error getting file stream from S3:', error);
    throw new Error(`Failed to get file from S3: ${error.message}`);
  }
}

module.exports = {
  uploadToS3,
  getSignedUrl,
  deleteFromS3,
  fileExistsInS3,
  getFileStream,
  BUCKET_NAME,
};
