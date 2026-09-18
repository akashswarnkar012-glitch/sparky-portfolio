# Portfolio Website — Design Spec

**Date:** 2026-09-18
**For:** Roblox Studio artist — builder, map designer, 3D modeler, commissions
**Status:** Approved direction (Frost style, one-page scroll, pure static stack)

## Overview

A one-page portfolio website showcasing Roblox building/map-design/3D-modeling work,
with vouches and contact details, aimed at landing commissions. Shared as a single
link (Discord bios, server posts). Built as a fully static site — no frameworks, no
build step, no backend — for maximum speed and security.

## Goals

- Look high-end: bold, animated, glowing "Frost" aesthetic
- Feel smooth: 60fps animations, instant load, no jank on mid-range phones
- Be secure: zero attack surface (static files only, no third-party scripts)
- Be easy to update: all real content lives in one config file the owner edits

## Non-Goals

- No CMS, no admin panel, no database
- No contact form (Discord/email buttons instead — owner's choice)
- No analytics or tracking
- No multi-page routing

## Visual Design

**Style:** "Frost" — blend of neon-dark and bold game-artist energy, chosen via
mockups.

**Palette (CSS custom properties):**

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#0b0e14` | page background |
| `--bg-2` | `#10141d` | section alt background |
| `--card` | `#151a24` | card surfaces |
| `--line` | `#232a38` | borders |
| `--ice` | `#93c5fd` | primary accent (glow, links, highlights) |
| `--silver` | `#e2e8f0` | secondary accent / bright text |
| `--text` | `#f8fafc` | headings |
| `--muted` | `#64748b` | body/secondary text |

**Typography:** Self-hosted WOFF2 fonts (downloaded once during setup, served from
`/assets/fonts/` — no runtime requests to Google): a heavy display font
(Archivo Black or similar) for chunky uppercase headlines, a clean sans
(Inter or similar) for body. System-font fallback stack.

**Signature elements:** tilted sticker badge ("OPEN FOR COMMS"), ice-glow shadows,
glassy cards, gradient ice→silver text on key words.

## Architecture

```
/ (repo root)
├── index.html          # all markup, CSP meta tag
├── css/style.css       # all styles + keyframe animations
├── js/config.js        # CONTENT CONFIG — the only file the owner edits
├── js/main.js          # rendering, animations, interactions
├── assets/
│   ├── fonts/          # self-hosted woff2
│   └── work/           # project images (placeholder SVGs initially)
├── docs/superpowers/specs/  # this spec
└── README.md           # how to edit content + deploy
```

- `config.js` exports one object: alias, tagline, roles, discord handle, email,
  socials, commission status (open/closed), skills list, projects list
  (title, category, image path, blurb), vouches list (name, avatar, stars, quote).
- `main.js` renders gallery/vouches from config at load, then wires up
  interactions. No innerHTML from any external source — config is local and
  rendering uses DOM APIs / escaped text, so no XSS vector.
- Placeholder images are local generated SVGs (labeled "YOUR BUILD HERE") so the
  site works offline and swapping = dropping a PNG in `assets/work/` and
  updating one config line.

## Page Sections

1. **Hero** — full-viewport. Canvas ice-particle drift background (capped particle
   count, pauses when tab hidden). Chunky 3-line headline (MAPS. / MODELS. /
   WORLDS.) with staggered entrance + glow, alias + roles line, two CTAs
   (View Work → scrolls to gallery; Hire Me → scrolls to contact), tilted
   OPEN FOR COMMS badge (hidden automatically if config says closed).
2. **Skills** — 4 cards (Building, Map Design, 3D Modeling, Communication) with
   icon, blurb, and a skill meter that animates to its level on first scroll into
   view.
3. **Work Gallery** — filter pills (All / Builds / Maps / Models) + responsive
   grid of 8 placeholder project cards. Hover: image zoom + frost glow.
   Click: fullscreen lightbox with title/blurb, Esc/backdrop closes, arrow keys
   navigate.
4. **Vouches** — auto-scrolling marquee of Discord-style review cards (avatar,
   name, stars, quote), pauses on hover; falls back to static grid when
   reduced-motion is set.
5. **Contact** — big "Copy my Discord" button (clipboard write + "Copied!" pop
   animation), email button (mailto), socials row, commission-status pill.
   Footer with alias + year.

Sticky top nav (logo/alias + section links) smooth-scrolls; highlights the active
section while scrolling; collapses to a hamburger on mobile.

## Animations & Performance

- Only `transform` and `opacity` are animated (GPU-composited; no layout thrash)
- Scroll reveals via one `IntersectionObserver`; elements get a `.in` class
- Hero canvas: requestAnimationFrame loop, ~60 particles desktop / ~30 mobile,
  stops when tab is hidden or hero is scrolled out
- `prefers-reduced-motion`: all non-essential animation disabled
- Images `loading="lazy"` below the fold; no JS/CSS libraries; single CSS +
  two JS files
- Target: Lighthouse Performance ≥ 95 on mobile

## Security

- Static files only — no server code, no database, no login
- Zero third-party requests at runtime (fonts self-hosted, no CDNs, no analytics)
- CSP `<meta>` tag: `default-src 'self'` (plus `style-src 'self' 'unsafe-inline'`
  only if needed for the lightbox — prefer none)
- All external links (`socials`) use `rel="noopener noreferrer"`
- No user input is stored or executed; clipboard API only writes
- HTTPS enforced by host (Vercel/Netlify default)

## Responsive

Breakpoints at ~640px and ~1024px. Gallery: 1 col → 2 col → 3 col. Hero text
scales with `clamp()`. Nav collapses to hamburger below 640px. Touch targets
≥ 44px.

## Error Handling

- Config rendering wrapped so a bad config entry skips that item and logs a
  console warning instead of blanking the page
- Clipboard API failure falls back to a prompt showing the handle to copy
  manually
- Missing project image shows the placeholder SVG via `onerror` fallback

## Testing

- Playwright pass: load page, zero console errors, filter buttons work, lightbox
  opens/closes, copy button fires, screenshots at 375px / 768px / 1440px widths
- Manual visual check by the owner in their browser
- Lighthouse run for the performance target

## Deployment

Push to GitHub → connect repo to Vercel or Netlify (no build command, publish
root). Until then, `index.html` opens directly from disk. README documents both
the deploy steps and the "edit config.js to update content" workflow.
