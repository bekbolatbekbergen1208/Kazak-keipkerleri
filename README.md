# QAZAQ HEROES

A Kazakh-first playable cultural game built with Next.js App Router, strict TypeScript, React, Tailwind CSS, Framer Motion, Lucide, and Supabase. Includes six folklore/epic heroes, twelve three-stage missions, five mini-games plus knowledge battles, an interactive five-region map, XP/levels/coins, eight achievements, daily quests, a collection, and a player dashboard.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Guest progress saves in this browser. Start opens the national games hub. Choose a game to play immediately as a guest and save rewards locally. Optional character creation opens the story journey: intro → creator → map → Ер Төстік mission → rewards → profile. All games support pointer/touch; horse run also supports Space/Arrow Up.

## Supabase

Copy `.env.example` to `.env.local`, supply your project's URL and public anon key, then run `supabase/migrations/001_game.sql` and `002_content.sql` in the Supabase SQL editor. Enable email/password authentication and set the site URL in your Supabase project. No service-role key belongs in the browser. Accounts save the full game state; a database trigger synchronizes normalized progress, achievements, unlocks, daily quests and score totals. RLS isolates personal records; the leaderboard view exposes only usernames, avatar indices and XP. Enable email confirmation before public deployment.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npm run test:game
```

## Content and assets

`data/content.ts` contains heroes, mission chains, achievements and quest templates. `types/game.ts` defines reusable models. `lib/i18n.ts` provides initial navigation dictionaries for Kazakh/Russian/English; full localized story content remains future work. The main interface is Kazakh. Hero portraits are original AI-generated cinematic illustrations in `public/art/hero-*.webp`; they are artistic folklore interpretations, not historical photographs. Generation prompts are saved in `public/art/portrait-prompts.json`. The steppe and customizable player avatars remain isolated SVG illustrations. Stats are game values, not historical claims. These characters are identified as folklore or epic figures. Replace art without changing game logic. Local ambience is a quiet generated tone in `public/audio`; sound starts only after explicit selection.

## Deployment limits

This is an early playable release, not a fully audited public service. Supabase credentials are intentionally not included; hosted auth and SQL must be tested against your project. XP is client-authored: add server-validated mission results before competitive leaderboard use. Choose moderated pseudonyms before a public child-facing launch. No chat, gambling or payments are included. Avatar presets and SVG wardrobe layers provide simplified visual customization; replace the layered artwork with final assets for a public release.

## National games

The «Ұлттық ойындар» shelves on Home, the dedicated Games screen, and Missions include simplified digital Asyk Atu (aim and power), Tenge Ilu (keyboard/touch timing), and Arqan Tartys (alternating left/right pulls against the computer). Asyk targets support tap-to-aim as well as direction/power sliders. Each game grants XP and coins once per saved player; starting a national game initializes browser-local guest progress without registration. Reward flags use the existing saved `game_state`, including compatibility with older saves.

Cultural reference: [UNESCO Assyk games](https://ich.unesco.org/en/RL/kazakh-traditional-assyk-games-01086).

## Grade 3 learning club

The Kazakh «Білім» screen adds a short original story with comprehension questions, a six-hero ability quiz, and four proverb questions. Children can retry answers and reread the story without a timer. Completing each activity awards a collectible hero badge, 40 XP and 10 coins once; a rotating daily activity grants 20 XP once per local calendar day. Progress is stored in the existing player state and old saves receive empty learning progress. The homepage links directly to the club. Shared styling includes larger question text, touch controls and tablet navigation.

Players can select any of the six presentation heroes from the homepage, Games or Profile. The selection is independent of mission unlocks and persists in `game_state.characterId`; the header and profile display the selected artwork. Guest choices stay in that browser, while configured signed-in profiles use the existing cloud synchronization.

## Story campaign and fairy-tale library

The homepage and persistent «СЮЖЕТ / ЕРТЕГІЛЕР» shortcuts open two complete local experiences. «Алты достың аманаты» is an original six-chapter story using the supplied presentation characters. Each chapter includes a reading scene, dialogue, a playable challenge and an ending. The three new challenge types are a navigable maze, an untimed symbol sequence and word ordering; they are also available as standalone practice on Games. Chapters unlock in order and award 80 XP and 20 coins once, with a one-time 100 XP finale bonus.

The library includes short introductions to two traditional tales plus two clearly marked original stories, three genre explanations, search/category/favorites filters, adjustable reading text, vocabulary and a comprehension question. Traditional tale references and the genre source are linked in the interface. Completing a reading awards 15 XP once. Chapter completion, favorites and read books persist in the existing `game_state.adventure` object, with normalization for old saves and malformed progress.

## Animated traditional tale

The primary Story screen now follows the regional library edition of «Ер Төстік» from birth and the search for his brothers through Kenjekei, Shalquyryq, the underground companions, Temir Khan's trials, Samruk, Shoyinqulaq and the return home. It replaces the invented six-chapter campaign in the interface. Eighteen episodes contain 36 original concise captions and responsive CSS/SVG cutout animations using the presentation's hero artwork. Playback can pause, replay, seek or select any episode without passing a game. Motion respects reduced-motion preferences. This is a child-friendly condensed visual retelling, not an unabridged transcription or a dubbed video.

`/ertostik` is a directly shareable route. The player includes the verified full-text library link, an external Kitap audio link, a transcript, playback speed and a copy-link control. Film bookmarks and viewed episodes persist separately in `game_state.tostik` without removing old saved XP or legacy chapter data. A new episode awards 20 XP once; watching all eighteen grants a one-time 100 XP bonus.

## Kazakh narration

All 36 animation captions have pre-generated Kazakh neural audio in `public/audio/tostik-daulet/`, with hashes/durations in `data/tostik-audio.json`. The browser plays local AAC files, so no speech API key or installed Kazakh device voice is needed at runtime. Play/pause, scene changes and replay control the audio; with voice enabled the next scene starts after narration finishes. Mute and volume persist locally. A media playback error falls back to timed captions.

Regenerate neural narration with `python scripts/generate-neural-narration.py` using `edge-tts` and macOS `afconvert`. It caches unchanged clips and updates manifests only when both collections finish. Runtime playback works independently of macOS.

### Full Er Tostik reader

`/ertostik/full` contains the complete traditional folk tale from the linked Pushkin Library edition, divided into 37 reading sections without abridgement. Source whitespace is normalized and long paragraphs are split for reading. This is separate from the short animated adaptation.

All sections and animation scenes have prerecorded Kazakh neural narration using `kk-KZ-DauletNeural`, played as ordinary AAC files on desktop and mobile. The reader supports pause, speed, seeking, automatic continuation, font size and local reading-position persistence. Regenerate both collections after text changes with `python scripts/generate-neural-narration.py` in a Python environment prepared with `pip install -r scripts/requirements-neural.txt` (network access and macOS `afconvert` are required). Legacy Aru scripts remain available but replace the selected narration when run. The deployed browser does not need a speech service or installed voice.

### Server accounts and administration

Node.js 24+ is required. Registration and login now use the Next.js server API at `/api/account/*`, with persistent SQLite storage at `SERVER_DATA_DIR/accounts.sqlite` (default `./storage`). Supabase credentials are not needed for accounts. Passwords are salted and hashed with scrypt; sessions use expiring HttpOnly cookies. Public registration always creates a student. Admin status can only be assigned by the server-side creation script.

Run `npm run admin:create` once to create an administrator (`admin@qazaq.local` by default). The generated unique password is written to `storage/admin-access.txt` with mode 0600, never to source code or the browser. `ADMIN_EMAIL` and `ADMIN_PASSWORD` may be set in the process environment when running the script. An existing user's role/password is never changed by this command. Sign in at `/admin`.

The admin page lists all registered users, search and role filters, account creation/last activity, synchronized game progress, and server-checked answers for the four required activities. Metrics refresh every 30 seconds. CSV export follows the active filters. Students cannot read administrative data. Guest activity remains local. Active minutes are approximate foreground-page time, not an attendance certificate; XP/story progress is synchronized from the game, while quiz correctness is calculated on the server.

For a Linux VPS, use `docker compose up -d --build` with `APP_ORIGIN` set to the real HTTPS site origin in the deployment `.env`. The application binds only to localhost:3000; publish it through the existing HTTPS reverse proxy. Run `docker compose exec web npm run admin:create`, then obtain the private credential file from `/data/admin-access.txt` through your server's secure file access. The `accounts` volume must remain mounted across deployments. Do not run `docker compose down -v`: that explicitly deletes persistent account data. Back up SQLite with its online backup API or stop the app before copying the database and WAL together. Keep data and credential files outside Git/public paths.

Local verification: `node --import tsx --test tests/accounts.test.ts` covers authentication, server-side scoring, duplicate-event protection, cross-account isolation, CSRF, role checks and storage persistence. This does not install the application on an offline VPS.

Run `npm run test:accounts` for the registration/admin browser journey. It starts a separate app on port 3101 with a temporary database and test admin, leaving the real `storage/` accounts untouched. The normal browser suite excludes this isolated test.
