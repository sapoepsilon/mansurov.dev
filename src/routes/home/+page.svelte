<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import Terminal from "../../lib/Terminal.svelte"; // Import the Terminal component

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
            <!-- <p
                in:fly={{ y: 20, duration: 500 }}
                out:fly={{ y: -20, duration: 500 }}
            >
                <span class="prompt">$</span> echo "Hello, World!"
            </p> -->
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
    <div class="terminal-wrapper">
        <Terminal />
    </div>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh; /* Set the height to full viewport height */
    }

    .content {
        background-color: black;
        color: #0f0;
        font-family: monospace;
        padding: 20px;
        border-radius: 5px;
        margin-top: 20px; /* Add space between terminal and text content */
    }

    .prompt {
        color: #0f0;
    }

    a {
        color: #0f0;
        text-decoration: underline;
    }

    .terminal-wrapper {
        width: 100%; /* Set the width of the terminal wrapper */
        max-width: none; /* Remove the maximum width for the terminal wrapper */
        margin: 0 auto; /* Center the terminal wrapper horizontally */
        height: 60vh; /* Set the height of the terminal wrapper to 60% of the viewport height */
    }

    @media (max-width: 600px) {
        .terminal-wrapper {
            height: 80vh; /* Increase the height of the terminal wrapper on mobile devices */
        }
    }
</style>
