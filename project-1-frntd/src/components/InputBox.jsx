import React, { useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { validateFile } from '../lib/utils';
import { toast } from 'sonner';
import './InputBox.css';

const InputBox = ({ onSend, disabled = false, scriptorStyle = false }) => {
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef(null);

    const handleSend = () => {
        if (input.trim() || files.length > 0) {
            onSend({ message: input.trim(), files });
            setInput('');
            setFiles([]);
            setFileError('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFileError('');

        const validFiles = [];
        for (const file of selectedFiles) {
            const validation = validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                toast.error(validation.error);
                return;
            }
        }

        setFiles(prev => [...prev, ...validFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const canSend = (input.trim() || files.length > 0) && !disabled;

    return (
        <div className={`input-box ${disabled ? 'disabled' : ''} ${scriptorStyle ? 'scriptor-style' : ''}`}>
            {files.length > 0 && (
                <div className="file-previews">
                    {files.map((file, index) => (
                        <div key={index} className="file-preview">
                            <div className="file-icon-mini">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                    <polyline points="13 2 13 9 20 9" />
                                </svg>
                                <span>{file.name}</span>
                            </div>
                            <button className="remove-file" onClick={() => handleRemoveFile(index)}>×</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="input-area">
                <button
                    className="attachment-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8M8 12h8" />
                    </svg>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
                <TextareaAutosize
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="type your prompt here"
                    minRows={1}
                    maxRows={6}
                    disabled={disabled}
                />
                <div className="input-actions">
                    <button className="mic-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                    </button>
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!canSend}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputBox;
