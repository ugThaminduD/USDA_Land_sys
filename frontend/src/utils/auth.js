import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users'; 

export const login = async (un, pwd) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { un, pwd });
        if (response.data && response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            return { success: true, ...response.data };
        }
        throw new Error('Login failed');
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
};

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

export const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};