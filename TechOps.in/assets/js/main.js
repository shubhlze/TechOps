(function () {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Mobile nav toggle
  const navToggle = qs('.nav-toggle');
  const nav = qs('#primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
    // Close nav on link click (mobile)
    qsa('#primary-nav a').forEach((link) =>
      link.addEventListener('click', () => {
        if (getComputedStyle(navToggle).display !== 'none') {
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      })
    );
  }

  // Smooth scrolling for anchor links
  qsa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const el = qs(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Testimonials avatars with initials
  qsa('.avatar').forEach((avatar) => {
    const initials = avatar.getAttribute('data-initials');
    if (initials && !avatar.textContent.trim()) {
      avatar.textContent = initials;
    }
  });

  // Basic client-side form validation
  const form = qs('#contact-form');
  const status = qs('.form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = '';
      const name = qs('#name');
      const email = qs('#email');
      const message = qs('#message');

      const errors = [];
      if (!name.value.trim()) errors.push('Name is required');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.push('Valid email is required');
      if (!message.value.trim()) errors.push('Message is required');

      if (errors.length) {
        status.textContent = errors.join(' • ');
        status.style.color = '#fecdd3';
        return;
      }

      // Placeholder submit
      status.textContent = 'Thanks! Your message has been queued.';
      status.style.color = '#9bb5ff';
      form.reset();
    });
  }
})();


