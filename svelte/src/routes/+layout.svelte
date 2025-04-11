<script lang="ts">
	import { isLoggedIn, checkLogin } from '$lib/stores/auth';
	import { clearToken } from '$lib/api';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		checkLogin();
	});

	function handleLogout(): void {
		clearToken();
		isLoggedIn.set(false);
		goto('/login');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
	{#if $isLoggedIn}
		<!-- Glass Navigation Bar - Only show when logged in -->
		<nav class="backdrop-blur-md bg-white/10 border-b border-white/20">
			<div class="container mx-auto px-4">
				<div class="flex justify-between items-center h-16">
					<div class="flex items-center space-x-8">
						<a href="/car" class="text-white font-medium">Dashboard</a>
						<a href="/car/new" class="text-gray-300 hover:text-white transition-colors">Add Vehicle</a>
					</div>
					<button
						on:click={handleLogout}
						class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-200"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
						Logout
					</button>
				</div>
			</div>
		</nav>
	{/if}

	<!-- Main Content -->
	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style> 