import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './components/ChatMessage';
import InputBox from './components/InputBox';
import SubjectCard from './components/SubjectCard';
import logo from './assets/logo.png';
import './Home.css';

const subjects = [
    { id: 'daa', name: 'DAA', emoji: '🧮', color: '#3b82f6', desc: 'Algorithms & Complexity', count: 24 },
    { id: 'os', name: 'Operating Systems', emoji: '💻', color: '#8b5cf6', desc: 'Process & Memory Management', count: 18 },
    { id: 'dbms', name: 'DBMS', emoji: '🗄️', color: '#ec4899', desc: 'SQL & Database Design', count: 21 },
    { id: 'cn', name: 'Computer Networks', emoji: '🌐', color: '#06b6d4', desc: 'TCP/IP & Routing', count: 15 },
    { id: 'se', name: 'Software Engineering', emoji: '⚙️', color: '#f59e0b', desc: 'SDLC & Design Patterns', count: 12 },
    { id: 'ml', name: 'Machine Learning', emoji: '🤖', color: '#10b981', desc: 'AI & Neural Networks', count: 16 }
];

function Home() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const chatSectionRef = useRef(null);
    const navigate = useNavigate();

    // Auto-scroll to bottom of messages only (not whole page)
    const scrollToLatestMessage = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // Scroll to chat section when subject card is clicked
    const scrollToChatSection = () => {
        chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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

    const handleSend = async (content) => {
        const userMsg = { id: Date.now(), content, role: 'user', time: new Date() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setLoading(true);

        if (messages.length === 0) {
            const sessionName = generateSessionName(content);
            const newSession = {
                id: Date.now(),
                name: sessionName,
                messages: newMessages,
                createdAt: new Date()
            };
            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(newSession.id);
        } else {
            setSessions(prev => prev.map(s =>
                s.id === currentSessionId ? { ...s, messages: newMessages } : s
            ));
        }

        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                content: `Based on GCTC exam papers: ${content}\n\nI recommend reviewing key concepts and practicing similar problems.`,
                role: 'assistant',
                time: new Date()
            };
            const updatedMessages = [...newMessages, aiMsg];
            setMessages(updatedMessages);

            setSessions(prev => prev.map(s =>
                s.id === currentSessionId ? { ...s, messages: updatedMessages } : s
            ));

            setLoading(false);
        }, 1500);
    };

    const handleSubjectClick = (subject) => {
        handleSend(`Show ${subject.name} resources`);
        // Scroll to chat section after clicking subject card
        setTimeout(() => scrollToChatSection(), 100);
    };

    const handleNewChat = () => {
        setMessages([]);
        setCurrentSessionId(null);
    };

    const handleLoadSession = (session) => {
        setCurrentSessionId(session.id);
        setMessages(session.messages);
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
            {/* Sidebar */}
            <motion.aside
                className="sidebar"
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : -300 }}
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
                                        <ChatMessage key={msg.id} {...msg} />
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
                    <div style={{ padding: '1rem' }}>
                        <InputBox onSend={handleSend} />
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
            </main>
        </div>
    );
}

export default Home;
