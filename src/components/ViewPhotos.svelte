<script>
    import { user, siteURL, settings } from '../stores.js';
    let selectedEvent;

    async function handleOnChange() {
        console.log("selectedEvent: ", selectedEvent);
        if (selectedEvent){
            const getResponse = await fetch(`/.netlify/functions/get_event?slug=${selectedEvent.slug}`);
            const eventPhotos = await getResponse.json();
            console.log("eventPhotos: ", eventPhotos);
        }

	}
</script>
<section>
    <h1>View photos</h1>
    {#if $settings.events}
        <select bind:value={selectedEvent} on:change="{handleOnChange}">
            <option value="">select an event</option>
            {#each $settings.events as event}
                <option value={event}>
                    {event.title}
                </option>
            {/each}
        </select>
    {:else}
        loading events...
    {/if}

</section>
