<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { user } from '../stores.js';
    const dispatch = createEventDispatcher();
    let cloudName;
    export let photoData = {};
    export let photoTags = [];
    export let caption = "";
    export let alt = "";
    export let  withMetadata = [];

    $: withString =  withMetadata.join(' ');

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


    onMount(async () => {
        console.log("onMount");
        try{
            cloudName = await postData(`/.netlify/functions/get_cloudname`);
            console.log("cloudName: ", cloudName);
        }catch(error){
            console.log("error getting cloudname: ", error);
        }

    });

    export function showUploadWidget() {
        console.log(" withMetadata: ",  withMetadata);
        cloudinary.openUploadWidget({
            cloudName,
            uploadPreset: "posting-pictures",
            folder: `posting-pictures/${photoData.slug}`,
            tags: [...Object.values(photoData), ...photoTags],
            context: { alt, caption, ...photoData, with:withString },
            sources: [
                "local",
                "url",
                "camera"
            ],
            showAdvancedOptions: true,
            cropping: false,
            croppingShowDimensions: true,
            multiple: true,
            defaultSource: "local",
            styles: {
                palette: {
                    window: "#FFFFFF",
                    windowBorder: "#90A0B3",
                    tabIcon: "#0078FF",
                    menuIcons: "#5A616A",
                    textDark: "#000000",
                    textLight: "#FFFFFF",
                    link: "#0078FF",
                    action: "#FF620C",
                    inactiveTabIcon: "#0E2F5A",
                    error: "#F44235",
                    inProgress: "#0078FF",
                    complete: "#20B832",
                    sourceBg: "#E4EBF1"
                },
                fonts: {
                    default: null,
                    "sans-serif": {
                        url: null,
                        active: true
                    }
                }
            }
        },
        (err, result) => {
            if (!err) {    
                console.log("Upload Widget event - ", result);
                if (result.event === "success"){
                    dispatch('success',{
                        uploadURL: result.info.secure_url,
                        filename: result.info.original_filename
                    })
                }
            }
        });
    }
</script>