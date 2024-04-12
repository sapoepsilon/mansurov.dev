<script lang="ts">
    import { onMount } from "svelte";
    import profile from "$lib/assets/profile-picture.png";

    export let history = [];
    let prompt = "";
    let inputValue = "";
    let typingIndex = 0;
    let typingText = "";

    const aboutMeText = [
        "Hey, my name is",
        "===============",
        "",
        "Izzy Mansurov",
        "-------------",
        "",
        "I'm an iOS Developer with interest in Machine Learning and low-level graphics.",
        "I am an avid Snowboarder, ping me if you have a ride in mind.",
        "I, also love history and maps!",
        "Check my projects out.",
    ];

    function handleSubmit() {
        if (inputValue.trim() !== "") {
            history = [...history, inputValue];
            inputValue = "";
        }
    }

    function updatePrompt() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        prompt = `${"..".repeat(31)} at ${hours}:${minutes}:${seconds}`;
    }

    function typeOutAboutMe(index) {
        if (index < aboutMeText.length) {
            typingText = "";
            typingIndex = 0;
            typeNextCharacter(aboutMeText[index], index);
        }
    }

    function typeNextCharacter(text, index) {
        if (typingIndex < text.length) {
            typingText += text[typingIndex];
            typingIndex++;
            setTimeout(() => typeNextCharacter(text, index), 50);
        } else {
            history = [...history, text];
            setTimeout(() => typeOutAboutMe(index + 1), 500);
        }
    }

    onMount(() => {
        updatePrompt();
        setInterval(updatePrompt, 1000);
        typeOutAboutMe(0);
    });
</script>

<div class="terminal-container">
    <div class="terminal">
        <div class="window-controls">
            <span class="control red"></span>
            <span class="control yellow"></span>
            <span class="control green"></span>
        </div>
        <div class="terminal-content">
            <div class="terminal-output">
                {#each history as entry}
                    <p class="typed-text">~ {entry}</p>
                {/each}
                {#if typingText}
                    <p class="typing-text">
                        ~ {typingText}<span class="cursor">|</span>
                    </p>
                {/if}
                <p class="prompt">{prompt}</p>
            </div>
            <div class="profile-picture">
                <img src={profile} alt="Izzy Mansurov" />
            </div>
        </div>
        <form on:submit|preventDefault={handleSubmit}>
            <input
                type="text"
                bind:value={inputValue}
                placeholder="Type a command..."
            />
        </form>
    </div>
</div>

<style>
    .terminal-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: auto;
    }

    .terminal {
        background-color: black;
        color: #0f0;
        font-family: monospace;
        padding: 20px;
        border-radius: 5px;
        width: 80%;
        max-width: 800px;
        height: 80%;
        max-height: 600px;
        position: relative;
    }

    .window-controls {
        position: absolute;
        top: 10px;
        left: 10px;
    }

    .control {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 5px;
    }

    .red,
    .yellow,
    .green {
        background-color: var(--control-color);
    }

    .red {
        --control-color: #ff5f56;
    }

    .yellow {
        --control-color: #ffbd2e;
    }

    .green {
        --control-color: #27c93f;
    }

    .terminal-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        height: calc(100% - 40px);
        padding-right: 20px;
    }

    .terminal-output {
        flex: 1;
        overflow-y: auto;
        padding-right: 20px;
    }

    .profile-picture {
        margin-left: 20px;
        margin-top: 20px;
        flex-shrink: 0;
    }

    .profile-picture img {
        max-width: 150px;
        max-height: 150px;
        border-radius: 50%;
    }

    .prompt {
        margin-bottom: 10px;
    }

    input {
        background-color: black;
        color: #0f0;
        font-family: monospace;
        border: none;
        outline: none;
        width: 100%;
    }
    .typed-text {
        background-color: #1c1c1c;
        padding: 2px 5px;
        border-radius: 3px;
    }

    .typing-text {
        background-color: #1c1c1c;
        padding: 2px 5px;
        border-radius: 3px;
        display: inline-block;
    }

    .cursor {
        animation: blink 0.7s infinite;
    }

    @keyframes blink {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>
