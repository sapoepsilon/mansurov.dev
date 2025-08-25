<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { ChevronDown } from "lucide-svelte";

    let experienceSection: HTMLElement;

    function scrollToExperience() {
        experienceSection.scrollIntoView({ behavior: "smooth" });
    }
</script>

<section
    class="min-h-screen flex flex-col items-center justify-center text-foreground relative overflow-hidden"
>
    <!-- Animated background elements -->
    <div class="absolute inset-0 -z-10">
        <div
            class="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"
        ></div>
        <div
            class="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"
        ></div>
        <div
            class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"
        ></div>
    </div>

    <div
        class="text-center p-4 border bg-card text-card-foreground shadow-sm rounded-lg backdrop-blur-xl px-8 py-12 md:px-16 md:py-20 max-w-4xl mx-4"
    >
        <h1
            class="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
        >
            Hey, I'm Ismatulla
        </h1>
        <p class="text-xl md:text-2xl text-muted-foreground mb-12">
            Software engineer, tech enthusiast, and snowboarder
        </p>
        <Button
            on:click={scrollToExperience}
            class="hover:scale-105 transition-transform"
        >
            <ChevronDown class="mr-2 h-4 w-4" />
            More about me
        </Button>
    </div>
</section>

<section
    bind:this={experienceSection}
    class="min-h-screen text-foreground p-4 flex flex-col justify-center"
>
    <div class="max-w-3xl mx-auto w-full space-y-8">
        <h2 class="text-3xl font-semibold mb-6">A bit about my background</h2>
        <p class="text-lg text-muted-foreground mb-6">
            I've been fortunate to work on a variety of projects that have
            helped me grow as a developer. Here's a quick rundown of what I've
            been up to:
        </p>

        <div class="space-y-6">
            <div
                class="border bg-card text-card-foreground shadow-sm rounded-lg p-6 hover:scale-[1.02] transition-transform"
            >
                <h3 class="text-xl font-semibold mb-2">Web Development</h3>
                <p class="text-muted-foreground">
                    At Vius Built, I've been working with Next.js, TypeScript,
                    and PostgreSQL. I lead a team where we work on everything
                    from microservices to CI/CD pipelines. It's been a great
                    opportunity to dive deep into full-stack development.
                </p>
            </div>

            <div
                class="border bg-card text-card-foreground shadow-sm rounded-lg p-6 hover:scale-[1.02] transition-transform"
            >
                <h3 class="text-xl font-semibold mb-2">Mobile Development</h3>
                <p class="text-muted-foreground">
                    During my time at Sorenson Communications, I got to work on
                    both Android and iOS. I worked with C++ for Android and
                    Swift for iOS, along with WebRTC. It was fascinating to see
                    how mobile apps come together and the unique challenges they
                    present.
                </p>
            </div>

            <div
                class="border bg-card text-card-foreground shadow-sm rounded-lg p-6 hover:scale-[1.02] transition-transform"
            >
                <h3 class="text-xl font-semibold mb-2">XR and New Tech</h3>
                <p class="text-muted-foreground">
                    Currently, I'm exploring XR technology. I'm working on an
                    app for Vision OS aimed at architects and interior
                    designers. It's exciting to be at the forefront of new tech
                    and see how it can be applied in practical ways.
                </p>
            </div>
        </div>

        <div
            class="border bg-card text-card-foreground shadow-sm rounded-lg p-8 mt-8"
        >
            <h2 class="text-2xl font-semibold mb-4">Outside of Work</h2>
            <p class="text-muted-foreground">
                I have a YouTube channel where I talk about various tech topics.
                It's a fun way to share what I've learned and connect with
                others interested in tech. When I'm not coding or making videos,
                I love to go snowboarding. It's a great way to clear my head and
                get some fresh air.
            </p>
        </div>

        <p class="text-lg text-muted-foreground mt-8">
            That's pretty much me in a nutshell. I enjoy working on challenging
            projects and learning new technologies. If you're interested in any
            of the areas I've worked in, feel free to reach out. I'm always
            happy to chat about tech or swap snowboarding stories!
        </p>
    </div>
</section>
