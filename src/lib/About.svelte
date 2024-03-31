<script>
    import profile from "../../static/profile-picture.png";
</script>

<!-- src/lib/About.svelte -->
<div class="about-container">
    <div class="about-content">
        <h1>Hey, my name is</h1>
        <h2>Izzy Mansurov</h2>

        <h3>
            I'm an iOS Developer with interest in Machine Learning and low-level
            graphics. I am an avid Snowboarder, ping me if you have a ride in
            mind. I, also love history and maps! Check my projects out.
        </h3>
    </div>

    <div class="about-image">
        <img src="/profile-picture.png" alt="Izzy Mansurov" />
    </div>
</div>

<style>
    .about-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .about-content {
        text-align: left;
        max-width: 600px;
        padding: 20px;
        backdrop-filter: blur(5px);
        background: var(--navbar-background);
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .about-image {
        margin-top: 20px;
    }

    .about-image img {
        max-width: 70%;
        height: auto;
        border-radius: 10px;
    }

    h1 {
        color: var(--royal-blue);
        margin-bottom: 0.5rem;
    }

    h2 {
        color: var(--royal-blue);
        margin-top: 0;
        margin-bottom: 1.5rem;
    }

    h3 {
        color: var(--seafoam-green);
        line-height: 1.6;
    }

    @media (min-width: 768px) {
        .about-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
        }

        .about-content {
            margin-right: 2rem;
            flex: 1;
        }

        .about-image {
            margin-top: 0;
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            flex: 1;
        }

        .about-image img {
            max-width: 50%;
        }
    }
</style>
