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
