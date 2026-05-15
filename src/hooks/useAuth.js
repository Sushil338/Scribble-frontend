import { useEffect, useState } from 'react';
import api from '../api/apiClient';

export const useAuth = () => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('username');
        return saved ? { username: saved } : null;
    });

    useEffect(() => {
        const onSessionExpired = () => {
            setUser(null);
        };

        window.addEventListener('scribble:session-expired', onSessionExpired);
        return () => window.removeEventListener('scribble:session-expired', onSessionExpired);
    }, []);

    const login = async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.id);
        setUser(data.user || { id: data.id, username: data.username });
        return data;
    };

    const register = async (formData) => {
        return await api.post('/auth/register', formData);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return { user, login, register, logout };
};
