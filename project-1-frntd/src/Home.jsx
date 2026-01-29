import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useChat } from './hooks/useChat';
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
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const messagesEndRef = useRef(null);
    const chatSectionRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Handle window resize for sidebar state sync
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const {
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
    } = useChat(closeSidebarIfMobile, scrollToChatSection, scrollToLatestMessage);


    return (
        <div className="home">
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
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {sidebarOpen && isMobile && (
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
                className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
                initial={false}
                animate={{
                    width: !isMobile ? (sidebarOpen ? 260 : 0) : 280,
                    x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
                    padding: sidebarOpen ? "1rem" : "0rem",
                    opacity: sidebarOpen ? 1 : (!isMobile ? 0 : 1)
                }}
                transition={{
                    type: 'spring',
                    damping: 28,
                    stiffness: 220,
                    mass: 0.8,
                    restDelta: 0.001
                }}
            >
                <div style={{ width: 228, opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.2s' }}>

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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setChatToDelete(session);
                                        setShowDeleteModal(true);
                                    }}
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

                    <button className="logout" onClick={async () => { await logout(); navigate('/'); }}>
                        Logout
                    </button>
                </div>
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
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        >
                            <div className="modal-header">
                                <div className="warning-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                                <h2>Delete Chat?</h2>
                            </div>
                            <p>Your entire chat <strong>{chatToDelete?.name}</strong> will be deleted. This action cannot be undone.</p>
                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="confirm-delete-btn" onClick={async () => {
                                    const id = chatToDelete.id;
                                    setChatToDelete(null);
                                    setShowDeleteModal(false);
                                    await handleDeleteSession(id, { stopPropagation: () => { } });
                                }}>Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}

export default Home;
