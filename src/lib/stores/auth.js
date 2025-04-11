import { writable } from 'svelte/store';
import { browser } from '$app/environment';


const initialState = browser ? 
    (window.AUTH_STATE?.isLoggedIn || !!localStorage.getItem('token')) : 
    false;

export const isLoggedIn = writable(initialState);


export function checkLogin() {
    if (browser) {
        const status = !!localStorage.getItem('token');
        isLoggedIn.set(status);
        return status;
    }
    return false;
}


export function logout() {
    if (browser) {
        localStorage.removeItem('token');
        isLoggedIn.set(false);
        // Force refresh the entire page
        window.location.href = '/login';
    }
}


export function setLoggedIn(token) {
    if (browser && token) {
        localStorage.setItem('token', token);
        isLoggedIn.set(true);
    
        window.location.href = '/car';
    }
} 