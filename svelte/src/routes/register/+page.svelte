<script lang="ts">
    import { goto } from '$app/navigation';
    import { registerAndLogin } from '$lib/api';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { isLoggedIn } from '$lib/stores/auth';

    let username = '';
    let password = '';
    let error = '';
    let isLoading = false;
    let isInitializing = true;
    let usernameError = '';

    onMount(() => {
        if (browser) {
            const token = localStorage.getItem('token');
            if (token) {
                goto('/car');
            }
            isInitializing = false;
        }
    });

    function validateUsername() {
        if (username.trim().length < 3) {
            usernameError = 'Username must be at least 3 characters long';
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            usernameError = 'Username can only contain letters, numbers, and underscores';
            return false;
        }
        usernameError = '';
        return true;
    }

    async function handleSubmit() {
        error = '';
        usernameError = '';

        if (!username.trim() || !password.trim()) {
            error = 'Username and password are required';
            return;
        }

        if (!validateUsername()) {
            error = usernameError;
            return;
        }

        if (password.length < 6) {
            error = 'Password must be at least 6 characters long';
            return;
        }

        try {
            isLoading = true;
            await registerAndLogin(username, password);
            goto('/car');
        } catch (e) {
            error = e instanceof Error ? e.message : 'An unknown error occurred';
        } finally {
            isLoading = false;
        }
    }

    function handleUsernameInput() {
        if (username.trim()) {
            validateUsername();
        } else {
            usernameError = '';
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
                    Create your account
                </h2>
            </div>
            <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
                {#if error}
                    <div class="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                        <div class="flex items-start">
                            <svg class="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                            <div class="flex-1 whitespace-pre-line">{error}</div>
                        </div>
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
                            on:input={handleUsernameInput}
                            class="block w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {usernameError ? 'border-red-500/50' : ''}"
                            placeholder="Enter your username"
                        />
                        {#if usernameError}
                            <p class="mt-1 text-sm text-red-400">{usernameError}</p>
                        {/if}
                        <p class="mt-1 text-xs text-gray-400">
                            Username must be at least 3 characters and can only contain letters, numbers, and underscores
                        </p>
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
                        <p class="mt-1 text-xs text-gray-400">
                            Password must be at least 6 characters long
                        </p>
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
                            Create Account
                        {/if}
                    </button>
                </div>
                
                <div class="text-center">
                    <a href="/login" class="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Already have an account? Sign in
                    </a>
                </div>
            </form>
        </div>
    </div>
{/if} 