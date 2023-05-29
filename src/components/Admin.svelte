<script>
    import { onMount } from 'svelte';
    import { user, siteURL, settings, events, locations, latestPics } from '../stores.js';
    import Dashboard from './Dashboard.svelte';
    let loggedIn = false;
    let isAuth = false;
    let authResponse;

    export let siteOrigin;
    $siteURL = siteOrigin;

    onMount(async () => {
        user.lsCheck();
        if (netlifyIdentity.currentUser() && !loggedIn){
            user.register(netlifyIdentity.currentUser());
            loggedIn = true;
            authResponse = await checkUser();
            isAuth = authResponse.verified;
            if (isAuth){
                // Get events
                try{
                    const eventsResponse = await fetch(`/.netlify/functions/get_events`);
                    $events = await eventsResponse.json();
                    const locationsResponse = await fetch(`/.netlify/functions/get_locations`);
                    $locations = await locationsResponse.json();
                    const latestPicsResponse = await fetch(`/.netlify/functions/get_latest_pics`);
                    $latestPics = await latestPicsResponse.json();
                }catch(error){
                    console.error("error getting events and/or locations: ", error);
                }
            }            
        }
    });

    async function validateJWT(){
        if ( Date.now() >= $user.token.expires_at ){
            // Refresh the JWT
            try {
                const response = await $user.jwt();
            } catch(error) {
                console.error("refresh error: ", error);
            }
            return;
        } else {
            return;
        }
    }

    async function checkUser(){
        try {
            // check if JWT is valid
            await validateJWT();
            const response = await fetch("/.netlify/functions/check_user", {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + $user.token.access_token
                },
            });
            return response.json(); // parses JSON response into native JavaScript objects
        } catch (error) {
            console.error("Error checking user: ", error);
        }
    }
    // Bind to events
    netlifyIdentity.on("init", async(netlifyUser) => {
        if (netlifyUser) {
            user.register(netlifyUser);
            loggedIn = true;
            authResponse = await checkUser();
            isAuth = authResponse.verified;
        } else {
            console.error("user is not logged in");
        }
    });
    netlifyIdentity.on("login", async(netlifyUser) => {
        if (!loggedIn && !$user){
            user.register(netlifyUser);
            loggedIn = true;
            authResponse = await checkUser();
            isAuth = authResponse.verified;
        } else {
            console.log("user is already logged in.");
            netlifyIdentity.close();
        }
    });
    netlifyIdentity.on("logout", () => {
        user.logout();
        loggedIn = false;
        isAuth = false;
        $settings = null;
    });
    netlifyIdentity.on("error", (err) => console.error("Logged out: ", err));
    netlifyIdentity.on("open", () => console.log("Widget opened"));
    netlifyIdentity.on("close", () => console.log("Widget closed"));

    function login(){
        netlifyIdentity.open('login');
    }

    function logout(){
        netlifyIdentity.logout();
        user.logout();
        loggedIn = false;
        isAuth = false;
        $settings = {};
    }
</script>

<section>
    {#if $user && loggedIn && isAuth}
        <button on:click={logout} class="logout">logout</button>
        {#if $events && $locations && $latestPics}
            <Dashboard />
        {:else}
            <p>loading...</p>
        {/if}
    {:else if !isAuth && loggedIn}
        <button on:click={logout} class="logout">logout</button>
        authorizing...
    {:else if $user && loggedIn}
        <button on:click={logout} class="logout">logout</button>
        not authorized!
    {:else}
        <div id="login-container">
            <button on:click={login} class="login">login</button>
        </div>
    {/if}
</section>

<style>
    button {
        cursor: pointer;
    }
    .logout {
        position: absolute;
        top: 5px;
        right: 5px;
    }
    #login-container {
        position: absolute;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>