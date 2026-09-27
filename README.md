# HackCelestial — AI-Powered Hospitality & Travel App

HackCelestial is a React + TypeScript + Vite trip-planning app built for **HackCelestial 3.0**.
It integrates **Nugen Intelligence** for real AI inference, a **Weather-Driven Digital Twin**
simulation engine, live vendor management, and Leaflet-powered dynamic itinerary maps.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| AI / LLM | **Nugen Intelligence** (aligned model), Gemini fallback |
| Map | Leaflet + react-leaflet |
| Database | Supabase (Postgres + Edge Functions) |
| Weather | Open-Meteo API |
| Deployment | **Vercel** (frontend + `/api/llm` serverless function) |

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in your secrets
cp .env.example .env
# Edit .env — add your NUGEN_API_KEY, Supabase keys, etc.

# 3. Start the dev server (hot reload, AI proxy via vite.config.ts middleware)
npm run dev
```

The dev server runs at `http://localhost:5177` (or the next free port).
All `/api/llm` calls are handled by the Vite middleware in `vite.config.ts` — no cold starts.

---

## Nugen Alignment (Optional but Recommended)

To generate a fine-tuned aligned model ID before deploying:

```bash
# Requires NUGEN_API_KEY in your .env
npx tsx scripts/nugen-align.ts
```

This uploads the training corpus, creates an alignment project, polls until `READY`,
and writes `NUGEN_ALIGNED_MODEL_ID` into your `.env` automatically.
Use that ID in the Vercel dashboard for the sharpest inference responses.

---

## Deployment (Vercel)

### 1. Connect the repo
Import this GitHub repo into [vercel.com](https://vercel.com). Vercel auto-detects Vite
and the `api/` folder (no `vercel.json` needed).

### 2. Set Environment Variables in Vercel

> ⚠️ Local `.env` files are **never** uploaded to Vercel.  
> You must add secrets manually in: **Project → Settings → Environment Variables**

| Variable | Required | Description |
|---|---|---|
| `NUGEN_API_KEY` | ✅ Yes | Nugen Intelligence API key — enables real AI inference |
| `NUGEN_ALIGNED_MODEL_ID` | Recommended | Fine-tuned model ID from `scripts/nugen-align.ts` |
| `NUGEN_BASE_MODEL` | Optional | Base model fallback (default: `qwen-v2p5-0p5b-instruct`) |
| `LLM_PROVIDER` | Optional | `nugen` / `gemini` / `grok` (default: `nugen`) |
| `VITE_SUPABASE_URL` | For DB | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | For DB | Supabase anon/public key |

Without `NUGEN_API_KEY`, all AI features on the live site fall back silently to
deterministic placeholder text.

### 3. Deploy
Push to `main` — Vercel auto-redeploys on every push.

The `/api/llm` serverless function (`api/llm.ts`) handles all Nugen inference requests
in production, exactly matching the local Vite proxy behavior.

---

## Architecture — AI Proxy

```
Browser  →  fetch('/api/llm', { task, payload })
               │
               ├─ Local dev  →  vite.config.ts llmProxyPlugin  →  Nugen API
               └─ Production →  api/llm.ts (Vercel serverless) →  Nugen API
                                                                    ↓ fallback
                                                               Gemini / Grok
                                                                    ↓ fallback
                                                            deterministic text
```

---

## AI Features Powered by Nugen Intelligence

1. **Natural Language Search** — parse free-text queries into filter intents
2. **Itinerary Narration** — editorial 3-sentence tour walkthrough
3. **Adaptation Explanation** — polite disruption notices for route changes
4. **Stop Swap Reasoning** — cultural-fit rationale for itinerary substitutions
5. **Vendor Copy Assistant** — authentic listing descriptions from rough notes
6. **Demand Insight Synthesis** — strategic merchant takeaways from search signals
7. **Digital Twin Weather Insight** — cascade impact analysis under weather simulations

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server with AI proxy |
| `npm run build` | Production build (runs `tsc -b` then Vite) |
| `npm run lint` | Lint with Oxlint |
| `npx tsx scripts/nugen-align.ts` | Run Nugen alignment pipeline |
