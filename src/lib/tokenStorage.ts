import Cookies from 'js-cookie';

export const tokenStorage = {
    setToken: (token: string) => {
        localStorage.setItem('token', token);
        // Also set in cookie for middleware
        Cookies.set('token', token, {
            expires: 15, // 15 days
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    removeToken: () => {
        localStorage.removeItem('token');
        Cookies.remove('token');
    },

    setRefreshToken: (token: string) => {
        localStorage.setItem('refresh_token', token);
    },

    getRefreshToken: () => {
        return localStorage.getItem('refresh_token');
    },

    removeRefreshToken: () => {
        localStorage.removeItem('refresh_token');
    },

    clearAll: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('login_timestamp');
        localStorage.removeItem('user_preferences');
        Cookies.remove('token');
    }
};
