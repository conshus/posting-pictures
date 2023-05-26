<script>
    import { user, siteURL, settings, events, locations } from '../stores.js';
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
        console.log("handleEventSelectChange e: ", e.target.value);
        if (e.target.value){
            selectedEventIndex = e.target.value;
            selectedEvent = {...$events[selectedEventIndex]};
            datetime = (new Date(selectedEvent.timeInMs)).toISOString().replace('Z','');
        }
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

    function handleLocationSelectChange(){

        selectedEvent.locationName = selectedLocation.name;
        selectedEvent.locationSlug = selectedLocation.slug;

        console.log("handleLocationSelectChange selectedEvent: ", selectedEvent);

    }

    async function updateEvent(){
        console.log("update event");
        selectedEvent.group = selectedEvent.title.split('')[0].toUpperCase();
        console.log("updateEvent selectedEvent: ", selectedEvent);
        console.log("selectedEventIndex: ", selectedEventIndex);
        console.log("$events[selectedEventIndex]: ",$events[selectedEventIndex]);
        console.log("$events[selectedEventIndex] === selectedEvent: ",$events[selectedEventIndex] === selectedEvent);
        $events[selectedEventIndex] = selectedEvent;
        status = "saving to events list";
        try {
            const saveToEventsResponse = await postData(`/.netlify/functions/save_to_events`, $events);
            status = "events saved successfully"
            console.log("saveToEventsResponse: ", saveToEventsResponse);
        }catch(error){
            console.error("error: ",error);
            status = error;
        }
    }

    async function removeEvent(){
        status = "removing event from list";
        console.log("remove event: ", $events);
        $events.splice(selectedEventIndex,1);
        $events = $events;
        try {
            const removeEventsResponse = await postData(`/.netlify/functions/save_to_events`, $events);
            status = "event removed successfully";
            console.log("removeEventsResponse: ", removeEventsResponse);
            console.log("remove Event: ", $events);
            selectedEvent = undefined;
        }catch(error){
            console.error("error: ",error);
            status = error;
        }
    }

</script>
<section>
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
        <button on:click={removeEvent} name="remove-event">Remove from list</button>
        <p>** Removing an event does not delete it. It only removes it from the list.</p>
        {status}
    {:else}
        <p>please select an event</p>
    {/if}
</section>

<style>
    section {
        text-align: center;
    }
</style>