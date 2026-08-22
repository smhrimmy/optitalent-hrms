# OptiTalent design system

Product: a personnel file, not a purple SaaS marketing site.

- Display: Fraunces (`font-headline`)
- Body: Source Sans 3 (`font-body`)
- Mono: IBM Plex Mono (`font-code`)
- Color: forest ink on paper (`design-tokens.json` → CSS variables in `src/app/globals.css`)
- Radius: 6px. No glassmorphism, no Inter+violet defaults.
- Motion: press on buttons (`.ot-press`), route bar, logo loader. Respects `prefers-reduced-motion`.
- Empty: `src/components/empty-state.tsx`
- Errors: `src/components/errors/` and `/errors/{code}`, `/offline`, `/session-expired`, etc.

Self-critique: the memorable element is the file-folder metaphor (Fraunces + forest stamp), not a gradient hero.
