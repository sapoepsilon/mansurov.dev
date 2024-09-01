<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let error: string | null = null;

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            try {
                const response = await fetch(`/api/calendar?action=callback&code=${code}`);
                if (response.ok) {
                    goto('/hireme'); // Redirect to the hire me page after successful authentication
                } else {
                    error = 'Authentication failed. Please try again.';
                }
            } catch (err) {
                error = 'An error occurred during authentication.';
                console.error(err);
            }
        } else {
            error = 'No authentication code received.';
        }
    });
</script>

<div class="flex justify-center items-center h-screen">
    {#if error}
        <p class="text-red-500">{error}</p>
    {:else}
        <p>Authenticating...</p>
    {/if}
</div>
