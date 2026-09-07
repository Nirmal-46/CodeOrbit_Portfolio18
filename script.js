/**
 * ============================================================
 *  NIRMAL C — PORTFOLIO  |  script.js
 *  Handles: cursor glow, particles, dark/light mode, navbar,
 *  typewriter, scroll reveal, skill tabs, project filter,
 *  floating icons, contact form, triple-click admin, admin dashboard
 * ============================================================
 */

'use strict';

/* ── Utility: Check reduced motion preference ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════════════
   1. DARK / LIGHT MODE
══════════════════════════════════════════════════════ */
(function initTheme() {
  const stored = localStorage.getItem('portfolio-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);

  const icon = document.getElementById('theme-icon');
  const mobileFooter = document.querySelector('.nav-mobile-footer');

  if (theme === 'dark') {
    if (icon) { icon.className = 'bi bi-moon-stars-fill'; }
    if (mobileFooter) mobileFooter.innerHTML = '<i class="bi bi-moon-stars-fill" style="color:var(--accent-b)"></i> Dark mode active';
  } else {
    if (icon) { icon.className = 'bi bi-sun-fill'; }
    if (mobileFooter) mobileFooter.innerHTML = '<i class="bi bi-sun-fill" style="color:#f59e0b"></i> Light mode active';
  }
}

document.addEventListener('DOMContentLoaded', function () {

  /* Sync icon on load */
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(currentTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(t);
    });
  }

  /* ══════════════════════════════════════════════════════
     2. UNIQUE CUSTOM CYBER LASER POINTER & GLOW (Desktop)
  ══════════════════════════════════════════════════════ */
  const customCursor = document.getElementById('custom-cursor');
  const cursorGlow   = document.getElementById('cursor-glow');

  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX, glowY = mouseY;
    let isVisible = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        glowX = mouseX;
        glowY = mouseY;
        if (customCursor) customCursor.style.opacity = '1';
        if (cursorGlow) cursorGlow.style.opacity = '1';
      }

      // Gradient pointer tracks cursor tip instantly with zero latency
      if (customCursor) {
        customCursor.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 1}px, 0)`;
      }
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      if (customCursor) customCursor.style.opacity = '0';
      if (cursorGlow) cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      if (customCursor) customCursor.style.opacity = '1';
      if (cursorGlow) cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mousedown', () => {
      if (customCursor) customCursor.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
      if (customCursor) customCursor.classList.remove('clicking');
    });

    // 60-120fps GPU-accelerated smooth ambient glow trail loop
    (function animateAmbientTrail() {
      if (isVisible) {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        if (cursorGlow) {
          cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
        }
      }
      requestAnimationFrame(animateAmbientTrail);
    })();

    /* Interactive element triggers for custom pointer transformation */
    const interactiveTargets = 'a, button, input, textarea, select, #display-name, .hero-name, .nav-logo, .glass-card, .skill-card, .project-card, .float-icon, .ambient-badge, .cyber-orb, .hero-iam-tag, .hud-status-badge, .social-icon-link, .theme-toggle, .interest-tag, .btn-cert-view';
    document.querySelectorAll(interactiveTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (customCursor) customCursor.classList.add('hovered');
        if (cursorGlow) {
          cursorGlow.style.width  = '460px';
          cursorGlow.style.height = '460px';
          cursorGlow.style.opacity = '1';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (customCursor) customCursor.classList.remove('hovered');
        if (cursorGlow) {
          cursorGlow.style.width  = '380px';
          cursorGlow.style.height = '380px';
          cursorGlow.style.opacity = '0.75';
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     3. PARTICLES CANVAS
  ══════════════════════════════════════════════════════ */
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas || prefersReducedMotion) {
      if (canvas) canvas.style.display = 'none';
      return;
    }
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.5 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        const colorChoices = ['239,68,68', '59,130,246', '6,182,212', '255,255,255'];
        this.color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    const PARTICLE_COUNT = Math.min(80, Math.floor(W * H / 14000));
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    }
    loop();
  })();

  /* ══════════════════════════════════════════════════════
     4. NAVBAR — scroll shrink & active section
  ══════════════════════════════════════════════════════ */
  const mainNav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  /* ── Active nav link via IntersectionObserver ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link-item');

  let activeSection = 'home';

  function updateActiveNavLink() {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === activeSection);
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection = entry.target.id;
        updateActiveNavLink();
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Mobile hamburger ── */
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close mobile menu when a link is clicked */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* Close mobile menu on outside click */
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ══════════════════════════════════════════════════════
     5. SCROLL REVEAL (IntersectionObserver)
  ══════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ══════════════════════════════════════════════════════
     6. TYPEWRITER EFFECT
  ══════════════════════════════════════════════════════ */
  (function typewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el || prefersReducedMotion) return;

    const strings = [
      'AI & Data Science Student',
      'Frontend Developer',
      'Python Enthusiast',
      'Problem Solver',
      'Lifelong Learner',
    ];

    let si = 0, ci = 0, deleting = false;
    const typingSpeed  = 70;
    const deletingSpeed = 40;
    const pauseEnd    = 1800;
    const pauseStart  = 400;

    function tick() {
      const current = strings[si];
      if (!deleting) {
        el.textContent = current.substring(0, ci + 1);
        ci++;
        if (ci === current.length) {
          deleting = true;
          setTimeout(tick, pauseEnd);
          return;
        }
      } else {
        el.textContent = current.substring(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          si = (si + 1) % strings.length;
          setTimeout(tick, pauseStart);
          return;
        }
      }
      setTimeout(tick, deleting ? deletingSpeed : typingSpeed);
    }
    setTimeout(tick, 800);
  })();

  /* ══════════════════════════════════════════════════════
     7. SKILL CATEGORY TABS
  ══════════════════════════════════════════════════════ */
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards   = document.querySelectorAll('#skills-grid .skill-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');

      const cat = btn.dataset.cat;
      skillCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        /* re-trigger reveal for newly shown cards */
        if (show && !card.classList.contains('revealed')) {
          setTimeout(() => card.classList.add('revealed'), 50);
        }
      });
    });
  });

  /* ══════════════════════════════════════════════════════
     8. PROJECT FILTER
  ══════════════════════════════════════════════════════ */
  const projFilterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards   = document.querySelectorAll('#projects-grid .project-card');

  projFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(',');
        const show = filter === 'all' || tags.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ══════════════════════════════════════════════════════
     9. FLOATING TECH ICONS & AMBIENT BADGES — randomise animation
  ══════════════════════════════════════════════════════ */
  (function initFloatingIcons() {
    const icons = document.querySelectorAll('.float-icon');
    icons.forEach((icon) => {
      const duration = 5 + Math.random() * 5;     /* 5–10 s */
      const delay    = -(Math.random() * duration); /* random phase */
      icon.style.animationDuration = duration + 's';
      icon.style.animationDelay   = delay + 's';

      /* Touch interaction: show tooltip on tap */
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        const tooltip = icon.querySelector('.float-tooltip');
        if (!tooltip) return;
        const wasVisible = tooltip.style.opacity === '1';
        /* hide all tooltips first */
        document.querySelectorAll('.float-icon .float-tooltip').forEach(t => t.style.opacity = '0');
        if (!wasVisible) tooltip.style.opacity = '1';
      });
    });

    // Also naturalize ambient badges floating phase
    const ambientBadges = document.querySelectorAll('.ambient-badge');
    ambientBadges.forEach((badge) => {
      const dur = 5.5 + Math.random() * 4;
      badge.style.animationDuration = dur + 's';
    });

    /* Hide tooltips on outside click */
    document.addEventListener('click', () => {
      document.querySelectorAll('.float-icon .float-tooltip').forEach(t => t.style.opacity = '0');
    });
  })();

  /* ══════════════════════════════════════════════════════
     10. CONTACT FORM VALIDATION
  ══════════════════════════════════════════════════════ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const nameInput  = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput   = document.getElementById('form-message');
    const subjectInput = document.getElementById('form-subject');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showErr(inputEl, errId, show) {
      const errEl = document.getElementById(errId);
      inputEl.classList.toggle('error', show);
      if (errEl) {
        errEl.classList.toggle('show', show);
      }
    }

    /* Real-time validation */
    nameInput.addEventListener('blur', () => {
      showErr(nameInput, 'err-name', nameInput.value.trim().length < 2);
    });
    emailInput.addEventListener('blur', () => {
      showErr(emailInput, 'err-email', !validateEmail(emailInput.value.trim()));
    });
    msgInput.addEventListener('blur', () => {
      showErr(msgInput, 'err-message', msgInput.value.trim().length < 10);
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (nameInput.value.trim().length < 2)          { showErr(nameInput, 'err-name', true); valid = false; }
      else                                              { showErr(nameInput, 'err-name', false); }

      if (!validateEmail(emailInput.value.trim()))     { showErr(emailInput, 'err-email', true); valid = false; }
      else                                              { showErr(emailInput, 'err-email', false); }

      if (msgInput.value.trim().length < 10)           { showErr(msgInput, 'err-message', true); valid = false; }
      else                                              { showErr(msgInput, 'err-message', false); }

      if (!valid) return;

      const btn = document.getElementById('form-submit-btn');
      btn.disabled = true;
      btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending…';

      // Send to Backend API
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          subject: (subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry'),
          message: msgInput.value.trim()
        })
      })
      .then(res => res.json())
      .then(data => {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message';
        if (data.success) {
          document.getElementById('form-success').classList.add('show');
          contactForm.reset();
          setTimeout(() => document.getElementById('form-success').classList.remove('show'), 5000);
        } else {
          alert(data.message || 'Could not send message. Please try again.');
        }
      })
      .catch(err => {
        // Fallback for static demo
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message';
        document.getElementById('form-success').classList.add('show');
        contactForm.reset();
        setTimeout(() => document.getElementById('form-success').classList.remove('show'), 5000);
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     11. CURRENT YEAR & CERTIFICATE VIEWER HANDLER
  ══════════════════════════════════════════════════════ */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Footer Scroll to Top */
  const footerTopBtn = document.getElementById('footer-top-btn');
  if (footerTopBtn) {
    footerTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Certificate Modal Elements */
  const certModalOverlay    = document.getElementById('cert-modal-overlay');
  const certModalTitle      = document.getElementById('cert-modal-title');
  const certModalOrg        = document.getElementById('cert-modal-org');
  const certModalDate       = document.getElementById('cert-modal-date');
  const certModalImg        = document.getElementById('cert-modal-img');
  const certModalOpenTab    = document.getElementById('cert-modal-open-tab');
  const certModalClose      = document.getElementById('cert-modal-close');
  const certModalBackBtn = document.getElementById('cert-modal-back-btn');

  function openCertificateModal(imgSrc, title, org, date) {
    if (!certModalOverlay) return;
    if (certModalTitle) certModalTitle.textContent = title || 'Certificate Preview';
    if (certModalOrg) certModalOrg.textContent = org || 'Verified Credential';
    if (certModalDate) certModalDate.textContent = date || '';
    if (certModalImg) {
      certModalImg.src = imgSrc;
      certModalImg.alt = title ? `${title} Certificate` : 'Certificate preview';
    }
    if (certModalOpenTab) {
      certModalOpenTab.href = `certificate.html?cert=${encodeURIComponent(imgSrc)}&title=${encodeURIComponent(title || '')}&org=${encodeURIComponent(org || '')}&date=${encodeURIComponent(date || '')}`;
    }

    certModalOverlay.classList.add('open');
    certModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCertificateModal() {
    if (!certModalOverlay) return;
    certModalOverlay.classList.remove('open');
    certModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    /* Ensure smooth return focus to Achievements section */
    const achSection = document.getElementById('achievements');
    if (achSection) {
      achSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* Certificate View Click Handler */
  document.querySelectorAll('.btn-cert-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = btn.getAttribute('data-cert-img') || btn.getAttribute('href');
      const title = btn.getAttribute('data-cert-title') || 'Certificate Credential';
      const org = btn.getAttribute('data-cert-org') || 'Verified Institution';
      const date = btn.getAttribute('data-cert-date') || '2026';

      if (href && href !== '#' && href.trim() !== '') {
        openCertificateModal(href, title, org, date);
      } else {
        showAdminToast('Certificate photo placeholder — edit href in index.html or Admin Dashboard to link image!', true);
      }
    });
  });

  if (certModalClose)   certModalClose.addEventListener('click', closeCertificateModal);
  if (certModalBackBtn) certModalBackBtn.addEventListener('click', closeCertificateModal);

  /* Close cert modal on background click */
  if (certModalOverlay) {
    certModalOverlay.addEventListener('click', (e) => {
      if (e.target === certModalOverlay) closeCertificateModal();
    });
  }

  /* ══════════════════════════════════════════════════════
     12. TRIPLE-CLICK ADMIN TRIGGER
  ══════════════════════════════════════════════════════ */
  (function initAdminTrigger() {
    const logo = document.getElementById('nav-logo');
    if (!logo) return;

    let clickCount = 0;
    let resetTimer = null;
    const WINDOW_MS = 700; /* click window in ms */

    function handleLogoClick() {
      clickCount++;
      if (resetTimer) clearTimeout(resetTimer);

      if (clickCount >= 3) {
        clickCount = 0;
        openAdminLogin();
        return;
      }
      resetTimer = setTimeout(() => { clickCount = 0; }, WINDOW_MS);
    }

    logo.addEventListener('click', handleLogoClick);
    logo.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogoClick();
    });
  })();

  /* ══════════════════════════════════════════════════════
     13. ADMIN AUTHENTICATION & BACKEND INTEGRATION
  ══════════════════════════════════════════════════════ */
  const adminLoginOverlay = document.getElementById('admin-login-overlay');
  const adminLoginClose   = document.getElementById('admin-login-close');
  const adminLoginCancel  = document.getElementById('admin-login-cancel');
  const adminLoginForm    = document.getElementById('admin-login-form');
  const adminLoginError   = document.getElementById('admin-login-error');
  const adminDashOverlay  = document.getElementById('admin-dash-overlay');
  const adminLogoutBtn    = document.getElementById('admin-logout-btn');
  const adminPreviewBtn   = document.getElementById('admin-preview-btn');

  /* Admin login helper functions */
  function getAdminToken() {
    return sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
  }

  function setAdminToken(token) {
    sessionStorage.setItem('adminToken', token);
    localStorage.setItem('adminToken', token);
  }

  function clearAdminToken() {
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminToken');
  }

  window.openAdminLogin = function openAdminLogin() {
    const token = getAdminToken();
    if (token) {
      fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          openAdminDash();
          loadAdminData();
          return;
        }
        clearAdminToken();
        showLoginModal();
      })
      .catch(() => showLoginModal());
    } else {
      showLoginModal();
    }
  };

  function showLoginModal() {
    if (!adminLoginOverlay) return;
    adminLoginOverlay.classList.add('open');
    adminLoginOverlay.setAttribute('aria-hidden', 'false');
    if (adminLoginError) adminLoginError.style.display = 'none';
    setTimeout(() => {
      const emailInput = document.getElementById('admin-email');
      if (emailInput) emailInput.focus();
    }, 150);
  }

  function closeAdminLogin() {
    if (!adminLoginOverlay) return;
    adminLoginOverlay.classList.remove('open');
    adminLoginOverlay.setAttribute('aria-hidden', 'true');
    if (adminLoginError) adminLoginError.style.display = 'none';
    if (adminLoginForm) adminLoginForm.reset();
  }

  if (adminLoginClose)  adminLoginClose.addEventListener('click',  closeAdminLogin);
  if (adminLoginCancel) adminLoginCancel.addEventListener('click', closeAdminLogin);

  if (adminLoginOverlay) {
    adminLoginOverlay.addEventListener('click', (e) => {
      if (e.target === adminLoginOverlay) closeAdminLogin();
    });
  }

  /* Keyboard trap / ESC */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const itemModal = document.getElementById('admin-item-modal-overlay');
      if (itemModal && itemModal.classList.contains('open')) {
        closeItemModal();
        return;
      }
      if (adminLoginOverlay && adminLoginOverlay.classList.contains('open')) closeAdminLogin();
      if (adminDashOverlay && adminDashOverlay.classList.contains('open'))  adminLogout();
    }
  });

  /* Admin login form submit with real API authentication */
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('admin-email');
      const passInput  = document.getElementById('admin-password');
      const submitBtn  = document.getElementById('admin-login-btn');

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passInput ? passInput.value : '';

      if (!email || !password) {
        if (adminLoginError) {
          adminLoginError.textContent = 'Please provide both email and password.';
          adminLoginError.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i> Authenticating…';
      }

      fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Login';
        }

        if (data.success && data.token) {
          setAdminToken(data.token);
          closeAdminLogin();
          openAdminDash();
          loadAdminData();
          showAdminToast('Welcome back, Admin! ✓');
        } else {
          if (adminLoginError) {
            adminLoginError.textContent = data.message || 'Invalid admin credentials.';
            adminLoginError.style.display = 'block';
          }
        }
      })
      .catch(err => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Login';
        }
        if (adminLoginError) {
          adminLoginError.textContent = 'Unable to connect to server backend. Make sure server is running (npm start).';
          adminLoginError.style.display = 'block';
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     14. ADMIN DASHBOARD MANAGEMENT
  ══════════════════════════════════════════════════════ */
  function openAdminDash() {
    closeAdminLogin();
    if (!adminDashOverlay) return;
    adminDashOverlay.classList.add('open');
    adminDashOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    loadAdminData();
  }

  function adminLogout() {
    if (adminDashOverlay) {
      adminDashOverlay.classList.remove('open');
      adminDashOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    clearAdminToken();
    showAdminToast('Logged out of Admin Dashboard');
  }

  if (adminLogoutBtn)  adminLogoutBtn.addEventListener('click',  adminLogout);
  if (adminPreviewBtn) adminPreviewBtn.addEventListener('click', () => {
    if (adminDashOverlay) {
      adminDashOverlay.classList.remove('open');
      adminDashOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    showAdminToast('Viewing Live Portfolio Preview');
  });

  /* Admin section tab switching */
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminPanels  = document.querySelectorAll('.admin-panel');

  adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      adminTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.adminTab;
      adminPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === 'admin-panel-' + target);
      });

      if (target === 'messages') {
        loadAdminMessages();
      }
    });
  });

  /* ══════════════════════════════════════════════════════
     15. SMOOTH SCROLL for all nav links
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════════════════════
     16. 3D CARD TILT EFFECT (mouse parallax on cards)
  ══════════════════════════════════════════════════════ */
  (function initCardTilt() {
    if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

    const TILT_MAX   = 8;
    const SCALE      = 1.02;
    const PERSPECTIVE = 900;

    document.querySelectorAll('.glass-card, .skill-card, .project-card, .achievement-card').forEach(card => {
      card.classList.add('tilt-card');
      card.style.perspective = PERSPECTIVE + 'px';

      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const rotateX = -dy * TILT_MAX;
        const rotateY =  dx * TILT_MAX;

        card.classList.remove('tilt-reset');
        card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${SCALE})`;
      });

      card.addEventListener('mouseleave', () => {
        card.classList.add('tilt-reset');
        card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) scale(1)`;
        setTimeout(() => card.classList.remove('tilt-reset'), 500);
      });
    });
  })();

  /* ══════════════════════════════════════════════════════
     17. MAGNETIC BUTTON EFFECT
  ══════════════════════════════════════════════════════ */
  (function initMagneticButtons() {
    if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

    const STRENGTH = 0.28;

    document.querySelectorAll('.btn-glow, .btn-sm-glow').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx   = e.clientX - (rect.left + rect.width  / 2);
        const dy   = e.clientY - (rect.top  + rect.height / 2);
        btn.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.45s cubic-bezier(0.23,1,0.32,1)';
        btn.style.transform  = '';
        setTimeout(() => btn.style.transition = '', 450);
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.12s ease';
      });
    });
  })();

  /* Fetch initial portfolio data on load to hydrate frontend */
  fetchPortfolioData();

}); /* END DOMContentLoaded */


/* ══════════════════════════════════════════════════════
   18. PORTFOLIO DATA SYNC & ADMIN PERSISTENCE ENGINE
══════════════════════════════════════════════════════ */

let currentPortfolioData = null;

function getAdminToken() {
  return sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
}

/**
 * Fetch portfolio data from backend API and update live site DOM
 */
function fetchPortfolioData() {
  fetch('/api/portfolio')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        currentPortfolioData = data.data;
        hydratePublicPortfolio(data.data);
      }
    })
    .catch(err => {
      console.log('Portfolio API offline, using static HTML fallback.');
    });
}

/**
 * Hydrate DOM elements from backend JSON data
 */
function hydratePublicPortfolio(data) {
  if (!data) return;

  // 1. Home Section
  if (data.home) {
    const nameEl = document.getElementById('display-name');
    if (nameEl && data.home.displayName) nameEl.textContent = data.home.displayName;

    const introEl = document.getElementById('display-intro');
    if (introEl && data.home.heroIntro) introEl.textContent = data.home.heroIntro;

    if (data.home.profileImg) {
      updateProfilePhotoDOM(data.home.profileImg);
    }
  }

  // 2. About Section
  if (data.about) {
    const descEl = document.getElementById('about-description');
    if (descEl && data.about.description) descEl.textContent = data.about.description;

    const focusEl = document.getElementById('about-focus');
    if (focusEl && data.about.focus) focusEl.textContent = data.about.focus;

    const goalsEl = document.getElementById('about-goals');
    if (goalsEl && data.about.goals) goalsEl.textContent = data.about.goals;
  }

  // 3. Contact Section
  if (data.contact) {
    if (data.contact.email) {
      const emailEl = document.getElementById('contact-email');
      if (emailEl) {
        emailEl.textContent = data.contact.email;
        emailEl.href = `mailto:${data.contact.email}`;
      }
    }
    if (data.contact.github) {
      document.querySelectorAll('#contact-github, #hero-social-github, #footer-social-github').forEach(el => el.href = data.contact.github);
    }
    if (data.contact.linkedin) {
      document.querySelectorAll('#contact-linkedin, #hero-social-linkedin, #footer-social-linkedin').forEach(el => el.href = data.contact.linkedin);
    }
    if (data.contact.instagram) {
      document.querySelectorAll('#contact-instagram, #hero-social-instagram, #footer-social-instagram').forEach(el => el.href = data.contact.instagram);
    }
  }
}

function updateProfilePhotoDOM(url) {
  const wrap = document.getElementById('profile-photo-wrap');
  if (wrap) {
    wrap.innerHTML = `<img src="${url}" alt="Nirmal C profile photo" class="hero-photo" id="profile-photo" onerror="this.onerror=null;this.src='profile.jpeg';" />`;
  }
}

/**
 * Load and populate Admin dashboard controls
 */
function loadAdminData() {
  if (!currentPortfolioData) {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          currentPortfolioData = res.data;
          populateAdminForms();
        }
      });
  } else {
    populateAdminForms();
  }
  loadAdminMessages();
}

function populateAdminForms() {
  if (!currentPortfolioData) return;

  // Home
  if (currentPortfolioData.home) {
    const name = document.getElementById('admin-display-name');
    const intro = document.getElementById('admin-hero-intro');
    const photo = document.getElementById('admin-profile-img');
    if (name)  name.value  = currentPortfolioData.home.displayName || '';
    if (intro) intro.value = currentPortfolioData.home.heroIntro || '';
    if (photo) photo.value = currentPortfolioData.home.profileImg || '';
  }

  // About
  if (currentPortfolioData.about) {
    const desc  = document.getElementById('admin-about-desc');
    const focus = document.getElementById('admin-about-focus');
    const goals = document.getElementById('admin-about-goals');
    if (desc)  desc.value  = currentPortfolioData.about.description || '';
    if (focus) focus.value = currentPortfolioData.about.focus || '';
    if (goals) goals.value = currentPortfolioData.about.goals || '';
  }

  // Contact
  if (currentPortfolioData.contact) {
    const email = document.getElementById('admin-contact-email');
    const gh    = document.getElementById('admin-contact-github');
    const li    = document.getElementById('admin-contact-linkedin');
    const ig    = document.getElementById('admin-contact-instagram');
    if (email) email.value = currentPortfolioData.contact.email || '';
    if (gh)    gh.value    = currentPortfolioData.contact.github || '';
    if (li)    li.value    = currentPortfolioData.contact.linkedin || '';
    if (ig)    ig.value    = currentPortfolioData.contact.instagram || '';
  }

  // Render lists
  renderAdminSkills();
  renderAdminProjects();
  renderAdminExperience();
  renderAdminAchievements();
  renderAdminEducation();
}

/**
 * Generic save section to backend API
 */
function saveSectionToBackend(section, data, callback) {
  const token = getAdminToken();
  if (!token) {
    showAdminToast('Please log in as admin to save changes.', true);
    return;
  }

  fetch('/api/admin/portfolio/update-section', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ section, data })
  })
  .then(res => res.json())
  .then(resp => {
    if (resp.success) {
      if (!currentPortfolioData) currentPortfolioData = {};
      currentPortfolioData[section] = data;
      hydratePublicPortfolio(currentPortfolioData);
      showAdminToast(`${section.charAt(0).toUpperCase() + section.slice(1)} updated & saved to backend ✓`);
      if (typeof callback === 'function') callback(null, resp);
    } else {
      showAdminToast(resp.message || 'Error saving to backend', true);
      if (typeof callback === 'function') callback(resp);
    }
  })
  .catch(err => {
    showAdminToast('Failed to connect to backend server', true);
    if (typeof callback === 'function') callback(err);
  });
}

/* ── Save Functions for Admin Panels ── */

window.adminSaveHome = function adminSaveHome() {
  const name  = document.getElementById('admin-display-name');
  const intro = document.getElementById('admin-hero-intro');
  const photo = document.getElementById('admin-profile-img');

  const homeData = {
    displayName: name ? name.value.trim() : 'Nirmal C',
    heroIntro: intro ? intro.value.trim() : '',
    profileImg: photo ? photo.value.trim() : 'profile.jpeg',
    roles: currentPortfolioData?.home?.roles || ["AI & Data Science Student", "Machine Learning Enthusiast", "Frontend Developer"]
  };

  saveSectionToBackend('home', homeData);
};

window.adminUpdatePhoto = function adminUpdatePhoto() {
  const photo = document.getElementById('admin-profile-img');
  const url = photo ? photo.value.trim() : '';
  if (!url) {
    showAdminToast('Please enter an image URL or filename.', true);
    return;
  }
  if (!currentPortfolioData) currentPortfolioData = {};
  if (!currentPortfolioData.home) currentPortfolioData.home = {};
  currentPortfolioData.home.profileImg = url;
  updateProfilePhotoDOM(url);
  adminSaveHome();
};

window.adminUploadPhotoFile = function adminUploadPhotoFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const token = getAdminToken();
  if (!token) {
    showAdminToast('Please log in as admin to upload files.', true);
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  showAdminToast('Uploading photo to server…');

  fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.url) {
      const photoInput = document.getElementById('admin-profile-img');
      if (photoInput) photoInput.value = data.url;
      adminUpdatePhoto();
      showAdminToast('Profile photo uploaded and saved ✓');
    } else {
      showAdminToast(data.message || 'File upload failed', true);
    }
  })
  .catch(err => {
    showAdminToast('Upload failed: server error', true);
  });
};

window.adminSaveAbout = function adminSaveAbout() {
  const desc  = document.getElementById('admin-about-desc');
  const focus = document.getElementById('admin-about-focus');
  const goals = document.getElementById('admin-about-goals');

  const aboutData = {
    description: desc ? desc.value.trim() : '',
    focus: focus ? focus.value.trim() : '',
    goals: goals ? goals.value.trim() : '',
    educationSummary: currentPortfolioData?.about?.educationSummary || '',
    interestsSummary: currentPortfolioData?.about?.interestsSummary || ''
  };

  saveSectionToBackend('about', aboutData);
};

window.adminSaveContact = function adminSaveContact() {
  const email = document.getElementById('admin-contact-email')?.value.trim() || '';
  const gh    = document.getElementById('admin-contact-github')?.value.trim() || '';
  const li    = document.getElementById('admin-contact-linkedin')?.value.trim() || '';
  const ig    = document.getElementById('admin-contact-instagram')?.value.trim() || '';

  const contactData = {
    email,
    location: currentPortfolioData?.contact?.location || 'Tamil Nadu, India',
    github: gh,
    linkedin: li,
    instagram: ig
  };

  saveSectionToBackend('contact', contactData);
};

/* ══════════════════════════════════════════════════════
   19. DYNAMIC LIST RENDERING & ITEM MODAL CRUD
══════════════════════════════════════════════════════ */

// ── Skills List
function renderAdminSkills() {
  const listEl = document.getElementById('admin-skills-list');
  if (!listEl) return;
  const skills = currentPortfolioData?.skills || [];
  if (!skills.length) {
    listEl.innerHTML = '<div class="text-muted p-2">No skills added yet.</div>';
    return;
  }
  listEl.innerHTML = skills.map((sk, idx) => `
    <div class="admin-list-item">
      <div class="admin-list-item-info">
        <div class="admin-list-item-title"><i class="${sk.icon || 'bi bi-tools'} me-1" style="color:${sk.color || 'var(--accent-a)'}"></i> ${sk.name}</div>
        <div class="admin-list-item-sub">${sk.category || 'Skill'} · ${sk.desc || ''}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-admin-edit" onclick="adminEditSkill('${sk.id || idx}')" title="Edit Skill"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-admin-del" onclick="adminDeleteSkill('${sk.id || idx}')" title="Delete Skill"><i class="bi bi-trash-fill"></i></button>
      </div>
    </div>
  `).join('');
}

// ── Projects List
function renderAdminProjects() {
  const listEl = document.getElementById('admin-projects-list');
  if (!listEl) return;
  const projects = currentPortfolioData?.projects || [];
  if (!projects.length) {
    listEl.innerHTML = '<div class="text-muted p-2">No projects added yet.</div>';
    return;
  }
  listEl.innerHTML = projects.map((pr, idx) => `
    <div class="admin-list-item">
      <div class="admin-list-item-info">
        <div class="admin-list-item-title">${pr.title}</div>
        <div class="admin-list-item-sub">${pr.badge || pr.tag || 'Project'} · ${(pr.tags || []).join(' · ')}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-admin-edit" onclick="adminEditProject('${pr.id || idx}')" title="Edit Project"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-admin-del" onclick="adminDeleteProject('${pr.id || idx}')" title="Delete Project"><i class="bi bi-trash-fill"></i></button>
      </div>
    </div>
  `).join('');
}

// ── Experience List
function renderAdminExperience() {
  const listEl = document.getElementById('admin-exp-list');
  if (!listEl) return;
  const exp = currentPortfolioData?.experience || [];
  if (!exp.length) {
    listEl.innerHTML = '<div class="text-muted p-2">No experience entries added yet.</div>';
    return;
  }
  listEl.innerHTML = exp.map((ex, idx) => `
    <div class="admin-list-item">
      <div class="admin-list-item-info">
        <div class="admin-list-item-title">${ex.role}</div>
        <div class="admin-list-item-sub">${ex.org} · ${ex.period}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-admin-edit" onclick="adminEditExperience('${ex.id || idx}')" title="Edit Experience"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-admin-del" onclick="adminDeleteExperience('${ex.id || idx}')" title="Delete Experience"><i class="bi bi-trash-fill"></i></button>
      </div>
    </div>
  `).join('');
}

// ── Achievements List
function renderAdminAchievements() {
  const listEl = document.getElementById('admin-ach-list');
  if (!listEl) return;
  const ach = currentPortfolioData?.achievements || [];
  if (!ach.length) {
    listEl.innerHTML = '<div class="text-muted p-2">No achievements added yet.</div>';
    return;
  }
  listEl.innerHTML = ach.map((ac, idx) => `
    <div class="admin-list-item">
      <div class="admin-list-item-info">
        <div class="admin-list-item-title">${ac.title}</div>
        <div class="admin-list-item-sub">${ac.org} · ${ac.date}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-admin-edit" onclick="adminEditAchievement('${ac.id || idx}')" title="Edit Achievement"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-admin-del" onclick="adminDeleteAchievement('${ac.id || idx}')" title="Delete Achievement"><i class="bi bi-trash-fill"></i></button>
      </div>
    </div>
  `).join('');
}

// ── Education List
function renderAdminEducation() {
  const listEl = document.getElementById('admin-edu-list');
  if (!listEl) return;
  const edu = currentPortfolioData?.education || [];
  if (!edu.length) {
    listEl.innerHTML = '<div class="text-muted p-2">No education entries added yet.</div>';
    return;
  }
  listEl.innerHTML = edu.map((ed, idx) => `
    <div class="admin-list-item">
      <div class="admin-list-item-info">
        <div class="admin-list-item-title">${ed.degree}</div>
        <div class="admin-list-item-sub">${ed.institution} · ${ed.period}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-admin-edit" onclick="adminEditEducation('${ed.id || idx}')" title="Edit Education"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-admin-del" onclick="adminDeleteEducation('${ed.id || idx}')" title="Delete Education"><i class="bi bi-trash-fill"></i></button>
      </div>
    </div>
  `).join('');
}

// ── Messages / Inquiries loader
function loadAdminMessages() {
  const token = getAdminToken();
  if (!token) return;

  fetch('/api/admin/messages', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    const listEl = document.getElementById('admin-messages-list');
    const badgeEl = document.getElementById('admin-msg-badge');
    if (!listEl) return;

    const msgs = data.messages || [];
    if (badgeEl) {
      badgeEl.textContent = msgs.length;
      badgeEl.style.display = msgs.length > 0 ? 'inline-block' : 'none';
    }

    if (!msgs.length) {
      listEl.innerHTML = '<div class="text-center py-4 text-muted"><i class="bi bi-inbox fs-2 d-block mb-2"></i>No inquiries received yet.</div>';
      return;
    }

    listEl.innerHTML = msgs.map(m => `
      <div class="glass-card p-3 mb-3" style="border-left: 3px solid var(--accent-a);">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 class="mb-0 fw-bold">${m.name}</h5>
            <a href="mailto:${m.email}" style="color:var(--accent-b); font-size:0.85rem; text-decoration:none;">
              <i class="bi bi-envelope-fill me-1"></i>${m.email}
            </a>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-secondary" style="font-size:0.75rem;">${new Date(m.receivedAt).toLocaleDateString()} ${new Date(m.receivedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
            <button class="btn-admin-del" onclick="deleteAdminMessage('${m.id}')" title="Delete Message">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
        <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary); margin-bottom:0.4rem;">Subject: ${m.subject || 'Inquiry'}</div>
        <div style="font-size:0.88rem; color:var(--text-secondary); white-space:pre-wrap; background:rgba(0,0,0,0.25); padding:0.75rem; border-radius:8px;">${m.message}</div>
      </div>
    `).join('');
  })
  .catch(err => {
    console.error('Error loading messages:', err);
  });
}

window.deleteAdminMessage = function deleteAdminMessage(id) {
  if (!confirm('Are you sure you want to delete this inquiry?')) return;
  const token = getAdminToken();
  fetch(`/api/admin/messages/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showAdminToast('Message deleted ✓');
      loadAdminMessages();
    }
  });
};

/* ══════════════════════════════════════════════════════
   20. REUSABLE ITEM MODAL (Skills, Projects, Exp, Ach, Edu)
══════════════════════════════════════════════════════ */
let itemModalCallback = null;

function openItemModal(title, fieldsHTML, onSave) {
  const overlay = document.getElementById('admin-item-modal-overlay');
  const titleEl = document.getElementById('admin-item-modal-title');
  const fieldsContainer = document.getElementById('admin-item-fields');
  const form = document.getElementById('admin-item-form');

  if (!overlay || !fieldsContainer) return;

  titleEl.innerHTML = title;
  fieldsContainer.innerHTML = fieldsHTML;
  itemModalCallback = onSave;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');

  form.onsubmit = function(e) {
    e.preventDefault();
    if (typeof itemModalCallback === 'function') {
      itemModalCallback();
    }
  };

  const closeBtn = document.getElementById('admin-item-modal-close');
  const cancelBtn = document.getElementById('admin-item-cancel-btn');
  if (closeBtn) closeBtn.onclick = closeItemModal;
  if (cancelBtn) cancelBtn.onclick = closeItemModal;
}

function closeItemModal() {
  const overlay = document.getElementById('admin-item-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

// ── Skill Actions
window.adminAddSkill = function adminAddSkill() {
  openItemModal('<i class="bi bi-plus-circle me-2"></i>Add New Skill', `
    <div class="admin-field-group">
      <label class="admin-field-label">Skill Name</label>
      <input type="text" id="m-skill-name" class="form-control-glow" placeholder="e.g. React, Node.js" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Category</label>
      <select id="m-skill-cat" class="form-control-glow">
        <option value="frontend">Frontend</option>
        <option value="programming">Programming</option>
        <option value="datascience">Data Science</option>
        <option value="database">Database</option>
        <option value="tools">Tools & Tech</option>
        <option value="learning">Currently Learning</option>
      </select>
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <input type="text" id="m-skill-desc" class="form-control-glow" placeholder="Brief proficiency detail" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Icon Class (Bootstrap or FontAwesome)</label>
      <input type="text" id="m-skill-icon" class="form-control-glow" value="bi bi-code-slash" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Accent Color (Hex)</label>
      <input type="color" id="m-skill-color" class="form-control-glow" value="#ef4444" style="height:44px; padding:4px;" />
    </div>
  `, () => {
    const name = document.getElementById('m-skill-name').value.trim();
    if (!name) return;
    const newSkill = {
      id: `sk-${Date.now()}`,
      name,
      category: document.getElementById('m-skill-cat').value,
      desc: document.getElementById('m-skill-desc').value.trim(),
      icon: document.getElementById('m-skill-icon').value.trim(),
      color: document.getElementById('m-skill-color').value
    };
    if (!currentPortfolioData.skills) currentPortfolioData.skills = [];
    currentPortfolioData.skills.push(newSkill);
    saveSectionToBackend('skills', currentPortfolioData.skills, () => {
      renderAdminSkills();
      closeItemModal();
    });
  });
};

window.adminEditSkill = function adminEditSkill(id) {
  const skill = (currentPortfolioData?.skills || []).find(s => String(s.id) === String(id));
  if (!skill) return;

  openItemModal('<i class="bi bi-pencil-square me-2"></i>Edit Skill', `
    <div class="admin-field-group">
      <label class="admin-field-label">Skill Name</label>
      <input type="text" id="m-skill-name" class="form-control-glow" value="${skill.name}" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Category</label>
      <select id="m-skill-cat" class="form-control-glow">
        <option value="frontend" ${skill.category==='frontend'?'selected':''}>Frontend</option>
        <option value="programming" ${skill.category==='programming'?'selected':''}>Programming</option>
        <option value="datascience" ${skill.category==='datascience'?'selected':''}>Data Science</option>
        <option value="database" ${skill.category==='database'?'selected':''}>Database</option>
        <option value="tools" ${skill.category==='tools'?'selected':''}>Tools & Tech</option>
        <option value="learning" ${skill.category==='learning'?'selected':''}>Currently Learning</option>
      </select>
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <input type="text" id="m-skill-desc" class="form-control-glow" value="${skill.desc || ''}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Icon Class</label>
      <input type="text" id="m-skill-icon" class="form-control-glow" value="${skill.icon || ''}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Accent Color</label>
      <input type="color" id="m-skill-color" class="form-control-glow" value="${skill.color || '#ef4444'}" style="height:44px; padding:4px;" />
    </div>
  `, () => {
    skill.name = document.getElementById('m-skill-name').value.trim();
    skill.category = document.getElementById('m-skill-cat').value;
    skill.desc = document.getElementById('m-skill-desc').value.trim();
    skill.icon = document.getElementById('m-skill-icon').value.trim();
    skill.color = document.getElementById('m-skill-color').value;

    saveSectionToBackend('skills', currentPortfolioData.skills, () => {
      renderAdminSkills();
      closeItemModal();
    });
  });
};

window.adminDeleteSkill = function adminDeleteSkill(id) {
  if (!confirm('Are you sure you want to delete this skill?')) return;
  currentPortfolioData.skills = (currentPortfolioData.skills || []).filter(s => String(s.id) !== String(id));
  saveSectionToBackend('skills', currentPortfolioData.skills, () => {
    renderAdminSkills();
  });
};

// ── Project Actions
window.adminAddProject = function adminAddProject() {
  openItemModal('<i class="bi bi-plus-circle me-2"></i>Add New Project', `
    <div class="admin-field-group">
      <label class="admin-field-label">Project Title</label>
      <input type="text" id="m-proj-title" class="form-control-glow" placeholder="e.g. AI Travel Planner" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Category Filter</label>
      <select id="m-proj-tag" class="form-control-glow">
        <option value="web">Web Development</option>
        <option value="ai">AI / Machine Learning</option>
        <option value="data">Data Science</option>
      </select>
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Badge Label</label>
      <input type="text" id="m-proj-badge" class="form-control-glow" placeholder="e.g. Tourism Web App" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <textarea id="m-proj-desc" class="form-control-glow" rows="3" placeholder="Project overview and tech stack"></textarea>
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Tech Stack Tags (comma-separated)</label>
      <input type="text" id="m-proj-tags" class="form-control-glow" placeholder="React, Node.js, MongoDB" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">GitHub URL</label>
      <input type="url" id="m-proj-github" class="form-control-glow" value="https://github.com/Nirmal-46" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Live Demo URL</label>
      <input type="text" id="m-proj-live" class="form-control-glow" value="#" />
    </div>
  `, () => {
    const title = document.getElementById('m-proj-title').value.trim();
    if (!title) return;
    const newProj = {
      id: `proj-${Date.now()}`,
      title,
      tag: document.getElementById('m-proj-tag').value,
      badge: document.getElementById('m-proj-badge').value.trim() || 'Project',
      badgeIcon: 'bi bi-laptop-fill',
      desc: document.getElementById('m-proj-desc').value.trim(),
      tags: document.getElementById('m-proj-tags').value.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: document.getElementById('m-proj-github').value.trim(),
      liveUrl: document.getElementById('m-proj-live').value.trim(),
      image: ''
    };
    if (!currentPortfolioData.projects) currentPortfolioData.projects = [];
    currentPortfolioData.projects.push(newProj);
    saveSectionToBackend('projects', currentPortfolioData.projects, () => {
      renderAdminProjects();
      closeItemModal();
    });
  });
};

window.adminEditProject = function adminEditProject(id) {
  const proj = (currentPortfolioData?.projects || []).find(p => String(p.id) === String(id));
  if (!proj) return;

  openItemModal('<i class="bi bi-pencil-square me-2"></i>Edit Project', `
    <div class="admin-field-group">
      <label class="admin-field-label">Project Title</label>
      <input type="text" id="m-proj-title" class="form-control-glow" value="${proj.title}" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Category Filter</label>
      <select id="m-proj-tag" class="form-control-glow">
        <option value="web" ${proj.tag==='web'?'selected':''}>Web Development</option>
        <option value="ai" ${proj.tag==='ai'?'selected':''}>AI / Machine Learning</option>
        <option value="data" ${proj.tag==='data'?'selected':''}>Data Science</option>
      </select>
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Badge Label</label>
      <input type="text" id="m-proj-badge" class="form-control-glow" value="${proj.badge || ''}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <textarea id="m-proj-desc" class="form-control-glow" rows="3">${proj.desc || ''}</textarea>
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Tech Stack Tags (comma-separated)</label>
      <input type="text" id="m-proj-tags" class="form-control-glow" value="${(proj.tags || []).join(', ')}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">GitHub URL</label>
      <input type="url" id="m-proj-github" class="form-control-glow" value="${proj.githubUrl || ''}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Live Demo URL</label>
      <input type="text" id="m-proj-live" class="form-control-glow" value="${proj.liveUrl || ''}" />
    </div>
  `, () => {
    proj.title = document.getElementById('m-proj-title').value.trim();
    proj.tag = document.getElementById('m-proj-tag').value;
    proj.badge = document.getElementById('m-proj-badge').value.trim();
    proj.desc = document.getElementById('m-proj-desc').value.trim();
    proj.tags = document.getElementById('m-proj-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    proj.githubUrl = document.getElementById('m-proj-github').value.trim();
    proj.liveUrl = document.getElementById('m-proj-live').value.trim();

    saveSectionToBackend('projects', currentPortfolioData.projects, () => {
      renderAdminProjects();
      closeItemModal();
    });
  });
};

window.adminDeleteProject = function adminDeleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  currentPortfolioData.projects = (currentPortfolioData.projects || []).filter(p => String(p.id) !== String(id));
  saveSectionToBackend('projects', currentPortfolioData.projects, () => {
    renderAdminProjects();
  });
};

// ── Experience Actions
window.adminAddExperience = function adminAddExperience() {
  openItemModal('<i class="bi bi-plus-circle me-2"></i>Add Experience', `
    <div class="admin-field-group">
      <label class="admin-field-label">Role / Position</label>
      <input type="text" id="m-exp-role" class="form-control-glow" placeholder="e.g. Trainee Developer" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Organization / Company</label>
      <input type="text" id="m-exp-org" class="form-control-glow" placeholder="e.g. NxtWave CCBP 4.0" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Period / Duration</label>
      <input type="text" id="m-exp-period" class="form-control-glow" placeholder="e.g. 2025 – Present" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <textarea id="m-exp-desc" class="form-control-glow" rows="3"></textarea>
    </div>
  `, () => {
    const role = document.getElementById('m-exp-role').value.trim();
    if (!role) return;
    const newExp = {
      id: `exp-${Date.now()}`,
      role,
      org: document.getElementById('m-exp-org').value.trim(),
      period: document.getElementById('m-exp-period').value.trim(),
      desc: document.getElementById('m-exp-desc').value.trim(),
      tags: []
    };
    if (!currentPortfolioData.experience) currentPortfolioData.experience = [];
    currentPortfolioData.experience.push(newExp);
    saveSectionToBackend('experience', currentPortfolioData.experience, () => {
      renderAdminExperience();
      closeItemModal();
    });
  });
};

window.adminEditExperience = function adminEditExperience(id) {
  const exp = (currentPortfolioData?.experience || []).find(e => String(e.id) === String(id));
  if (!exp) return;

  openItemModal('<i class="bi bi-pencil-square me-2"></i>Edit Experience', `
    <div class="admin-field-group">
      <label class="admin-field-label">Role / Position</label>
      <input type="text" id="m-exp-role" class="form-control-glow" value="${exp.role}" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Organization / Company</label>
      <input type="text" id="m-exp-org" class="form-control-glow" value="${exp.org}" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Period / Duration</label>
      <input type="text" id="m-exp-period" class="form-control-glow" value="${exp.period}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <textarea id="m-exp-desc" class="form-control-glow" rows="3">${exp.desc || ''}</textarea>
    </div>
  `, () => {
    exp.role = document.getElementById('m-exp-role').value.trim();
    exp.org = document.getElementById('m-exp-org').value.trim();
    exp.period = document.getElementById('m-exp-period').value.trim();
    exp.desc = document.getElementById('m-exp-desc').value.trim();

    saveSectionToBackend('experience', currentPortfolioData.experience, () => {
      renderAdminExperience();
      closeItemModal();
    });
  });
};

window.adminDeleteExperience = function adminDeleteExperience(id) {
  if (!confirm('Are you sure you want to delete this experience entry?')) return;
  currentPortfolioData.experience = (currentPortfolioData.experience || []).filter(e => String(e.id) !== String(id));
  saveSectionToBackend('experience', currentPortfolioData.experience, () => {
    renderAdminExperience();
  });
};

// ── Achievement Actions
window.adminAddAchievement = function adminAddAchievement() {
  openItemModal('<i class="bi bi-plus-circle me-2"></i>Add Achievement / Certificate', `
    <div class="admin-field-group">
      <label class="admin-field-label">Achievement Title</label>
      <input type="text" id="m-ach-title" class="form-control-glow" placeholder="e.g. Fortinet NSE 1 Certification" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Issuing Organization</label>
      <input type="text" id="m-ach-org" class="form-control-glow" placeholder="e.g. Fortinet Training Institute" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Date / Year</label>
      <input type="text" id="m-ach-date" class="form-control-glow" placeholder="e.g. 2026" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Certificate Image URL / Filename</label>
      <input type="text" id="m-ach-img" class="form-control-glow" placeholder="e.g. Nse1.PNG" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <textarea id="m-ach-desc" class="form-control-glow" rows="3"></textarea>
    </div>
  `, () => {
    const title = document.getElementById('m-ach-title').value.trim();
    if (!title) return;
    const newAch = {
      id: `ach-${Date.now()}`,
      title,
      org: document.getElementById('m-ach-org').value.trim(),
      date: document.getElementById('m-ach-date').value.trim(),
      image: document.getElementById('m-ach-img').value.trim(),
      icon: 'bi bi-award-fill',
      desc: document.getElementById('m-ach-desc').value.trim()
    };
    if (!currentPortfolioData.achievements) currentPortfolioData.achievements = [];
    currentPortfolioData.achievements.push(newAch);
    saveSectionToBackend('achievements', currentPortfolioData.achievements, () => {
      renderAdminAchievements();
      closeItemModal();
    });
  });
};

window.adminEditAchievement = function adminEditAchievement(id) {
  const ach = (currentPortfolioData?.achievements || []).find(a => String(a.id) === String(id));
  if (!ach) return;

  openItemModal('<i class="bi bi-pencil-square me-2"></i>Edit Achievement', `
    <div class="admin-field-group">
      <label class="admin-field-label">Achievement Title</label>
      <input type="text" id="m-ach-title" class="form-control-glow" value="${ach.title}" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Issuing Organization</label>
      <input type="text" id="m-ach-org" class="form-control-glow" value="${ach.org}" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Date / Year</label>
      <input type="text" id="m-ach-date" class="form-control-glow" value="${ach.date || ''}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Certificate Image URL / Filename</label>
      <input type="text" id="m-ach-img" class="form-control-glow" value="${ach.image || ''}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <textarea id="m-ach-desc" class="form-control-glow" rows="3">${ach.desc || ''}</textarea>
    </div>
  `, () => {
    ach.title = document.getElementById('m-ach-title').value.trim();
    ach.org = document.getElementById('m-ach-org').value.trim();
    ach.date = document.getElementById('m-ach-date').value.trim();
    ach.image = document.getElementById('m-ach-img').value.trim();
    ach.desc = document.getElementById('m-ach-desc').value.trim();

    saveSectionToBackend('achievements', currentPortfolioData.achievements, () => {
      renderAdminAchievements();
      closeItemModal();
    });
  });
};

window.adminDeleteAchievement = function adminDeleteAchievement(id) {
  if (!confirm('Are you sure you want to delete this achievement?')) return;
  currentPortfolioData.achievements = (currentPortfolioData.achievements || []).filter(a => String(a.id) !== String(id));
  saveSectionToBackend('achievements', currentPortfolioData.achievements, () => {
    renderAdminAchievements();
  });
};

// ── Education Actions
window.adminAddEducation = function adminAddEducation() {
  openItemModal('<i class="bi bi-plus-circle me-2"></i>Add Education', `
    <div class="admin-field-group">
      <label class="admin-field-label">Degree / Qualification</label>
      <input type="text" id="m-edu-degree" class="form-control-glow" placeholder="e.g. B.Tech – AI & Data Science" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Institution / College</label>
      <input type="text" id="m-edu-inst" class="form-control-glow" placeholder="e.g. KPR Institute" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Period / Years</label>
      <input type="text" id="m-edu-period" class="form-control-glow" placeholder="e.g. 2025 – 2029" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Badge / Grade / CGPA</label>
      <input type="text" id="m-edu-badge" class="form-control-glow" placeholder="e.g. CGPA: 8.06" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <textarea id="m-edu-desc" class="form-control-glow" rows="3"></textarea>
    </div>
  `, () => {
    const degree = document.getElementById('m-edu-degree').value.trim();
    if (!degree) return;
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree,
      institution: document.getElementById('m-edu-inst').value.trim(),
      period: document.getElementById('m-edu-period').value.trim(),
      badge: document.getElementById('m-edu-badge').value.trim(),
      desc: document.getElementById('m-edu-desc').value.trim(),
      highlights: []
    };
    if (!currentPortfolioData.education) currentPortfolioData.education = [];
    currentPortfolioData.education.push(newEdu);
    saveSectionToBackend('education', currentPortfolioData.education, () => {
      renderAdminEducation();
      closeItemModal();
    });
  });
};

window.adminEditEducation = function adminEditEducation(id) {
  const edu = (currentPortfolioData?.education || []).find(e => String(e.id) === String(id));
  if (!edu) return;

  openItemModal('<i class="bi bi-pencil-square me-2"></i>Edit Education', `
    <div class="admin-field-group">
      <label class="admin-field-label">Degree / Qualification</label>
      <input type="text" id="m-edu-degree" class="form-control-glow" value="${edu.degree}" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Institution / College</label>
      <input type="text" id="m-edu-inst" class="form-control-glow" value="${edu.institution}" required />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Period / Years</label>
      <input type="text" id="m-edu-period" class="form-control-glow" value="${edu.period}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Badge / Grade / CGPA</label>
      <input type="text" id="m-edu-badge" class="form-control-glow" value="${edu.badge || ''}" />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Description</label>
      <textarea id="m-edu-desc" class="form-control-glow" rows="3">${edu.desc || ''}</textarea>
    </div>
  `, () => {
    edu.degree = document.getElementById('m-edu-degree').value.trim();
    edu.institution = document.getElementById('m-edu-inst').value.trim();
    edu.period = document.getElementById('m-edu-period').value.trim();
    edu.badge = document.getElementById('m-edu-badge').value.trim();
    edu.desc = document.getElementById('m-edu-desc').value.trim();

    saveSectionToBackend('education', currentPortfolioData.education, () => {
      renderAdminEducation();
      closeItemModal();
    });
  });
};

window.adminDeleteEducation = function adminDeleteEducation(id) {
  if (!confirm('Are you sure you want to delete this education entry?')) return;
  currentPortfolioData.education = (currentPortfolioData.education || []).filter(e => String(e.id) !== String(id));
  saveSectionToBackend('education', currentPortfolioData.education, () => {
    renderAdminEducation();
  });
};

/* ══════════════════════════════════════════════════════
   21. TOAST NOTIFICATION
══════════════════════════════════════════════════════ */
function showAdminToast(msg, isWarning = false) {
  const existing = document.getElementById('admin-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'admin-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem; right: 2rem;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: var(--font-head);
    z-index: 99999;
    backdrop-filter: blur(12px);
    border: 1px solid ${isWarning ? 'rgba(251,191,36,0.4)' : 'rgba(239,68,68,0.4)'};
    background: ${isWarning ? 'rgba(251,191,36,0.12)' : 'rgba(239,68,68,0.15)'};
    color: ${isWarning ? '#fbbf24' : '#ef4444'};
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    animation: toastIn 0.3s ease;
    max-width: 90vw;
  `;
  toast.textContent = msg;

  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = '@keyframes toastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }';
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

