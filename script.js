(() => {
  'use strict';

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const profilePhoto = document.getElementById('profilePhoto');
  const portraitFallback = document.getElementById('portraitFallback');

  // If the remote GitHub avatar cannot load, keep the initials avatar visible.
  if (profilePhoto && portraitFallback) {
    const showFallback = () => {
      profilePhoto.style.display = 'none';
      portraitFallback.style.zIndex = '2';
    };
    profilePhoto.addEventListener('error', showFallback, { once: true });
    if (profilePhoto.complete && profilePhoto.naturalWidth === 0) showFallback();
  }

  // Mobile navigation.
  if (menuToggle && navLinks) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      navLinks.classList.toggle('open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Typewriter role rotator.
  const typedRole = document.getElementById('typedRole');
  const roles = [
    'Cybersecurity Enthusiast',
    'Aspiring SOC Analyst',
    'SOC & Blue Team Learner',
    'Web Application Security',
    'Penetration Testing Learner',
    'Security Research & CTFs'
  ];
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;
  let typeTimer;

  function typeNext() {
    if (!typedRole) return;
    const current = roles[roleIndex];
    if (deleting) {
      characterIndex -= 1;
      typedRole.textContent = current.slice(0, Math.max(0, characterIndex));
      if (characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeTimer = window.setTimeout(typeNext, 300);
        return;
      }
      typeTimer = window.setTimeout(typeNext, 34);
    } else {
      const next = roles[roleIndex];
      characterIndex += 1;
      typedRole.textContent = next.slice(0, characterIndex);
      if (characterIndex >= next.length) {
        deleting = true;
        typeTimer = window.setTimeout(typeNext, 1750);
        return;
      }
      typeTimer = window.setTimeout(typeNext, 58);
    }
  }
  if (typedRole && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typeTimer = window.setTimeout(typeNext, 1750);
  }

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Back-to-top control and active section link.
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  function onScroll() {
    backToTop?.classList.toggle('visible', window.scrollY > 520);
    let current = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 150) current = section.id;
    });
    sectionLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Keep the footer year current.
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Avoid an unused timer when reduced motion is enabled after page load.
  window.addEventListener('pagehide', () => window.clearTimeout(typeTimer), { once: true });
})();
