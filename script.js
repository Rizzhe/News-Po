/* =========================================================
   THE WIRE DESK — shared behavior across all pages
   ========================================================= */

/* ---------- Mobile nav toggle ---------- */
function initNav(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.header-right nav');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', ()=>{
    nav.classList.toggle('open');
    toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      nav.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

/* ---------- Live clock / dateline (data-clock="key") ---------- */
function updateClock(){
  const now = new Date();
  const weekdayShort = now.toLocaleDateString(undefined,{weekday:'short'}).toUpperCase();
  const weekdayFull = now.toLocaleDateString(undefined,{weekday:'long'});
  const dateShort = now.toLocaleDateString(undefined,{day:'2-digit', month:'short', year:'numeric'});
  const dateFull = now.toLocaleDateString(undefined,{day:'2-digit', month:'long', year:'numeric'});
  const time = now.toLocaleTimeString(undefined,{hour:'2-digit', minute:'2-digit', second:'2-digit'});
  const year = now.getFullYear();

  const map = {
    'weekday-short': weekdayShort,
    'weekday-full': weekdayFull,
    'date-short': dateShort,
    'date-full': dateFull,
    'time': time,
    'year': year,
    'updated': 'Updated ' + time
  };
  document.querySelectorAll('[data-clock]').forEach(el=>{
    const key = el.getAttribute('data-clock');
    if(map[key] !== undefined) el.textContent = map[key];
  });
}

/* ---------- Scroll-triggered reveal ---------- */
function observeReveals(){
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>io.observe(el));
}

/* ---------- Ticker ---------- */
function initTicker(items){
  const track = document.getElementById('tickerTrack');
  if(!track || !items || !items.length) return;
  const doubled = [...items, ...items];
  track.innerHTML = doubled.map(t=>`<span>${t}</span><span class="sep">///</span>`).join('');
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress(){
  const bar = document.querySelector('.scroll-progress');
  if(!bar) return;
  const onScroll = ()=>{
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = max > 0 ? (scrolled / max * 100) + '%' : '0%';
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ---------- Back to top button ---------- */
function initBackToTop(){
  const btn = document.querySelector('.back-to-top');
  if(!btn) return;
  document.addEventListener('scroll', ()=>{
    btn.classList.toggle('show', window.scrollY > 480);
  }, {passive:true});
  btn.addEventListener('click', ()=>{
    window.scrollTo({top:0, behavior:'smooth'});
  });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  initNav();
  updateClock();
  setInterval(updateClock, 1000);
  observeReveals();
  initScrollProgress();
  initBackToTop();

  // mark current nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[href]').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('current');
  });
});

/* expose for pages that render content dynamically (e.g. news grid) */
window.WireDesk = { observeReveals, initTicker };
