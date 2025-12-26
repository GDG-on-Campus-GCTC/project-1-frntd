import React from 'react';
import { motion } from 'framer-motion';
import './ChatMessage.css';

const ChatMessage = ({ content, role, time, images = [], metadata = {}, error = null, onRetry }) => {
    return (
        <motion.div
            className={`message ${role} ${error ? 'error' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Error Display */}
            {error && (
                <div className="message-error">
                    <div className="error-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div className="error-content">
                        <div className="error-title">Error</div>
                        <div className="error-message">{error.message || 'An error occurred'}</div>
                        {error.retryable && onRetry && (
                            <button className="retry-btn" onClick={onRetry}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 4 23 10 17 10" />
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                </svg>
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Text Content */}
            {content && (
                <div className="message-content">{content}</div>
            )}

            {/* Image Gallery */}
            {images && images.length > 0 && (
                <div className={`image-gallery ${images.length === 1 ? 'single' : ''}`}>
                    {images.map((img, idx) => (
                        <div key={idx} className="image-item">
                            <img src={img} alt={`Response ${idx + 1}`} loading="lazy" />
                        </div>
                    ))}
                </div>
            )}

            {/* Metadata Display */}
            {metadata && Object.keys(metadata).length > 0 && (
                <div className="message-metadata">
                    {metadata.confidence !== undefined && (
                        <div className="metadata-badge confidence">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>{Math.round(metadata.confidence * 100)}% confident</span>
                        </div>
                    )}
                    {metadata.model && (
                        <div className="metadata-badge model">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                            <span>{metadata.model}</span>
                        </div>
                    )}
                    {metadata.sources && metadata.sources.length > 0 && (
                        <div className="metadata-badge sources">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span>{metadata.sources.length} {metadata.sources.length === 1 ? 'source' : 'sources'}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Timestamp */}
            {time && (
                <div className="message-time">
                    {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </motion.div>
    );
};

export default ChatMessage;
