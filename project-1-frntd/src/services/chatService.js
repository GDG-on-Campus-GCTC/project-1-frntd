import { API_CONFIG } from '../config/api-config';

export const chatService = {
    async getChats() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/chat/list`, {
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch chats');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw error;
        }
    },

    async getChatHistory(chatId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/chat/history/${chatId}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch history');
            }

            const data = await response.json();
            // Data is the full chat object with history
            return data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    },

    async createNewChat() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/chat/new`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create new chat');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating new chat:', error);
            throw error;
        }
    },

    async deleteChat(chatId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/chat/delete/${chatId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete chat');
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting chat:', error);
            throw error;
        }
    }
};
