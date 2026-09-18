# Frost Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One-page static portfolio site (Frost style) for a Roblox artist/builder — hero with particle canvas, skills, filterable work gallery with lightbox, vouch marquee, contact with copy-Discord.

**Architecture:** Three hand-written files do everything: `index.html` (markup + CSP), `css/style.css` (all styling + keyframes), `js/main.js` (renders content out of `js/config.js` and wires interactions). No build step; classic `<script>` tags (NOT ES modules) so the site also works opened straight from disk.

**Tech Stack:** HTML5, CSS3, vanilla JS. Zero libraries, zero runtime third-party requests. Dev-time only: `npx http-server` to serve locally, Playwright MCP browser tools (or a manual browser) to verify.

**Spec:** `docs/superpowers/specs/2026-09-18-portfolio-website-design.md`

## Global Constraints

- Palette tokens exactly: `--bg:#0b0e14` `--bg-2:#10141d` `--card:#151a24` `--line:#232a38` `--ice:#93c5fd` `--silver:#e2e8f0` `--text:#f8fafc` `--muted:#64748b`
- No JS/CSS libraries, no CDNs, no analytics, no external requests at runtime (fonts self-hosted in `assets/fonts/`)
- Classic scripts only — no `type="module"`, no `import` (must work from `file://`)
- The CSP `<meta>` tag from Task 2 must never be weakened or removed
- Continuous/looping animations use only `transform` and `opacity` (discrete hover/state transitions may also transition colors/borders)
- No inline `style=""` attributes in `index.html` (CSP style-src stays `'self'`); JS may set styles via the CSSOM (`el.style.x = …`) which CSP allows
- All external links get `rel="noopener noreferrer"`
- `js/config.js` is the ONLY file the owner edits later — all display content flows from it
- Verification server: `npx --yes http-server -p 8123 -c-1 .` from repo root; test at `http://127.0.0.1:8123`
- Commit after every task; working dir is the repo root `website_building_portoflio`

**How to verify (used by every task):** with the dev server running, use Playwright MCP: `browser_navigate` to `http://127.0.0.1:8123`, `browser_console_messages` (expect zero errors), `browser_evaluate` for behavior checks, `browser_take_screenshot` for visual checks. If Playwright MCP is unavailable, open the URL in a browser and check DevTools console manually.

---

### Task 1: Scaffold — folders, fonts, favicon, placeholder art, content config

**Files:**
- Create: `assets/fonts/` (3 woff2 files, downloaded)
- Create: `assets/favicon.svg`
- Create: `assets/work/placeholder-1.svg` … `placeholder-8.svg` (generated)
- Create: `js/config.js`

**Interfaces:**
- Produces: global `const SITE = {...}` (loaded before `main.js`) with fields: `alias:string`, `tagline:string`, `roles:string`, `commsOpen:bool`, `discord:string`, `email:string`, `socials:[{label,url}]`, `skills:[{name,level,blurb,icon}]`, `projects:[{title,cat,img,blurb}]` (`cat` ∈ `builds|maps|models`), `vouches:[{name,stars,quote,when}]`
- Produces: image paths `assets/work/placeholder-N.svg` referenced by `config.js`

- [ ] **Step 1: Create folders and download fonts** (PowerShell, from repo root)

```powershell
New-Item -ItemType Directory -Force assets/fonts, assets/work, css, js | Out-Null
curl.exe -sL -o assets/fonts/archivo-black-400.woff2 https://cdn.jsdelivr.net/fontsource/fonts/archivo-black@latest/latin-400-normal.woff2
curl.exe -sL -o assets/fonts/inter-400.woff2 https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2
curl.exe -sL -o assets/fonts/inter-700.woff2 https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2
Get-ChildItem assets/fonts | Select-Object Name, Length
```

Expected: 3 files, each > 10,000 bytes. If a download fails (offline), continue — CSS has system-font fallbacks — but note it in the final report.

- [ ] **Step 2: Write `assets/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0b0e14"/><text x="32" y="45" font-family="Arial Black, Arial" font-size="34" font-weight="900" fill="#93c5fd" text-anchor="middle">F</text></svg>
```

- [ ] **Step 3: Generate the 8 placeholder work images** (PowerShell)

```powershell
$items = @(
  @{n=1; t='FROST CASTLE';   c='#16233b'},
  @{n=2; t='NEON ARENA';     c='#101b2e'},
  @{n=3; t='LOST TEMPLE MAP';c='#1a2438'},
  @{n=4; t='CITY BLOCK';     c='#0f1a2c'},
  @{n=5; t='SCI-FI LAB MAP'; c='#132036'},
  @{n=6; t='MEDIEVAL KEEP';  c='#182540'},
  @{n=7; t='WEAPON PACK';    c='#122031'},
  @{n=8; t='VEHICLE MODEL';  c='#152239'}
)
$tpl = @'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{C}"/><stop offset="1" stop-color="#0b0e14"/>
  </linearGradient></defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <circle cx="650" cy="90" r="160" fill="rgba(147,197,253,0.10)"/>
  <circle cx="120" cy="430" r="190" fill="rgba(147,197,253,0.06)"/>
  <text x="400" y="240" text-anchor="middle" font-family="Arial Black, Arial" font-size="44" font-weight="900" fill="#e2e8f0">{T}</text>
  <text x="400" y="285" text-anchor="middle" font-family="Arial" font-size="18" fill="#64748b">placeholder — drop your screenshot here</text>
</svg>
'@
foreach ($i in $items) {
  ($tpl -replace '\{C\}', $i.c) -replace '\{T\}', $i.t | Set-Content -Encoding UTF8 "assets/work/placeholder-$($i.n).svg"
}
Get-ChildItem assets/work
```

Expected: 8 SVG files.

- [ ] **Step 4: Write `js/config.js`** (complete file)

```js
// ============================================================
//  EDIT THIS FILE to update your site — nothing else needed.
//  Swap placeholder images: drop your PNG/JPG in assets/work/
//  and change the img path below.
// ============================================================
const SITE = {
  alias: "FROSTWORKS",            // your name/alias (shows in logo, title, footer)
  roles: "Roblox Artist · Builder · Map Designer",
  tagline: "High-detail builds, maps and models — made to order.",
  commsOpen: true,                // false = hides the badge + flips status to CLOSED

  discord: "yourdiscord",         // what the copy button copies
  email: "you@example.com",
  socials: [
    { label: "Roblox",  url: "https://www.roblox.com/" },
    { label: "X / Twitter", url: "https://x.com/" },
    { label: "YouTube", url: "https://youtube.com/" }
  ],

  skills: [
    { name: "Building",     level: 95, icon: "🏗️", blurb: "Showcase-grade environment builds with proper lighting and detail passes." },
    { name: "Map Design",   level: 90, icon: "🗺️", blurb: "Playable layouts that flow — sightlines, routes and pacing thought through." },
    { name: "3D Modeling",  level: 85, icon: "🧊", blurb: "Clean low-poly to mid-poly assets, optimized for Roblox performance." },
    { name: "Communication",level: 98, icon: "💬", blurb: "Clear updates, honest timelines, revisions handled without drama." }
  ],

  projects: [
    { title: "Frost Castle",   cat: "builds", img: "assets/work/placeholder-1.svg", blurb: "Winter showcase build with custom lighting." },
    { title: "Neon Arena",     cat: "builds", img: "assets/work/placeholder-2.svg", blurb: "PvP arena build, glow-heavy style." },
    { title: "Lost Temple",    cat: "maps",   img: "assets/work/placeholder-3.svg", blurb: "Adventure map with layered routes." },
    { title: "City Block",     cat: "builds", img: "assets/work/placeholder-4.svg", blurb: "Modular city set for an RP game." },
    { title: "Sci-Fi Lab",     cat: "maps",   img: "assets/work/placeholder-5.svg", blurb: "Story map — lab interior, full detail pass." },
    { title: "Medieval Keep",  cat: "maps",   img: "assets/work/placeholder-6.svg", blurb: "Siege map with destructible props." },
    { title: "Weapon Pack",    cat: "models", img: "assets/work/placeholder-7.svg", blurb: "12-piece stylized weapon set." },
    { title: "Vehicle Model",  cat: "models", img: "assets/work/placeholder-8.svg", blurb: "Rigged vehicle, game-ready." }
  ],

  vouches: [
    { name: "blox_dev",     stars: 5, when: "Aug 2026", quote: "Insane quality and finished 2 days early. Instant re-hire." },
    { name: "studio_mike",  stars: 5, when: "Jul 2026", quote: "Best map designer I've commissioned, communication was top tier." },
    { name: "rblx_tycoon",  stars: 5, when: "Jul 2026", quote: "The build straight up carried our game's front page push." },
    { name: "gamedev_ana",  stars: 4, when: "Jun 2026", quote: "Great models, minor revisions handled fast. Recommended." },
    { name: "pixel_wolf",   stars: 5, when: "May 2026", quote: "Understood the vibe from one reference image. Wild." },
    { name: "sky_forge",    stars: 5, when: "Apr 2026", quote: "Fair pricing, clean optimized builds. My go-to now." }
  ]
};
```

- [ ] **Step 5: Verify scaffold**

Run: `Get-ChildItem -Recurse assets, js | Select-Object FullName` — expect favicon, 3 fonts (or noted-missing), 8 work SVGs, config.js. Sanity-parse config: `node -e "const c=require('fs').readFileSync('js/config.js','utf8'); eval(c); console.log(SITE.projects.length, SITE.vouches.length, SITE.skills.length)"` → `8 6 4`.

- [ ] **Step 6: Commit**

```powershell
git add assets js && git commit -m "scaffold: fonts, favicon, placeholder art, content config"
```

---

### Task 2: HTML skeleton + base styles (tokens, nav, hero — static)

**Files:**
- Create: `index.html`
- Create: `css/style.css`

**Interfaces:**
- Consumes: `js/config.js` global `SITE`; font files from Task 1
- Produces: element ids used by `js/main.js` in Tasks 3–5: `nav links burger logo roles tagline badge fx top skillsGrid pills workGrid track status copyDiscord tip mailBtn socials footLine lb lbX lbPrev lbNext lbImg lbTitle lbBlurb lbCat`
- Produces: CSS classes later tasks rely on: `.reveal` (markup hook; animation CSS lands in Task 5), `.wrap .section .alt .label .btn .btn-ice .btn-ghost .pill .work .hide .vouch .marquee .track .lb .open`

- [ ] **Step 1: Write `index.html`** (complete file)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'none'">
<meta name="description" content="Roblox builder, map designer & 3D modeler — portfolio and commissions.">
<title>Portfolio</title>
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<nav class="nav" id="nav">
  <div class="wrap">
    <a href="#top" class="logo" id="logo">FROST<span>WORKS</span></a>
    <ul class="links" id="links">
      <li><a href="#skills">Skills</a></li>
      <li><a href="#work">Work</a></li>
      <li><a href="#vouches">Vouches</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <button class="burger" id="burger" aria-label="menu">☰</button>
  </div>
</nav>

<header class="hero" id="top">
  <canvas id="fx"></canvas>
  <div class="badge" id="badge">OPEN FOR COMMS</div>
  <div class="wrap">
    <p class="kicker reveal" id="roles">Roblox Artist · Builder · Map Designer</p>
    <h1>
      <span class="l1 reveal">Maps.</span><br>
      <span class="l2 reveal" data-delay="1">Models.</span><br>
      <span class="l3 reveal" data-delay="2" data-text="Worlds.">Worlds.</span>
    </h1>
    <p class="sub reveal" data-delay="2" id="tagline">High-detail builds with that glow.</p>
    <div class="cta reveal" data-delay="3">
      <a href="#work" class="btn btn-ice">View Work</a>
      <a href="#contact" class="btn btn-ghost">Hire Me</a>
    </div>
  </div>
</header>

<section class="section" id="skills">
  <div class="wrap">
    <p class="label reveal">What I do</p>
    <h2 class="reveal">Skills</h2>
    <div class="skills-grid" id="skillsGrid"></div>
  </div>
</section>

<section class="section alt" id="work">
  <div class="wrap">
    <p class="label reveal">Portfolio</p>
    <h2 class="reveal">Selected Work</h2>
    <div class="pills reveal" id="pills"></div>
    <div class="work-grid" id="workGrid"></div>
  </div>
</section>

<section class="section" id="vouches">
  <div class="wrap">
    <p class="label reveal">Reviews</p>
    <h2 class="reveal">Client Vouches</h2>
  </div>
  <div class="marquee reveal"><div class="track" id="track"></div></div>
</section>

<section class="section alt contact" id="contact">
  <div class="wrap">
    <p class="label reveal">Get in touch</p>
    <h2 class="reveal">Let's Build Something</h2>
    <div class="status reveal" id="status"><i></i><span>Commissions: OPEN</span></div>
    <div class="contact-btns reveal" data-delay="1">
      <button class="btn btn-ice" id="copyDiscord">💬 Copy my Discord<span class="tip" id="tip">Copied!</span></button>
      <a class="btn btn-ghost" id="mailBtn" href="#">✉️ Email me</a>
    </div>
    <div class="socials reveal" data-delay="2" id="socials"></div>
  </div>
</section>

<footer><span id="footLine"></span></footer>

<div class="lb" id="lb">
  <button class="x" id="lbX" aria-label="close">✕</button>
  <button class="prev" id="lbPrev" aria-label="previous">←</button>
  <button class="next" id="lbNext" aria-label="next">→</button>
  <figure>
    <img id="lbImg" src="assets/work/placeholder-1.svg" alt="">
    <figcaption>
      <div><h3 id="lbTitle"></h3><p id="lbBlurb"></p></div>
      <span class="label" id="lbCat"></span>
    </figcaption>
  </figure>
</div>

<script src="js/config.js"></script>
<script src="js/main.js"></script>
</body>
</html>
```

Note: `js/main.js` doesn't exist yet — that 404 in dev console is expected until Task 3 and is the ONLY acceptable console error for this task.

- [ ] **Step 2: Write `css/style.css`** (complete file — later tasks append to it)

```css
/* Frost portfolio — hand-rolled, no libs */
@font-face { font-family:'Archivo Black'; src:url('../assets/fonts/archivo-black-400.woff2') format('woff2'); font-display:swap; }
@font-face { font-family:'Inter'; src:url('../assets/fonts/inter-400.woff2') format('woff2'); font-weight:400; font-display:swap; }
@font-face { font-family:'Inter'; src:url('../assets/fonts/inter-700.woff2') format('woff2'); font-weight:700; font-display:swap; }

:root {
  --bg:#0b0e14; --bg-2:#10141d; --card:#151a24; --line:#232a38;
  --ice:#93c5fd; --silver:#e2e8f0; --text:#f8fafc; --muted:#64748b;
  --display:'Archivo Black','Arial Black',sans-serif;
  --body:'Inter',system-ui,'Segoe UI',sans-serif;
}

* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { background:var(--bg); color:var(--text); font-family:var(--body); line-height:1.6; overflow-x:hidden; }
img { max-width:100%; display:block; }
a { color:var(--ice); text-decoration:none; }
ul { list-style:none; }
button { font-family:inherit; cursor:pointer; }
section { scroll-margin-top:80px; }
.wrap { max-width:1100px; margin:0 auto; padding:0 24px; }

/* nav */
.nav { position:fixed; top:0; left:0; right:0; z-index:50; border-bottom:1px solid transparent; transition:background .3s ease, border-color .3s ease; }
.nav.scrolled { background:rgba(11,14,20,.82); backdrop-filter:blur(12px); border-color:var(--line); }
.nav .wrap { display:flex; align-items:center; justify-content:space-between; height:68px; }
.logo { font-family:var(--display); font-size:1.05rem; letter-spacing:1px; color:var(--silver); }
.logo span { color:var(--ice); }
.links { display:flex; gap:28px; }
.links a { color:var(--muted); font-size:.9rem; font-weight:700; transition:color .25s; }
.links a:hover, .links a.active { color:var(--ice); }
.burger { display:none; background:none; border:0; color:var(--silver); font-size:1.4rem; }

/* hero */
.hero { min-height:100svh; display:flex; align-items:center; position:relative; overflow:hidden; }
.hero::before, .hero::after { content:''; position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
.hero::before { width:480px; height:480px; background:rgba(147,197,253,.16); top:-140px; right:-120px; }
.hero::after { width:520px; height:520px; background:rgba(100,116,139,.18); bottom:-180px; left:-140px; }
#fx { position:absolute; inset:0; width:100%; height:100%; }
.hero .wrap { position:relative; z-index:2; padding-top:90px; padding-bottom:60px; }
.kicker { color:var(--ice); text-transform:uppercase; letter-spacing:4px; font-size:.8rem; font-weight:700; margin-bottom:18px; }
.hero h1 { font-family:var(--display); text-transform:uppercase; font-size:clamp(3rem,9vw,6.5rem); line-height:.95; }
.hero h1 span { display:inline-block; }
.hero h1 .l1 { color:var(--text); }
.hero h1 .l2 { background:linear-gradient(90deg,var(--ice),var(--silver)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hero h1 .l3 { color:var(--ice); position:relative; }
.hero h1 .l3::after { content:attr(data-text); position:absolute; inset:0; color:var(--ice); filter:blur(16px); animation:glowpulse 3.2s ease-in-out infinite; }
@keyframes glowpulse { 0%,100%{opacity:.35} 50%{opacity:.8} }
.sub { color:var(--muted); font-size:1.05rem; max-width:520px; margin:22px 0 30px; }
.cta { display:flex; gap:14px; flex-wrap:wrap; }

/* buttons */
.btn { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:999px; font-weight:700; font-size:.95rem; border:0; transition:transform .25s ease; }
.btn:hover { transform:translateY(-3px); }
.btn-ice { background:linear-gradient(90deg,var(--ice),var(--silver)); color:#0b0e14; box-shadow:0 0 24px rgba(147,197,253,.35); }
.btn-ghost { background:transparent; border:1px solid var(--line); color:var(--silver); }
.btn-ghost:hover { border-color:var(--ice); }

/* badge */
.badge { position:absolute; top:110px; right:24px; z-index:3; background:linear-gradient(90deg,var(--ice),var(--silver)); color:#0b0e14; font-weight:900; font-size:.75rem; letter-spacing:1px; padding:10px 18px; border-radius:8px; box-shadow:0 0 26px rgba(147,197,253,.45); animation:wobble 5s ease-in-out infinite; }
@keyframes wobble { 0%,100%{transform:rotate(3deg) translateY(0)} 50%{transform:rotate(5deg) translateY(-6px)} }
.badge.hidden { display:none; }

/* section shells */
.section { padding:110px 0; }
.section.alt { background:var(--bg-2); }
.label { color:var(--ice); text-transform:uppercase; letter-spacing:4px; font-weight:700; font-size:.75rem; }
.section h2 { font-family:var(--display); font-size:clamp(1.8rem,4vw,2.6rem); text-transform:uppercase; margin:10px 0 40px; }

footer { border-top:1px solid var(--line); padding:26px 0; text-align:center; color:var(--muted); font-size:.85rem; }
```

- [ ] **Step 3: Start the dev server** (background, keep running for all remaining tasks)

Run: `npx --yes http-server -p 8123 -c-1 .` (run_in_background)

- [ ] **Step 4: Verify**

Navigate to `http://127.0.0.1:8123`. Expect: dark page, fixed nav, huge MAPS./MODELS./WORLDS. headline with gradient middle line and glowing third line, two pill buttons, tilted wobbling badge top-right, empty sections below with labels/headings, no horizontal scrollbar. Console: only the expected `main.js` 404 — nothing else. Screenshot for the record.

- [ ] **Step 5: Commit**

```powershell
git add index.html css && git commit -m "page skeleton + frost base styles (nav, hero, sections)"
```

---

### Task 3: Render everything from config + section styles (full static page)

**Files:**
- Create: `js/main.js`
- Modify: `css/style.css` (append section styles at end)

**Interfaces:**
- Consumes: `SITE` global from `js/config.js`; ids from Task 2
- Produces: functions later tasks extend IN THE SAME FILE: `el(tag, cls, txt)` helper, `render()` (called at bottom of file), `openLb` (declared with `let`; Task 3's version just logs, Task 4 reassigns it). Card elements: `.skill` (has `.meter i` with `--lvl` custom prop set 0–1), `.work[data-cat]`, `.vouch`, pills `.pill[data-cat]`

- [ ] **Step 1: Write `js/main.js`** (complete file at this stage)

```js
// frost portfolio — no libs, just vanilla
const cfg = SITE;
const $ = s => document.querySelector(s);

function el(tag, cls, txt) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
}

let curCat = 'all';

let openLb = p => console.log('lightbox soon:', p.title); // reassigned in a later pass

function render() {
  document.title = cfg.alias + ' — Roblox Builder & Map Designer';
  const a = cfg.alias, half = Math.ceil(a.length / 2);
  const logo = $('#logo');
  logo.textContent = a.slice(0, half);
  logo.append(el('span', null, a.slice(half)));
  $('#roles').textContent = cfg.roles;
  $('#tagline').textContent = cfg.tagline;
  $('#footLine').textContent = '© ' + new Date().getFullYear() + ' ' + a + ' — built from scratch, no templates';

  if (!cfg.commsOpen) {
    $('#badge').classList.add('hidden');
    $('#status').classList.add('closed');
    $('#status span').textContent = 'Commissions: CLOSED';
  }

  // skills
  for (const s of cfg.skills) {
    try {
      const card = el('div', 'skill reveal');
      card.append(el('div', 'ico', s.icon), el('h3', null, s.name), el('p', null, s.blurb));
      const m = el('div', 'meter'), bar = el('i');
      bar.style.setProperty('--lvl', s.level / 100);
      m.append(bar);
      card.append(m);
      $('#skillsGrid').append(card);
    } catch (e) { console.warn('skipped skill', s, e); }
  }

  // gallery pills
  const cats = ['all', ...new Set(cfg.projects.map(p => p.cat))];
  for (const c of cats) {
    const b = el('button', 'pill' + (c === 'all' ? ' active' : ''), c[0].toUpperCase() + c.slice(1));
    b.dataset.cat = c;
    $('#pills').append(b);
  }

  // gallery cards
  for (const p of cfg.projects) {
    try {
      const card = el('div', 'work reveal');
      card.dataset.cat = p.cat;
      const img = el('img');
      img.src = p.img; img.alt = p.title; img.loading = 'lazy';
      img.onerror = () => { img.onerror = null; img.src = 'assets/work/placeholder-1.svg'; };
      const cap = el('div', 'cap');
      cap.append(el('span', null, p.cat), el('h3', null, p.title));
      card.append(img, cap);
      card.onclick = () => openLb(p);
      $('#workGrid').append(card);
    } catch (e) { console.warn('skipped project', p, e); }
  }

  // vouches (twice, for the seamless marquee loop later)
  const vouchCard = v => {
    const c = el('div', 'vouch');
    const top = el('div', 'top');
    const meta = el('div');
    meta.append(el('div', 'name', v.name), el('div', 'when', v.when));
    top.append(el('div', 'avatar', v.name.slice(0, 2).toUpperCase()), meta);
    c.append(top, el('div', 'stars', '★'.repeat(v.stars) + '☆'.repeat(5 - v.stars)));
    c.append(el('p', 'quote', '"' + v.quote + '"'));
    return c;
  };
  for (const v of cfg.vouches) { try { $('#track').append(vouchCard(v)); } catch (e) { console.warn('skipped vouch', v, e); } }
  for (const v of cfg.vouches) { try { $('#track').append(vouchCard(v)); } catch (e) { console.warn('skipped vouch', v, e); } }
  $('#track').style.setProperty('--dur', cfg.vouches.length * 6 + 's');

  // contact
  $('#mailBtn').href = 'mailto:' + cfg.email;
  for (const s of cfg.socials) {
    const link = el('a', null, s.label);
    link.href = s.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    $('#socials').append(link);
  }
}

render();
```

- [ ] **Step 2: Append section styles to `css/style.css`**

```css
/* skills */
.skills-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
.skill { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:24px; transition:transform .3s ease, border-color .3s ease; }
.skill:hover { transform:translateY(-6px); border-color:rgba(147,197,253,.5); }
.skill .ico { font-size:1.7rem; }
.skill h3 { margin:12px 0 6px; font-size:1.05rem; }
.skill p { color:var(--muted); font-size:.88rem; margin-bottom:16px; }
.meter { height:7px; background:var(--bg); border-radius:99px; overflow:hidden; }
.meter i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg,var(--ice),var(--silver)); transform:scaleX(var(--lvl,0)); transform-origin:left; }

/* work gallery */
.pills { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:30px; }
.pill { background:var(--card); border:1px solid var(--line); color:var(--muted); padding:9px 20px; border-radius:999px; font-weight:700; font-size:.85rem; transition:color .25s, background .25s, transform .25s; }
.pill:hover { transform:translateY(-2px); color:var(--silver); }
.pill.active { background:linear-gradient(90deg,var(--ice),var(--silver)); color:#0b0e14; border-color:transparent; }
.work-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.work { position:relative; border-radius:14px; overflow:hidden; border:1px solid var(--line); background:var(--card); cursor:pointer; }
.work.hide { display:none; }
.work img { aspect-ratio:16/10; object-fit:cover; width:100%; transition:transform .5s cubic-bezier(.16,1,.3,1); }
.work:hover img { transform:scale(1.07); }
.work .cap { position:absolute; inset:auto 0 0 0; padding:34px 16px 14px; background:linear-gradient(transparent, rgba(11,14,20,.92)); }
.work .cap h3 { font-size:1rem; }
.work .cap span { color:var(--ice); font-size:.72rem; text-transform:uppercase; letter-spacing:2px; font-weight:700; }
.work::after { content:''; position:absolute; inset:0; border-radius:14px; box-shadow:inset 0 0 0 1px rgba(147,197,253,.6), 0 0 30px rgba(147,197,253,.25); opacity:0; transition:opacity .35s; pointer-events:none; }
.work:hover::after { opacity:1; }

/* vouches */
.marquee { overflow:hidden; padding:6px 0; -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent); mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent); }
.track { display:flex; gap:18px; width:max-content; padding:0 9px; }
.vouch { width:330px; flex:none; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:20px; }
.vouch .top { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
.avatar { width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,var(--ice),#3b5f8f); color:#0b0e14; font-weight:900; font-size:.85rem; display:flex; align-items:center; justify-content:center; }
.vouch .name { font-weight:700; font-size:.95rem; line-height:1.3; }
.vouch .when { color:var(--muted); font-size:.75rem; }
.stars { color:var(--ice); letter-spacing:2px; font-size:.85rem; margin-bottom:8px; }
.vouch .quote { color:var(--muted); font-size:.9rem; }

/* contact */
.contact { text-align:center; }
.contact .label, .contact h2 { text-align:center; }
.status { display:inline-flex; align-items:center; gap:8px; background:var(--card); border:1px solid var(--line); padding:8px 18px; border-radius:999px; font-size:.85rem; font-weight:700; margin-bottom:26px; }
.status i { width:9px; height:9px; border-radius:50%; background:#4ade80; box-shadow:0 0 10px #4ade80; }
.status.closed i { background:#f87171; box-shadow:0 0 10px #f87171; }
.contact-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin:10px 0 26px; }
#copyDiscord { position:relative; }
.tip { position:absolute; top:-42px; left:50%; transform:translateX(-50%) translateY(6px); background:var(--silver); color:#0b0e14; font-size:.75rem; font-weight:700; padding:6px 12px; border-radius:6px; opacity:0; transition:opacity .3s, transform .3s; pointer-events:none; white-space:nowrap; }
.tip.show { opacity:1; transform:translateX(-50%) translateY(0); }
.socials { display:flex; gap:18px; justify-content:center; }
.socials a { color:var(--muted); font-weight:700; font-size:.9rem; transition:color .25s; }
.socials a:hover { color:var(--ice); }

/* lightbox (behavior in a later pass) */
.lb { position:fixed; inset:0; z-index:100; background:rgba(7,9,14,.92); display:flex; align-items:center; justify-content:center; padding:24px; opacity:0; pointer-events:none; transition:opacity .3s; }
.lb.open { opacity:1; pointer-events:auto; }
.lb figure { max-width:900px; width:100%; }
.lb img { width:100%; border-radius:14px; border:1px solid var(--line); }
.lb figcaption { margin-top:14px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px; text-align:left; }
.lb h3 { font-size:1.1rem; }
.lb p { color:var(--muted); font-size:.9rem; }
.lb .x, .lb .prev, .lb .next { position:fixed; background:var(--card); border:1px solid var(--line); color:var(--silver); width:46px; height:46px; border-radius:50%; font-size:1.05rem; transition:transform .25s, border-color .25s; }
.lb .x { top:20px; right:20px; }
.lb .prev { left:16px; top:50%; margin-top:-23px; }
.lb .next { right:16px; top:50%; margin-top:-23px; }
.lb button:hover { transform:scale(1.1); border-color:var(--ice); }
```

- [ ] **Step 3: Verify**

Reload `http://127.0.0.1:8123`. Console: ZERO errors now. Check via `browser_evaluate`:
- `document.querySelectorAll('.skill').length` → 4, `.work` → 8, `.pill` → 4, `.vouch` → 12 (6×2), `#socials a` → 3
- `document.title` starts with `FROSTWORKS`
- every skill meter is filled (static `scaleX(var(--lvl))` — visible bars)
- footer shows alias + year; page has no horizontal overflow: `document.documentElement.scrollWidth <= window.innerWidth`
Screenshot full page.

- [ ] **Step 4: Commit**

```powershell
git add js/main.js css/style.css && git commit -m "render skills/work/vouches/contact from config + section styles"
```

---

### Task 4: Interactions — filters, lightbox, copy button, nav behavior

**Files:**
- Modify: `js/main.js` (replace the `openLb` stub; add interaction code after `render()` call)

**Interfaces:**
- Consumes: `.pill[data-cat]`, `.work[data-cat]` cards, lightbox ids from Task 2, `cfg`, `$`, `curCat`
- Produces: working `openLb(project)`, `closeLb()`, `filterWork(cat, btn)` — Task 5 does not depend on them but the QA task (6) exercises them

- [ ] **Step 1: Append this block at the END of `js/main.js`** (after `render();`). The `openLb` stub from Task 3 stays where it is — the last line of the lightbox block reassigns it:

```js
// ---- work filter ----
function filterWork(cat, btn) {
  curCat = cat;
  document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p === btn));
  document.querySelectorAll('.work').forEach(w => w.classList.toggle('hide', cat !== 'all' && w.dataset.cat !== cat));
}
document.querySelectorAll('.pill').forEach(b => b.onclick = () => filterWork(b.dataset.cat, b));

// ---- lightbox ----
let lbList = [], lbAt = 0;
function shown() { return cfg.projects.filter(p => curCat === 'all' || p.cat === curCat); }

function showLb() {
  const p = lbList[lbAt];
  $('#lbImg').src = p.img;
  $('#lbImg').alt = p.title;
  $('#lbTitle').textContent = p.title;
  $('#lbBlurb').textContent = p.blurb;
  $('#lbCat').textContent = p.cat;
}
function realOpenLb(p) {
  lbList = shown();
  lbAt = Math.max(0, lbList.indexOf(p));
  showLb();
  $('#lb').classList.add('open');
}
openLb = realOpenLb; // replaces the Task 3 stub
function closeLb() { $('#lb').classList.remove('open'); }
function stepLb(d) { lbAt = (lbAt + d + lbList.length) % lbList.length; showLb(); }

$('#lbX').onclick = closeLb;
$('#lbPrev').onclick = () => stepLb(-1);
$('#lbNext').onclick = () => stepLb(1);
$('#lb').onclick = e => { if (e.target === $('#lb')) closeLb(); };
document.addEventListener('keydown', e => {
  if (!$('#lb').classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') stepLb(-1);
  if (e.key === 'ArrowRight') stepLb(1);
});

// ---- copy discord ----
let tipT;
$('#copyDiscord').onclick = async () => {
  try {
    await navigator.clipboard.writeText(cfg.discord);
    $('#tip').classList.add('show');
    clearTimeout(tipT);
    tipT = setTimeout(() => $('#tip').classList.remove('show'), 1600);
  } catch {
    window.prompt('Copy my discord:', cfg.discord);
  }
};

// ---- nav ----
addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > 30), { passive: true });
$('#burger').onclick = () => {
  const open = $('#links').classList.toggle('open');
  $('#burger').textContent = open ? '✕' : '☰';
};
document.querySelectorAll('.links a').forEach(a => a.onclick = () => {
  $('#links').classList.remove('open');
  $('#burger').textContent = '☰';
});
const nio = new IntersectionObserver(es => {
  for (const e of es) if (e.isIntersecting) {
    document.querySelectorAll('.links a').forEach(l =>
      l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach(s => nio.observe(s));
```

- [ ] **Step 2: Verify interactions**

Reload page, console clean, then check:
- Click pill "Maps" → `document.querySelectorAll('.work:not(.hide)').length` → 3, all with `data-cat="maps"`; click "All" → 8 visible
- Click first work card → `#lb` has class `open`, `#lbTitle` text = "Frost Castle"; press ArrowRight → title changes; press Escape → `open` class gone
- Click copy button → tip shows (or prompt appears on non-secure context); clipboard reads back the discord handle where permissions allow
- Scroll down → nav gains `.scrolled`; the matching section link gains `.active`
Screenshot lightbox open.

- [ ] **Step 3: Commit**

```powershell
git add js/main.js && git commit -m "filters, lightbox, copy-discord, nav behavior"
```

---

### Task 5: Motion — scroll reveals, meters, marquee, hero particles, reduced-motion

**Files:**
- Modify: `css/style.css` (append motion styles; EDIT one existing rule)
- Modify: `js/main.js` (append reveal observer + particle canvas)

**Interfaces:**
- Consumes: `.reveal` markup hooks (Task 2/3), `#fx` canvas, `#top` hero, `.track` with `--dur` (Task 3)
- Produces: `.reveal.in` state used by `.skill.in .meter i`

- [ ] **Step 1: Edit `css/style.css`** — replace the existing rule

```css
.meter i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg,var(--ice),var(--silver)); transform:scaleX(var(--lvl,0)); transform-origin:left; }
```

with:

```css
.meter i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg,var(--ice),var(--silver)); transform:scaleX(0); transform-origin:left; transition:transform 1.2s cubic-bezier(.16,1,.3,1) .2s; }
.skill.in .meter i { transform:scaleX(var(--lvl,0)); }
```

- [ ] **Step 2: Append motion styles to `css/style.css`**

```css
/* scroll reveals */
.reveal { opacity:0; transform:translateY(26px); transition:opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1); }
.reveal.in { opacity:1; transform:none; }
.reveal[data-delay="1"] { transition-delay:.12s; }
.reveal[data-delay="2"] { transition-delay:.24s; }
.reveal[data-delay="3"] { transition-delay:.36s; }

/* vouch marquee */
.track { animation:scroll var(--dur,40s) linear infinite; }
.marquee:hover .track { animation-play-state:paused; }
@keyframes scroll { to { transform:translateX(-50%); } }

/* calm everything down for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation:none !important; transition:none !important; }
  .reveal { opacity:1; transform:none; }
  .track { width:auto; flex-wrap:wrap; justify-content:center; }
  .meter i, .skill.in .meter i { transform:scaleX(var(--lvl,1)); }
}
```

- [ ] **Step 3: Append to `js/main.js`**

```js
// ---- scroll reveals ----
const io = new IntersectionObserver(es => {
  for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(n => io.observe(n));

// ---- hero particles ----
(function startFx() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = $('#fx'), ctx = cv.getContext('2d');
  let w, h, raf = 0, running = false;
  const N = innerWidth < 640 ? 30 : 60;
  const parts = [];
  function size() { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight; }
  size();
  addEventListener('resize', size);
  for (let i = 0; i < N; i++) parts.push({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 2 + .6,
    vx: (Math.random() - .5) * .3, vy: -(Math.random() * .35 + .1),
    o: Math.random() * .5 + .15
  });
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = 'rgba(147,197,253,' + p.o + ')';
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  function play() { if (!running) { running = true; tick(); } }
  function stop() { running = false; cancelAnimationFrame(raf); }
  play();
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());
  new IntersectionObserver(es => es[0].isIntersecting ? play() : stop()).observe($('#top'));
})();
```

- [ ] **Step 4: Verify motion**

Reload at the top of the page, console clean, then:
- Hero lines fade/slide in staggered on load; particles drift upward in the hero
- Scroll to skills → cards fade in, meters sweep to their levels (`browser_evaluate`: after scrolling, `.skill.in` count → 4)
- Vouch row auto-scrolls; hovering pauses it
- Scroll far below hero → `requestAnimationFrame` stops (canvas paused — check via `browser_evaluate` twice comparing a frame counter if convenient, else visually)
- Emulate reduced motion (Playwright: `browser_evaluate` can't — instead temporarily toggle via DevTools if manual; otherwise trust the media query and note it)
Screenshot mid-page.

- [ ] **Step 5: Commit**

```powershell
git add css/style.css js/main.js && git commit -m "scroll reveals, meter sweep, vouch marquee, hero particles"
```

---

### Task 6: Responsive + QA pass + README + done

**Files:**
- Modify: `css/style.css` (append responsive rules)
- Modify: `README.md` (replace content)

**Interfaces:**
- Consumes: everything above
- Produces: the finished site

- [ ] **Step 1: Append responsive rules to `css/style.css`**

```css
/* responsive */
@media (max-width:1024px) {
  .skills-grid { grid-template-columns:repeat(2,1fr); }
  .work-grid { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:640px) {
  .burger { display:block; }
  .links { position:fixed; top:68px; left:0; right:0; background:rgba(11,14,20,.97); flex-direction:column; padding:20px 24px; gap:16px; border-bottom:1px solid var(--line); transform:translateY(-130%); transition:transform .35s ease; }
  .links.open { transform:translateY(0); }
  .skills-grid { grid-template-columns:1fr; }
  .work-grid { grid-template-columns:1fr; }
  .badge { top:auto; bottom:24px; right:16px; font-size:.68rem; }
  .section { padding:80px 0; }
  .vouch { width:280px; }
}
```

- [ ] **Step 2: Replace `README.md`**

```markdown
# Frost Portfolio

One-page portfolio site for Roblox building / map design / 3D modeling commissions.
Pure HTML + CSS + vanilla JS — no frameworks, no build step, nothing to install.

## Update your content

Everything editable lives in **`js/config.js`** — name, discord, email, socials,
skills, projects, vouches, and the open/closed commissions switch. Edit, save, refresh.

**Swap in real work images:** drop your screenshot (PNG/JPG) into `assets/work/`
and point the project's `img` at it, e.g. `img: "assets/work/frost-castle.png"`.
Ideal size ~1200×750 (16:10). The placeholder SVGs can be deleted once replaced.

## Run locally

Just open `index.html` in a browser. (Or `npx http-server` for a local server.)

## Deploy (Vercel or Netlify)

1. Push this repo to GitHub
2. vercel.com (or netlify.com) → New project → import the repo
3. Framework preset: **Other / none**. Build command: **empty**. Output dir: **/** (root)
4. Deploy — done. Custom domain optional, HTTPS automatic.
```

- [ ] **Step 3: Full QA sweep**

With the server running:
1. Desktop 1440×900: `browser_resize`, reload, screenshot; console must be clean
2. Tablet 768×1024: resize, screenshot — grids at 2 columns, no horizontal overflow
3. Phone 375×812: resize, screenshot — 1-column grids, burger shows; click burger → menu slides in; click a link → menu closes and page scrolls
4. Re-check: filter → lightbox from a filtered list → arrows stay within filter
5. `document.documentElement.scrollWidth <= window.innerWidth` at all three sizes
6. Check every asset request succeeded (no 404s in network/console)
7. Lighthouse (spec target: mobile Performance ≥ 95): if Chrome is available run it from DevTools → Lighthouse manually, or note in the final report that the owner should run it once — the site ships ~zero JS beyond main.js so the target is expected to pass

- [ ] **Step 4: Fix anything QA found** (repeat Step 3 until clean)

- [ ] **Step 5: Final commit**

```powershell
git add -A && git commit -m "responsive styles + readme"
```

- [ ] **Step 6: Report** — summarize to the user: what was built, how to view it, the config-edit workflow, and next step (push to GitHub → Vercel/Netlify import).
