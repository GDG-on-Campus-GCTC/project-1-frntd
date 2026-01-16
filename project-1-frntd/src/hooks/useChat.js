import { useState, useEffect, useRef } from 'react';
import socketService from '../services/socketService';

export const useChat = (closeSidebarIfMobile, scrollToChatSection, scrollToLatestMessage) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);

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

    // Load sessions from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('chatSessions');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSessions(parsed);
            if (parsed.length > 0) {
                setCurrentSessionId(parsed[0].id);
                setMessages(parsed[0].messages);
            }
        }
    }, [setMessages]);

    // Save sessions to localStorage whenever they change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('chatSessions', JSON.stringify(sessions));
        }
    }, [sessions]);

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

        // Send via updated WebSocket
        socketService.sendMessage(
            {
                content: message,
                role: 'user',
                time: new Date().toISOString()
            },
            // onMessage - called when CSV response arrives
            (data) => {
                const finalMsg = {
                    id: Date.now(),
                    content: data.content,
                    role: 'assistant',
                    time: new Date()
                };

                setMessages(prev => [...prev, finalMsg]);
                setLoading(false);
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
        // Find the user message before this error message
        const msgIndex = messages.findIndex(m => m.id === messageId);
        if (msgIndex > 0) {
            const userMsg = messages[msgIndex - 1];
            // Remove error message and resend
            setMessages(prev => prev.filter(m => m.id !== messageId));
            handleSend({ message: userMsg.content, files: [] });
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setCurrentSessionId(null);
        closeSidebarIfMobile();
    };

    const handleLoadSession = (session) => {
        setCurrentSessionId(session.id);
        setMessages(session.messages);
        closeSidebarIfMobile();
    };

    const handleDeleteSession = (sessionId, e) => {
        e.stopPropagation();
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (currentSessionId === sessionId) {
            setMessages([]);
            setCurrentSessionId(null);
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
