/* ============================================================
   JANS ALZATE-MORALES — Portfolio Main JavaScript
   ============================================================ */

'use strict';

// ===== NAVBAR SCROLL BEHAVIOUR =====
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  backTop.classList.toggle('visible', window.scrollY > 400);
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ===== HERO CANVAS — PARTICLE NETWORK =====
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animFrame;

  const CONFIG = {
    count:      80,
    speed:      0.35,
    radius:     2,
    lineRange:  140,
    colorNode:  'rgba(0, 212, 255, 0.55)',
    colorLine:  'rgba(0, 212, 255, ',
    colorSec:   'rgba(124, 58, 237, 0.4)',
  };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = Array.from({ length: CONFIG.count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r:  Math.random() * CONFIG.radius + 0.8,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.85 ? CONFIG.colorSec : CONFIG.colorNode;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.lineRange) {
          const opacity = (1 - dist / CONFIG.lineRange) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = CONFIG.colorLine + opacity + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ===== TYPED TEXT EFFECT =====
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Computational Chemist',
    'Bioinformatics Researcher',
    'AI/ML Practitioner',
    'Associate Professor',
    'Drug Discovery Scientist',
    'Data Science Enthusiast',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let pauseTimer = null;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    clearTimeout(pauseTimer);
    const delay = deleting ? 55 : 90;
    pauseTimer  = setTimeout(type, delay);
  }

  setTimeout(type, 800);
})();

// ===== ANIMATED NUMBER COUNTERS =====
function animateCounter(el, target, duration) {
  const start     = performance.now();
  const startVal  = 0;

  function update(ts) {
    const elapsed  = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = Math.round(startVal + (target - startVal) * ease);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER — shared =====
const sharedObserverOptions = {
  threshold:  0.15,
  rootMargin: '0px 0px -50px 0px',
};

// Reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, sharedObserverOptions);

document.querySelectorAll('.reveal, .timeline-item').forEach(el => revealObserver.observe(el));

// Skill bars animation
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// Counter animation for hero & research stats
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(numEl => {
        const target = parseInt(numEl.getAttribute('data-target'), 10);
        animateCounter(numEl, target, 1800);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .research-impact').forEach(el => counterObserver.observe(el));

// ===== EXPERIENCE TABS =====
const tabBtns  = document.querySelectorAll('.tab-btn');
const tabWork  = document.getElementById('tab-work');
const tabEdu   = document.getElementById('tab-education');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.getAttribute('data-tab');
    if (target === 'work') {
      tabWork.classList.remove('hidden');
      tabEdu.classList.add('hidden');
    } else {
      tabEdu.classList.remove('hidden');
      tabWork.classList.add('hidden');
    }
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== CONTACT FORM (mailto fallback) =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    const subjectLine = encodeURIComponent(
      `[Portfolio Contact] ${subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'Message'} from ${name}`
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:jalzatemorales@gmail.com?subject=${subjectLine}&body=${body}`;
  });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
