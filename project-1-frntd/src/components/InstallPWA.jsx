import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import './InstallPWA.css';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if we already have a deferred prompt from index.html script
        if (window.deferredPrompt) {
            setDeferredPrompt(window.deferredPrompt);
            setIsVisible(true);
        }

        const handlePromptAvailable = () => {
            if (window.deferredPrompt) {
                setDeferredPrompt(window.deferredPrompt);
                setIsVisible(true);
            }
        };

        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            window.deferredPrompt = e;
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('pwa-prompt-available', handlePromptAvailable);

        const handleAppInstalled = () => {
            // Hide the app-provided install promotion
            setIsVisible(false);
            // Clear the deferredPrompt so it can be garbage collected
            setDeferredPrompt(null);
            window.deferredPrompt = null;
            console.log('PWA was installed');
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        // Check if app is already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsVisible(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('pwa-prompt-available', handlePromptAvailable);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        const promptEvent = deferredPrompt || window.deferredPrompt;
        if (!promptEvent) return;

        // Show the install prompt
        promptEvent.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await promptEvent.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        window.deferredPrompt = null;
        setIsVisible(false);
    };

    // For debugging: if not isVisible, we still return a hidden marker
    if (!isVisible) return <div style={{ display: 'none' }} data-pwa-status="hidden"></div>;

    return (
        <button
            className="install-pwa-button"
            data-pwa-ready="true"
            onClick={handleInstallClick}
            title="Install App"
        >
            <Download size={20} />
            <span>Install App</span>
        </button>
    );
};

export default InstallPWA;
