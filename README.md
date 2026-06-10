
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
│  │  │  ├─ loading.tsx
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
│  │     ├─ loading.tsx
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
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ discover
│  │  │  └─ page.tsx
│  │  ├─ favorites
│  │  │  ├─ FavoritesClient.tsx
│  │  │  └─ page.tsx
│  │  ├─ history
│  │  │  ├─ HistoryClient.tsx
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ library
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ offline-library
│  │  │  └─ page.tsx
│  │  ├─ player
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ playlists
│  │  │  ├─ page.tsx
│  │  │  ├─ PlaylistsClient.tsx
│  │  │  └─ [id]
│  │  │     ├─ page.tsx
│  │  │     └─ PlaylistPageClient.tsx
│  │  ├─ radio
│  │  │  ├─ page.tsx
│  │  │  └─ RadioClient.tsx
│  │  ├─ search
│  │  │  ├─ loading.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ SearchClient.tsx
│  │  ├─ settings
│  │  │  └─ page.tsx
│  │  └─ subscription
│  │     ├─ page.tsx
│  │     └─ SubscriptionContent.tsx
│  ├─ (public)
│  │  ├─ (noShell)
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ register
│  │  │     └─ page.tsx
│  │  ├─ (shell)
│  │  │  ├─ albums
│  │  │  │  └─ [id]
│  │  │  │     ├─ AlbumClient.tsx
│  │  │  │     ├─ loading.tsx
│  │  │  │     └─ page.tsx
│  │  │  ├─ artists
│  │  │  │  ├─ ArtistsGrid.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     ├─ ArtistClient.tsx
│  │  │  │     ├─ loading.tsx
│  │  │  │     └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ s
│  │  │  │  └─ [slug]
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ SmartLinkClient.tsx
│  │  │  └─ u
│  │  │     └─ [username]
│  │  │        ├─ page.tsx
│  │  │        └─ ProfileClient.tsx
│  │  └─ layout.tsx
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
│  │  ├─ push
│  │  │  └─ route.ts
│  │  ├─ recommendations
│  │  │  ├─ route.ts
│  │  │  └─ similar
│  │  │     └─ route.ts
│  │  ├─ search
│  │  │  └─ route.ts
│  │  ├─ songs
│  │  │  ├─ by-slug
│  │  │  │  └─ [slug]
│  │  │  │     └─ route.ts
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
│  │     ├─ sessions
│  │     │  └─ route.ts
│  │     ├─ settings
│  │     │  └─ route.ts
│  │     └─ [username]
│  │        └─ route.ts
│  ├─ error.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ icon-192.png
│  ├─ layout.tsx
│  ├─ loading.tsx
│  ├─ manifest.ts
│  ├─ not-found.tsx
│  ├─ page.tsx
│  ├─ robots.ts
│  └─ sitemap.ts
├─ CLAUDE.md
├─ components
│  ├─ LandingPage.tsx
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
│  │  │  ├─ EQPanel.tsx
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
│  ├─ useAutoQueue.ts
│  ├─ useCurrentUser.ts
│  ├─ useKeyboardShortcuts.ts
│  ├─ useOfflineSongs.ts
│  ├─ usePlayer.ts
│  └─ usePushNotifications.ts
├─ lib
│  ├─ audioEngine.ts
│  ├─ auth.ts
│  ├─ cloudinary.ts
│  ├─ db.ts
│  ├─ pushNotification.ts
│  ├─ rateLimit.ts
│  ├─ recommendations.ts
│  ├─ stripe.ts
│  └─ utils.ts
├─ models
│  ├─ Album.ts
│  ├─ Artist.ts
│  ├─ Comment.ts
│  ├─ History.ts
│  ├─ Like.ts
│  ├─ Notification.ts
│  ├─ Playlist.ts
│  ├─ PushSubscription.ts
│  ├─ Session.ts
│  ├─ Song.ts
│  ├─ StreamEvent.ts
│  ├─ User.ts
│  └─ UserSettings.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  ├─ icon-192.png
│  ├─ icon-512.png
│  └─ icon-maskable-512.png
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