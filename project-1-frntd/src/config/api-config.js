const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    AUTH: {
        GOOGLE: `${API_BASE_URL}/auth/google`,
        STATUS: `${API_BASE_URL}/auth/status`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        SIGNUP_EMAIL: `${API_BASE_URL}/auth/signup/email`, // Placeholder if needed
        SIGNUP_PHONE: `${API_BASE_URL}/auth/signup/phone`  // Placeholder if needed
    },
    CHAT: {
        SEND: `${API_BASE_URL}/chat`, // Adjusted to match the new base if implied, or keep specific logic?
        // Note: apiService.js had /chat. If the prefix is /api, we might need to adjust BASE_URL or the path.
        // apiService currently uses http://localhost:8000/api -> /chat
        // User wants localhost:3000.
        // I will assume the new endpoint is simply /chat on the base URL, or /api/chat? 
        // Logic suggests: http://localhost:3000/chat or http://localhost:3000/api/chat.
        // For now, I will map it to BASE_URL + '/chat' to be consistent, but I will double check.
    }
};

export default API_CONFIG;
