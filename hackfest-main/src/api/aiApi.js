import { apiClient } from './apiClient';

export const aiApi = {
    /**
     * Send a text message to the AI
     * @param {string} message - User message
     * @param {Array} history - Chat history
     */
    chat: async (message, history = []) => {
        return apiClient.post('/ai/chat', { message, history });
    },

    /**
     * Send an image and message for analysis
     * @param {File} image - Image file
     * @param {string} message - User message/query
     */
    analyzeImage: async (image, message = '') => {
        const formData = new FormData();
        formData.append('image', image);
        if (message) {
            formData.append('message', message);
        }
        return apiClient.postMultipart('/ai/analyze-image', formData);
    }
};
