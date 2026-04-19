/* ============================================================
   JANS ALZATE-MORALES — Portfolio Main JavaScript
   Updated: April 18, 2026 (Hybrid Canvas + GSS Co-op)
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

// ===== HERO CANVAS — ZONED BACKGROUND: CHEMISTRY | BIOLOGY | AI/ML =====
(function initCanvas() {
  try {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W, H, animFrame, time = 0;
    
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    // ===== CHEMISTRY ZONE (Left) =====
    function drawChemistry(time) {
      const zones = { x: 0, width: W / 3 };
      const gradient = ctx.createLinearGradient(zones.x, 0, zones.x + zones.width, 0);
      gradient.addColorStop(0, 'rgba(15, 25, 50, 0.95)');
      gradient.addColorStop(1, 'rgba(20, 30, 55, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(zones.x, 0, zones.width, H);

      // Molecular structures: simple hexagons (benzene rings)
      const moleculeY = H / 2 + Math.sin(time * 0.5) * 20;
      const molecules = [
        { x: zones.width * 0.25, y: moleculeY - 100, size: 25, rotation: time * 0.3 },
        { x: zones.width * 0.75, y: moleculeY + 80, size: 30, rotation: time * 0.2 },
      ];

      molecules.forEach(mol => {
        ctx.save();
        ctx.translate(mol.x, mol.y);
        ctx.rotate(mol.rotation);
        
        // Draw hexagon (benzene ring)
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * mol.size;
          const y = Math.sin(angle) * mol.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsla(200, 100%, 60%, 0.6)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Atoms at vertices
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * mol.size;
          const y = Math.sin(angle) * mol.size;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(200, 90%, 65%, 0.7)`;
          ctx.fill();
        }
        
        ctx.restore();
      });

      // Floating single atoms (electrons)
      for (let i = 0; i < 8; i++) {
        const x = zones.x + Math.random() * zones.width;
        const y = H * 0.2 + Math.sin(time * 0.4 + i) * H * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(160, 85%, 50%, ${0.4 + 0.2 * Math.sin(time + i)})`;
        ctx.fill();
      }
    }

    // ===== BIOLOGY ZONE (Center) =====
    function drawBiology(time) {
      const zones = { x: W / 3, width: W / 3 };
      const gradient = ctx.createLinearGradient(zones.x, 0, zones.x + zones.width, 0);
      gradient.addColorStop(0, 'rgba(20, 30, 55, 0.85)');
      gradient.addColorStop(0.5, 'rgba(25, 35, 50, 0.9)');
      gradient.addColorStop(1, 'rgba(20, 30, 55, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(zones.x, 0, zones.width, H);

      // Organic flowing shapes (like cells or organisms)
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const progress = i / 100;
        const x = zones.x + zones.width * progress;
        const y = H / 2 + Math.sin(progress * Math.PI * 3 + time * 0.6) * 60 + 
                  Math.cos(progress * Math.PI * 2 + time * 0.4) * 40;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(130, 75%, 55%, 0.5)`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Secondary flowing line
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const progress = i / 100;
        const x = zones.x + zones.width * progress;
        const y = H / 2 - Math.sin(progress * Math.PI * 2.5 + time * 0.5) * 50 + 
                  Math.cos(progress * Math.PI * 3 + time * 0.3) * 35;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(160, 80%, 50%, 0.4)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pulsing cell-like structures
      const cellCount = 4;
      for (let i = 0; i < cellCount; i++) {
        const cellX = zones.x + zones.width * (0.2 + i * 0.2);
        const cellY = H / 2 + Math.sin(time * 0.4 + i * 1.5) * 80;
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.5 + i);
        
        ctx.beginPath();
        ctx.arc(cellX, cellY, 20 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(150, 70%, 60%, ${0.5 * pulse})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // ===== AI/ML ZONE (Right) =====
    function drawAIMath(time) {
      const zones = { x: (W * 2) / 3, width: W / 3 };
      const gradient = ctx.createLinearGradient(zones.x, 0, zones.x + zones.width, 0);
      gradient.addColorStop(0, 'rgba(20, 30, 55, 0.85)');
      gradient.addColorStop(1, 'rgba(15, 20, 45, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(zones.x, 0, zones.width, H);

      // Neural network nodes in grid
      const gridX = 4, gridY = 4;
      const nodeSize = zones.width / (gridX + 1);
      const nodeYSize = H / (gridY + 1);
      const nodes = [];

      for (let gx = 1; gx <= gridX; gx++) {
        for (let gy = 1; gy <= gridY; gy++) {
          const x = zones.x + nodeSize * gx;
          const y = nodeYSize * gy;
          
          const pulse = 0.6 + 0.4 * Math.sin(time * 0.7 + gx * 0.3 + gy * 0.2);
          
          // Draw node
          ctx.beginPath();
          ctx.arc(x, y, 5 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(270, 100%, 60%, ${0.7 * pulse})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(x, y, 10 * pulse, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(270, 90%, 65%, ${0.2 * pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          nodes.push({ x, y });
        }
      }

      // Connect nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < nodeSize * 1.2 && dist > 0) {
            const opacity = Math.max(0, 0.4 - dist / (nodeSize * 2));
            
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `hsla(280, 80%, 55%, ${opacity * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Data flow lines
      for (let i = 0; i < 3; i++) {
        const flowY = H * (0.2 + i * 0.3) + Math.sin(time * 0.6 + i) * 20;
        ctx.beginPath();
        ctx.moveTo(zones.x, flowY);
        ctx.lineTo(zones.x + zones.width, flowY);
        ctx.strokeStyle = `hsla(260, 75%, 50%, ${0.2 + 0.1 * Math.sin(time + i)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    function draw() {
      time += 0.016; // ~60fps
      
      // Draw all three zones
      drawChemistry(time);
      drawBiology(time);
      drawAIMath(time);

      animFrame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
    console.log('✓ Zoned background: Chemistry | Biology | AI/ML initialized');
  } catch (error) {
    console.error('Canvas error:', error);
  }
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

// ===== PUBLICATION YEAR FILTERS =====
const pubFilterBtns = document.querySelectorAll('.pub-filter-btn');
const pubCards      = document.querySelectorAll('.pub-card');

pubFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pubFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    pubCards.forEach(card => {
      const year = card.getAttribute('data-year');
      const show = filter === 'all' || year === filter;
      card.classList.toggle('pub-hidden', !show);
    });
  });
});

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
