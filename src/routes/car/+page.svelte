<script>
    import { onMount, onDestroy } from 'svelte';
    import { getAllCars, apiDelete, updateCar } from '$lib/api';
    import authService from '$lib/auth-service';
    import { writable } from 'svelte/store';
    
    // Create local state
    const isAuthenticated = writable(authService.isAuthenticated());
    
    let cars = [];
    let error = '';
    let loading = true;
    let editingStock = null;
    let newStockValue = 0;
    let unsubscribe;

    onMount(async () => {

        if (!authService.requireAuth()) {
            return; 
        }
        
     
        unsubscribe = authService.addListener((status) => {
            isAuthenticated.set(status);
            
          
            if (!status) {
                authService.redirectToLogin();
            }
        });
        
        try {
            loading = true;
            cars = await getAllCars();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });
    
    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });
</script>

<div class="mb-8">
    <h1 class="text-3xl font-bold text-white mb-2">Vehicle Inventory</h1>
    <p class="text-gray-400">Manage your vehicle stock and information</p>
</div>

{#if error}
    <div class="mb-6 backdrop-blur-md bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <div class="flex items-center text-red-400">
            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {error}
        </div>
    </div>
{/if}

{#if loading}
    <div class="flex justify-center items-center py-12">
        <div class="relative">
            <div class="w-12 h-12 border-2 border-gray-700 rounded-full animate-spin"></div>
            <div class="w-12 h-12 border-2 border-indigo-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
    </div>
{/if}

{#if $isAuthenticated}

{:else}
    <div class="flex justify-center items-center h-[50vh]">
        <p>Checking authentication...</p>
    </div>
{/if} 