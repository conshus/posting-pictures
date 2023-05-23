<script>
    import { user, siteURL, settings } from '../stores.js';

    let title;
    let location;
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

    $: slug = title && title.toLowerCase().replaceAll(' ','-').replaceAll("'",'');
    $: locationSlug = location && location.toLowerCase().replaceAll(' ','-').replaceAll(',','');
    $: slugUnique = $settings.events?.find(event => event.slug === slug);
    // $: slugUnique = false;
    $: allowSubmit = title && location && lat && lon && datetime && !slugUnique;


    async function getLocation() {
        console.log("get Location", location);
        status = "getting coordinates..."
        if (location){
            const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${location}&format=jsonv2`);
            const data = await response.json();
            console.log("data: ", data);
            // just take the first entry
            // location = data.display_name;
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
                location = data.display_name;
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
    
    function addEvent() {
        console.log("add event");
    }

    // Example POST method implementation:
    async function postData(url = '', data = {}) {
        // const dataToSend = [
        //     {
        //         "key": "TEST_KEY",
        //         "values": [{
        //             "id": "TEST_ID",
        //             "value": "test value",
        //             "context": "all"
        //         }]
        //     }
        // ]
        // const dataToSend = {
        //     name: 'John Doe',
        //     age: 30,
        //     email: 'johndoe@example.com'
        // };

        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            // mode: 'cors', // no-cors, *cors, same-origin
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // "User-Agent": "MyApp (YOUR_NAME@EXAMPLE.COM)",
                // 'Authorization': 'Bearer ' + "QX27v2jCdNZlAamPQaru1u0JjDF440uF-EgWUlnlBlA"
                'Authorization': 'Bearer ' + $user.token.access_token
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
        // console.log("next_session_input: ",next_session_input);
        console.log(`${datetime} GMT${timezoneString}`);
        const newDate = new Date(`${datetime}${timezoneString}`);
        // console.log({ newDate });
        timeInMs = Date.parse(newDate);
        console.log({ timeInMs });
        console.log(new Date(timeInMs).toLocaleString());
        console.log("datetimeSplit: ", datetime.split('T')[0].split('-'));
        const datetimeSplit = datetime.split('T')[0].split('-')
        console.log("yearMonth: ", `${datetimeSplit[0]}-${datetimeSplit[1]}`);
        yearMonth = `${datetimeSplit[0]}-${datetimeSplit[1]}`;
        // dispatch('datetimechange', {
        //     datetimeMs: timeInMs
        // });
    }

    async function saveSettings() {
        console.log("save settings");
        // const dataToSend = [
        //     {
        //         "key": "TEST_KEY",
        //         "values": [{
        //             "id": "TEST_ID",
        //             "value": "test value",
        //             "context": "all"
        //         }]
        //     }
        // ]
        const eventToAdd = {
            title,
            slug,
            location,
            locationSlug,
            timeInMs,
            yearMonth,
            group: title.split('')[0].toUpperCase()

        };
        const locationToAdd = {
            name: location,
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

        $settings.events = $settings.events ? [...$settings.events, eventToAdd] : [eventToAdd];
        const duplicateLocation = $settings.locations?.find(location => location.slug === locationSlug);
        if(!duplicateLocation){
            $settings.locations = $settings.locations ? [...$settings.locations, locationToAdd] : [locationToAdd];
        }
        console.log("$settings: ", $settings);
        // const saveResponse = await postData("https://marvelous-otter-a2b882.netlify.app/.netlify/functions/savesettings",dataToSend);
        try {
            status = "saving event";
            const saveEventResponse = await postData(`/.netlify/functions/add_event`, eventToAdd.slug);
            console.log("saveEventResponse: ",saveEventResponse);
            status = "saving settings";
            // const saveResponse = await postData(`${$siteURL}/.netlify/functions/savesettings`, $settings);
            const saveResponse = await postData(`/.netlify/functions/savesettings`, $settings);
            status = "settings saved successfully"
            console.log("saveResponse: ", saveResponse);
        } catch (error) {
            status = error;
        }


    }

    async function getSettings() {
        console.log("get settings");
        // const getResponse = await fetch("https://marvelous-otter-a2b882.netlify.app/.netlify/functions/getsettings");
        // const getResponse = await fetch(`${$siteURL}/.netlify/functions/getsettings`);
        const getResponse = await fetch(`/.netlify/functions/getsettings`);
        const settings = await getResponse.json();
        console.log("settings: ", settings);


    }

</script>
<section>
    {!slugUnique}
    Add Event
    <label for="event">Event:</label>
    <br/>        
    <input bind:value={title} id="title" required>
    <br/><br/>
    <label for="slug">Slug:</label>
    <br/>        
    <input bind:value={slug} id="slug" disabled required>
    <br/><br/>
    <label for="datetime">Date and Time:</label>
    <br/>  
    <input type="datetime-local" bind:value={datetime} on:change={handleDateTimeChange} id="datetime" required>
    <br/><br/>
    <label for="location">Location:</label>
    <br/>                
    <input bind:value={location} id="location" required>
    <br/>
    <button on:click={getLocation} name="get-location">Get Location</button><button on:click={findMyLocation} name="find-location">Find My Location</button>
    <br/>
    <br/><br/>
    Coordinates:<br/>
    <label for="lat">Lat: </label>
    <input bind:value={lat} id="lat" required>
    <br/>
    <label for="lon">Lon: </label>
    <input bind:value={lon} id="lon" required>
    <br/>                
    <label for="minLat">min Lat: </label>
    <input bind:value={minLat} id="minLat" required>
    <br/>
    <label for="maxLat">max Lat: </label>
    <input bind:value={maxLat} id="maxLat" required>
    <br/>
    <label for="minLon">min Lon: </label>
    <input bind:value={minLon} id="minLon" required>
    <br/>
    <label for="maxLon">max Lon: </label>
    <input bind:value={maxLon} id="maxLon" required>
    <br/><br/>
    <div id="status">{status}</div>
    <br/>
    <button on:click={addEvent} disabled={!allowSubmit} name="add">Add</button>
    <button on:click={saveSettings} disabled={!allowSubmit} name="save">Save Settings</button>
    <button on:click={getSettings} name="get">Get Settings</button>
    <br>{$siteURL}
</section>
