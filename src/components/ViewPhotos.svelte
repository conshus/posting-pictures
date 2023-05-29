<script>
    import { user, events } from '../stores.js';
    let selectedEvent;
    let eventPhotos;
    let status = "";
    let isRemoving = false;

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


    async function handleOnChange() {
        if (selectedEvent){
            let getResponse;
            status = "loading photos...";
            try {
                if (selectedEvent === 'latest'){
                    getResponse = await fetch(`/.netlify/functions/get_latest_pics`);
                } else {
                    getResponse = await fetch(`/.netlify/functions/get_event?slug=${selectedEvent.slug}`);
                }
                eventPhotos = await getResponse.json();
                status = "";
            } catch(error){
                status = error;
            }
        }

	}
    async function removeEvent(e){
        let removePhotosResponse;
        status = "removing photo from event";
        const tempEventPhotos = [...eventPhotos];
        tempEventPhotos.splice(e.target.dataset.index,1);
        try {
            isRemoving = true;
            if (selectedEvent === 'latest'){
                removePhotosResponse = await postData(`/.netlify/functions/update_latest_pics`, tempEventPhotos);
            } else {
                removePhotosResponse = await postData(`/.netlify/functions/update_event?slug=${selectedEvent.slug}`, tempEventPhotos);
            }
            status = "photo removed successfully";
            isRemoving = false;
            setTimeout(() => {
                status = "";
            }, 2000);
            eventPhotos = tempEventPhotos;
        }catch(error){
            isRemoving = false;
            status = error;
        }
    }
</script>

<div>
    <h1>View photos</h1>
    {#if $events}
        <section>
            <div>
                <p>** Removing a photo does not delete it. It only removes it from the list and site.</p>
                <select bind:value={selectedEvent} on:change="{handleOnChange}">
                    <option value="">select a gallery</option>
                    <option value="latest">latest photos</option>
                    {#each $events as event}
                        <option value={event}>
                            {event.title}
                        </option>
                    {/each}
                </select>
                <br/>
                {status}
            </div>
            <div id="photos-container">
                {#if selectedEvent && eventPhotos}
                    {#each eventPhotos as photo, i}
                        <fieldset>
                            <legend>{photo.filename}</legend>
                            <img src={photo.url} alt={photo.altText} />
                            <br/><br/>
                            <details>
                                <summary>Remove photo</summary>
                                <br/>
                                <button on:click={removeEvent} name="remove-event" data-index={i} disabled={isRemoving}>Remove from list</button>
                            </details>
                        </fieldset>                        
                    {/each}
                {:else}
                    <p>select a gallery</p>
                {/if}
            </div>
        </section>
    {:else}
        loading events...
    {/if}

</div>

<style>
    section {
        display: flex;
    }
    select {
        width: 200px;
    }
    #photos-container {
        width: 100%;
        text-align: center;
        display: flex;
        align-items: flex-start;
    }
    fieldset {
        width: 200px;
        cursor: pointer;
    }
    fieldset img {
        width: 100%;
    }
    p {
        width: 100%;
    }
</style>