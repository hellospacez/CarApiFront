import { goto } from '$app/navigation';
import { isLoggedIn } from '$lib/stores/auth';


/** @type {import('@sveltejs/kit').HandleClientFetch} */
export async function handleFetch({ request, fetch }) {

    const token = localStorage.getItem('token');
    

    isLoggedIn.set(!!token);
    
    return fetch(request);
}


/** @type {import('@sveltejs/kit').Handle} */
export function handleNavigate({ from, to }) {

    if (to?.url.pathname.startsWith('/car')) {
        const token = localStorage.getItem('token');
        if (!token) {
      
            goto('/login');
            return { type: 'redirect', location: '/login' };
        }
    }
} 