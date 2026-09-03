/**
 * NeoFluid3D - Vertical 3D Navigation Plexus & Scroll-Spy Engine
 * Fluid Particle Canvas & Multi-Section Real-Time Tracking
 */
(function setupVertical3DPlexus() {
  const container = document.getElementById('vertical-plexus-container');
  const canvas = document.getElementById('vertical-plexus-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  const nodeItems = document.querySelectorAll('.plexus-node-item');
  const sectionIds = ['hero', 'vision', 'demos', 'benchmarks', 'sdk', 'modes', 'possibilities', 'roadmap', 'brand', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  let cachedDots = [];
  let dpr = window.devicePixelRatio || 1;

  function cacheNodePositions() {
    if (window.innerWidth <= 1024) return;
    const cr = container.getBoundingClientRect();
    cachedDots = [];
    nodeItems.forEach(item => {
      const dotEl = item.querySelector('.plexus-node-dot');
      if (dotEl) {
        const r = dotEl.getBoundingClientRect();
        cachedDots.push({
          x: r.left - cr.left + r.width / 2,
          y: r.top - cr.top + r.height / 2,
          active: item.classList.contains('active'),
          item: item
        });
      }
    });
  }

  function resizeCanvas() {
    if (window.innerWidth <= 1024) return;
    const w = container.offsetWidth || 55;
    const h = container.offsetHeight || 500;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    cacheNodePositions();
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  setTimeout(resizeCanvas, 150);

  // 3D Organic Fluid Particles (Calm Sea Wave Drift)
  const numParticles = 24;
  const particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: 15 + Math.random() * 25,
      y: Math.random() * 500,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.25,
      radius: 1.2 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      baseSpeed: 0.008 + Math.random() * 0.012
    });
  }

  let lastScrollY = window.scrollY;
  let scrollSpeedAcc = 0;

  function updatePlexus() {
    if (window.innerWidth <= 1024) {
      requestAnimationFrame(updatePlexus);
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    // Linear subtle acceleration with smooth decay (no tilt)
    scrollSpeedAcc = scrollSpeedAcc * 0.90 + scrollDelta * 0.02;

    const w = container.offsetWidth || 55;
    const h = container.offsetHeight || 500;
    ctx.clearRect(0, 0, w, h);

    const now = performance.now() * 0.001;

    // Update and draw particles
    particles.forEach(p => {
      p.phase += p.baseSpeed + scrollSpeedAcc * 0.02;
      p.y += p.vy + Math.sin(p.phase) * 0.35;
      p.x += p.vx + Math.cos(p.phase * 0.7) * 0.2;

      // Wrap around bounds
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      if (p.x < 5) p.x = w - 5;
      if (p.x > w - 5) p.x = 5;

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 210, 255, 0.45)';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00D2FF';
      ctx.fill();
      ctx.restore();
    });

    // Particle-to-Particle Interconnections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 48) {
          const alpha = (1 - dist / 48) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Connect Active/Nearby Nodes to Particles
    cachedDots.forEach(dot => {
      particles.forEach(p => {
        const dx = dot.x - p.x;
        const dy = dot.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 55) {
          const alpha = (1 - dist / 55) * (dot.active ? 0.45 : 0.15);
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = dot.active ? `rgba(0, 229, 153, ${alpha})` : `rgba(0, 210, 255, ${alpha})`;
          ctx.lineWidth = dot.active ? 1.0 : 0.6;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(updatePlexus);
  }

  requestAnimationFrame(updatePlexus);

  // Scroll-Spy Handler (Highlight Active Node 01-09)
  function handleScrollSpy() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = 'hero';

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.id;
      }
    });

    // Handle top/bottom boundary conditions
    if (window.scrollY < 100) {
      currentId = 'hero';
    } else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
      currentId = sections[sections.length - 1]?.id || currentId;
    }

    nodeItems.forEach(item => {
      const secName = item.getAttribute('data-sec');
      const isActive = (secName === currentId);
      item.classList.toggle('active', isActive);
    });

    cacheNodePositions();
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  setTimeout(handleScrollSpy, 200);
})();
