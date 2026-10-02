# QAZAQ HEROES

A Kazakh-first playable cultural game built with Next.js App Router, strict TypeScript, React, Tailwind CSS, Framer Motion, Lucide, and Supabase. Includes six folklore/epic heroes, twelve three-stage missions, five mini-games plus knowledge battles, an interactive five-region map, XP/levels/coins, eight achievements, daily quests, a collection, and a player dashboard.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Guest progress saves in this browser. Start → intro → creator → map → Ер Төстік mission → riddle → route → memory → rewards → profile. All games support pointer/touch; horse run also supports Space/Arrow Up.

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

The «Ұлттық ойындар» shelves on Home and Missions include Togyzqumalaq (18 pits, 162 stones, tuzdyk, computer or two local players), simplified digital Asyk Atu (aim and power), and Tenge Ilu (keyboard/touch timing). Togyzqumalaq grants a learning reward after six total moves, while its full match can continue. Each game grants XP and coins once per saved player; guest practice without a created player grants no currency. Reward flags use the existing saved `game_state`, including compatibility with older saves.

Rules reference: [Kazakh Togyzqumalaq Federation](https://9kumalak.com/index.php/zhyldy-zhospar/509-to-yz-mala-a-idasy-men-erezhesi). Cultural reference: [UNESCO Assyk games](https://ich.unesco.org/en/RL/kazakh-traditional-assyk-games-01086).
