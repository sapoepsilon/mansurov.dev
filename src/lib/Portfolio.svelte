<script>
    // Portfolio page script here
    const githubUsername = "sapoepsilon";
    const reposToShow = 5;

    async function fetchGitHubRepos() {
        const response = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=${reposToShow}`,
        );
        const repos = await response.json();
        return repos;
    }
</script>

<h1>Portfolio</h1>

<div class="github-link">
    <a
        href={`https://github.com/${githubUsername}`}
        target="_blank"
        rel="noopener noreferrer"
    >
        Visit my GitHub Profile
    </a>
</div>

{#await fetchGitHubRepos()}
    <p>Loading repositories...</p>
{:then repos}
    <div class="repo-grid">
        {#each repos as repo}
            <div class="repo-card">
                <h3>{repo.name}</h3>
                <p>{repo.description}</p>
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer">View Repository</a
                >
            </div>
        {/each}
    </div>
{:catch error}
    <p>Error loading repositories: {error.message}</p>
{/await}

<style>
    h1 {
        text-align: center;
        margin-top: 20px;
        color: var(--royal-blue);
    }

    .github-link {
        text-align: center;
        margin-bottom: 20px;
    }

    .github-link a {
        color: var(--seafoam-green);
        text-decoration: none;
        font-weight: bold;
    }

    .repo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 20px;
        margin: 0 auto;
        max-width: 1200px;
    }

    .repo-card {
        backdrop-filter: blur(5px);
        background: var(--navbar-background);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        color: var(--seafoam-green);
    }

    .repo-card h3 {
        margin-top: 0;
        color: var(--royal-blue);
    }

    .repo-card a {
        display: inline-block;
        margin-top: 10px;
        color: var(--seafoam-green);
        text-decoration: none;
        font-weight: bold;
    }
</style>
