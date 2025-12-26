import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api-config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(API_CONFIG.AUTH.STATUS, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    // Also sync local storage if needed, or rely purely on backend
                    localStorage.setItem('user', JSON.stringify(userData));
                    sessionStorage.setItem('isLoggedIn', 'true');
                } else {
                    // clear session if backend says not logged in
                    setUser(null);
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('isLoggedIn');
                }
            } catch (error) {
                console.error("Failed to check auth status", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (userData) => {
        // Ensure user has an ID field
        const userWithId = {
            ...userData,
            id: userData.id || userData.email || `user_${Date.now()}`
        };
        setUser(userWithId);
        localStorage.setItem('user', JSON.stringify(userWithId));
        sessionStorage.setItem('isLoggedIn', 'true');
    };

    const logout = async () => {
        try {
            await fetch(API_CONFIG.AUTH.LOGOUT, {
                method: 'POST', // or GET depending on backend, usually logout is POST or GET. Assuming GET or POST based on typical REST. User said "hit the api".
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            sessionStorage.removeItem('isLoggedIn');
            // Assuming the caller will handle navigation or state change affects the app
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
