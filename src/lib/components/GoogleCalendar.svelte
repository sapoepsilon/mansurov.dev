<script lang="ts">
    import { onMount } from 'svelte';
    import { Calendar } from '$lib/components/ui/calendar';
  
    let events = [];
    let selectedDate = new Date();
  
    async function fetchEvents(date: Date) {
      const response = await fetch(`/api/calendar?action=availability&date=${date.toISOString().split('T')[0]}`);
      if (response.ok) {
        events = await response.json();
      } else {
        console.error('Failed to fetch events');
      }
    }
  
    function handleDateSelect(event) {
      selectedDate = event.detail;
      fetchEvents(selectedDate);
    }
  
    onMount(() => {
      fetchEvents(selectedDate);
    });
  </script>
  
  <Calendar value={selectedDate} on:select={handleDateSelect} />
  
  <div>
    <h2>Events for {selectedDate.toDateString()}</h2>
    {#if events.length > 0}
      <ul>
        {#each events as event}
          <li>{event.start} - {event.end}: {event.summary}</li>
        {/each}
      </ul>
    {:else}
      <p>No events for this day.</p>
    {/if}
  </div>