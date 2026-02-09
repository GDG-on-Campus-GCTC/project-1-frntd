import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useChat } from './hooks/useChat';
import GLogo from './components/GLogo';
import {
    MessageSquare,
    Settings as SettingsIcon,
    X,
    Search as SearchIcon,
    Plus,
    Zap,
    Calculator,
    Monitor,
    Database,
    Network
} from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import InputBox from './components/InputBox';
import SubjectCard from './components/SubjectCard';
import LogoLoop from './components/LogoLoop';
import Settings from './components/Settings';
import logo from './assets/logo.png';
import ThemeToggle from './components/ThemeToggle';
import './Home.css';

const subjects = [
    { id: 'daa', name: 'DAA', icon: <Calculator size={22} />, color: '#6366f1', desc: 'Algorithms & Complexity', count: 24, label: 'Algorithm Expert' },
    { id: 'os', name: 'Operating Systems', icon: <Monitor size={22} />, color: '#a855f7', desc: 'Process & Memory Management', count: 18, label: 'System Logic' },
    { id: 'dbms', name: 'DBMS', icon: <Database size={22} />, color: '#ec4899', desc: 'SQL & Database Design', count: 21, label: 'Data Architect' },
    { id: 'cn', name: 'Computer Networks', icon: <Network size={22} />, color: '#06b6d4', desc: 'TCP/IP & Routing', count: 15, label: 'Network Pro' }
];

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [theme, setTheme] = useState('light');
    const [showSettings, setShowSettings] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    const messagesEndRef = useRef(null);
    const chatSectionRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const closeSidebarIfMobile = () => { if (window.innerWidth <= 768) setSidebarOpen(false); };
    const scrollToLatestMessage = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); };
    const scrollToChatSection = () => { chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

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

    // Group sessions by date
    const groupedSessions = sessions.reduce((acc, session) => {
        const date = new Date(session.lastActive || Date.now());
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const key = isToday ? 'Today' : 'Yesterday';
        if (!acc[key]) acc[key] = [];
        acc[key].push(session);
        return acc;
    }, { Today: [], Yesterday: [] });

    return (
        <div className={`home ${theme} ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
                    width: !isMobile ? (sidebarOpen ? 300 : 0) : 300,
                    x: isMobile ? (sidebarOpen ? 0 : -300) : 0,
                    opacity: sidebarOpen ? 1 : (!isMobile ? 0 : 1)
                }}
            >
                <div className="sidebar-content">
                    <div className="sidebar-top">
                        <div className="brand-header">
                            <GLogo size={36} />
                            <button className="dots-btn"><X size={20} onClick={() => setSidebarOpen(false)} /></button>
                        </div>
                    </div>

                    <div className="sidebar-scrollable">
                        <div className="sidebar-section">
                            <button className="new-chat-btn" onClick={handleNewChat}>
                                <Plus size={18} />
                                <span>New Chat</span>
                            </button>
                            <button className="sidebar-item search-pill">
                                <SearchIcon size={18} />
                                <span>Search</span>
                            </button>
                        </div>

                        <div className="sidebar-section">
                            <div className="section-header">
                                <span>Recent Chats</span>
                                <div className="section-actions">
                                    <button>+</button>
                                </div>
                            </div>
                            {Object.entries(groupedSessions).map(([group, groupSessions]) => (
                                groupSessions.length > 0 && (
                                    <div key={group} className="history-group">
                                        <h4 className="group-title">{group}</h4>
                                        {groupSessions.map(session => (
                                            <div
                                                key={session.id}
                                                className={`history-item ${currentSessionId === session.id ? 'active' : ''}`}
                                                onClick={() => handleLoadSession(session)}
                                            >
                                                <MessageSquare size={16} />
                                                <span className="truncate">{session.name}</span>
                                                <button className="item-dots">...</button>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-footer">
                        <button className="user-profile-btn" onClick={() => setShowSettings(true)}>
                            <div className="user-avatar">{user?.name?.[0]}</div>
                            <div className="user-info">
                                <span>{user?.name || 'User'}</span>
                                <p>Settings</p>
                            </div>
                            <SettingsIcon size={18} />
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main */}
            <main className="main">
                <div className="mesh-gradient"></div>

                <header className="main-header">
                    <div className="header-left">
                        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {!sidebarOpen && <GLogo size={28} />}
                        </button>
                        <h2 className="header-title">Scriptor</h2>
                    </div>
                    <div className="header-right">
                        <button className="update-btn">
                            <Zap size={14} />
                            Update
                        </button>
                        <button className="settings-btn" onClick={() => setShowSettings(true)}>
                            <SettingsIcon size={18} />
                            Settings
                        </button>
                    </div>
                </header>

                <div className="main-content">
                    {messages.length === 0 ? (
                        <div className="scriptor-welcome">
                            <div className="welcome-icon">
                                <GLogo size={80} />
                            </div>
                            <h1>How can we <span className="assist-text">assist</span> you today?</h1>
                            <p className="welcome-desc">Get expert guidance powered by AI agents specializing in Sales, Marketing, and Negotiation. Choose the agent that suits your needs and start your conversation with ease.</p>

                            <div className="subject-grid">
                                {subjects.map((sub, i) => (
                                    <motion.div
                                        key={sub.id}
                                        className="scriptor-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => handleSubjectClick(sub)}
                                    >
                                        <div className="card-top">
                                            <h3>{sub.name}</h3>
                                            <div className="card-arrow">↗</div>
                                        </div>
                                        <p>{sub.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="chat-view">
                            <div className="messages-container">
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
                                    <div className="typing-indicator">
                                        <div className="dots"><span></span><span></span><span></span></div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="input-wrapper">
                    <InputBox onSend={handleSend} disabled={loading} scriptorStyle={true} />
                </div>
            </main>

            <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                theme={theme}
                toggleTheme={toggleTheme}
                user={user}
                onLogout={async () => { await logout(); navigate('/'); }}
            />

            <AnimatePresence>
                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content scriptor-modal">
                            <h2>Delete Chat?</h2>
                            <p>This will permanently remove the conversation mapping.</p>
                            <div className="modal-actions">
                                <button className="modal-btn ghost" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="modal-btn danger" onClick={async () => {
                                    await handleDeleteSession(chatToDelete.id);
                                    setShowDeleteModal(false);
                                }}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;
