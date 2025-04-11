// A standalone authentication service, framework-independent
class AuthService {
    constructor() {
        this._token = null;
        this._listeners = new Set();
        
        // Initialize immediately if in browser environment
        if (typeof window !== 'undefined') {
            this.init();
        }
    }

    init() {
        // Read token from localStorage
        this._token = localStorage.getItem('token');
        
        // Start keep-alive mechanism - check every 10 seconds
        setInterval(() => this.checkAuth(), 10000);
        
        // Check current path immediately
        this.checkAuth();
        
        console.log('[AuthService] Initialization complete, token exists:', !!this._token);
    }

    setToken(token) {
        const oldToken = this._token;
        this._token = token;
        
        // If token state changes, update and notify
        if (oldToken !== token) {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
            console.log('[AuthService] Authentication state changed:', !!this._token);
            this._listeners.forEach(listener => listener(!!token));
        }
    }

    checkAuth() {
        const path = window.location.pathname;
        const isProtectedRoute = !path.startsWith('/login');
        
        // If protected route but no token
        if (isProtectedRoute && !this._token) {
            console.log('[AuthService] Unauthorized access to protected route, redirecting...');
            window.location.href = '/login';
        }
    }

    onAuthChange(listener) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    getToken() {
        return this._token;
    }
}

export default new AuthService(); 
export default authService; 