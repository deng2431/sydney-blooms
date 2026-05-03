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

/* ---- Contact form: submit via API ---- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn       = document.getElementById('contactSubmit');
    const errorBox  = document.getElementById('formError');
    const successBox = document.getElementById('formSuccess');

    // Reset state
    errorBox.style.display  = 'none';
    successBox.style.display = 'none';
    form.querySelectorAll('.form__input, .form__textarea').forEach(f => f.style.borderColor = '');

    // Client-side required check
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--blush)';
        firstInvalid = firstInvalid || field;
      }
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    // Submit
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res  = await fetch('/api/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    form.name.value.trim(),
          email:   form.email.value.trim(),
          phone:   form.phone?.value.trim(),
          subject: form.subject?.value.trim(),
          message: form.message.value.trim(),
        }),
      });
      const json = await res.json();
      if (json.ok) {
        form.reset();
        form.style.display   = 'none';
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        errorBox.textContent  = json.error || 'Something went wrong. Please try again.';
        errorBox.style.display = 'block';
        btn.disabled   = false;
        btn.textContent = 'Send Message';
      }
    } catch {
      errorBox.textContent  = 'Could not reach the server. Please try again later.';
      errorBox.style.display = 'block';
      btn.disabled   = false;
      btn.textContent = 'Send Message';
    }
  });
}
