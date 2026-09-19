// frost portfolio — vanilla, no libs
const cfg = SITE;
const works = [...cfg.projects, ...(cfg.moreBuilds || [])];
const $ = s => document.querySelector(s);

function el(tag, cls, txt) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
}

function render() {
  document.title = cfg.alias + ' — Roblox Builder & Map Designer';
  const initials = cfg.alias.slice(0, 2).toUpperCase();
  $('#ava').textContent = initials;
  $('#footAva').textContent = initials;
  $('#navAlias').textContent = cfg.alias;
  $('#footAlias').textContent = cfg.alias;
  $('#kicker').textContent = cfg.roles;
  if (cfg.headline1) $('#h1a').textContent = cfg.headline1;
  if (cfg.headline2) $('#h1b').textContent = cfg.headline2;
  $('#tagline').textContent = cfg.tagline;
  $('#footLine').textContent = '© ' + new Date().getFullYear() + ' ' + cfg.alias + ' — built from scratch, no templates';

  if (!cfg.commsOpen) {
    $('#statusChip').classList.add('hidden');
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

  // work rows
  cfg.projects.forEach((p, i) => {
    try {
      const row = el('div', 'workrow reveal');
      const media = el('div', 'media');
      const img = el('img');
      img.src = p.img; img.alt = p.title;
      img.onerror = () => { img.onerror = null; img.src = 'assets/work/placeholder-1.svg'; };
      media.append(img);
      media.onclick = () => openLb(i);
      const info = el('div', 'info');
      info.append(el('span', 'tag', p.cat), el('h3', null, p.title), el('p', null, p.blurb));
      const btn = el('button', 'pillbtn', 'View full size');
      btn.onclick = () => openLb(i);
      info.append(btn);
      row.append(media, info);
      $('#workRows').append(row);
    } catch (e) { console.warn('skipped project', p, e); }
  });

  // more builds mini grid
  (cfg.moreBuilds || []).forEach((p, j) => {
    try {
      const card = el('div', 'mini reveal');
      const imWrap = el('div', 'mini-img');
      const img = el('img');
      img.src = p.img; img.alt = p.title;
      img.onerror = () => { img.onerror = null; img.src = 'assets/work/placeholder-1.svg'; };
      imWrap.append(img);
      card.append(imWrap, el('h3', null, p.title));
      card.onclick = () => openLb(cfg.projects.length + j);
      $('#miniGrid').append(card);
    } catch (e) { console.warn('skipped mini', p, e); }
  });
  const xSocial = cfg.socials.find(s => /twitter/i.test(s.label) || s.label.trim().toLowerCase().startsWith('x'));
  const xcard = el('a', 'xcard reveal');
  xcard.href = xSocial ? xSocial.url : 'https://x.com/';
  xcard.target = '_blank'; xcard.rel = 'noopener noreferrer';
  xcard.append(el('span', 'xmark', '𝕏'), el('div', 'xtitle', 'View More on X →'), el('div', 'xsub', 'New work posted regularly'));
  $('#miniGrid').append(xcard);

  // worked-with groups strip
  for (const g of (cfg.groups || [])) {
    try {
      const a = el('a', 'gcard reveal');
      a.href = g.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      const ic = el('img', 'gicon');
      ic.src = g.icon; ic.alt = g.name;
      ic.onerror = () => ic.remove();
      const meta = el('div');
      const nm = el('div', 'gname', g.name);
      if (g.verified) nm.append(el('span', 'gcheck', ' ✓'));
      meta.append(nm, el('div', 'gmem', g.members + ' members'));
      a.append(ic, meta);
      $('#groupsRow').append(a);
    } catch (e) { console.warn('skipped group', g, e); }
  }

  // vouches (twice for seamless loop)
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
  if (!cfg.vouches.length) {
    $('#vouches').style.display = 'none';
    document.querySelectorAll('a[href="#vouches"]').forEach(a => a.parentElement.style.display = 'none');
  }

  // contact
  $('#mailBtn').href = 'mailto:' + cfg.email;
  for (const s of cfg.socials) {
    const link = el('a', null, s.label);
    link.href = s.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    $('#socials').append(link);
  }
}
render();

// ---- lightbox ----
let at = 0;
function showLb() {
  const p = works[at];
  $('#lbImg').src = p.img;
  $('#lbImg').alt = p.title;
  $('#lbTitle').textContent = p.title;
  $('#lbBlurb').textContent = p.blurb;
  $('#lbCat').textContent = p.cat;
}
function openLb(i) { at = i; showLb(); $('#lb').classList.add('open'); }
function closeLb() { $('#lb').classList.remove('open'); }
function stepLb(d) { at = (at + d + works.length) % works.length; showLb(); }

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
document.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => {
  $('#links').classList.remove('open');
  $('#burger').textContent = '☰';
}));
const nio = new IntersectionObserver(es => {
  for (const e of es) if (e.isIntersecting) {
    document.querySelectorAll('.navlink').forEach(l =>
      l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id], header[id]').forEach(s => nio.observe(s));

// ---- scroll reveals ----
const io = new IntersectionObserver(es => {
  for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(n => io.observe(n));

// ---- typewriter line ----
(function () {
  const t = $('#typed');
  if (!t) return;
  const phrases = cfg.typerPhrases || ['Open for commissions'];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t.textContent = phrases[0]; return; }
  let pi = 0, ci = 0, del = false;
  function step() {
    const p = phrases[pi];
    if (!del) {
      ci++;
      t.textContent = p.slice(0, ci);
      if (ci === p.length) { del = true; return setTimeout(step, 2300); }
      return setTimeout(step, 45 + Math.random() * 45);
    }
    ci--;
    t.textContent = p.slice(0, ci);
    if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; return setTimeout(step, 400); }
    setTimeout(step, 20);
  }
  step();
})();

// ---- starfield ----
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = $('#stars'), ctx = cv.getContext('2d');
  let w, h, raf = 0, running = false, t = 0;
  function size() { w = cv.width = innerWidth; h = cv.height = innerHeight; }
  size();
  addEventListener('resize', size);
  const N = innerWidth < 640 ? 60 : 130;
  const stars = [];
  for (let i = 0; i < N; i++) stars.push({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + .3,
    tw: Math.random() * 6.28,
    sp: Math.random() * .5 + .2
  });
  function tick() {
    t += .016;
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const o = .2 + .5 * Math.abs(Math.sin(t * s.sp + s.tw));
      ctx.beginPath();
      ctx.arc(s.x * w, (s.y * h + t * 6 * s.sp) % h, s.r, 0, 7);
      ctx.fillStyle = 'rgba(196,222,255,' + o + ')';
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  function play() { if (!running) { running = true; tick(); } }
  function stop() { running = false; cancelAnimationFrame(raf); }
  play();
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());
})();
