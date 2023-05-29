<script>
    import { user, siteURL, settings, events, locations } from '../stores.js';

    let title;
    let locationName;
    let lat;
    let lon;
    let minLat;
    let maxLat;
    let minLon;
    let maxLon;
    let datetime;
    let timeInMs;
    let yearMonth;
    let status = "";
    let selectedLocation;
    let existingLocationDetails;
    let newLocationDetails;
    let locationChoice = 'existing';
    let newLocationChoice = 'search';

    $: slug = title && title.toLowerCase().replaceAll(' ','-').replaceAll("'",'');
    $: locationSlug = locationName && locationName.toLowerCase().replaceAll(' ','-').replaceAll(',','');
    $: slugDuplicate = $events?.find(event => event.slug === slug);
    $: allowSubmit = title && locationName && lat && lon && datetime && !slugDuplicate;

    async function getLocation() {
        console.log("get Location", location);
        status = "getting coordinates..."
        if (locationName){
            const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${locationName}&format=jsonv2`);
            const data = await response.json();
            console.log("data: ", data);
            // just take the first entry
            lat = data[0].lat;
            lon = data[0].lon;
            minLat = data[0].boundingbox[0];
            maxLat = data[0].boundingbox[1];
            minLon = data[0].boundingbox[2];
            maxLon = data[0].boundingbox[3];

            status= "got location data!";
        } else {
            status = "enter a location";
        }
    }
    
    function findMyLocation() {
        console.log("find my Location");
        if(!navigator.geolocation){
            status = "geolocation not supported!";
        } else {
            status = "getting location...";
            navigator.geolocation.getCurrentPosition(async (position) => {
                console.log('got position: ', position);
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse.php?lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=9&format=jsonv2`);
                const data = await response.json();
                console.log("data: ", data);
                locationName = data.display_name;
                lat = data.lat;
                lon = data.lon;
                minLat = data.boundingbox[0];
                maxLat = data.boundingbox[1];
                minLon = data.boundingbox[2];
                maxLon = data.boundingbox[3];
                status= "got location data!";
            }, (error) => {
                console.log('error getting location: ',error.message);
            } )
        }
    }
    
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

    // Timezone stuff
    function handleDateTimeChange() {
        const timezoneHr = Math.trunc(-(new Date().getTimezoneOffset() / 60));
        const sign = timezoneHr < 0 ? "-" : "+";
        const timezoneMin = new Date().getTimezoneOffset() % 60;
        const timezoneString = `${sign}${
        Math.abs(timezoneHr) < 10 ? "0" + Math.abs(timezoneHr) : Math.abs(timezoneHr)
        }${timezoneMin === 0 ? "00" : Math.abs(timezoneMin)}`;
        console.log("handleDateTimeChange: ", datetime)
        console.log(`${datetime} GMT${timezoneString}`);
        const newDate = new Date(`${datetime}${timezoneString}`);
        timeInMs = Date.parse(newDate);
        console.log({ timeInMs });
        console.log(new Date(timeInMs).toLocaleString());
        console.log("datetimeSplit: ", datetime.split('T')[0].split('-'));
        const datetimeSplit = datetime.split('T')[0].split('-')
        console.log("yearMonth: ", `${datetimeSplit[0]}-${datetimeSplit[1]}`);
        yearMonth = `${datetimeSplit[0]}-${datetimeSplit[1]}`;
    }

    async function addEvent() {
        console.log("add event");
        const eventToAdd = {
            title,
            slug,
            locationName,
            locationSlug,
            timeInMs,
            yearMonth,
            group: title.split('')[0].toUpperCase()

        };
        const locationToAdd = {
            name: locationName,
            slug: locationSlug,
            lat,
            lon,
            boundary: {
                minLat,
                minLon,
                maxLat,
                maxLon
            }
        };

        $events = [...$events, eventToAdd];

        // Check if location is new
        const duplicateLocation = $locations?.find(location => location.slug === locationSlug);
        if(!duplicateLocation){
            // save to locations file
            $locations = [...$locations, locationToAdd];
            console.log("not a duplicate: ", $locations);
            try {
                const saveToLocationsResponse = await postData(`/.netlify/functions/save_to_locations`, $locations);
                status = "locations saved successfully"
                console.log("saveToLocationsResponse: ", saveToLocationsResponse);
            } catch (error) {
                status = error;
            }
        }
        console.log("$events: ", $events);
        try {
            status = "adding event";
            const addEventResponse = await postData(`/.netlify/functions/add_event`, eventToAdd.slug);
            console.log("addEventResponse: ",addEventResponse);
            status = "saving to events list";
            const saveToEventsResponse = await postData(`/.netlify/functions/save_to_events`, $events);
            status = "events saved successfully"
            console.log("saveToEventsResponse: ", saveToEventsResponse);
            clearForm();
        } catch (error) {
            status = error;
        }
    }

    function handleLocationSelectChange() {
        locationSlug = selectedLocation.slug;
        locationName = selectedLocation.name;
        lat = selectedLocation.lat;
        lon = selectedLocation.lon;
        minLat = selectedLocation.boundary?.minLat;
        minLon = selectedLocation.boundary?.minLon;
        maxLat = selectedLocation.boundary?.maxLat;
        maxLon = selectedLocation.boundary?.maxLon;
    }

    function clearForm() {
        title = "";
        slug = "";
        datetime = "";
        selectedLocation = undefined;
        locationSlug = "";
        locationName = "";
        lat = "";
        lon = "";
        minLat = "";
        minLon = "";
        maxLat = "";
        maxLon = "";
    }
    
</script>

<section>
    <label for="event">Event:</label>
    <br/>        
    <input bind:value={title} id="title" required>
    <br/><br/>
    <label for="slug">Slug:</label>
    <br/>        
    <input bind:value={slug} id="slug" disabled required>
    <br/>
    {slugDuplicate ? "event name needs to be unique":""}
    <br/><br/>
    <label for="datetime">Date and Time:</label>
    <br/>  
    <input type="datetime-local" bind:value={datetime} on:change={handleDateTimeChange} id="datetime" required>
    <br/><br/>
    <fieldset>
        <legend>Select a Location:</legend>
        <details open={locationChoice === "existing"} bind:this={existingLocationDetails} on:toggle={() => { locationChoice = existingLocationDetails?.open ? "existing" : "new"}}>
            <summary>Existing</summary>
            {#if $locations.length === 0}
                <div>No locations yet.</div>
            {:else}
                <select bind:value={selectedLocation} on:change="{handleLocationSelectChange}">
                    <option value={undefined} selected={!selectedLocation}>select a location</option>
                    {#each $locations as location}
                        <option value={location}>
                            {location.name}
                        </option>
                    {/each}
                </select>
            {/if}
        </details>
        <details open={locationChoice === "new"} bind:this={newLocationDetails} on:toggle={() => { locationChoice = newLocationDetails?.open ? "new" : "existing"}}>
            <summary>New</summary>
            via <label><input type="radio" bind:group={newLocationChoice} name="newLocationChoice" value="search">Search</label>
            <label><input type="radio" bind:group={newLocationChoice} name="newLocationChoice" value="geolocation">Geolocation</label>
            <br/>
            <input bind:value={locationName} id="location" required>
            {#if newLocationChoice === "search"}
                <button on:click={getLocation} name="get-location">Get Location</button>
            {:else}
                <button on:click={findMyLocation} name="find-location">Find My Location</button>
            {/if}
        </details>

    </fieldset>

    <br/><br/>
    <div id="status">{status}</div>
    <br/>
    <button on:click={addEvent} disabled={!allowSubmit} name="add">Add Event</button>
</section>

<style>
    section {
        text-align: center;
    }
</style>