import { initAuth } from '$lib/stores/auth';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    const isAuthenticated = await initAuth();
    return {
        isAuthenticated
    };
};


export const ssr = false; 