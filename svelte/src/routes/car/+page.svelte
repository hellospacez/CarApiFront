<script lang="ts">
    import { onMount } from 'svelte';
    import { getAllCars, apiDelete, updateCar } from '$lib/api';
    import { goto } from '$app/navigation';
    import { isLoggedIn } from '$lib/stores/auth';
    
    interface Car {
        id: string;
        make: string;
        model: string;
        year: number;
        stock: number;
    }

    let cars: Car[] = [];
    let error = '';
    let loading = true;
    let editingStock: string | null = null;
    let newStockValue = 0;

    onMount(async () => {
        if (!$isLoggedIn) {
            goto('/login');
            return;
        }

        try {
            loading = true;
            cars = await getAllCars();
        } catch (e) {
            error = e instanceof Error ? e.message : 'An unknown error occurred';
        } finally {
            loading = false;
        }
    });

    async function deleteCar(id: string) {
        if (confirm('Are you sure you want to delete this car?')) {
            try {
                await apiDelete(`/car/${id}`);
                cars = cars.filter(car => car.id !== id);
            } catch (e) {
                error = e instanceof Error ? e.message : 'An unknown error occurred';
            }
        }
    }

    function startEditStock(car: Car) {
        editingStock = car.id;
        newStockValue = car.stock;
    }

    function cancelEditStock() {
        editingStock = null;
        newStockValue = 0;
    }

    async function saveStock(car: Car) {
        try {
            await updateCar(car.id, { ...car, stock: newStockValue });
            cars = cars.map(c => c.id === car.id ? { ...c, stock: newStockValue } : c);
            editingStock = null;
        } catch (e) {
            error = e instanceof Error ? e.message : 'An unknown error occurred';
        }
    }
</script>

{#if $isLoggedIn}
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Vehicle Inventory</h1>
        <p class="text-gray-400">Manage your vehicle stock and information</p>
    </div>

    {#if error}
        <div class="mb-6 backdrop-blur-md bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div class="flex items-start text-red-400">
                <svg class="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1 whitespace-pre-line">{error}</div>
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
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each cars as car (car.id)}
                <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl overflow-hidden transition-all duration-200 hover:bg-white/20">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <span class="px-2.5 py-1 rounded-md bg-white/10 text-gray-300 text-sm">
                                ID: {car.id}
                            </span>
                            <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">
                                {car.year}
                            </span>
                        </div>

                        <div class="mb-6">
                            <h2 class="text-xl font-semibold text-white mb-1">{car.make}</h2>
                            <p class="text-gray-400">{car.model}</p>
                        </div>

                        <div class="mb-6">
                            <div class="text-sm text-gray-400 mb-2">Current Stock</div>
                            {#if editingStock === car.id}
                                <div class="flex flex-col gap-3 bg-white/5 p-3 rounded-lg">
                                    <div class="flex items-center gap-3">
                                        <input
                                            type="number"
                                            bind:value={newStockValue}
                                            min="0"
                                            max="2147483647"
                                            step="1"
                                            class="w-32 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Enter stock"
                                        />
                                        <div class="flex gap-2">
                                            <button
                                                on:click={() => saveStock(car)}
                                                class="px-3 py-1.5 rounded-md bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                on:click={cancelEditStock}
                                                class="px-3 py-1.5 rounded-md bg-white/10 text-gray-400 hover:bg-white/20 transition-colors"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        Enter a whole number between 0 and 2,147,483,647
                                    </div>
                                </div>
                            {:else}
                                <div class="flex items-center justify-between">
                                    <span class="text-2xl font-medium text-white">{car.stock}</span>
                                    <button
                                        on:click={() => startEditStock(car)}
                                        class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                                            <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Update Stock
                                    </button>
                                </div>
                            {/if}
                        </div>

                        <button
                            on:click={() => deleteCar(car.id)}
                            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            Remove Vehicle
                        </button>
                    </div>
                </div>
            {:else}
                <div class="col-span-full text-center py-12">
                    <div class="inline-block p-6 rounded-full bg-white/5 mb-4">
                        <svg class="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <p class="text-gray-400 text-lg">No vehicles available</p>
                </div>
            {/each}
        </div>
    {/if}
{:else}
    <div class="flex justify-center items-center min-h-screen">
        <div class="text-center">
            <p class="text-gray-400 text-lg">Please log in to view the inventory</p>
            <a href="/login" class="inline-block mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                Go to Login
            </a>
        </div>
    </div>
{/if}

<style>
    /* Add any custom styles here if needed */
</style> 