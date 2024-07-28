<script>
	import { Calendar } from "$lib/components/ui/calendar";
	import SkillsList from "$lib/components/SkillsList.svelte";
	import ExperienceList from "$lib/components/ExperienceList.svelte";
	import ContactForm from "$lib/components/ContactForm.svelte";
	import skills from "$lib/data/skills.json";
	import experiences from "$lib/data/experience.json";
	import { onMount } from "svelte";
	import { fade, fly } from 'svelte/transition';

	let selectedDate = null;

	onMount(() => {
		// Initialize calendar or fetch available dates
	});

	function handleDateSelect(event) {
		selectedDate = event.detail.date;
	}
</script>

<div class="max-w-5xl mx-auto p-4 sm:p-6 md:p-8" in:fade="{{ duration: 300 }}">
	<div class="grid md:grid-cols-2 gap-8">
		<div in:fly="{{ x: -50, duration: 500 }}" class="space-y-6">
			<h1 class="text-4xl font-bold mb-4 text-primary">Hire Me</h1>
			<div class="space-y-6">
				<div>
					<h2 class="text-2xl font-semibold mb-2">About Me</h2>
					<p class="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
				</div>
				<div>
					<h2 class="text-2xl font-semibold mb-2">Skills</h2>
					<SkillsList {skills} />
				</div>
				<div>
					<h2 class="text-2xl font-semibold mb-2">Experience</h2>
					<ExperienceList {experiences} />
				</div>
			</div>
		</div>
		<div in:fly="{{ x: 50, duration: 500 }}" class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold mb-2">Schedule a Meeting</h2>
				<Calendar
						bind:value={selectedDate}
						on:select={handleDateSelect}
						numberOfMonths={1}
						mode="single"
						class="p-0 [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6 transition-all duration-300 hover:shadow-lg"
				/>
				{#if selectedDate}
					<p class="mt-2 text-primary font-medium">Selected date: {selectedDate.toDateString()}</p>
				{/if}
			</div>
			<div>
				<h2 class="text-2xl font-semibold mb-2">Contact Me</h2>
				<ContactForm />
			</div>
		</div>
	</div>
</div>
