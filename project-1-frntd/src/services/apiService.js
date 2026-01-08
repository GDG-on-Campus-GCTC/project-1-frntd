import { API_CONFIG } from '../config/api-config';

const API_TIMEOUT = 30000; // 30 seconds

/**
 * Convert file to Base64 string
 * @param {File} file - File object to convert
 * @returns {Promise<string>} Base64 encoded string
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Send chat message to backend API
 * @param {Object} params - Request parameters
 * @param {string} params.message - User message text
 * @param {string} params.userId - User ID from auth context
 * @param {string} params.sessionId - Session ID for grouping conversations
 * @param {string} params.conversationId - Conversation ID for this chat thread
 * @param {File[]} params.files - Optional array of files to upload
 * @returns {Promise<Object>} API response
 */
export const sendChatMessage = async ({ message, userId, sessionId, conversationId, files = [] }) => {
    try {
        // Convert files to Base64 if any
        const attachments = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const base64 = await fileToBase64(file);
                attachments.push({
                    filename: file.name,
                    content: base64,
                    type: file.type,
                    size: file.size
                });
            }
        }

        // Format request payload
        const payload = {
            message: message,
            user_id: userId || 'anonymous',
            session_id: sessionId || null,
            conversation_id: conversationId || null,
            attachments: attachments.length > 0 ? attachments : undefined,
            timestamp: new Date().toISOString()
        };

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        // Make API request
        const response = await fetch(API_CONFIG.CHAT.SEND, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: errorData.message || errorData.error || `Server error: ${response.status}`,
                code: 'SERVER_ERROR'
            };
        }

        // Parse and return response
        const data = await response.json();
        return {
            success: true,
            data: {
                content: data.content || data.message || '',
                images: data.images || [],
                metadata: data.metadata || {},
                conversationId: data.conversation_id || conversationId
            }
        };
    } catch (error) {
        // Handle timeout errors
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: {
                    message: 'Request timed out. Please try again.',
                    code: 'TIMEOUT',
                    retryable: true
                }
            };
        }

        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return {
                success: false,
                error: {
                    message: 'Network error. Please check your connection and try again.',
                    code: 'NETWORK_ERROR',
                    retryable: true
                }
            };
        }

        // Handle server errors
        if (error.status) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                    status: error.status,
                    retryable: error.status >= 500
                }
            };
        }

        // Handle unknown errors
        return {
            success: false,
            error: {
                message: 'An unexpected error occurred. Please try again.',
                code: 'UNKNOWN_ERROR',
                retryable: true,
                details: error.message
            }
        };
    }
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    } = options;

    // Check file size
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
        };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'File type not supported. Please upload images (JPG, PNG, GIF, WebP) or PDF files.'
        };
    }

    return { valid: true };
};

export default {
    sendChatMessage,
    validateFile
};
