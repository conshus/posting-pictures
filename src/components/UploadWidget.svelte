<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let photoData = {};
    export let photoTags = [];
    export let caption = "";
    export let alt = "";
    export let  withMetadata = [];

    $: withString =  withMetadata.join(' ');

    export function showUploadWidget() {
        console.log(" withMetadata: ",  withMetadata);
        cloudinary.openUploadWidget({
            cloudName: "dwane", // need to make this a variable or something
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