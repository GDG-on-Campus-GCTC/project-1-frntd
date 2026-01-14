import { useState, useEffect, useRef, useCallback } from 'react';
import socketService from '../services/socketService';
import { chatService } from '../services/chatService';

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

    // Initialize WebSocket connection
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
            }
        };
        fetchSessions();
    }, [transformSession]);

    const generateSessionName = (firstMessage) => {
        const words = firstMessage.split(' ').slice(0, 4).join(' ');
        return words.length > 30 ? words.substring(0, 30) + '...' : words;
    };

    const handleSend = async ({ message, files }) => {
        // Create user message
        const userMsg = {
            id: Date.now(),
            content: message,
            role: 'user',
            time: new Date()
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setLoading(true);

        // Prepare payload: Use the pre-existing currentSessionId
        const payload = {
            content: message,
            chatId: currentSessionId
        };

        // Send via WebSocket
        socketService.sendMessage(
            payload,
            // onMessage - called when response arrives
            (data) => {
                const finalMsg = {
                    id: Date.now(),
                    content: data.content,
                    role: 'assistant',
                    time: new Date()
                };

                const updatedMessages = [...newMessages, finalMsg];
                setMessages(updatedMessages);
                setLoading(false);

                // Update session state (e.g., if title changed on first message)
                setSessions(prev => prev.map(s =>
                    s.id === currentSessionId
                        ? {
                            ...s,
                            name: data.title || s.name,
                            messages: updatedMessages,
                            time: new Date()
                        }
                        : s
                ));
            },
            // onError - called if error occurs
            (error) => {
                const errorMsg = {
                    id: Date.now(),
                    content: '',
                    role: 'assistant',
                    time: new Date(),
                    error: error
                };

                setMessages(prev => [...prev, errorMsg]);
                setLoading(false);
            }
        );
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
            const userMsg = messages[msgIndex - 1];
            setMessages(prev => prev.filter(m => m.id !== messageId));
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
