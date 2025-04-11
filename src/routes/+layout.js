import { initAuth } from '$lib/stores/auth';

/** @type {import('./$types').LayoutLoad} */
export async function load() {
    await initAuth();
    return {};
}

export const ssr = false; 