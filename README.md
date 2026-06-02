This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

```

```
moozik
├─ .husky
│  ├─ pre-commit
│  └─ _
│     ├─ applypatch-msg
│     ├─ commit-msg
│     ├─ h
│     ├─ husky.sh
│     ├─ post-applypatch
│     ├─ post-checkout
│     ├─ post-commit
│     ├─ post-merge
│     ├─ post-rewrite
│     ├─ pre-applypatch
│     ├─ pre-auto-gc
│     ├─ pre-commit
│     ├─ pre-merge-commit
│     ├─ pre-push
│     ├─ pre-rebase
│     └─ prepare-commit-msg
├─ AGENTS.md
├─ app
│  ├─ (admin)
│  │  ├─ admin
│  │  │  ├─ artists
│  │  │  │  ├─ ArtistsAdminClient.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ library
│  │  │  │  ├─ LibraryClient.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ users
│  │  │     ├─ page.tsx
│  │  │     └─ UsersClient.tsx
│  │  └─ layout.tsx
│  ├─ (artist)
│  │  ├─ layout.tsx
│  │  └─ studio
│  │     ├─ analytics
│  │     │  ├─ AnalyticsClient.tsx
│  │     │  └─ page.tsx
│  │     ├─ page.tsx
│  │     ├─ songs
│  │     │  └─ [id]
│  │     │     ├─ EditSongForm.tsx
│  │     │     └─ page.tsx
│  │     ├─ SongsList.tsx
│  │     └─ upload
│  │        ├─ page.tsx
│  │        └─ UploadForm.tsx
│  ├─ (auth)
│  │  ├─ account
│  │  │  └─ page.tsx
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  ├─ favorites
│  │  │  └─ page.tsx
│  │  ├─ history
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ library
│  │  │  └─ page.tsx
│  │  ├─ player
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ playlists
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ radio
│  │  │  ├─ page.tsx
│  │  │  └─ RadioClient.tsx
│  │  └─ search
│  │     ├─ page.tsx
│  │     └─ SearchClient.tsx
│  ├─ (public)
│  │  ├─ albums
│  │  │  └─ [id]
│  │  │     ├─ AlbumClient.tsx
│  │  │     └─ page.tsx
│  │  ├─ artists
│  │  │  ├─ ArtistsGrid.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     ├─ ArtistClient.tsx
│  │  │     └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ playlists
│  │  │  └─ [id]
│  │  │     ├─ page.tsx
│  │  │     └─ PublicPlaylistClient.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  └─ u
│  │     └─ [username]
│  │        ├─ page.tsx
│  │        └─ ProfileClient.tsx
│  ├─ api
│  │  ├─ admin
│  │  │  ├─ artists
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ songs
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  └─ users
│  │  │     └─ [id]
│  │  │        └─ route.ts
│  │  ├─ analytics
│  │  │  └─ route.ts
│  │  ├─ artists
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     └─ follow
│  │  │        └─ route.ts
│  │  ├─ auth
│  │  │  ├─ register
│  │  │  │  └─ route.ts
│  │  │  └─ [...nextauth]
│  │  │     └─ route.ts
│  │  ├─ notifications
│  │  │  └─ route.ts
│  │  ├─ playlists
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     ├─ route.ts
│  │  │     └─ songs
│  │  │        └─ route.ts
│  │  ├─ songs
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     ├─ comments
│  │  │     │  └─ route.ts
│  │  │     ├─ edit
│  │  │     │  └─ route.ts
│  │  │     ├─ like
│  │  │     │  └─ route.ts
│  │  │     ├─ play
│  │  │     │  └─ route.ts
│  │  │     └─ route.ts
│  │  └─ users
│  │     ├─ history
│  │     │  └─ route.ts
│  │     ├─ likes
│  │     │  └─ route.ts
│  │     ├─ me
│  │     │  ├─ password
│  │     │  │  └─ route.ts
│  │     │  └─ route.ts
│  │     └─ [username]
│  │        └─ route.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ CLAUDE.md
├─ components
│  ├─ layout
│  │  ├─ AdminLinks.tsx
│  │  ├─ AppShell.tsx
│  │  ├─ Header.tsx
│  │  ├─ MobileNav.tsx
│  │  ├─ RightPanel.tsx
│  │  └─ Sidebar.tsx
│  ├─ modals
│  │  ├─ AddToPlaylistModal.tsx
│  │  └─ CreatePlaylistModal.tsx
│  ├─ music
│  │  ├─ CommentsSection.tsx
│  │  └─ SongRow.tsx
│  ├─ player
│  │  ├─ FloatingComments.tsx
│  │  ├─ FullPlayerPage.tsx
│  │  ├─ MiniPlayer.tsx
│  │  ├─ panels
│  │  │  ├─ CommentsPanel.tsx
│  │  │  ├─ InfosPanel.tsx
│  │  │  └─ QueuePanel.tsx
│  │  ├─ PlayerActions.tsx
│  │  ├─ PlayerControls.tsx
│  │  ├─ PlayerProvider.tsx
│  │  ├─ ProgressBar.tsx
│  │  └─ VolumeControl.tsx
│  ├─ Providers.tsx
│  └─ ui
│     ├─ Badge.tsx
│     ├─ Button.tsx
│     ├─ NotificationBell.tsx
│     └─ Skeleton.tsx
├─ eslint.config.mjs
├─ hooks
│  ├─ useCurrentUser.ts
│  └─ usePlayer.ts
├─ lib
│  ├─ audioEngine.ts
│  ├─ auth.ts
│  ├─ db.ts
│  └─ utils.ts
├─ middleware.ts
├─ models
│  ├─ Album.ts
│  ├─ Artist.ts
│  ├─ Comment.ts
│  ├─ History.ts
│  ├─ Like.ts
│  ├─ Notification.ts
│  ├─ Playlist.ts
│  ├─ Song.ts
│  ├─ StreamEvent.ts
│  └─ User.ts
├─ next.config.ts
├─ not-found.tsx
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ README.md
├─ scripts
│  └─ seed.ts
├─ store
│  └─ playerStore.ts
├─ tsconfig.json
└─ types
   ├─ css.d.ts
   ├─ index.ts
   └─ next-auth.d.ts

```