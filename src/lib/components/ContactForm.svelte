<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Button } from "$lib/components/ui/button";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let name = "";
  let email = "";
  let message = "";
  let success = false;
  let error = "";
  let isLoading = false;

  async function handleSubmit() {
    if (!name || !email || !message) {
      error = "Please fill out all fields.";
      return;
    }

    isLoading = true;
    error = "";
    success = false;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        success = true;
        name = "";
        email = "";
        message = "";
      } else {
        const errorData = await response.json();
        error = errorData.message;
      }
    } catch (err) {
      error =
        "An error occurred while sending your message. Please try again later.";
    } finally {
      isLoading = false;
    }
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="space-y-4"
  in:fade={{ duration: 300 }}
>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="space-y-2">
      <Label for="name" class="text-sm font-medium">Name</Label>
      <Input
        id="name"
        bind:value={name}
        placeholder="Enter your name"
        class="w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
      />
    </div>
    <div class="space-y-2">
      <Label for="email" class="text-sm font-medium">Email</Label>
      <Input
        id="email"
        type="email"
        bind:value={email}
        placeholder="Enter your email"
        class="w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
      />
    </div>
  </div>
  <div class="space-y-2">
    <Label for="message" class="text-sm font-medium">Message</Label>
    <Textarea
      id="message"
      bind:value={message}
      placeholder="Enter your message"
      class="w-full min-h-[120px] transition-all duration-300 focus:ring-2 focus:ring-primary"
    />
  </div>
  <Button
    type="submit"
    class="w-full transition-all duration-300 hover:bg-primary-dark"
    disabled={isLoading}
  >
    {#if isLoading}
      Sending...
    {:else}
      Send Message
    {/if}
  </Button>
  {#if success}
    <p class="text-green-500">Your message has been sent successfully!</p>
  {/if}
  {#if error}
    <p class="text-red-500">{error}</p>
  {/if}
</form>
