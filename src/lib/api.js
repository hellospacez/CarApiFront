import authService from './auth-service.js';

// ==========================
// API CONFIG & TOKEN UTILS
// ==========================
const API_BASE = 'http://car.9it.com.au';

export function getToken() {
    return authService.getToken();
}

export function saveToken(token) {
    return authService.setToken(token);
}

export function clearToken() {
    authService.clearToken();
}


function isTokenValid(token) {
    if (!token) return false;
    
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        const payload = JSON.parse(atob(parts[1]));
        const exp = payload.exp * 1000; 
        
        return Date.now() < exp;
    } catch (e) {
        console.error('Token validation error:', e);
        return false;
    }
}

// ==========================
// SHARED RESPONSE HANDLER
// ==========================
async function handleResponse(res, method, endpoint) {
    if (res.status === 401 || res.status === 403) {
        authService.clearToken();
        
        window.location.href = '/login';
        throw new Error('Login failed');
    }
    
    const text = await res.text();
    if (!res.ok) {
        throw new Error(`${method} ${endpoint} failed: ${text}`);
    }
    return text.trim() ? JSON.parse(text) : {};
}

// ==========================
// HTTP METHODS
// ==========================
export async function apiGet(endpoint) {
    const token = getToken();
    if (!token || !isTokenValid(token)) {
        clearToken();
        throw new Error('Login failed');
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return handleResponse(res, 'GET', endpoint);
}



// ==========================
// AUTH LOGIC
// ==========================
export async function login(username, password) {
    const data = await apiPost('/login', { username, password }, false);
    const token = data.token || data.jwt || data.access_token;

    if (!token) {
        throw new Error("Login successful but no token returned");
    }
    
    
    saveToken(token);
    
  
} 