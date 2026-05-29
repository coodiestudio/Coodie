/* ── NAV SCROLL ── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── HAMBURGER / MOBILE NAV ── */
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobile-overlay');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  mobileOverlay.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMobile() {
  hamburger.classList.remove('is-open');
  mobileOverlay.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
window.closeMobile = closeMobile;

/* ── SMOOTH SCROLL (offset for fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMobile();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => {
  /* Hero elements are handled by CSS keyframe animation — skip observer */
  if (el.closest('.hero')) return;
  revealObs.observe(el);
});

/* ── CONTACT FORM — Formspree ── */
const form      = document.getElementById('contact-form');
const success   = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');
const submitLbl = document.getElementById('submit-lbl');

if (form) {
  form.querySelectorAll('.form-input, .form-textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nameEl    = form.querySelector('#name');
    const emailEl   = form.querySelector('#email');
    const messageEl = form.querySelector('#message');
    let valid = true;

    [nameEl, emailEl, messageEl].forEach(field => {
      if (!field.value.trim()) { field.classList.add('error'); valid = false; }
    });
    if (!valid) { form.querySelector('.error').focus(); return; }

    submitBtn.disabled    = true;
    submitLbl.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });

      if (res.ok) {
        form.style.display    = 'none';
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('error');
      }
    } catch {
      /* Fallback mailto */
      const sub  = encodeURIComponent('Brief — ' + nameEl.value);
      const body = encodeURIComponent(
        `Name: ${nameEl.value}\nEmail: ${emailEl.value}\n\n${messageEl.value}`
      );
      window.location.href = `mailto:hello@coodie.studio?subject=${sub}&body=${body}`;
      submitBtn.disabled    = false;
      submitLbl.textContent = 'Send Brief →';
    }
  });
}
