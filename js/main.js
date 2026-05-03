/* ============================================================
   SYDNEY BLOOMS — Main JS
   ============================================================ */

/* ---- Nav: scroll state ---- */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Nav: mobile toggle ---- */
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Active nav link ---- */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ---- Hero: subtle Ken Burns on load ---- */
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('load', () => hero.classList.add('loaded'));
}

/* ---- Scroll reveal ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Contact form: basic client-side validation ---- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--blush)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    if (!valid) {
      e.preventDefault();
      form.querySelector('[required]:invalid, [required]')?.focus();
    }
  });
}
