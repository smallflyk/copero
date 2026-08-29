# Pokémon Champions Wiki

An unofficial, fan-made Pokémon Champions SEO guide and team-building MVP.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Cloudflare

The production build is a static Next.js export served by a Cloudflare Worker with Static Assets. The apex domain redirects to `www.pokemonchampions.pro`.

```bash
npm run deploy:cloudflare
```

Use `npm run preview:cloudflare` to build and preview the same Worker locally.

## Content updates

- Pokémon and builds: `data/pokemon.ts`
- Mystery Gift codes: `data/codes.ts`
- Sample teams: `data/teams.ts`

Review all provisional battle data against official information before publishing content updates.
