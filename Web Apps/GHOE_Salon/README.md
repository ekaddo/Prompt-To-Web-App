# Aura Glam — N.C. A&T Homecoming Salon

Originally a full-stack React + Vite + Express + Gemini app (sourced from
[ekaddo/GHOE_Salon](https://github.com/ekaddo/GHOE_Salon)). This folder has two parts:

- **[demo.html](demo.html)** — a single-file, client-side-only clone of the booking wizard, AI style
  consultant, and stylist dashboard. No backend, no API key: the AI consultant uses the same
  fallback recommendation logic the real app falls back to when no `GEMINI_API_KEY` is configured.
  Open it directly in a browser.
- **[source/](source/)** — the real, unmodified app source. To run it for real (including live
  Gemini-powered recommendations):

  ```bash
  cd source
  npm install
  # optional: cp .env.example .env and set GEMINI_API_KEY to get real AI recommendations
  # (it works fine without one — falls back to built-in style logic)
  npm run dev
  ```

- **[ReverseEngineeredPrompt_GHOE_Salon.md](ReverseEngineeredPrompt_GHOE_Salon.md)** — the prompt
  describing the real full-stack app, for pasting into your own model.
