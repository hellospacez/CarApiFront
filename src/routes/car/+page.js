import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load() {
    if (browser) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw redirect(307, '/login');
        }
    }
    return {};
}

export const ssr = false; 