import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';
import { chatService } from '../services/chatService';
import { API_CONFIG } from '../config/api-config';
import { toast } from 'sonner';

export const useChat = (closeSidebarIfMobile, scrollToChatSection, scrollToLatestMessage) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);

    const transformSession = useCallback((backendSession) => {
        // The API might return a full chat object or just the history array
        const history = Array.isArray(backendSession) ? backendSession : (backendSession.history || []);
        const transformedMessages = [];

        history.forEach((h, index) => {
            // Map 'question' to user role
            if (h.question) {
                transformedMessages.push({
                    id: h._id || `q-${index}-${Date.now()}`,
                    content: h.question,
                    role: 'user',
                    time: h.timestamp ? new Date(h.timestamp) : new Date()
                });
            }
            // Map 'answer' to assistant role
            if (h.answer) {
                transformedMessages.push({
                    id: h._id ? `${h._id}-ans` : `a-${index}-${Date.now()}`,
                    content: h.answer,
                    role: 'assistant',
                    time: h.timestamp ? new Date(h.timestamp) : new Date()
                });
            }
        });

        return {
            id: backendSession._id || null,
            name: backendSession.title || 'Untitled Chat',
            messages: transformedMessages,
            time: backendSession.updatedAt ? new Date(backendSession.updatedAt) : new Date()
        };
    }, []);

    // Initialize WebSocket connection (Keeping cleanup logic just in case, though we are using fetch for streaming now)
    useEffect(() => {
        socketService.connect().catch(err => {
            console.error('Failed to connect to WebSocket:', err);
        });

        return () => {
            socketService.disconnect();
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToLatestMessage();
        }
    }, [messages, scrollToLatestMessage]);

    // Load session list from API on mount
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await chatService.getChats(); // This now calls /chat/list
                if (data && Array.isArray(data)) {
                    const transformed = data.map(transformSession);
                    setSessions(transformed);
                }
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
                toast.error(error.message || 'Failed to fetch sessions');
            }
        };
        fetchSessions();
    }, [transformSession]);

    const generateSessionName = (firstMessage) => {
        const words = firstMessage.split(' ').slice(0, 4).join(' ');
        return words.length > 30 ? words.substring(0, 30) + '...' : words;
    };

    const handleSend = async ({ message, files, mode = 'lite' }) => {
        if ((!message || !message.trim()) && files.length === 0) return;
        if (loading) return;

        const userMsg = {
            id: Date.now(),
            content: message,
            role: 'user',
            time: new Date()
        };

        const assistantMsgId = Date.now() + 1;
        const assistantMsgPlaceholder = {
            id: assistantMsgId,
            content: '',
            role: 'assistant',
            time: new Date(),
            isStreaming: true
        };

        // Optimistically add messages
        setMessages(prev => [...prev, userMsg, assistantMsgPlaceholder]);
        setLoading(true);

        try {
            // Ensure we have a chat ID
            let activeChatId = currentSessionId;
            if (!activeChatId) {
                try {
                    const newChat = await chatService.createNewChat();
                    activeChatId = newChat._id || newChat.chatId;
                    setCurrentSessionId(activeChatId);

                    // Add new session to list
                    setSessions(prev => [{
                        id: activeChatId,
                        name: 'New Chat',
                        messages: [],
                        time: new Date()
                    }, ...prev]);
                } catch (error) {
                    console.error('Failed to create new chat session:', error);
                    throw new Error('Failed to start new chat');
                }
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: message,
                    chatId: activeChatId,
                    mode: mode
                }),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Stream failed');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                accumulatedContent += text;

                // Update the assistant message in state
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMsgId
                        ? { ...msg, content: accumulatedContent }
                        : msg
                ));
            }

            // Final update to remove streaming flag
            setMessages(prev => prev.map(msg =>
                msg.id === assistantMsgId
                    ? { ...msg, isStreaming: false }
                    : msg
            ));

            // Refetch sessions to update title if it was a new chat or title changed
            // Optional optimization: only do this if it was a new chat or every N messages
            // const updatedSessions = await chatService.getChats();
            // setSessions(updatedSessions.map(transformSession));

        } catch (error) {
            console.error('Error in streaming chat:', error);
            setMessages(prev => prev.map(msg =>
                msg.id === assistantMsgId
                    ? {
                        ...msg,
                        isStreaming: false,
                        content: msg.content || '', // Keep any partial content
                        error: { message: error.message || 'Connection error. Please try again.', retryable: true }
                    }
                    : msg
            ));
            toast.error(error.message || 'Message failed to send');
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectClick = (subject) => {
        handleSend({ message: `Show ${subject.name} resources`, files: [] });
        // Scroll to chat section after clicking subject card
        setTimeout(() => scrollToChatSection(), 100);
        closeSidebarIfMobile();
    };

    const handleRetry = (messageId) => {
        const msgIndex = messages.findIndex(m => m.id === messageId);
        if (msgIndex > 0) {
            const userMsg = messages[msgIndex - 1]; // Assuming previous message is the user prompt

            // Remove the failed message and the user message to re-send
            // Actually, better UX is to keep the user message and just retry sending.
            // But handleSend adds a NEW user message.
            // So we should remove both, or modify handleSend to accept 'retry' mode.
            // Simplest: Remove both and call handleSend with content.

            // Remove the error message and the preceding user message from UI
            setMessages(prev => prev.filter((_, idx) => idx !== msgIndex && idx !== msgIndex - 1));

            handleSend({ message: userMsg.content, files: [] });
        }
    };

    const handleNewChat = async () => {
        setLoading(true);
        try {
            // 1. Create a new row in DB and get its ID immediately
            const newChatData = await chatService.createNewChat();
            const chatId = newChatData._id || newChatData.chatId;

            // 2. Set the state locally
            setMessages([]);
            setCurrentSessionId(chatId);

            // 3. Add to sidebar sessions list immediately with temporary title
            const newSession = {
                id: chatId,
                name: newChatData.title || 'New Chat',
                messages: [],
                time: new Date()
            };
            setSessions(prev => [newSession, ...prev]);

        } catch (error) {
            console.error('Failed to initialize new chat:', error);
            toast.error(error.message || 'Failed to initialize new chat');
        } finally {
            setLoading(false);
            closeSidebarIfMobile();
        }
    };

    const handleLoadSession = async (session) => {
        setLoading(true);
        setCurrentSessionId(session.id);

        try {
            // Fetch full history on-demand for the specific chat
            const fullData = await chatService.getChatHistory(session.id);
            const transformed = transformSession(fullData);
            setMessages(transformed.messages);
        } catch (error) {
            console.error('Failed to load session history:', error);
            toast.error(error.message || 'Failed to load session history');
            setMessages([]);
        } finally {
            setLoading(false);
            closeSidebarIfMobile();
        }
    };

    const handleDeleteSession = async (sessionId, e) => {
        e.stopPropagation();
        try {
            await chatService.deleteChat(sessionId);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            if (currentSessionId === sessionId) {
                setMessages([]);
                setCurrentSessionId(null);
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
            toast.error(error.message || 'Failed to delete session');
            // Optionally show error to user
        }
    };

    return {
        messages,
        loading,
        sessions,
        currentSessionId,
        handleSend,
        handleSubjectClick,
        handleRetry,
        handleNewChat,
        handleLoadSession,
        handleDeleteSession
    };
};
