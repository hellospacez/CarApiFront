import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize auth state with token check
const initialValue = browser ? !!localStorage.getItem('token') : false;
export const isLoggedIn = writable(initialValue);

export function checkLogin(): void {
    if (browser) {
        const token = localStorage.getItem('token');
        isLoggedIn.set(!!token);
    }
}

export function logout(): void {
    if (browser) {
        localStorage.removeItem('token');
        isLoggedIn.set(false);
    }
} 