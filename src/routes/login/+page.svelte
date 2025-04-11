<script>
    import { login } from '$lib/api';
    import { checkLogin } from '$lib/stores/auth';
    import { onMount } from 'svelte';

    let username = '';
    let password = '';
    let error = '';
    let processing = false;
    

    onMount(() => {
        if (localStorage.getItem('token')) {
            window.location.href = '/car';
        }
    });

    async function handleSubmit() {
        try {
            processing = true;
            error = '';
            await login(username, password);
    
        } catch (e) {
            error = e.message;
            processing = false;
        }
    }
</script>

