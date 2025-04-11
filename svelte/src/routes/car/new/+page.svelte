<script>
    import { goto } from '$app/navigation';
    import { addCar } from '$lib/api';

    let car = {
        make: '',
        model: '',
        year: 2024,
        stock: 0
    };
    let error = '';
    let saving = false;

    async function handleSubmit() {
        try {
            saving = true;
            await addCar(car);
            goto('/car');
        } catch (e) {
            error = e.message;
        } finally {
            saving = false;
        }
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Add New Car</h1>

        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
            {#if error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            {/if}

            <div>
                <label for="make" class="block text-sm font-medium text-gray-700">Make</label>
                <input
                    type="text"
                    id="make"
                    bind:value={car.make}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter make"
                />
            </div>

            <div>
                <label for="model" class="block text-sm font-medium text-gray-700">Model</label>
                <input
                    type="text"
                    id="model"
                    bind:value={car.model}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter model"
                />
            </div>

            <div>
                <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
                <input
                    type="number"
                    id="year"
                    bind:value={car.year}
                    required
                    min="1900"
                    max="2100"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
                <input
                    type="number"
                    id="stock"
                    bind:value={car.stock}
                    required
                    min="0"
                    max="9999"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div class="flex justify-end space-x-4">
                <a
                    href="/car"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </a>
                <button
                    type="submit"
                    disabled={saving}
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Car'}
                </button>
            </div>
        </form>
    </div>
</div> 