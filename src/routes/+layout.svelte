<!-- src/routes/+layout.svelte -->
<script>
    import "../global.css";
    import Navbar from "$lib/Navbar.svelte";
    import Index from "./index.svelte";
</script>
<Navbar />
<slot />

<style>
    :global(body) {
        background: linear-gradient(135deg, #6e8efb, #a777e3);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #ffffff;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
