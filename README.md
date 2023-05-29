Hey. I'm Dwane ([LifeLong.dev](https://lifelong.dev)) and I like to build side projects. One of them is a site where I post pictures and videos of my travels ([Dwane.in](https://dwane.in)). I've shown it to a few folks and they asked if they could get one like it.

So here it is. A less complex version of my project that is easier to get up and running. You can see a demo at [Dwane.Posted.Pics](https://dwane.posted.pics)

For $2 USD a month, you can get a custom subdomain (yourname.posted.pics). If interested, contact me at my site or Twitter ([@lifelongdev](https://twitter.com/lifelongdev))

# Things you need
- [GitHub account](https://github.com/signup)
- [Netlify account](https://app.netlify.com/) (you can log in using GitHub)
- [Cloudinary account](https://console.cloudinary.com/invites/lpov9zyyucivvxsnalc5/s4khtwourlx3jw2fz5xp?t=default) (you can Login using GitHub) *This is an affiliate link so I can get more credits if you sign up.

# Steps
- [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-statuskit)

- In your Netlify dashboard, go to "Site settings" -> "Environment variables"

- Click "Add a variable" and select "Import from a .env file"

- Copy and paste the following into the box next to "Contents of .env file:"
<pre>
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_NAME=
GITHUB_PAT=
NETLIFY_PAT=
</pre>
(Leave Scopes: All scopes and Deploy contexts: All deploy contexts)

- Click "Import variables"

- Now, we need to fill in the Environment variables. In the Netlify Dashboard, click a variable to expand it. Click "Options" -> "Edit". Make sure, "Scopes: All scopes" and "Values: Same value for all deploy contexts"

- Open the same variable below to see how to get the value you will then input into the dashboard. Click "Save variable" Repeat until all Environment variables are filled in. 
<details>
    <summary>CLOUDINARY_API_KEY | CLOUDINARY_API_SECRET | CLOUDINARY_NAME</summary>
    Go to the <a href="https://console.cloudinary.com/console/" target="_blank">Console dashboard</a> The left side bar should look like this: <br/> <img src="https://github.com/conshus/posting-pictures/assets/212875/8c5b4146-1918-4a61-a550-fef4baa3ed88" alt="Cloudinary dashboard side bar show 'Dashboard' is highlighted" /><br/> On this page, you'll find the API key, API secret, and Cloud Name to put into the Netlify dashboard.<br/><img src="https://github.com/conshus/posting-pictures/assets/212875/1fb7358d-26fd-405c-91c9-fac1fb3e7608" alt="Cloudinary showing the Cloud Name, API Key, and API Secret" />
</details>
<details>
    <summary>GITHUB_PAT</summary>
    Something small enough to escape casual notice.
</details>
<details>
    <summary>NETLIFY_PAT</summary>
    Something small enough to escape casual notice.
</details>

- Create a Cloudinary upload preset in the Console and then "Settings"(gear icon in the bottom left) -> "Upload" scroll to "Upload presets".

- Click "Add upload preset"

- Fill out the following:
<pre>
Upload preset name -> posting-pictures
Signing Mode -> Unsigned
Use filename or externally defined Public ID: on
Unique filename: on
</pre>
(You can take a look at the other options and select what fits your needs.)

- In the Netlify dashboard, you should be able to click the link under "Settings for..." to view your photo gallery. I'll be empty.

- Put "/admin" at the end of your site's URL to go to the dashboard.

- Click login and then "Continue with GitHub".

- That's it! Add events, photos and enjoy! Feel free to show me your photo gallery if you want.


# Upcoming features

Things I want to add once I get some time:

- Integrate the View Transitions API
- Show events on a map
- Show photos based on keywords, time, people, things, etc


# Astro Stuff if you want to modify things

Built the photo gallery with Astro using HTML, CSS and JavaScript. Don't need to be an expert to make some customations.

The Admin dashboard is built with Svelte. Astro also supports Lit, Vue, React, Preact, SolidJS, and [more](https://astro.build/integrations?search=&categories%5B%5D=frameworks). Feel free to rewrite anything with whatever you are comfortable with. 


## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
