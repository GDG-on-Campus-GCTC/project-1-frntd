import { io } from 'socket.io-client';

// WebSocket Service for Real-time Communication
const WS_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const RECONNECTION_ATTEMPTS = 5;
const RECONNECTION_DELAY = 2000;

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.onMessageCallback = null;
    }

    connect() {
        if (this.socket?.connected) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.socket = io(WS_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnectionAttempts: RECONNECTION_ATTEMPTS,
                reconnectionDelay: RECONNECTION_DELAY,
                timeout: 10000,
            });

            this.socket.on('connect', () => {
                console.log('WebSocket connected to CSV Backend');
                this.isConnected = true;
                resolve();
            });

            this.socket.on('disconnect', () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
            });

            this.socket.on('connect_error', (error) => {
                console.error('WebSocket connection error:', error);
                this.isConnected = false;
                reject(error);
            });

            // Handle CSV backend response
            this.socket.on('receive_message', (data) => {
                if (this.onMessageCallback) {
                    this.onMessageCallback(data);
                }
            });
        });
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    /**
     * Send chat message
     * @param {Object} payload - Message payload
     * @param {Function} onMessage - Callback for the response
     * @param {Function} onError - Callback for errors
     */
    async sendMessage(payload, onMessage, onError) {
        if (!this.isConnected) {
            try {
                await this.connect();
            } catch (error) {
                onError?.({
                    message: 'Failed to connect to server. Please check your connection.',
                    code: 'CONNECTION_ERROR',
                    retryable: true
                });
                return;
            }
        }

        this.onMessageCallback = onMessage;
        this.socket.emit('send_message', payload);
    }

    /**
     * Handle stream start event
     */
    handleStreamStart(data) {
        const { message_id, conversation_id } = data;
        this.currentMessageId = message_id;
        this.streamBuffer = '';

        const callbacks = this.messageCallbacks.get(message_id);
        if (callbacks?.onChunk) {
            callbacks.onChunk('', { isStart: true, conversation_id });
        }
    }

    /**
     * Handle streaming chunk
     */
    handleStreamChunk(data) {
        const { message_id, content } = data;

        if (message_id !== this.currentMessageId) return;

        this.streamBuffer += content;

        const callbacks = this.messageCallbacks.get(message_id);
        if (callbacks?.onChunk) {
            callbacks.onChunk(this.streamBuffer, { isStreaming: true });
        }
    }

    /**
     * Handle stream end
     */
    handleStreamEnd(data) {
        const { message_id, images = [], metadata = {}, conversation_id } = data;

        const callbacks = this.messageCallbacks.get(message_id);
        if (callbacks?.onComplete) {
            callbacks.onComplete({
                content: this.streamBuffer,
                images,
                metadata,
                conversation_id
            });
        }

        // Cleanup
        this.messageCallbacks.delete(message_id);
        this.streamBuffer = '';
        this.currentMessageId = null;
    }

    /**
     * Handle error event
     */
    handleError(data) {
        const { message_id, message, code, retryable = true } = data;

        const callbacks = this.messageCallbacks.get(message_id || this.currentMessageId);
        if (callbacks?.onError) {
            callbacks.onError({
                message: message || 'An error occurred',
                code: code || 'UNKNOWN_ERROR',
                retryable
            });
        }

        // Cleanup
        if (message_id) {
            this.messageCallbacks.delete(message_id);
        }
        this.streamBuffer = '';
        this.currentMessageId = null;
    }

    /**
     * Convert file to Base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    /**
     * Get connection status
     */
    getConnectionStatus() {
        return this.isConnected;
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
