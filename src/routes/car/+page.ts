import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { isLoggedIn } from '$lib/stores/auth';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    if (!get(isLoggedIn)) {
        throw redirect(307, '/login');
    }
};

export const ssr = false; 