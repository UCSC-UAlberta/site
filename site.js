// Mobile menu
const toggle = document.getElementById('menuToggle');
const links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Fade-in on scroll (skipped when the visitor prefers reduced motion)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  items.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  items.forEach(el => observer.observe(el));
}

// Google Calendar embed: month view on wide screens, agenda list on phones
const cal = document.getElementById('calendar');
if (cal) {
  const id = cal.dataset.calendarId.trim();
  const frame = document.getElementById('calendarFrame');
  const empty = document.getElementById('calendarEmpty');
  if (!id) {
    empty.hidden = false;
  } else {
    const narrow = window.matchMedia('(max-width: 768px)');
    const setSrc = () => {
      const p = new URLSearchParams({
        src: id,
        ctz: cal.dataset.timezone || 'America/Edmonton',
        mode: narrow.matches ? 'AGENDA' : 'MONTH',
        showTitle: '0', showPrint: '0', showCalendars: '0', showTz: '0',
        wkst: '1', bgcolor: '#FFFFFF', color: '#5C9812'
      });
      frame.src = 'https://calendar.google.com/calendar/embed?' + p.toString();
    };
    // The embed pulls in ~500 KB of Google scripts, so only load it once the
    // visitor scrolls near the events section.
    const load = () => {
      setSrc();
      narrow.addEventListener('change', setSrc);
    };
    frame.hidden = false;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) { io.disconnect(); load(); }
      }, { rootMargin: '600px 0px' });
      io.observe(cal);
    } else {
      load();
    }
  }
}
