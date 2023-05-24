<script>
    import { user, siteURL, settings, events, locations } from '../stores.js';
    let selectedEvent;

    function handleLocationSelectChange() {
        console.log("handleSelectChange: ", selectedEvent);
    }

    function handleDateTimeChange() {
        console.log("handleDateTimeChange");
    }

    function updateEvent(){
        console.log("update event");
    }

    function removeEvent(){
        console.log("remove event");
    }



</script>
<section>
    View Events
    {#if $events.length === 0}
        <div>No events yet. Please add one.</div>
    {:else}
        <select bind:value={selectedEvent} on:change="{handleLocationSelectChange}">
            <option value={undefined} selected={!selectedEvent}>select a event</option>
            {#each $events as event}
                <option value={event}>
                    {event.title}
                </option>
            {/each}
        </select>
    {/if}
    {#if selectedEvent}
        <label for="event">Event:</label>
        <br/>        
        <input bind:value={selectedEvent.title} id="title" required>
        <br/><br/>
        <label for="slug">Slug:</label>
        <br/>        
        <input bind:value={selectedEvent.slug} id="slug" disabled>
        <br/><br/>
        <label for="datetime">Date and Time:</label>
        {new Date(selectedEvent.timeInMs)}
        <br/>  
        <input type="datetime-local" bind:value={selectedEvent.timeInMs} on:change={handleDateTimeChange} id="datetime" required>

        <button on:click={updateEvent} name="update-event">Update</button>
        <button on:click={removeEvent} name="remove-event">Remove from list</button>
        <p>** Removing an event does not delete it. It only removes from list.</p>
    {:else}
        please select an event
    {/if}
</section>
