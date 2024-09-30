<script lang="ts">
  import { fade } from "svelte/transition";
  import ContactForm from "$lib/components/ContactForm.svelte";
</script>

<section class="container mx-auto mt-8 p-4" in:fade={{ duration: 300 }}>
  <h2 class="text-2xl font-bold mb-4">Contact Me</h2>
  <p class="mb-4">
    Feel free to reach out to me using the form below. I'll get back to you as
    soon as possible.
  </p>
  <ContactForm />
</section>
