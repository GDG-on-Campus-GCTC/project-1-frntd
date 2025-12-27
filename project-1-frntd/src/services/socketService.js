import { io } from 'socket.io-client';

// WebSocket Service for Real-time Streaming Communication
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
const RECONNECTION_ATTEMPTS = 5;
const RECONNECTION_DELAY = 2000;

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.messageCallbacks = new Map();
        this.currentMessageId = null;
        this.streamBuffer = '';
    }

    /**
     * Initialize WebSocket connection
     */
    connect() {
        if (this.socket?.connected) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.socket = io(WS_URL, {
                transports: ['websocket'],
                reconnectionAttempts: RECONNECTION_ATTEMPTS,
                reconnectionDelay: RECONNECTION_DELAY,
                timeout: 10000,
            });

            this.socket.on('connect', () => {
                console.log('✅ WebSocket connected');
                this.isConnected = true;
                resolve();
            });

            this.socket.on('disconnect', () => {
                console.log('❌ WebSocket disconnected');
                this.isConnected = false;
            });

            this.socket.on('connect_error', (error) => {
                console.error('WebSocket connection error:', error);
                this.isConnected = false;
                reject(error);
            });

            // Handle streaming events
            this.socket.on('stream_start', this.handleStreamStart.bind(this));
            this.socket.on('stream_chunk', this.handleStreamChunk.bind(this));
            this.socket.on('stream_end', this.handleStreamEnd.bind(this));
            this.socket.on('error', this.handleError.bind(this));
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
     * Send chat message with streaming response
     * @param {Object} params - Message parameters
     * @param {Function} onChunk - Callback for each streaming chunk
     * @param {Function} onComplete - Callback when streaming completes
     * @param {Function} onError - Callback for errors
     */
    async sendMessage({ message, userId, sessionId, conversationId, files = [] }, onChunk, onComplete, onError) {
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

        // Generate unique message ID
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.currentMessageId = messageId;
        this.streamBuffer = '';

        // Store callbacks
        this.messageCallbacks.set(messageId, {
            onChunk,
            onComplete,
            onError
        });

        // Convert files to Base64
        const attachments = [];
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    const base64 = await this.fileToBase64(file);
                    attachments.push({
                        filename: file.name,
                        content: base64,
                        type: file.type,
                        size: file.size
                    });
                } catch (error) {
                    console.error('File conversion error:', error);
                }
            }
        }

        // Send message payload
        const payload = {
            message_id: messageId,
            message,
            user_id: userId || 'anonymous',
            session_id: sessionId || null,
            conversation_id: conversationId || null,
            attachments: attachments.length > 0 ? attachments : undefined,
            timestamp: new Date().toISOString()
        };

        this.socket.emit('chat_message', payload);

        // Set timeout for response
        setTimeout(() => {
            if (this.messageCallbacks.has(messageId) && this.streamBuffer === '') {
                this.handleError({
                    message_id: messageId,
                    message: 'Request timed out. Please try again.',
                    code: 'TIMEOUT',
                    retryable: true
                });
            }
        }, 30000); // 30 second timeout
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
