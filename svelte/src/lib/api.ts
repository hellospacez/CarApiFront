import { isLoggedIn } from '$lib/stores/auth';

// ==========================
// API CONFIG & TOKEN UTILS
// ==========================
//

const API_BASE = 'https://carstockapi.onrender.com';
export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function saveToken(token: string): void {
    localStorage.setItem('token', token);
}

export function clearToken(): void {
    localStorage.removeItem('token');
}

// ==========================
// SHARED RESPONSE HANDLER
// ==========================
async function handleResponse(res: Response): Promise<any> {
    const text = await res.text();
    if (!res.ok) {
        try {
            const errorData = JSON.parse(text);
            if (errorData.errors) {
                // Format validation errors
                const errorMessages = Object.entries(errorData.errors)
                    .map(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            // Improve error messages
                            const errorMsg = errors.join(', ');
                            if (field === 'stock') {
                                if (errorMsg.includes('Int32')) {
                                    return 'Stock must be a whole number between 0 and 2,147,483,647';
                                }
                                if (errorMsg.includes('format')) {
                                    return 'Stock must be a valid number';
                                }
                            }
                            return `${field}: ${errorMsg}`;
                        }
                        return `${field}: ${errors}`;
                    })
                    .join('\n');
                throw new Error(errorMessages);
            } else if (errorData.message) {
                throw new Error(errorData.message);
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                // If JSON parsing failed, use the raw text
                throw new Error(`Request failed: ${text}`);
            }
            throw e;
        }
    }
    return text.trim() ? JSON.parse(text) : {};
}

// ==========================
// HTTP METHODS
// ==========================
export async function apiGet(endpoint: string): Promise<any> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return handleResponse(res, 'GET', endpoint);
}

export async function apiPost(endpoint: string, body: any, includeToken = true): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (includeToken) {
        headers['Authorization'] = `Bearer ${getToken()}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });

    return handleResponse(res, 'POST', endpoint);
}

export async function apiPut(endpoint: string, body: any): Promise<any> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
    });

    return handleResponse(res, 'PUT', endpoint);
}

export async function apiDelete(endpoint: string): Promise<any> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    return handleResponse(res, 'DELETE', endpoint);
}

// ==========================
// AUTH LOGIC
// ==========================
export async function login(username: string, password: string): Promise<void> {
    const data = await apiPost('/login', { username, password }, false);
    const token = data.token || data.jwt || data.access_token;

    if (!token) {
        throw new Error("Login successful but no token returned");
    }

    saveToken(token);
    isLoggedIn.set(true);
}

export async function registerAndLogin(username: string, password: string): Promise<void> {
    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const text = await res.text();
        if (!res.ok) {
            try {
                const errorData = JSON.parse(text);
                if (errorData.errors) {
                    const errorMessages = Object.entries(errorData.errors)
                        .map(([field, errors]) => {
                            if (Array.isArray(errors)) {
                                if (field === 'username' && errors.includes('Username already exists')) {
                                    return 'This username is already taken. Please choose another one.';
                                }
                                return errors.join(', ');
                            }
                            return errors;
                        })
                        .join('\n');
                    throw new Error(errorMessages);
                } else if (errorData.message) {
                    throw new Error(errorData.message);
                }
            } catch (e) {
                if (e instanceof SyntaxError) {
                    throw new Error(`Registration failed: ${text}`);
                }
                throw e;
            }
        }

        await login(username, password);
    } catch (e) {
        if (e instanceof Error && e.message.includes('fetch')) {
            throw new Error('Unable to connect to the server. Please try again later.');
        }
        throw e;
    }
}

// ==========================
// CAR LOGIC
// ==========================
export async function getAllCars(): Promise<any[]> {
    return apiGet('/car');
}

export function addCar(car: any): Promise<any> {
    return apiPost('/car', car);
}

export function updateCar(id: string, car: any): Promise<any> {
    // Validate stock is a number and within Int32 bounds
    if (car.stock !== undefined && car.stock !== null) {
        const stockNum = Number(car.stock);
        if (isNaN(stockNum)) {
            return Promise.reject(new Error('Stock must be a valid number'));
        }
        if (!Number.isInteger(stockNum)) {
            return Promise.reject(new Error('Stock must be a whole number'));
        }
        if (stockNum < 0 || stockNum > 2147483647) {
            return Promise.reject(new Error('Stock must be between 0 and 2,147,483,647'));
        }
        car.stock = stockNum;
    }
    
    return apiPut(`/car/${id}`, car);
}

export function deleteCar(id: string): Promise<any> {
    return apiDelete(`/car/${id}`);
} 