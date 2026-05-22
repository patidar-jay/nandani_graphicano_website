// ── LOADER ──────────────────────────────────────────────
const loader = document.getElementById('loader');
const progress = document.getElementById('loaderProgress');
let pct = 0;
const loadTimer = setInterval(() => {
  pct += Math.random() * 15;
  if (pct >= 100) { pct = 100; clearInterval(loadTimer); setTimeout(() => loader.classList.add('hidden'), 300); }
  progress.style.width = pct + '%';
}, 80);

// ── CUSTOM CURSOR ────────────────────────────────────────
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
  ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
});
document.querySelectorAll('a,button,.wf-btn,.sol-card,.work-item,.testi-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width = '60px'; ring.style.height = '60px'; ring.style.borderColor = 'var(--green-accent)'; });
  el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(134,197,95,0.5)'; });
});

// ── HEADER SCROLL ────────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER / MOBILE MENU ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ── REVEAL ON SCROLL ─────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }});
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

// ── STAT COUNTER ─────────────────────────────────────────
const statNums = document.querySelectorAll('.stat-num');
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = +e.target.dataset.target;
      let curr = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        curr += step;
        if (curr >= target) { curr = target; clearInterval(timer); }
        e.target.textContent = Math.floor(curr).toLocaleString();
        if (target >= 100) e.target.textContent += (target === 40 || target === 98) ? '%' : '+';
      }, 25);
      // animate stat fill bars
      e.target.closest('.stat-card')?.querySelector('.stat-fill')?.style && (e.target.closest('.stat-card').querySelector('.stat-fill').style.width = e.target.closest('.stat-card').querySelector('.stat-fill').getAttribute('style').replace('width:','').replace(';',''));
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObs.observe(n));

// ── STAT BAR ANIMATION ───────────────────────────────────
const statFills = document.querySelectorAll('.stat-fill');
const fillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = e.target.style.width;
      e.target.style.width = '0%';
      setTimeout(() => { e.target.style.width = target; }, 200);
      fillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statFills.forEach(f => { const w = f.style.width; f.style.width = '0%'; fillObs.observe(f); f._target = w; });

// ── WORK FILTER ──────────────────────────────────────────
const wfBtns = document.querySelectorAll('.wf-btn');
const workItems = document.querySelectorAll('.work-item');
wfBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    wfBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workItems.forEach(item => {
      const cat = item.dataset.cat;
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ── FORM SUBMIT ──────────────────────────────────────────
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#25D366';
  setTimeout(() => { btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>'; btn.style.background = ''; e.target.reset(); }, 3000);
}

// ── SMOOTH SECTION TAG REVEAL DELAY ─────────────────────
document.querySelectorAll('.reveal-up').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.1 + 's';
});
