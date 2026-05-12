/* ================================================================
   SHUBHAM RAJ PORTFOLIO v3 — script.js
   Features: Loader · Particles · Cursor · Magnetic · Tilt · Typed
             Scroll reveal · Skill bars · Counter · Marquee hover
             Project hover card · Noise canvas · Active nav
   ================================================================ */

/* ══════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const pct    = document.getElementById('loaderPct');
  const bar    = document.querySelector('.loader-bar');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) { progress = 100; clearInterval(interval); finish(); }
    pct.textContent = Math.floor(progress);
    if (bar) bar.style.setProperty('--w', progress + '%');
    if (bar && bar.querySelector) {
      const fill = bar.querySelector('::after');
    }
    // Direct style manipulation
    bar.style.background = `linear-gradient(90deg, var(--accent) ${progress}%, var(--dim) ${progress}%)`;
  }, 80);

  function finish() {
    setTimeout(() => {
      loader.classList.add('out');
      document.body.classList.remove('loading');
      setTimeout(() => { loader.style.display = 'none'; }, 700);
    }, 300);
  }
})();

/* ══════════════════════════════════════════════
   2. NOISE CANVAS
══════════════════════════════════════════════ */
(function initNoise() {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, animId;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawNoise() {
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 30;
    }
    ctx.putImageData(imageData, 0, 0);
    animId = requestAnimationFrame(drawNoise);
  }
  drawNoise();
})();

/* ══════════════════════════════════════════════
   3. PARTICLE SYSTEM
══════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], mouse = { x: -1000, y: -1000 };

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * w;
      this.y  = initial ? Math.random() * h : h + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.decay = Math.random() * 0.001 + 0.0005;
      this.color = Math.random() > 0.7 ? '#a8ff57' : Math.random() > 0.5 ? '#57e8ff' : '#ffffff';
    }
    update() {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.8;
        this.vx += (dx / dist) * force * 0.05;
        this.vy += (dy / dist) * force * 0.05;
      }
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      if (this.alpha <= 0 || this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ══════════════════════════════════════════════
   4. CUSTOM CURSOR
══════════════════════════════════════════════ */
(function initCursor() {
  const outer = document.getElementById('cursorOuter');
  const inner = document.getElementById('cursorInner');
  if (!outer || !inner) return;

  let mx = -100, my = -100, ox = -100, oy = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mousedown', () => outer.classList.add('click'));
  document.addEventListener('mouseup',   () => outer.classList.remove('click'));

  function animCursor() {
    ox += (mx - ox) * 0.1;
    oy += (my - oy) * 0.1;
    outer.style.left = ox + 'px';
    outer.style.top  = oy + 'px';
    inner.style.left = mx + 'px';
    inner.style.top  = my + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.querySelectorAll('a, button, .bento-card, .project-row, .mini-card, .stat-card, .cc-card, .social-pill, .pr-btn, .nav-cta, .btn-mag, .btn-outline, .contact-big-btn').forEach(el => {
    el.addEventListener('mouseenter', () => outer.classList.add('big'));
    el.addEventListener('mouseleave', () => outer.classList.remove('big'));
  });
})();

/* ══════════════════════════════════════════════
   5. CURSOR TRAIL
══════════════════════════════════════════════ */
(function initTrail() {
  const container = document.getElementById('trailContainer');
  if (!container) return;
  const TRAIL_COUNT = 12;
  const trail = [];

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed;width:${6 - i*0.3}px;height:${6 - i*0.3}px;
      border-radius:50%;pointer-events:none;z-index:9990;
      background:rgba(168,255,87,${0.4 - i*0.03});
      transform:translate(-50%,-50%);
      transition:left ${0.05 + i*0.02}s, top ${0.05 + i*0.02}s;
    `;
    container.appendChild(dot);
    trail.push(dot);
  }

  document.addEventListener('mousemove', e => {
    trail.forEach(d => { d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; });
  });
})();

/* ══════════════════════════════════════════════
   6. NAV
══════════════════════════════════════════════ */
(function initNav() {
  const nav  = document.getElementById('nav');
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      menu.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
})();

/* ══════════════════════════════════════════════
   7. TYPED TEXT
══════════════════════════════════════════════ */
(function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;
  const phrases = ['BTech CSE Student', 'Problem Solver', 'Excel Wizard', 'Code Enthusiast', 'Always Building'];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const cur = phrases[pi];
    el.textContent = deleting ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
    ci = deleting ? ci - 1 : ci + 1;
    if (!deleting && ci === cur.length) { deleting = true; setTimeout(type, 2200); return; }
    if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
    setTimeout(type, deleting ? 50 : 85);
  }
  setTimeout(type, 2000);
})();

/* ══════════════════════════════════════════════
   8. SCROLL REVEAL
══════════════════════════════════════════════ */
(function initReveal() {
  const selectors = [
    '.reveal-tag', '.reveal-heading', '.reveal-body', '.reveal-socials',
    '.reveal-card', '.reveal-mc', '.reveal-bento', '.reveal-project',
    '.reveal-edu', '.reveal-cc'
  ];
  const els = document.querySelectorAll(selectors.join(','));

  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('revealed'), 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  // Stagger siblings
  document.querySelectorAll('.skills-bento, .about-mini-cards, .contact-cards').forEach(parent => {
    const children = parent.querySelectorAll(selectors.join(','));
    children.forEach((child, i) => {
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  document.querySelectorAll('.projects-list .reveal-project').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  els.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════
   9. SKILL BAR ANIMATION
══════════════════════════════════════════════ */
(function initBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.bc-meter-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.bento-card').forEach(c => obs.observe(c));
})();

/* ══════════════════════════════════════════════
   10. COUNTER ANIMATION (hero stats)
══════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.hstat-n[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        const start = performance.now();
        const duration = 1400;
        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          e.target.textContent = Math.round(ease * target);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ══════════════════════════════════════════════
   11. MAGNETIC ELEMENTS
══════════════════════════════════════════════ */
(function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });
})();

/* ══════════════════════════════════════════════
   12. 3D TILT CARDS
══════════════════════════════════════════════ */
(function initTilt() {
  const tiltEls = document.querySelectorAll('#tiltCard1, #tiltCard2, #tiltCard3, #tiltEdu, .about-photo-card');
  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { el.style.transition = ''; }, 600);
    });
  });
})();

/* ══════════════════════════════════════════════
   13. PROJECT ROW HOVER IMAGE FOLLOWS CURSOR
══════════════════════════════════════════════ */
(function initProjectHover() {
  document.querySelectorAll('.project-row').forEach(row => {
    const hoverImg = row.querySelector('.pr-hover-img');
    if (!hoverImg) return;

    row.addEventListener('mousemove', e => {
      hoverImg.style.left = (e.clientX + 20) + 'px';
      hoverImg.style.top  = (e.clientY - 70) + 'px';
    });
  });
})();

/* ══════════════════════════════════════════════
   14. PARALLAX ON SCROLL (hero elements)
══════════════════════════════════════════════ */
(function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (bgText) bgText.style.transform = `translate(-50%, calc(-50% + ${sy * 0.3}px))`;
  });
})();

/* ══════════════════════════════════════════════
   15. MARQUEE PAUSE ON HOVER
══════════════════════════════════════════════ */
(function initMarquee() {
  const inner = document.getElementById('marqueeInner');
  if (!inner) return;
  const section = inner.closest('.marquee-section');
  if (section) {
    section.addEventListener('mouseenter', () => { inner.style.animationPlayState = 'paused'; });
    section.addEventListener('mouseleave', () => { inner.style.animationPlayState = 'running'; });
  }
})();

/* ══════════════════════════════════════════════
   16. SMOOTH SCROLL NAV
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════════════════════════════════════════
   17. PAGE TRANSITION LINKS (optional polish)
══════════════════════════════════════════════ */
(function initPageFade() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();