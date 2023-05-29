<script>
    import { user, events, locations } from '../stores.js';
    let selectedEvent;
    let selectedEventIndex;
    let selectedLocation;
    let datetime;
    let status="";

    // Example POST method implementation:
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $user.token.access_token
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    function handleEventSelectChange(e) {
        if (e.target.value){
            selectedEventIndex = e.target.value;
            selectedEvent = {...$events[selectedEventIndex]};
            datetime = (new Date(selectedEvent.timeInMs)).toISOString().replace('Z','');
        }
    }

    function handleDateTimeChange() {
        const timezoneHr = Math.trunc(-(new Date().getTimezoneOffset() / 60));
        const sign = timezoneHr < 0 ? "-" : "+";
        const timezoneMin = new Date().getTimezoneOffset() % 60;
        const timezoneString = `${sign}${
        Math.abs(timezoneHr) < 10 ? "0" + Math.abs(timezoneHr) : Math.abs(timezoneHr)
        }${timezoneMin === 0 ? "00" : Math.abs(timezoneMin)}`;
        const newDate = new Date(`${datetime}${timezoneString}`);
        selectedEvent.timeInMs = Date.parse(newDate);
        const datetimeSplit = datetime.split('T')[0].split('-')
        selectedEvent.yearMonth = `${datetimeSplit[0]}-${datetimeSplit[1]}`;
    }

    function handleLocationSelectChange(){
        selectedEvent.locationName = selectedLocation.name;
        selectedEvent.locationSlug = selectedLocation.slug;
    }

    async function updateEvent(){
        selectedEvent.group = selectedEvent.title.split('')[0].toUpperCase();
        $events[selectedEventIndex] = selectedEvent;
        status = "saving to events list";
        try {
            const saveToEventsResponse = await postData(`/.netlify/functions/save_to_events`, $events);
            status = "events saved successfully";
            setTimeout(() => {
                status = "";
            }, 2000);

        }catch(error){
            status = error;
        }
    }

    async function removeEvent(){
        status = "removing event from list";
        $events.splice(selectedEventIndex,1);
        $events = $events;
        try {
            const removeEventsResponse = await postData(`/.netlify/functions/save_to_events`, $events);
            status = "event removed successfully";
            selectedEvent = undefined;
            setTimeout(() => {
                status = "";
            }, 2000);
        }catch(error){
            status = error;
        }
    }

</script>
<section>
    <h1>Edit events</h1>

    {#if $events.length === 0}
        <div>No events yet. Please add one.</div>
    {:else}
        <label for="events">Events: </label>
        <select id="events" on:change="{handleEventSelectChange}">
            <option value={undefined} selected={!selectedEvent}>select an event</option>
            {#each $events as eventObj, i}
                <option value={i}>
                    {eventObj.title}
                </option>
            {/each}
        </select>
        <br/><br/>
    {/if}
    {#if selectedEvent}
        <label for="event">Name:</label>
        <br/>        
        <input bind:value={selectedEvent.title} id="title" required>
        <br/><br/>
        <label for="slug">Slug:</label>
        <br/>        
        <input bind:value={selectedEvent.slug} id="slug" disabled>
        <br/><br/>
        <label for="datetime">Date and Time:</label>
        <br/>  
        <input type="datetime-local" bind:value={datetime} on:change={handleDateTimeChange} id="datetime" required>
        <br/><br/>
        <label for="location">Location:</label>
        <br/>        
        <select id="location"  bind:value={selectedLocation} on:change="{handleLocationSelectChange}">
            {#each $locations as location}
                <option value={location} selected={selectedEvent.locationSlug === location.slug}>
                    {location.name}
                </option>
            {/each}
        </select>
        <br/><br/>
        <button on:click={updateEvent} name="update-event">Update</button>
        <br/><br/>
        <details>
            <summary>Remove event</summary>
            <br/>
            <button on:click={removeEvent} name="remove-event">Remove from list</button>
        </details>
        <p>** Removing an event does not delete it. It only removes it from the list and site.</p>
        {status}
    {:else}
        <p>please select an event</p>
    {/if}
</section>

<style>
    section {
        text-align: center;
    }
    details {
        cursor: pointer;
    }
</style>