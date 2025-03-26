// src/lib/storage.js

const HISTORY_KEY = 'csv_rag_history';

/**
 * Utilities for managing query history in local storage
 */
const historyStorage = {
  /**
   * Get all query history items
   * @returns {Array} Array of history items
   */
  getHistory: () => {
    try {
      const history = localStorage.getItem(HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to get history from localStorage:', error);
      return [];
    }
  },

  /**
   * Add a new query to history
   * @param {Object} queryItem - Query history item
   * @param {string} queryItem.fileId - ID of the queried file
   * @param {string} queryItem.fileName - Name of the queried file
   * @param {string} queryItem.query - The query text
   * @param {string} queryItem.response - The response text
   * @param {Date} queryItem.timestamp - When the query was made
   */
  addToHistory: (queryItem) => {
    try {
      const history = historyStorage.getHistory();
      
      // Add timestamp if not provided
      if (!queryItem.timestamp) {
        queryItem.timestamp = new Date().toISOString();
      }
      
      // Add to beginning of array (newest first)
      const updatedHistory = [queryItem, ...history];
      
      // Limit history to 50 items to prevent localStorage overflow
      const limitedHistory = updatedHistory.slice(0, 50);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Failed to add to history in localStorage:', error);
    }
  },

  /**
   * Clear all history
   */
  clearHistory: () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history from localStorage:', error);
    }
  },

  /**
   * Delete a specific history item by timestamp
   * @param {string} timestamp - Timestamp of the item to delete
   */
  deleteHistoryItem: (timestamp) => {
    try {
      const history = historyStorage.getHistory();
      const updatedHistory = history.filter(item => item.timestamp !== timestamp);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to delete history item from localStorage:', error);
    }
  },
};

export default historyStorage;