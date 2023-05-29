Hey. I'm Dwane ([LifeLong.dev](https://lifelong.dev)) and I like to build side projects. One of them is a site where I post pictures and videos of my travels ([Dwane.in](https://dwane.in)). I've shown it to a few folks and they asked if they could get one like it.

So here it is. A less complex version of my project that is easier to get up and running. You can see a demo at [Dwane.Posted.Pics](https://dwane.posted.pics)

For $2 USD a month, you can get a custom subdomain (yourname.posted.pics). If interested, contact me at my site or Twitter ([@lifelongdev](https://twitter.com/lifelongdev))

# Things you need
- [GitHub account](https://github.com/signup)
- [Netlify account](https://app.netlify.com/) (you can log in using GitHub)
- [Cloudinary account](https://console.cloudinary.com/invites/lpov9zyyucivvxsnalc5/s4khtwourlx3jw2fz5xp?t=default) (you can Login using GitHub) *This is an affiliate link so I can get more credits if you sign up.

# Steps
- [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-statuskit)

- In your Netlify dashboard, go to Site settings -> Environment variables

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
    <summary>CLOUDINARY_API_KEY</summary>
    Something small enough to escape casual notice.
</details>
<details>
    <summary>CLOUDINARY_API_SECRET</summary>
    Something small enough to escape casual notice.
</details>
<details>
    <summary>CLOUDINARY_NAME</summary>
    Something small enough to escape casual notice.
</details>
<details>
    <summary>GITHUB_PAT</summary>
    Something small enough to escape casual notice.
</details>
<details>
    <summary>NETLIFY_PAT</summary>
    Something small enough to escape casual notice.
</details>

- Create a



# Astro Stuff if you want to modify things

```
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![basics](https://user-images.githubusercontent.com/4677417/186188965-73453154-fdec-4d6b-9c34-cb35c248ae5b.png)


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
