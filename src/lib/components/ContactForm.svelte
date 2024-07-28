<script>
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Button } from "$lib/components/ui/button";
    import { fade } from 'svelte/transition';

    let name = '';
    let email = '';
    let message = '';

    function handleSubmit() {
        console.log({ name, email, message });
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4" in:fade="{{ duration: 300 }}">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
            <Label for="name" class="text-sm font-medium">Name</Label>
            <Input id="name" bind:value={name} placeholder="Enter your name" class="w-full transition-all duration-300 focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2">
            <Label for="email" class="text-sm font-medium">Email</Label>
            <Input id="email" type="email" bind:value={email} placeholder="Enter your email" class="w-full transition-all duration-300 focus:ring-2 focus:ring-primary" />
        </div>
    </div>
    <div class="space-y-2">
        <Label for="message" class="text-sm font-medium">Message</Label>
        <Textarea id="message" bind:value={message} placeholder="Enter your message" class="w-full min-h-[120px] transition-all duration-300 focus:ring-2 focus:ring-primary" />
    </div>
    <Button type="submit" class="w-full transition-all duration-300 hover:bg-primary-dark">Send Message</Button>
</form>
