// src/lib/api.js
const API_URL ='http://localhost:8000';

/**
 * API client for CSV RAG Backend
 */
export const api = {
  /**
   * Upload a CSV file
   * @param {File} file - The CSV file to upload
   * @returns {Promise<Object>} - Response with file_id and message
   */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload file');
    }

    return response.json();
  },

  /**
   * Upload a CSV file from a local path
   * @param {string} filePath - Path to the CSV file
   * @param {string} sourceType - Either "disk" or "project"
   * @returns {Promise<Object>} - Response with file_id and message
   */
  uploadFromPath: async (filePath, sourceType) => {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_type: sourceType,
        file_path: filePath,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload file');
    }

    return response.json();
  },

  /**
   * Get list of all CSV files
   * @returns {Promise<Object>} - Response with files array
   */
  getFiles: async () => {
    const response = await fetch(`${API_URL}/files`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get files');
    }

    return response.json();
  },

  /**
   * Query a CSV file
   * @param {string} fileId - ID of the file to query
   * @param {string} query - Natural language query
   * @returns {Promise<Object>} - Response with query result
   */
  queryFile: async (fileId, query) => {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_id: fileId,
        query,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to query file');
    }

    return response.json();
  },

  /**
   * Delete a CSV file
   * @param {string} fileId - ID of the file to delete
   * @returns {Promise<Object>} - Response with deletion message
   */
  deleteFile: async (fileId) => {
    const response = await fetch(`${API_URL}/file/${fileId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete file');
    }

    return response.json();
  },
};

export default api;