import { apiClient } from './apiClient';

export const authApi = {
    login: async (username, password, role) => {
        const response = await apiClient.post('/auth/login', { username, password, role });
        
        console.log('Login response received:', response);

        // Save token and user on success
        if (response.success && response.token) {
            console.log('Saving token to localStorage:', response.token.substring(0, 10) + '...');
            localStorage.setItem('hackfest_token', response.token);
            // The user object is returned in response.user
        } else {
            console.warn('Login successful but no token found in response:', response);
        }

        return response;
    },

    changePassword: async (currentPassword, newPassword) => {
        return apiClient.post('/auth/change-password', { currentPassword, newPassword });
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout', {});
        } catch (err) {
            console.error('Logout API error', err);
        } finally {
            // Always clean up local storage
            localStorage.removeItem('hackfest_token');
            localStorage.removeItem('hackfest_user');
        }
        return true;
    }
};
