<script>
    import { user, siteURL, settings, events } from '../stores.js';
    import UploadWidget from './UploadWidget.svelte';
    let datetime;
    let location;
    let selectedEvent;
    let photoData;
    let timeInMs;
    let yearMonth;
    let caption;
    let altText;
    let name;
    let username;
    let withTags = [];
    let withMetadata = [];
    let photoTags = [];
    let uploadWidget;
    let status = "";
    $: allowSubmit = location && datetime;
    $: slug = name && name.toLowerCase().replaceAll(' ','-');
    $: photoTagsNoDuplicates = Array.from(new Set(photoTags));


    // async function getLocation() {
    //     console.log("get Location", location);
    //     status = "getting coordinates..."
    //     if (location){
    //         const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${location}&format=jsonv2`);
    //         const data = await response.json();
    //         console.log("data: ", data);
    //         // just take the first entry
    //         // location = data.display_name;
    //         lat = data[0].lat;
    //         lon = data[0].lon;
    //         minLat = data[0].boundingbox[0];
    //         maxLat = data[0].boundingbox[1];
    //         minLon = data[0].boundingbox[2];
    //         maxLon = data[0].boundingbox[3];

    //         status= "got location data!";
    //         photoData.location = location;
    //     } else {
    //         status = "enter a location";
    //     }
    // }
    
    // function findMyLocation() {
    //     console.log("find my Location");
    //     if(!navigator.geolocation){
    //         status = "geolocation not supported!";
    //     } else {
    //         status = "getting location...";
    //         navigator.geolocation.getCurrentPosition(async (position) => {
    //             console.log('got position: ', position);
    //             const response = await fetch(`https://nominatim.openstreetmap.org/reverse.php?lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=9&format=jsonv2`);
    //             const data = await response.json();
    //             console.log("data: ", data);
    //             location = data.display_name;
    //             photoData.location = location;
    //             lat = data.lat;
    //             lon = data.lon;
    //             minLat = data.boundingbox[0];
    //             maxLat = data.boundingbox[1];
    //             minLon = data.boundingbox[2];
    //             maxLon = data.boundingbox[3];
    //             status= "got location data!";
    //         }, (error) => {
    //             console.log('error getting location: ',error.message);
    //         } )
    //     }
    // }

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
        photoData.timeInMs = timeInMs;
        console.log(new Date(timeInMs).toLocaleString());
        console.log("datetimeSplit: ", datetime.split('T')[0].split('-'));
        const datetimeSplit = datetime.split('T')[0].split('-')
        console.log("yearMonth: ", `${datetimeSplit[0]}-${datetimeSplit[1]}`);
        yearMonth = `${datetimeSplit[0]}-${datetimeSplit[1]}`;
        photoData.yearMonth = yearMonth;

        console.log("photoData: ", photoData);
        // dispatch('datetimechange', {
        //     datetimeMs: timeInMs
        // });
    }

    function saveAltText(){
        console.log("saveAltText", altText);
        const commonWords = ["the","be","of","and","a","in","to","have","it","for","I","that","you","he","on","with","do","at","by","not","this","but","from","they","his","that","she","or","which","as","we","an","say","will","would","can","if","their","go","what","there","all","get","her","make","who","as","out","up","see","know","time","take","them","some","could","so","him","year","into","its","then","think","my","come","than","more","about","now","last","your","me","no","other","give","just","should","these","people","also","well","any","only","new","very","when","may","way","look","like","use","her","such","how","because","when","as","good","find","is"];
        const keywords = altText.replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().split(" ").filter(word => !commonWords.includes(word));
        photoTags = [...photoTags, ...keywords];
        console.log("saveAltText photoTags: ",photoTags); 
    }

    function addTag(){
        withTags = [...withTags, {name,slug,username: username.replaceAll('@',''),group:name.toUpperCase().split("")[0]}];
        withMetadata = [...withMetadata, name, slug, username.replaceAll('@','')];
        photoTags = [...photoTags, name, slug, username.replaceAll('@','')];
        console.log("addTag photoTags: ",photoTags);
        name = "";
        username = ""; 
    }

    function saveSettings(){
        // add withTags to $settings.with
    }

    function handleCloudinarySuccess(event) {
        console.log("success event.detail: ", event.detail);
        // const uploadURL = event.detail.uploadURL;
        // const uploadURLSplit = uploadURL.split('upload/');
        // const filename = event.detail.filename;
        // const url = uploadURLSplit[0]+'upload/f_auto,q_auto,c_scale,w_1500/'+uploadURLSplit[1];
        status = "media uploaded successfully!"
    }


</script>
<section>
    Select Event
    <br/>
    {#if $settings.events}
        <select bind:value={photoData}>
            {#each $settings.events as event}
                <option value={event}>
                    {event.title}
                </option>
            {/each}
        </select>
    {:else}
        loading events...
    {/if}
    <br/><br/>
    {#if photoData}
        {photoData.location}
    {:else}
        select a location
    {/if}
    <!-- <br/><br/>
    <label for="location">Location:</label>
    <br/>                
    <input bind:value={location} id="location" required>
    <br/>
    <button on:click={getLocation} name="get-location">Get Location</button><button on:click={findMyLocation} name="find-location">Find My Location</button> -->

    <br/><br/>
    <label for="datetime">Date and Time:</label>
    <br/>  
    <input type="datetime-local" bind:value={datetime} on:change={handleDateTimeChange} id="datetime" required>
    <br/>
    <br/><br/>
    <label for="caption">Title / Caption:</label>
    <br/>  
    <input type="text" bind:value={caption} id="caption" required>
    <br/>
    <br/><br/>
    <label for="alt-text">Describe the photo:</label>
    <br/>
    <textarea id="alt-text" name="alt-text" bind:value={altText} placeholder="Will be used as alt text and for keywords."></textarea>
    <br/><button on:click={saveAltText} name="save-alt-text">Save Alt Text</button>
    <br/><br/>
    Add People, Things, Places
    <br/>
    <label for="name">Name:</label>
    <br/>                
    <input bind:value={name} id="name" required>
    <br/>
    <label for="username">Username (optional):</label>
    <br/>                
    <input bind:value={username} id="username" placeholder="no @" required>
    <br/>
    <button on:click={addTag} name="add-tag">Add Tag</button>

    <fieldset>
        <legend>Added Tags</legend>
        {#each withTags as tag (tag.slug)}
            <div>{tag.name} {tag.username}</div>
        {/each}
    </fieldset>

    <div id="status">{status}</div>
    <br/>
    <button on:click={() => uploadWidget.showUploadWidget()}  name="upload">Upload</button>
    <UploadWidget photoData={photoData} photoTags={photoTagsNoDuplicates}  withMetadata={withMetadata} caption={caption} alt={altText} bind:this={uploadWidget} on:success={handleCloudinarySuccess} />
    <!-- <button on:click={addEvent} disabled={!allowSubmit} name="add">Add</button>
    <button on:click={saveSettings} disabled={!allowSubmit} name="save">Save Settings</button>
    <button on:click={getSettings} name="get">Get Settings</button> -->
</section>
