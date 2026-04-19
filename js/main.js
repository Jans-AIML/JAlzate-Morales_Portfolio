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

// ===== HERO CANVAS — DNA + NEURAL NETWORK HYBRID BACKGROUND =====
(function initCanvas() {
  try {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W, H, animFrame, time = 0;
    
    const CONFIG = {
      dnaHelices: 3,        // Multiple DNA strands
      neuronsPerLayer: 15,
      layers: 3,
      speed: 0.0003,        // Very slow motion
    };

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function drawDNAHelix(x, startY, length, rotation, hue, time) {
      const turns = 4;
      const spacing = length / (turns * 100);
      
      ctx.save();
      ctx.translate(x, startY);
      ctx.rotate(rotation);
      
      // Left and right strands of DNA
      for (let i = 0; i < length; i += spacing) {
        const angle = (i / length) * Math.PI * 2 * turns + time;
        const radius = 40;
        
        // Left strand (blue hue)
        const x1 = Math.cos(angle) * radius;
        const y1 = i;
        ctx.beginPath();
        ctx.arc(x1, y1, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 85%, 55%, 0.6)`;
        ctx.fill();
        
        // Right strand (purple/magenta hue)
        const x2 = Math.cos(angle + Math.PI) * radius;
        const y2 = i;
        ctx.beginPath();
        ctx.arc(x2, y2, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue + 80}, 80%, 60%, 0.6)`;
        ctx.fill();
        
        // Connecting rungs (like DNA crossbars)
        if (i % (spacing * 5) === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(${hue + 40}, 70%, 50%, 0.4)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      
      ctx.restore();
    }

    function drawNeuralNetwork(startX, startY, size, time) {
      const nodeRadius = 4;
      const nodes = [];
      
      // Create neural network layers
      for (let layer = 0; layer < CONFIG.layers; layer++) {
        const layerX = startX + (layer * size) / CONFIG.layers;
        const layerY = startY - size / 2;
        
        for (let i = 0; i < CONFIG.neuronsPerLayer; i++) {
          const y = layerY + (i * size) / CONFIG.neuronsPerLayer;
          
          // Pulsing effect
          const pulse = 0.8 + 0.2 * Math.sin(time + i * 0.2);
          
          // Draw neuron
          ctx.beginPath();
          ctx.arc(layerX, y, nodeRadius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(270, 85%, 55%, ${0.7 * pulse})`;
          ctx.fill();
          
          // Glow effect
          ctx.beginPath();
          ctx.arc(layerX, y, nodeRadius * pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(270, 80%, 60%, ${0.3 * pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          nodes.push({ x: layerX, y: y, layer: layer, index: i });
        }
      }
      
      // Draw synaptic connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          
          // Only connect nearby neurons
          if (Math.abs(n1.layer - n2.layer) === 1 && Math.abs(n1.index - n2.index) <= 2) {
            const dist = Math.sqrt(Math.pow(n2.x - n1.x, 2) + Math.pow(n2.y - n1.y, 2));
            const opacity = Math.max(0, 0.5 - dist / 200);
            
            if (opacity > 0) {
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = `hsla(280, 75%, 58%, ${opacity * 0.4})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }
    }

    function draw() {
      // Clear canvas with subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, W, H);
      gradient.addColorStop(0, 'rgba(10, 15, 35, 0.98)');
      gradient.addColorStop(1, 'rgba(15, 10, 30, 0.98)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
      
      time += CONFIG.speed;
      
      // Draw DNA helices at different angles
      drawDNAHelix(W * 0.2, H * 0.5, H * 0.8, -0.3, 200, time);
      drawDNAHelix(W * 0.5, H * 0.5, H * 0.8, 0, 160, time * 0.7);
      drawDNAHelix(W * 0.8, H * 0.5, H * 0.8, 0.3, 130, time * 0.5);
      
      // Draw neural networks
      drawNeuralNetwork(W * 0.15, H * 0.3, H * 0.5, time * 2);
      drawNeuralNetwork(W * 0.65, H * 0.4, H * 0.4, time * 1.5);
      
      animFrame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
    console.log('✓ DNA + Neural Network hybrid background initialized');
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
