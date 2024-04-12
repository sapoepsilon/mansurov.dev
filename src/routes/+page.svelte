<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import Terminal from "../lib/Terminal.svelte"; // Import the Terminal component

    let showText = false;
    let showLink = false;

    onMount(() => {
        setTimeout(() => {
            showText = true;
            setTimeout(() => {
                showText = false;
                setTimeout(() => {
                    showLink = true;
                }, 1000);
            }, 3000);
        }, 1000);
    });
</script>

<div class="app">
    <div class="content">
        {#if showText}
            <p
                in:fly={{ y: 20, duration: 500 }}
                out:fly={{ y: -20, duration: 500 }}
            >
                <span class="prompt">$</span> echo "Hello, World!"
            </p>
        {/if}
        {#if showLink}
            <p in:fly={{ y: 20, duration: 500 }}>
                <span class="prompt">$</span> Try my terminal setup:
                <a
                    href="https://github.com/sapoepsilon/scripts"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://github.com/sapoepsilon/scripts
                </a>
            </p>
        {/if}
    </div>
    <Terminal />
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .content {
        background-color: black;
        color: #0f0;
        font-family: monospace;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    .prompt {
        color: #0f0;
    }

    a {
        color: #0f0;
        text-decoration: underline;
    }
</style>
