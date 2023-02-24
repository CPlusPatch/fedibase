# Fedibase

### A beautiful, simple client for the Fediverse.

```
⚠️ Fedibase is in public beta, and is missing many features
⚠️ No promises will be made on ETA for missing features
```

![Dark mode for Desktop](assets/desktop-dark.png)
![Dark mode for Desktop](assets/desktop-light.png)

## Technologies used

- [Next.js](https://nextjs.org/) for the web app
- [TailwindCSS](https://tailwindcss.com) for styling
- [Megalodon](https://github.com/h3poteto/megalodon) for the Fediverse API
- [PNPM](https://pnpm.io/) for package distribution

## Features

- Fully mobile-compatible and responsive
- Compatible with Mastodon, Pleroma and Misskey
- Dark/light mode support (toggle coming soon)
- Beautiful animations
- Simple and clean interface
- Self-hostable (anyone can host it)
- Clientside only (stores all data in browser)

### Planned features (coming soon™️):

- Emoji reactions
- More timelines
- Placing CWs on posts
- Drag and drop files to upload
- More files support
- Quote post rendering
- Notifications
- Settings page

## Running your own instance

First, clone the Codeberg repository:

```sh
git clone https://codeberg.org/CPlusPatch/fedibase.git
cd fedibase
```

Then, [install PNPM](https://pnpm.io/installation) and Node.js 18.

To build and start:

```sh
pnpm build
pnpm start
```

## Collaborators

- [Daikei](https://codeberg.org/daikei/) helped me fix a couple of annoying bugs!

---
Licensed under GPLv3