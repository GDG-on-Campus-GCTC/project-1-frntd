import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import socketService from './services/socketService';
import {
    Cpu,
    Globe,
    Database,
    Code2,
    Workflow,
    Bot,
    Layers,
    Network,
    Terminal,
    Zap,
    Calculator,
    Monitor,
    BookOpen,
    Target,
    Settings
} from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import InputBox from './components/InputBox';
import SubjectCard from './components/SubjectCard';
import LogoLoop from './components/LogoLoop';
import LightRays from './components/LightRays';
import logo from './assets/logo.png';
import './Home.css';

const techIcons = [
    { node: <Cpu size={24} />, title: "CPU" },
    { node: <Globe size={24} />, title: "Network" },
    { node: <Database size={24} />, title: "Database" },
    { node: <Code2 size={24} />, title: "Coding" },
    { node: <Workflow size={24} />, title: "Logic" },
    { node: <Bot size={24} />, title: "AI" },
    { node: <Layers size={24} />, title: "Structure" },
    { node: <Network size={24} />, title: "Connectivity" },
    { node: <Terminal size={24} />, title: "Terminal" },
    { node: <Zap size={24} />, title: "Performance" }
];

const subjects = [
    { id: 'daa', name: 'DAA', icon: <Calculator size={22} />, color: '#6366f1', desc: 'Algorithms & Complexity', count: 24 },
    { id: 'os', name: 'Operating Systems', icon: <Monitor size={22} />, color: '#a855f7', desc: 'Process & Memory Management', count: 18 },
    { id: 'dbms', name: 'DBMS', icon: <Database size={22} />, color: '#ec4899', desc: 'SQL & Database Design', count: 21 },
    { id: 'cn', name: 'Computer Networks', icon: <Network size={22} />, color: '#06b6d4', desc: 'TCP/IP & Routing', count: 15 },
    { id: 'se', name: 'Software Engineering', icon: <Settings size={22} />, color: '#f59e0b', desc: 'SDLC & Design Patterns', count: 12 },
    { id: 'ml', name: 'Machine Learning', icon: <Bot size={22} />, color: '#10b981', desc: 'AI & Neural Networks', count: 16 }
];

function Home() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [streamingMessageId, setStreamingMessageId] = useState(null);
    const messagesEndRef = useRef(null);
    const chatSectionRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Auto-close sidebar on mobile after selecting something
    const closeSidebarIfMobile = () => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    // Auto-scroll to bottom of messages only (not whole page)
    const scrollToLatestMessage = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // Scroll to chat section when subject card is clicked
    const scrollToChatSection = () => {
        chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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
    }, [messages]);

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
    }, []);

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
            time: new Date(),
            files: files?.length > 0 ? files.map(f => f.name) : undefined
        };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setLoading(true);

        // Create or update session
        if (messages.length === 0) {
            const sessionName = generateSessionName(message);
            const newSession = {
                id: Date.now(),
                name: sessionName,
                messages: newMessages,
                createdAt: new Date()
            };
            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(newSession.id);
            setSessionId(`session_${newSession.id}`);
        } else {
            setSessions(prev => prev.map(s =>
                s.id === currentSessionId ? { ...s, messages: newMessages } : s
            ));
        }

        // Create placeholder AI message for streaming
        const aiMsgId = Date.now() + 1;
        const aiMsg = {
            id: aiMsgId,
            content: '',
            role: 'assistant',
            time: new Date(),
            isStreaming: true
        };

        const messagesWithPlaceholder = [...newMessages, aiMsg];
        setMessages(messagesWithPlaceholder);
        setStreamingMessageId(aiMsgId);

        // Send via WebSocket with streaming callbacks
        socketService.sendMessage(
            {
                message,
                userId: user?.id || user?.email || 'anonymous',
                sessionId: sessionId || `session_${currentSessionId || Date.now()}`,
                conversationId: currentSessionId?.toString(),
                files: files || []
            },
            // onChunk - called for each streaming chunk
            (content, meta) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId
                        ? { ...msg, content, isStreaming: true }
                        : msg
                ));
            },
            // onComplete - called when streaming finishes
            (data) => {
                const finalMsg = {
                    id: aiMsgId,
                    content: data.content,
                    role: 'assistant',
                    time: new Date(),
                    images: data.images || [],
                    metadata: data.metadata || {},
                    isStreaming: false
                };

                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? finalMsg : msg
                ));

                setSessions(prev => prev.map(s =>
                    s.id === currentSessionId
                        ? { ...s, messages: prev }
                        : s
                ));

                setStreamingMessageId(null);
                setLoading(false);
            },
            // onError - called if error occurs
            (error) => {
                const errorMsg = {
                    id: aiMsgId,
                    content: '',
                    role: 'assistant',
                    time: new Date(),
                    error: error,
                    isStreaming: false
                };

                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? errorMsg : msg
                ));

                setSessions(prev => prev.map(s =>
                    s.id === currentSessionId
                        ? { ...s, messages: prev }
                        : s
                ));

                setStreamingMessageId(null);
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

    return (
        <div className="home">
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {sidebarOpen && window.innerWidth <= 768 && (
                    <motion.div
                        className="sidebar-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className="sidebar"
                initial={{ x: -280 }}
                animate={{ x: sidebarOpen ? 0 : -280 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
                <div className="sidebar-top">
                    <img src={logo} alt="GCTC" />
                    <h2>GCTC Workspace</h2>
                </div>

                <button className="new-chat" onClick={handleNewChat}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Chat
                </button>

                <div className="chat-history">
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            className={`history-item ${currentSessionId === session.id ? 'active' : ''}`}
                            onClick={() => handleLoadSession(session)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <span>{session.name}</span>
                            <button
                                className="delete-btn"
                                onClick={(e) => handleDeleteSession(session.id, e)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="sidebar-subjects">
                    <h3>Quick Access</h3>
                    <div className="sidebar-subjects-grid">
                        {subjects.map(sub => (
                            <div key={sub.id} className="sidebar-subject-item" onClick={() => handleSubjectClick(sub)}>
                                <span className="item-icon">{sub.icon}</span>
                                <span className="item-name">{sub.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <nav>
                    <a href="/about">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                        </svg>
                        About
                    </a>
                    <a href="/contact">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Contact
                    </a>
                </nav>

                <button className="logout" onClick={() => { sessionStorage.clear(); navigate('/'); }}>
                    Logout
                </button>
            </motion.aside>

            {/* Main */}
            <main className="main">
                <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                {/* Chat */}
                <section className="chat" ref={chatSectionRef}>
                    <div className="chat-container">
                        {messages.length === 0 ? (
                            <div className="welcome">
                                <img src={logo} alt="AI" />
                                <h1>GCTC Workspace</h1>
                                <p>Ask anything, create anything</p>
                            </div>
                        ) : (
                            <div className="messages">
                                <AnimatePresence>
                                    {messages.map(msg => (
                                        <ChatMessage
                                            key={msg.id}
                                            {...msg}
                                            onRetry={msg.error?.retryable ? () => handleRetry(msg.id) : undefined}
                                        />
                                    ))}
                                </AnimatePresence>
                                {loading && (
                                    <div className="typing">
                                        <div className="typing-dots">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                    <div style={{ padding: '1rem', paddingBottom: '0' }}>
                        <InputBox onSend={handleSend} disabled={loading} />
                    </div>
                    <div className="decoration-loop">
                        <LogoLoop
                            logos={techIcons}
                            speed={40}
                            direction="left"
                            logoHeight={24}
                            gap={40}
                            scaleOnHover
                            fadeOut
                            fadeOutColor="#1a1a1a"
                        />
                    </div>
                </section>

                {/* Subjects */}
                <section className="subjects">
                    <h2>For You</h2>
                    <div className="grid">
                        {subjects.map((sub, i) => (
                            <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <SubjectCard {...sub} onClick={() => handleSubjectClick(sub)} />
                            </motion.div>
                        ))}
                    </div>
                </section>
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#6366f1"
                    raysSpeed={0.8}
                    lightSpread={2.0}
                    rayLength={2.5}
                    pulsating={true}
                    followMouse={true}
                    mouseInfluence={0.15}
                />
            </main>
        </div >
    );
}

export default Home;
