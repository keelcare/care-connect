// DEPRECATED: Tokens are now stored in HttpOnly cookies managed by the browser.
// This file remains for backward compatibility during migration but should not be used for new auth logic.
import Cookies from 'js-cookie';

export const tokenStorage = {
    setToken: (token: string) => {
        // No-op: Browser handles cookies
        console.warn('tokenStorage.setToken is deprecated. Tokens are handled via HttpOnly cookies.');
    },

    getToken: () => {
        // Return null or check cookies if needed, but really we shouldn't be reading tokens client side
        return null;
    },

    removeToken: () => {
        // No-op
    },

    setRefreshToken: (token: string) => {
        // No-op
    },

    getRefreshToken: () => {
        return null;
    },

    removeRefreshToken: () => {
        // No-op
    },

    clearAll: () => {
        localStorage.removeItem('login_timestamp');
        localStorage.removeItem('user_preferences');
        // Browser clears cookies on logout endpoint call
    }
};
