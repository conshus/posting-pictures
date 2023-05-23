<script>
    import { onMount, afterUpdate, beforeUpdate } from 'svelte';
    import { user, siteURL, settings } from '../stores.js';
    import Dashboard from './Dashboard.svelte';
    // import Dashboard from './Dashboard.astro';
    // import netlifyIdentity from 'netlify-identity-widget';
    // let authUser;
    // let loggedInUser;
    let loggedIn = false;
    let isAuth = false;
    let authResponse;

    export let siteOrigin;
    $siteURL = siteOrigin;

    // netlifyIdentity.init();
    console.log("outside netlifyIdentity: ",netlifyIdentity);
    console.log("outside netlifyIdentity currentUser",netlifyIdentity.currentUser());
    console.log("outside ls user?: ",JSON.parse(localStorage.getItem('gotrue.user')));

    onMount(async () => {
        console.log("onMount");
        // netlifyIdentity.init();
        console.log("netlifyIdentity: ",netlifyIdentity);
        console.log("netlifyIdentity has the user?",netlifyIdentity.currentUser());
        console.log("$user: ",$user )
        console.log("double check localstorage");
        user.lsCheck();
        console.log("user.lsCheck(): ",$user )
        console.log("onMount ls user?: ",JSON.parse(localStorage.getItem('gotrue.user')));
        if (netlifyIdentity.currentUser() && !loggedIn){
            console.log("netlifyIdentity does have the user, but not logged in",netlifyIdentity.currentUser());
            user.register(netlifyIdentity.currentUser());
            loggedIn = true;
            authResponse = await checkUser();
            console.log("authResponse: ", authResponse);
            isAuth = authResponse.verified;
            if (isAuth){
                // Get settings
                console.log("get settings", $siteURL);
                try{
                    // const getResponse = await fetch(`${$siteURL}/.netlify/functions/getsettings`);
                    const getResponse = await fetch(`/.netlify/functions/getsettings`);
                    $settings = await getResponse.json();
                    console.log("settings: ", $settings);
                }catch(error){
                    console.log("error getting settings: ", error);
                }
            }
            
        }
        // if ($user && !loggedIn){            
        //     console.log("user from local storage");
        //     loggedIn = true;
        //     authResponse = await checkUser();
        //     console.log("authResponse: ", authResponse);
        //     isAuth = authResponse.verified;
        // }

        // Bind to events
        // netlifyIdentity.on("init", user => console.log("init: ",user));
        // netlifyIdentity.on("login", user => console.log("login: ",user));
        // netlifyIdentity.on("logout", () => console.log("Logged out"));
        // netlifyIdentity.on("error", (err) => console.error("Logged out: ", err));
        // netlifyIdentity.on("open", () => console.log("Widget opened"));
        // netlifyIdentity.on("close", () => console.log("Widget closed"));


    });

    beforeUpdate(() => {
		// console.log('the component is about to update: ', $user);
        // console.log("beforeUpdate netlifyIdentity.currentUser",netlifyIdentity.currentUser());
        // console.log("beforeUpdate ls user?: ",JSON.parse(localStorage.getItem('gotrue.user')));
	});

    afterUpdate(() => {
		// console.log('the component just updated: ', $user);
        // console.log("afterUpdate netlifyIdentity.currentUser",netlifyIdentity.currentUser());
        // console.log("afterUpdate ls user?: ",JSON.parse(localStorage.getItem('gotrue.user')));

	});

    async function validateJWT(){
        // console.log("userData.token.expires_at: ", loggedInUser.token.expires_at);
        // console.log("userData.token.expires_at: ", $user.token.expires_at);
        console.log("Date.now(): ", Date.now());
        // if ( Date.now() >= loggedInUser.token.expires_at ){
        if ( Date.now() >= $user.token.expires_at ){
            console.log("JWT expired");
            // Refresh the JWT
            console.log("refresh JWT");
            try {
                // const response = await loggedInUser.jwt();
                const response = await $user.jwt();
                console.log("response: ", response);
            } catch(error) {
                console.log("refresh error: ", error);
            }
            // set gotrue.user in localStorage
            return;
        } else {
            console.log("JWT is good");
            return;
        }
    }


    async function checkUser(){
        // check if JWT is valid
        await validateJWT();
        // place a try catch
        // const response = await fetch("https://marvelous-otter-a2b882.netlify.app/.netlify/functions/checkuser", {
        const response = await fetch("/.netlify/functions/checkuser", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            // mode: 'cors', // no-cors, *cors, same-origin
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // "User-Agent": "MyApp (YOUR_NAME@EXAMPLE.COM)",
                // 'Authorization': 'Bearer ' + "QX27v2jCdNZlAamPQaru1u0JjDF440uF-EgWUlnlBlA"
                'Authorization': 'Bearer ' + $user.token.access_token
                // 'Authorization': 'Bearer ' + "Zr20wX4I6jleYD61COTHLvZWdCfjFxQy8-NyVTnIFBk"
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // body: JSON.stringify(dataToSend) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects

    }
    // Bind to events
    netlifyIdentity.on("init", async(netlifyUser) => {
        console.log("init: ", netlifyUser);
        console.log("init $user: ", $user);
        console.log("init netlifyIdentity.currentUser : ", netlifyIdentity.currentUser());
        console.log("init ls user: ", JSON.parse(localStorage.getItem('gotrue.user')));
        // if (!$user) {
        if (netlifyUser) {
            // loggedInUser = netlifyUser;
            // $user = netlifyUser;
            user.register(netlifyUser);
            console.log("got user on init.",$user);
            loggedIn = true;
            authResponse = await checkUser();
            console.log("authResponse: ", authResponse);
            isAuth = authResponse.verified;
        } else {
            console.log("user is not logged in");
        }
    });
    netlifyIdentity.on("login", async(netlifyUser) => {
        console.log("login: ", netlifyUser);
        // loggedInUser = netlifyUser;
        // $user = netlifyUser;
        // user.register(netlifyUser);
        if (!loggedIn && !$user){
            user.register(netlifyUser);
            console.log("user just logged in");
            loggedIn = true;
            authResponse = await checkUser();
            console.log("authResponse: ", authResponse);
            isAuth = authResponse.verified;
        } else {
            console.log("user is already logged in.");
            netlifyIdentity.close();
        }
    });
    netlifyIdentity.on("logout", () => {
        // authUser = null;
        // loggedInUser = null;
        // $user = null;
        user.logout();
        loggedIn = false;
        isAuth = false;
        $settings = null;
        console.log("Logged out");
    });
    netlifyIdentity.on("error", (err) => console.error("Logged out: ", err));
    netlifyIdentity.on("open", () => console.log("Widget opened"));
    netlifyIdentity.on("close", () => console.log("Widget closed"));

    function login(){
        netlifyIdentity.open('login');
    }

    function logout(){
        console.log("logout");
        netlifyIdentity.logout();
        user.logout();
        loggedIn = false;
        isAuth = false;
        $settings = {};
        console.log("Logged out");
    }
</script>
<svelte:head>
    <script type="text/javascript" src='https://identity.netlify.com/v1/netlify-identity-widget.js'></script>
</svelte:head>
<section>
    Admin {$siteURL}
    <br/>
    <!-- <div data-netlify-identity-button></div> -->
    <!-- {#if loggedInUser && loggedIn && isAuth} -->
    {#if $user && loggedIn && isAuth}
        <button on:click={logout}>logout</button>
        logged in!
        <button on:click={checkUser}>checkUser</button>
        <Dashboard />
        <!-- <Dashboard> -->
        <!-- </Dashboard> -->

    {:else if $user && loggedIn}
        <button on:click={logout}>logout</button>
        not authorized!
    {:else}
        <button on:click={login}>login</button>
        logged out!
    {/if}

</section>