import { checkLogin } from '$lib/stores/auth';

export function load() {
    checkLogin();
} 