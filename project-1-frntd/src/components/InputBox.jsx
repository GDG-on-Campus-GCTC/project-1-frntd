import React, { useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { validateFile } from '../lib/utils';
import { toast } from 'sonner';
import './InputBox.css';

const InputBox = ({ onSend, disabled = false }) => {
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

        // Validate each file
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
        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFileError('');
    };

    const getFilePreview = (file) => {
        if (file.type.startsWith('image/')) {
            return URL.createObjectURL(file);
        }
        return null;
    };

    const canSend = (input.trim() || files.length > 0) && !disabled;

    return (
        <div className={`input-box ${disabled ? 'disabled' : ''}`}>
            {/* File Previews */}
            {files.length > 0 && (
                <div className="file-previews">
                    {files.map((file, index) => (
                        <div key={index} className="file-preview">
                            {file.type.startsWith('image/') ? (
                                <img src={getFilePreview(file)} alt={file.name} />
                            ) : (
                                <div className="file-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                        <polyline points="13 2 13 9 20 9" />
                                    </svg>
                                    <span>{file.name}</span>
                                </div>
                            )}
                            <button
                                className="remove-file"
                                onClick={() => handleRemoveFile(index)}
                                disabled={disabled}
                                aria-label="Remove file"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}



            {/* Input Area */}
            <div className="input-area">
                <button
                    className="file-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    aria-label="Attach file"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
                <TextareaAutosize
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    minRows={1}
                    maxRows={6}
                    disabled={disabled}
                />
                <button
                    className="send-btn"
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label="Send message"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default InputBox;
