<script>
    import { user, siteURL, events, latestPics } from '../stores.js';
    import UploadWidget from './UploadWidget.svelte';
    let datetime;
    let location;
    let selectedEvent;
    let photoData;
    let timeInMs;
    let yearMonth;
    let caption;
    let altText;
    let altTextStatus = "";
    let name;
    let username;
    let withTags = [];
    let withMetadata = [];
    let photoTags = [];
    let uploadWidget;
    let status = "";
    let url;
    let filename;
    $: allowSubmit = caption && altText && url;
    $: slug = name && name.toLowerCase().replaceAll(' ','-');
    $: photoTagsNoDuplicates = Array.from(new Set(photoTags));

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
        altTextStatus = "";
        console.log("saveAltText", altText);
        const commonWords = ["the","be","of","and","a","in","to","have","it","for","I","that","you","he","on","with","do","at","by","not","this","but","from","they","his","that","she","or","which","as","we","an","say","will","would","can","if","their","go","what","there","all","get","her","make","who","as","out","up","see","know","time","take","them","some","could","so","him","year","into","its","then","think","my","come","than","more","about","now","last","your","me","no","other","give","just","should","these","people","also","well","any","only","new","very","when","may","way","look","like","use","her","such","how","because","when","as","good","find","is"];
        const keywords = altText.replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().split(" ").filter(word => !commonWords.includes(word));
        photoTags = [...photoTags, ...keywords];
        console.log("saveAltText photoTags: ",photoTags); 
        altTextStatus = "Alt Text saved!";
    }

    function addTag(){
        if (username){
            withTags = [...withTags, {name,slug,username: username.replaceAll('@',''),group:name.toUpperCase().split("")[0]}];
            withMetadata = [...withMetadata, name, slug, username.replaceAll('@','')];
            photoTags = [...photoTags, name, slug, username.replaceAll('@','')];
        } else {
            withTags = [...withTags, {name,slug,group:name.toUpperCase().split("")[0]}];
            withMetadata = [...withMetadata, name, slug];
            photoTags = [...photoTags, name, slug];
        }
        console.log("addTag photoTags: ",photoTags);
        name = "";
        username = ""; 
    }

    function handleCloudinarySuccess(event) {
        console.log("success event.detail: ", event.detail);
        const uploadURL = event.detail.uploadURL;
        const uploadURLSplit = uploadURL.split('upload/');
        filename = event.detail.filename;
        photoData.filename = event.detail.filename;
        url = uploadURLSplit[0]+'upload/f_auto,q_auto,c_scale,w_1500/'+uploadURLSplit[1];
        status = "media uploaded successfully!"
    }

    async function savePhoto(){
        console.log("photoData: ", photoData);
        console.log("photoTags: ", photoTagsNoDuplicates);  
        console.log("withMetadata: ", withMetadata); 
        console.log("caption: ", caption); 
        console.log("alt: ", altText);
        console.log("url: ", url);

        const newPicToAdd = {...photoData, altText, url, tags:photoTagsNoDuplicates, with:withMetadata, caption};

        try {
            // get the array of event photos from JSON file
            const getEventResponse = await fetch(`/.netlify/functions/get_event?slug=${photoData.slug}`);
            let eventPics = await getEventResponse.json();
            console.log("eventPhotos: ", eventPhotos);

            // add new photo to array
            eventPics = [...eventPics, newPicToAdd];
            console.log("eventPhotos: ", eventPhotos);

            // update the event JSON file
            const updateEventResponse = await postData(`/.netlify/functions/update_event?slug=${photoData.slug}`, eventPics);
            status = "event updated successfully"
            console.log("updateEventResponse: ", updateEventResponse);

            // add to latest pics JSON
            if ($latestPics.length === 50){
                console.log('latest pics is full.')
                $latestPics.pop();
            }
            $latestPics = [ newPicToAdd, ...$latestPics ];
            status = "adding to latest pics"
            const updatelatestPicsResponse = await postData(`/.netlify/functions/update_latest_pics`, $latestPics);
            status = "pic added to latest successfully"
            console.log("updateEventResponse: ", updatelatestPicsResponse);

            // show Twitter link


        }catch(error) {
            console.error('Error: ', error);
        }
    }


</script>
<section>
    {#if $events.length > 0}
        Select Event
        <br/>
        <select bind:value={photoData}>
            {#each $events as event}
                <option value={event}>
                    {event.title}
                </option>
            {/each}
        </select>
        <br/><br/>
        <label for="datetime">Date and Time:</label>
        <br/>  
        <input type="datetime-local" bind:value={datetime} on:change={handleDateTimeChange} id="datetime" required>
        <br/><br/>
        <label for="caption">Title / Caption:</label>
        <br/>  
        <input type="text" bind:value={caption} id="caption" required>
        <br/><br/>
        <label for="alt-text">Describe the photo:</label>
        <br/>
        <textarea id="alt-text" name="alt-text" bind:value={altText} placeholder="Will be used as alt text and for keywords." rows="5" cols="33"></textarea>
        <br/><button on:click={saveAltText} name="save-alt-text" disabled={!altText}>Save Alt Text</button>
        <br/><div id="alt-text-status">{altTextStatus}</div>
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
        <button on:click={addTag} name="add-tag" disabled={!name}>Add Tag</button>
        <br/><br/>
        <fieldset>
            <legend>Added Tags</legend>
            {#each withTags as tag (tag.slug)}
                <div>{tag.name} {tag.username ? tag.username : ''}</div>
            {/each}
        </fieldset>
    
        <div id="status">{status}</div>
        <br/><br/>
        <label for="url">URL:</label>
        <br/>
        <input bind:value={url} id="url" disabled required>
        <br/>
        <button on:click={() => uploadWidget.showUploadWidget()} disabled={!photoData} name="upload">Upload a photo</button>
        <br/><br/>
        <button on:click={savePhoto} disabled={!allowSubmit} name="save">Save Photo</button>

        <UploadWidget photoData={photoData} photoTags={photoTagsNoDuplicates}  withMetadata={withMetadata} caption={caption} alt={altText} bind:this={uploadWidget} on:success={handleCloudinarySuccess} />
        <!-- <button on:click={addEvent} disabled={!allowSubmit} name="add">Add</button>
        <button on:click={saveSettings} disabled={!allowSubmit} name="save">Save Settings</button>
        <button on:click={getSettings} name="get">Get Settings</button> -->
    
    {:else}
        Please add an event
    {/if}
    <!-- <br/><br/>
    {#if photoData}
        {photoData.location}
    {:else}
        select a location
    {/if} -->
    <!-- <br/><br/>
    <label for="location">Location:</label>
    <br/>                
    <input bind:value={location} id="location" required>
    <br/>
    <button on:click={getLocation} name="get-location">Get Location</button><button on:click={findMyLocation} name="find-location">Find My Location</button> -->

</section>

<style>
    section {
        text-align: center;
    }
    fieldset {
        max-width: 300px;
        margin: auto;
    }
</style>