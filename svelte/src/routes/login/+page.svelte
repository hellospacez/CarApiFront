<script lang="ts">
    import { onMount } from 'svelte';
    import { isLoggedIn } from '$lib/stores/auth';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import '../../app.css';

    let username = '';
    let password = '';
    let error = '';
    let isLoading = false;
    let isInitializing = true;

    onMount(() => {
        if (browser) {
            const token = localStorage.getItem('token');
            if (token) {
                goto('/car');
            }
            isInitializing = false;
        }
    });

    async function handleSubmit() {
        isLoading = true;
        try {
            const response = await fetch('http://car.9it.com.au/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const token = data.token || data.jwt || data.access_token;

            if (!token) {
                throw new Error('Login successful but no token received');
            }

            localStorage.setItem('token', token);
            isLoggedIn.set(true);
            goto('/car');
        } catch (e) {
            error = e instanceof Error ? e.message : 'An unknown error occurred';
        } finally {
            isLoading = false;
        }
    }
</script>

{#if isInitializing}
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div class="w-12 h-12 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
{:else if !$isLoggedIn}
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div class="max-w-md w-full p-8 bg-gray-900/20 backdrop-blur-sm rounded-xl border border-white/5">
            <div>
                <h2 class="mt-2 text-center text-3xl font-bold text-white">
                    Login to your account
                </h2>
            </div>
            <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
                {#if error}
                    <div class="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                {/if}
                <div class="space-y-4">
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            bind:value={username}
                            class="block w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            bind:value={password}
                            class="block w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {#if isLoading}
                            <div class="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                        {:else}
                            Sign in
                        {/if}
                    </button>
                </div>
                
                <div class="text-center">
                    <a href="/register" class="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Don't have an account? Register
                    </a>
                </div>
            </form>
        </div>
    </div>
{/if} 