// ── PAGE FADE-IN ──
(function () {
  document.documentElement.style.opacity = '0';
  window.addEventListener('load', () => {
    document.documentElement.style.transition = 'opacity 0.45s ease';
    document.documentElement.style.opacity = '1';
  });
})();

// ── PAGE TRANSITIONS (fade-out on navigate) ──
function initPageTransition() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('javascript') || link.target === '_blank') return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.documentElement.style.opacity = '0';
      setTimeout(() => { location.href = href; }, 420);
    });
  });
}

// ── SCROLL REVEAL ──
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;

  const inViewport = [];
  const offScreen  = [];

  els.forEach(el => {
    const r = el.getBoundingClientRect();
    (r.top < window.innerHeight && r.bottom > 0 ? inViewport : offScreen).push(el);
  });

  // Elementi già visibili: mostra subito senza animazione (double-rAF + force layout)
  inViewport.forEach(el => {
    el.style.transition = 'none';
    el.classList.add('visible');
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight; // forza reflow: il browser "registra" lo stato opacity:1
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { el.style.transition = ''; });
    });
  });

  // Elementi fuori viewport: animazione allo scroll
  if (!offScreen.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  offScreen.forEach(el => io.observe(el));
}

// ── PARALLAX HERO ──
function initParallax() {
  const silhouette = document.querySelector('.hero-silhouette');
  if (!silhouette) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        silhouette.style.transform = `translateY(${y * 0.3}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

// ── LETTER-BY-LETTER TITLE ANIMATION ──
function initLetterAnimation() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  const parts = title.innerHTML.split(/(<br\s*\/?>)/i);
  let delay = 0;
  title.innerHTML = parts.map(part => {
    if (/^<br/i.test(part)) return part;
    const isEm = /^<em>/i.test(part);
    const inner = part.replace(/<\/?em>/gi, '');
    const wrapped = [...inner].map(ch => {
      if (ch === ' ') { delay += 0.01; return ' '; }
      const s = `<span class="letter" style="animation-delay:${delay.toFixed(2)}s">${ch}</span>`;
      delay += 0.04;
      return s;
    }).join('');
    return isEm ? `<em>${wrapped}</em>` : wrapped;
  }).join('');
}

// ── HEADER SCROLL BEHAVIOR ──
function initScrollHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── ACTIVE NAV LINK ──
function initActiveNav() {
  const path = location.pathname;
  document.querySelectorAll('.site-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const page = href.replace(/^\.\.\//, '').split('/')[0];
    if (path.includes(page) && page !== 'index.html') {
      a.classList.add('active');
    }
  });
}

// ── POPOLA GRIGLIA SITI (solo index.html) ──
async function caricaSiti() {
  const griglia = document.getElementById('griglia-siti');
  if (!griglia) return;
  try {
    const res = await fetch('dati/siti.json');
    const siti = await res.json();
    const colori = ['#2196F3', '#4BA535', '#D4841E', '#1C2035', '#1565C0'];

    griglia.innerHTML = siti.map((sito, i) => {
      const c = colori[i % colori.length];
      return `
        <a href="siti/${sito.id}.html" class="sito-card reveal reveal-delay-${i}">
          <div class="sito-card-img" style="background:${c}18">
            <img class="sito-card-foto" src="${sito.copertina}" alt="Disegno del luogo: ${sito.nome}" loading="lazy"
                 onload="this.parentElement.classList.add('has-foto')" onerror="this.remove()">
            <svg class="card-pin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${c}"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
            <span class="card-pin-badge" style="background:${c}" aria-hidden="true"></span>
          </div>
          <div class="sito-card-stripe" style="background:${c}"></div>
          <div class="sito-card-body">
            <span class="sito-card-periodo">${sito.periodo}</span>
            <h3 class="sito-card-nome">${sito.nome}</h3>
            <p class="sito-card-desc">${sito.descrizione}</p>
            <span class="sito-card-cta">Esplora →</span>
          </div>
        </a>`;
    }).join('');

    setTimeout(initReveal, 50);
  } catch (e) {
    console.warn('Impossibile caricare siti.json', e);
  }
}

// ── LINEA DEL TEMPO (pagine luogo) ──
async function caricaTimeline() {
  const cont = document.getElementById('timeline-luogo');
  if (!cont) return;
  const luogo = cont.dataset.luogo;
  try {
    const res = await fetch('../dati/timeline.json');
    const eventi = await res.json();
    cont.innerHTML = eventi.map(ev => {
      const mine = Array.isArray(ev.luoghi) && ev.luoghi.includes(luogo);
      return `
        <div class="tl-item${mine ? ' is-luogo' : ''}">
          <p class="tl-epoca">${ev.epoca}</p>
          <h3 class="tl-titolo">${ev.titolo}${mine ? '<span class="tl-badge">questo luogo</span>' : ''}</h3>
          <p class="tl-testo">${ev.testo}</p>
        </div>`;
    }).join('');
  } catch (e) {
    console.warn('Impossibile caricare timeline.json', e);
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  initReveal();
  initParallax();
  initLetterAnimation();
  initScrollHeader();
  initActiveNav();
  caricaSiti();
  caricaTimeline();
});
