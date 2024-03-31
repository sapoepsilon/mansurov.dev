<script>
  import { page } from "$app/stores"; // Import $page store
  import { derived } from "svelte/store";

  // Derive the current path
  const currentPath = derived(page, ($page) => $page.url.pathname);

  // Function to check if the link is active
  function isActive(linkPath) {
    return $currentPath === linkPath ? "active" : "";
  }
</script>

<nav>
  <a href="/" class={isActive("/")}>Home</a>
  <a href="/about" class={isActive("/about")}>About Me</a>
  <a href="/portfolio" class={isActive("/portfolio")}>Portfolio</a>
  <a href="/contact" class={isActive("/contact")}>Contact Me</a>
</nav>

<style>
  nav {
    backdrop-filter: blur(10px);
    background: var(--navbar-background);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-around;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  a {
    color: var(--link-color);
    text-decoration: none;
    font-weight: bold;
    position: relative;
  }

  .active {
    color: var(--active-link-color);
  }

  a:hover {
    color: var(--hover-link-color);
    transition: color 0.3s ease;
  }
</style>
