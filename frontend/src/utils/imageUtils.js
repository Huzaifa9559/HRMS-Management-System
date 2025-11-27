/**
 * Helper function to get the correct image URL
 * Handles both S3 URLs (full URLs) and local file paths
 * @param {string} imageValue - The image value from API (could be full URL or filename)
 * @param {string} backendURL - The backend URL for local files
 * @param {string} localPath - The local path prefix (e.g., '/uploads/employees/')
 * @returns {string|null} - Full image URL or null
 */
export function getImageUrl(imageValue, backendURL, localPath = '/uploads/employees/') {
  if (!imageValue) {
    return null;
  }

  // If it's already a full URL (S3 or external), use it directly
  if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
    return imageValue;
  }

  // Otherwise, construct the backend URL for local files
  return `${backendURL}${localPath}${imageValue}`;
}

