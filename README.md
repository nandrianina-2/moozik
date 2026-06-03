
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
│  │     ├─ albums
│  │     │  ├─ AlbumsClient.tsx
│  │     │  └─ page.tsx
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
│  │  │     ├─ page.tsx
│  │  │     └─ PlaylistPageClient.tsx
│  │  ├─ radio
│  │  │  ├─ page.tsx
│  │  │  └─ RadioClient.tsx
│  │  ├─ search
│  │  │  ├─ page.tsx
│  │  │  └─ SearchClient.tsx
│  │  └─ subscription
│  │     └─ page.tsx
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
│  │  ├─ page.tsx
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
│  │  ├─ albums
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     └─ route.ts
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
│  │  ├─ search
│  │  │  └─ route.ts
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
│  │  ├─ stripe
│  │  │  ├─ checkout
│  │  │  │  └─ route.ts
│  │  │  ├─ portal
│  │  │  │  └─ route.ts
│  │  │  └─ webhook
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
│  ├─ manifest.ts
│  ├─ page.tsx
│  ├─ robots.ts
│  └─ sitemap.ts
├─ assets
│  └─ logo.png
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
│  │  ├─ VolumeControl.tsx
│  │  └─ Waveform.tsx
│  ├─ Providers.tsx
│  └─ ui
│     ├─ Badge.tsx
│     ├─ Button.tsx
│     ├─ FloatingInstallButton.tsx
│     ├─ NotificationBell.tsx
│     ├─ OnboardingModal.tsx
│     ├─ OnboardingWrapper.tsx
│     └─ Skeleton.tsx
├─ eslint.config.mjs
├─ hooks
│  ├─ useCurrentUser.ts
│  ├─ useKeyboardShortcuts.ts
│  └─ usePlayer.ts
├─ lib
│  ├─ audioEngine.ts
│  ├─ auth.ts
│  ├─ db.ts
│  ├─ rateLimit.ts
│  ├─ stripe.ts
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