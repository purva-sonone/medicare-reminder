import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));

                    // Verify token profile fetch to confirm it is still valid
                    const { data } = await api.get('/auth/profile');
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data));
                } catch (err) {
                    console.error('Session expired or authentication failed', err);
                    logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const register = async (fullName, email, password, confirmPassword) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/register', {
                fullName,
                email,
                password,
                confirmPassword,
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                fullName: data.fullName,
                email: data.email,
            }));

            setUser(data);
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            throw new Error(msg);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                fullName: data.fullName,
                email: data.email,
            }));

            setUser(data);
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.message || 'Login failed. Invalid credentials.';
            setError(msg);
            throw new Error(msg);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    const updateProfile = async (profileData) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.put('/auth/profile', profileData);

            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            const updatedUser = {
                _id: data._id,
                fullName: data.fullName,
                email: data.email,
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.message || 'Profile update failed.';
            setError(msg);
            throw new Error(msg);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                register,
                login,
                logout,
                updateProfile,
                setError,
            }}
        >
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
