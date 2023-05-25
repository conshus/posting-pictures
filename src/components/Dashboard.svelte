<script>
    import AddPhoto from './AddPhoto.svelte';
    import AddEvent from './AddEvent.svelte';
    import ViewPhotos from './ViewPhotos.svelte';
    import EditEvents from './EditEvents.svelte';
    let mode = "photo";

</script>

<main>
    Dashboard
    <a href="https://cloudinary.com/console/media_library/folders/home" target="_blank" rel="noreferrer">View Cloudinary console</a>
    <br/><br/>
    <button on:click={() => mode = "photo"}>add photo</button> | <button on:click={() => mode = "event"}>add event</button> | <button on:click={() => mode = "events"}>edit events</button> | <button on:click={() => mode = "photos"}>edit photos</button>
    <br/><br/>
    {#if mode === "photo"}
        <AddPhoto />
    {:else if mode === "event"}
        <AddEvent />
    {:else if mode === "events"}
        <EditEvents />
    {:else if mode === "photos"}
        <ViewPhotos />
    {/if}
</main>