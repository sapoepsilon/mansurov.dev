<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {Input} from "$lib/components/ui/input";
    import SkillsList from "$lib/components/SkillsList.svelte";
    import ExperienceList from "$lib/components/ExperienceList.svelte";
    import ContactForm from "$lib/components/ContactForm.svelte";
    import skills from "$lib/data/skills.json";
    import experiences from "$lib/data/experience.json";
    import {fade, fly} from 'svelte/transition';
    import {Textarea} from "$lib/components/ui/textarea";

    let userEmail: string = '';
    let userMessage: string = '';

    async function sendMessage() {
        if (!userEmail || !userMessage) {
            alert('Please enter your email and message');
            return;
        }

        // Here you would typically send the message to your backend
        console.log('Sending message:', { email: userEmail, message: userMessage });
        alert('Message sent successfully!');
        // Reset form
        userEmail = '';
        userMessage = '';
    }
</script>

<div class="max-w-5xl mx-auto p-4 sm:p-6 md:p-8" in:fade="{{ duration: 300 }}">
    <div class="grid md:grid-cols-2 gap-8">
        <div in:fly="{{ x: -50, duration: 500 }}" class="space-y-6">
            <h1 class="text-4xl font-bold mb-4 text-primary">Hire Me</h1>
            <div class="space-y-6">
                <div>
                    <h2 class="text-2xl font-semibold mb-2">About Me</h2>
                    <p class="text-muted-foreground">Passionate developer with interest in low level graphics and automation.</p>
                </div>
                <div>
                    <h2 class="text-2xl font-semibold mb-2">Skills</h2>
                    <SkillsList {skills}/>
                </div>
                <div>
                    <h2 class="text-2xl font-semibold mb-2">Experience</h2>
                    <ExperienceList {experiences}/>
                </div>
            </div>
        </div>
        <div in:fly="{{ x: 50, duration: 500 }}" class="space-y-6">
            <div>
                <h2 class="text-2xl font-semibold mb-2">Contact Me</h2>
                <form on:submit|preventDefault={sendMessage} class="space-y-4">
                    <Input type="email" bind:value={userEmail} placeholder="Your email" required />
                    <Textarea bind:value={userMessage} placeholder="Your message" required />
                    <Button type="submit" class="w-full">Send Message</Button>
                </form>
            </div>
        </div>
    </div>
</div>
