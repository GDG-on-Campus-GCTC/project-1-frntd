import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const userData = await authService.checkStatus();

                if (userData) {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    sessionStorage.setItem('isLoggedIn', 'true');
                } else {
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
            await authService.logout();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            sessionStorage.removeItem('isLoggedIn');
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
