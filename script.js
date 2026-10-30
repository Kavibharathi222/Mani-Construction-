/* ============================================
   BUILDRIGHT CONSTRUCTIONS – script.js
   ============================================ */

(function () {
  'use strict';

  /* ------- Navbar Scroll Behaviour ------- */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load

  /* ------- Active Nav Link on Scroll ------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ------- Hamburger / Mobile Menu ------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ------- Smooth Scroll for all anchor links ------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ------- Scroll Reveal Animation ------- */
  const revealElements = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ------- Hero Image Ken Burns ------- */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
    if (heroImg.complete) heroImg.classList.add('loaded');
  }

  /* ------- Animated Counters ------- */
  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    el.textContent = '0' + suffix;

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + '+' + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;
    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      const targets = [200, 20, 500];
      counters.forEach((counter, i) => {
        setTimeout(() => animateCounter(counter, targets[i] || 0), i * 200);
      });
    }
  }

  window.addEventListener('scroll', startCounters, { passive: true });
  setTimeout(startCounters, 800); // Try on load too

  /* ------- Contact Form → WhatsApp ------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  // ✏️ Replace this with Mani's actual WhatsApp number (country code + number, no + or spaces)
  const WHATSAPP_NUMBER = '919385960565';

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      /* --- Validate required fields --- */
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#e53935';
          field.style.boxShadow = '0 0 0 4px rgba(229,57,53,0.12)';
          valid = false;
        }
      });

      if (!valid) {
        const firstError = contactForm.querySelector('[style*="e53935"]');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      /* --- Collect form values --- */
      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const projectType = document.getElementById('projectType').value.trim();
      const message = document.getElementById('message').value.trim();

      /* --- Build a clean, formatted WhatsApp message --- */
      let waMsg = '';
      waMsg += '🏗️ *New Project Enquiry – Mani Construction*\n';
      waMsg += '─────────────────────────\n';
      waMsg += `👤 *Name:* ${name}\n`;
      waMsg += `📞 *Phone:* ${phone}\n`;
      if (email) {
        waMsg += `✉️ *Email:* ${email}\n`;
      }
      waMsg += `🔨 *Project Type:* ${projectType}\n`;
      waMsg += '─────────────────────────\n';
      waMsg += `📝 *Details:*\n${message}\n`;
      waMsg += '─────────────────────────\n';
      waMsg += '_Sent via Mani Construction website_';

      /* --- Show button loading state briefly --- */
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');

      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';

      setTimeout(() => {
        /* --- Open WhatsApp with pre-filled message --- */
        const encodedMsg = encodeURIComponent(waMsg);
        const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
        window.open(waURL, '_blank');

        /* --- Reset button & show success --- */
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';

        if (formSuccess) {
          formSuccess.style.display = 'block';
          contactForm.reset();
          // Clear any error highlights
          contactForm.querySelectorAll('input, select, textarea').forEach(f => {
            f.style.borderColor = '';
            f.style.boxShadow = '';
          });
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => { formSuccess.style.display = 'none'; }, 7000);
        }
      }, 800);
    });

    /* --- Clear error highlight on input --- */
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      });
    });
  }

  /* ------- WhatsApp Float: Show/Hide ------- */
  const whatsappFloat = document.getElementById('whatsappFloat');
  function toggleWhatsAppFloat() {
    if (!whatsappFloat) return;
    if (window.scrollY > 400) {
      whatsappFloat.style.opacity = '1';
      whatsappFloat.style.pointerEvents = 'auto';
      whatsappFloat.style.transform = 'scale(1)';
    } else {
      whatsappFloat.style.opacity = '0';
      whatsappFloat.style.pointerEvents = 'none';
      whatsappFloat.style.transform = 'scale(0.8)';
    }
  }

  if (whatsappFloat) {
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.pointerEvents = 'none';
    whatsappFloat.style.transform = 'scale(0.8)';
    whatsappFloat.style.transition = 'opacity 0.4s ease, transform 0.4s ease, background 0.3s ease, box-shadow 0.3s ease';
    window.addEventListener('scroll', toggleWhatsAppFloat, { passive: true });
  }

  /* ------- Service cards: stagger on load ------- */
  const serviceCards = document.querySelectorAll('.service-card, .service-cta-card');
  serviceCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
  });

  /* ------- Navbar link click → close mobile menu, scroll ------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) closeMenu();
    });
  });

  /* ------- Project image reveal on intersection ------- */
  document.querySelectorAll('.project-card').forEach(card => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        io.unobserve(card);
      }
    }, { threshold: 0.1 });
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    io.observe(card);
  });

  /* ------- Console signature ------- */
  console.log(
    '%cMani Construction 🏗️\nBuilding your dream, with my own hands.',
    'color: #A07850; font-size: 14px; font-weight: bold;'
  );

})();
