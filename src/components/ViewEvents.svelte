<script>
    import { user, siteURL, settings, events, locations } from '../stores.js';
    let selectedEvent;
    let datetime;

    // $: dateTimeValue = (new Date(selectedEvent.timeInMs)).toISOString().replace('Z','')

    function handleLocationSelectChange() {
        console.log("handleSelectChange: ", selectedEvent);
        datetime = (new Date(selectedEvent.timeInMs)).toISOString().replace('Z','');
    }

    function handleDateTimeChange() {
        console.log("handleDateTimeChange");
        const timezoneHr = Math.trunc(-(new Date().getTimezoneOffset() / 60));
        const sign = timezoneHr < 0 ? "-" : "+";
        const timezoneMin = new Date().getTimezoneOffset() % 60;
        const timezoneString = `${sign}${
        Math.abs(timezoneHr) < 10 ? "0" + Math.abs(timezoneHr) : Math.abs(timezoneHr)
        }${timezoneMin === 0 ? "00" : Math.abs(timezoneMin)}`;
        console.log("handleDateTimeChange: ", datetime)
        console.log(`${datetime} GMT${timezoneString}`);
        const newDate = new Date(`${datetime}${timezoneString}`);
        selectedEvent.timeInMs = Date.parse(newDate);
        console.log(selectedEvent.timeInMs);
        console.log(new Date(selectedEvent.timeInMs).toLocaleString());
        console.log("datetimeSplit: ", datetime.split('T')[0].split('-'));
        const datetimeSplit = datetime.split('T')[0].split('-')
        console.log("yearMonth: ", `${datetimeSplit[0]}-${datetimeSplit[1]}`);
        selectedEvent.yearMonth = `${datetimeSplit[0]}-${datetimeSplit[1]}`;
        console.log("selectedEvent: ", selectedEvent);

    }

    function updateEvent(){
        console.log("update event");
        selectedEvent.group = selectedEvent.title.split('')[0].toUpperCase();
        console.log("updateEvent selectedEvent: ", selectedEvent);
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
        {(new Date(selectedEvent.timeInMs)).toISOString().replace('Z','')}
        <br/>  
        <input type="datetime-local" bind:value={datetime} on:change={handleDateTimeChange} id="datetime" required>

        <button on:click={updateEvent} name="update-event">Update</button>
        <button on:click={removeEvent} name="remove-event">Remove from list</button>
        <p>** Removing an event does not delete it. It only removes from list.</p>
    {:else}
        please select an event
    {/if}
</section>
