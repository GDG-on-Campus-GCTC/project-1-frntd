import { API_CONFIG } from '../config/api-config';

export const authService = {
    async login(credentials) {
        try {
            const response = await fetch(API_CONFIG.AUTH.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include', // Ensure cookies are handled if backend uses them
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await fetch(API_CONFIG.AUTH.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async checkStatus() {
        try {
            const response = await fetch(API_CONFIG.AUTH.STATUS, {
                credentials: 'include'
            });

            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Auth status check failed:", error);
            return null;
        }
    },

    async logout() {
        try {
            await fetch(API_CONFIG.AUTH.LOGOUT, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout API call failed:', error);
            throw error;
        }
    }
};

