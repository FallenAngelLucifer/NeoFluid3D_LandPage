/**
 * NeoFluid3D - Core Web Interaction & Dynamic Visualizers Runtime
 * Hardware-Accelerated Procedural Fluid Canvases & UI Subsystems
 */

/* ── 2. Navigation Header Scroll State & Smooth Progress Bar ── */
(function setupNavigation() {
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');

  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
})();

/* ── 3. Helper for Dynamic High-Performance Canvases ── */
function setupDynamicCanvas(canvasId, drawFn) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let isVisible = true;
  let animationId = null;

  function render(time) {
    if (!isVisible) return;
    const w = canvas.width = canvas.offsetWidth || 300;
    const h = canvas.height = canvas.offsetHeight || 200;
    drawFn(ctx, w, h, time * 0.001);
    animationId = requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver((entries) => {
    const wasVisible = isVisible;
    isVisible = entries[0].isIntersecting;
    if (isVisible && !wasVisible) {
      animationId = requestAnimationFrame(render);
    }
  }, { threshold: 0.05 });

  observer.observe(canvas);
  animationId = requestAnimationFrame(render);
}

/* ── 4. Interactive Demos (Procedural Real-Time Canvases) ── */
// Demo 1: SPH Micro-Particles
setupDynamicCanvas('vfb-1', (ctx, w, h, t) => {
  ctx.fillStyle = '#060B0E';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;

  ctx.save();
  ctx.strokeStyle = '#00D2FF';
  ctx.lineWidth = 1.4;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00D2FF';
  ctx.beginPath();
  for (let p = 0; p <= 60; p++) {
    const a = (p / 60) * Math.PI * 2;
    const r = Math.min(w, h) * 0.35;
    const noise = 1 + Math.sin(a * 5 + t * 2) * 0.12 + Math.cos(a * 3 - t) * 0.08;
    const px = cx + Math.cos(a) * r * noise;
    const py = cy + Math.sin(a) * r * noise * 0.75;
    p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
});

// Demo 2: Surface Reconstruction
setupDynamicCanvas('vfb-2', (ctx, w, h, t) => {
  ctx.fillStyle = '#060B0E';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    const s = i * 137.5;
    const x = (Math.sin(s + t * 0.25) * 0.5 + 0.5) * w;
    const y = (Math.cos(s * 0.7 + t * 0.2) * 0.5 + 0.5) * h;
    const r = 1.8 + Math.sin(s + t) * 0.8;
    const a = 0.35 + Math.sin(s * 2 + t * 0.4) * 0.35;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = '#00D2FF';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00D2FF';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
});

// Demo 3: Vector Velocity Fields
setupDynamicCanvas('vfb-3', (ctx, w, h, t) => {
  ctx.fillStyle = '#060B0E';
  ctx.fillRect(0, 0, w, h);
  const cols = 14, rows = 8;
  const dx = w / cols, dy = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = dx * (c + 0.5), y = dy * (r + 0.5);
      const angle = Math.sin(x * 0.04 + t * 0.5) * Math.PI + Math.cos(y * 0.04 - t * 0.3) * 0.6;
      const spd = Math.abs(Math.sin(x * 0.05 + y * 0.04 + t));
      const len = 6 + spd * 12;
      const ex = x + Math.cos(angle) * len;
      const ey = y + Math.sin(angle) * len;
      const color = spd > 0.5 ? '#00D2FF' : '#00E599';
      ctx.save();
      ctx.globalAlpha = 0.45 + spd * 0.45;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.1;
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();
    }
  }
});

/* ── 5. Mode Inspection Canvases (The 6 Official Analytical Modes) ── */

// [Mode 1] Partículas Discretas: Spherical GPU particles with velocity/pressure shading
setupDynamicCanvas('mc-p1', (ctx, w, h, t) => {
  ctx.fillStyle = '#05090C';
  ctx.fillRect(0, 0, w, h);
  const count = 95;
  const cx = w / 2, cy = h / 2;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + t * 0.35;
    const dist = ((i * 11.7 + t * 40) % (Math.min(w, h) * 0.46));
    const x = cx + Math.cos(angle) * dist + Math.sin(t * 1.5 + i) * 8;
    const y = cy + Math.sin(angle) * dist * 0.72 + Math.cos(t * 1.2 + i) * 6;
    const alpha = Math.max(0.15, 1 - dist / (Math.min(w, h) * 0.46));
    const radius = 2.4 + Math.sin(i * 0.5 + t) * 0.8;
    const isHighSpeed = i % 4 === 0;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = isHighSpeed ? '#00D2FF' : '#00E599';
    ctx.shadowBlur = 8;
    ctx.shadowColor = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
});

// [Mode 2] Red de Cohesión (Plexus): Neighbor search & smoothing kernel topology
setupDynamicCanvas('mc-p2', (ctx, w, h, t) => {
  ctx.fillStyle = '#05090C';
  ctx.fillRect(0, 0, w, h);
  const nodes = [];
  const nodeCount = 38;
  const cx = w / 2, cy = h / 2;
  for (let i = 0; i < nodeCount; i++) {
    const a = (i / nodeCount) * Math.PI * 2 + t * 0.2;
    const r = 20 + ((i * 19 + t * 18) % (Math.min(w, h) * 0.42));
    nodes.push({
      x: cx + Math.cos(a + Math.sin(t * 0.8 + i) * 0.3) * r,
      y: cy + Math.sin(a + Math.cos(t * 0.7 + i) * 0.3) * r * 0.75
    });
  }
  const maxDist = Math.min(w, h) * 0.22;
  // Draw connecting cohesion bonds
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < maxDist) {
        ctx.save();
        ctx.globalAlpha = (1 - d / maxDist) * 0.55;
        ctx.strokeStyle = '#00D2FF';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
  // Draw particles
  nodes.forEach(n => {
    ctx.save();
    ctx.fillStyle = '#00E599';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#00E599';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
});

// [Mode 3] Malla Superficie Continua: Reconstructed fluid isosurfaces
setupDynamicCanvas('mc-p3', (ctx, w, h, t) => {
  ctx.fillStyle = '#04080B';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  for (let i = 1; i <= 8; i++) {
    const baseR = (i / 9) * Math.min(w, h) * 0.52;
    ctx.save();
    ctx.globalAlpha = 0.12 + (i / 9) * 0.45;
    ctx.strokeStyle = i % 2 === 0 ? '#00D2FF' : '#00E599';
    ctx.lineWidth = 1.6;
    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.beginPath();
    for (let p = 0; p <= 72; p++) {
      const a = (p / 72) * Math.PI * 2;
      const wave = Math.sin(a * 5 + t * 1.1 + i * 0.7) * 0.12 + Math.cos(a * 3 - t * 0.8) * 0.08;
      const px = cx + Math.cos(a) * baseR * (1 + wave);
      const py = cy + Math.sin(a) * baseR * (1 + wave) * 0.72;
      p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
});

// [Mode 4] Campo Vectorial 3D: Directional and magnitude vector arrows
setupDynamicCanvas('mc-p4', (ctx, w, h, t) => {
  ctx.fillStyle = '#05090C';
  ctx.fillRect(0, 0, w, h);
  const cols = 15, rows = 9;
  const dx = w / cols, dy = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = dx * (c + 0.5), y = dy * (r + 0.5);
      const angle = Math.sin(x * 0.035 + t * 0.8) * Math.PI + Math.cos(y * 0.04 - t * 0.5) * 0.8;
      const speed = Math.abs(Math.sin(x * 0.04 + y * 0.03 + t * 0.9));
      const len = 5 + speed * 12;
      const ex = x + Math.cos(angle) * len;
      const ey = y + Math.sin(angle) * len;
      const col = speed > 0.55 ? '#00D2FF' : '#00E599';

      ctx.save();
      ctx.globalAlpha = 0.4 + speed * 0.55;
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ex, ey);
      // Arrowhead
      const headLen = 3;
      ctx.lineTo(ex - headLen * Math.cos(angle - 0.5), ey - headLen * Math.sin(angle - 0.5));
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - headLen * Math.cos(angle + 0.5), ey - headLen * Math.sin(angle + 0.5));
      ctx.stroke();
      ctx.restore();
    }
  }
});

// [Mode 5] Líneas de Corriente: Continuous kinetic streamlines
setupDynamicCanvas('mc-p5', (ctx, w, h, t) => {
  ctx.fillStyle = '#04080B';
  ctx.fillRect(0, 0, w, h);
  const lineCount = 18;
  for (let i = 0; i < lineCount; i++) {
    const yBase = (i / (lineCount - 1)) * (h - 20) + 10;
    const speed = 0.6 + (i % 3) * 0.25;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = i % 2 === 0 ? '#00D2FF' : '#00E599';
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.35 + (i % 4) * 0.15;
    ctx.shadowBlur = 8;
    ctx.shadowColor = ctx.strokeStyle;

    for (let x = 0; x <= w; x += 12) {
      const wave1 = Math.sin(x * 0.02 + t * speed + i) * 14;
      const wave2 = Math.cos(x * 0.04 - t * 0.5 + i * 0.5) * 6;
      const y = yBase + wave1 + wave2;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
});

// [Mode 6] Mapa Térmico CFD: Scientific Jet colormap (0% laminar blue -> 100% turbulent red)
setupDynamicCanvas('mc-p6', (ctx, w, h, t) => {
  ctx.fillStyle = '#04070A';
  ctx.fillRect(0, 0, w, h);
  const cols = 20, rows = 12;
  const dx = w / cols, dy = h / rows;

  // Function to compute Jet colormap
  function jetColor(v, alpha) {
    // v in [0, 1]
    const fourV = 4 * v;
    const r = Math.min(Math.max(Math.min(fourV - 1.5, -fourV + 4.5), 0), 1);
    const g = Math.min(Math.max(Math.min(fourV - 0.5, -fourV + 3.5), 0), 1);
    const b = Math.min(Math.max(Math.min(fourV + 0.5, -fourV + 2.5), 0), 1);
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const xNorm = c / cols;
      const yNorm = r / rows;
      // Synthesize a fluid jet vortex flow
      const v1 = Math.sin(xNorm * 6 + t * 0.9) * Math.cos(yNorm * 5 - t * 0.7);
      const v2 = Math.sin(Math.hypot(xNorm - 0.5, yNorm - 0.5) * 8 - t * 1.2);
      const scalar = (v1 + v2 + 2) / 4; // normalized [0, 1]
      ctx.fillStyle = jetColor(scalar, 0.75);
      ctx.fillRect(dx * c, dy * r, dx + 0.5, dy + 0.5);
    }
  }

  // Draw subtle contour grid
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 0.5;
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * dx, 0);
    ctx.lineTo(c * dx, h);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * dy);
    ctx.lineTo(w, r * dy);
    ctx.stroke();
  }
  ctx.restore();
});

/* ── 6. UI Toast Subsystem ── */
function showToast(msg) {
  const toast = document.getElementById('ui-toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

/* ── 7. Safe Contact Form Handler ── */
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name')?.value || 'Contacto';
  showToast(`Solicitud recibida para ${name}. Nos pondremos en contacto.`);
  const form = document.getElementById('contact-form');
  if (form) form.reset();
}

/* ── 8. Safe Smooth Anchor Scroll Interceptor (Zero file:/// CORS/Origin Warnings) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 9. Scroll Reveal Observer ── */
(function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── 10. Guaranteed Global KaTeX Math Typesetter Subsystem ── */
function renderAllMathOnPage() {
  if (typeof renderMathInElement === 'function') {
    try {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option", "svg", "canvas"]
      });
      return true;
    } catch (e) {
      console.warn("KaTeX renderMathInElement error:", e);
    }
  }

  // Fallback: Direct text-node search and KaTeX string rendering
  if (window.katex && typeof katex.renderToString === 'function') {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let curr;
    while ((curr = walker.nextNode())) {
      if (curr.nodeValue && curr.nodeValue.includes('$')) {
        const parent = curr.parentElement;
        if (parent && !['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'CANVAS', 'TEXTAREA'].includes(parent.tagName) && !parent.classList.contains('katex')) {
          textNodes.push(curr);
        }
      }
    }

    textNodes.forEach(node => {
      const text = node.nodeValue;
      if (!text || !text.includes('$')) return;
      const parent = node.parentNode;
      if (!parent) return;

      const hasDisplay = /\$\$([^$]+)\$\$/.test(text);
      const hasInline = /\$([^$]+)\$/.test(text);
      if (!hasDisplay && !hasInline) return;

      const span = document.createElement('span');
      span.className = 'math-rendered-span';
      let replaced = text
        .replace(/\$\$([^$]+)\$\$/g, (_, latex) => {
          try {
            return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false });
          } catch(err) { return `$$${latex}$$`; }
        })
        .replace(/\$([^$]+)\$/g, (_, latex) => {
          try {
            return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false });
          } catch(err) { return `$${latex}$`; }
        });

      span.innerHTML = replaced;
      parent.replaceChild(span, node);
    });
    return true;
  }
  return false;
}

// Automatic Polling to Guarantee Full KaTeX Math Typesetting
(function initMathAutoRender() {
  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    const ok = renderAllMathOnPage();
    if (ok || attempts > 60) {
      clearInterval(timer);
    }
  }, 50);

  window.addEventListener('load', renderAllMathOnPage);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderAllMathOnPage();
  } else {
    document.addEventListener('DOMContentLoaded', renderAllMathOnPage);
  }
})();

/* ── 11. Click-to-Copy Official Color HEX Swatches ── */
(function setupColorSwatchesCopy() {
  document.querySelectorAll('.swatch-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.setAttribute('title', 'Haz clic para copiar el código HEX');
    card.addEventListener('click', () => {
      const hex = card.querySelector('.swatch-hex')?.textContent?.trim();
      if (hex) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(hex).then(() => {
            showToast(`Color ${hex} copiado al portapapeles`);
          }).catch(() => {
            showToast(`Color oficial: ${hex}`);
          });
        } else {
          showToast(`Color oficial: ${hex}`);
        }
      }
    });
  });
})();

/* ── 12. Interactive Master Lockup Inspection ── */
(function setupMasterLockupHover() {
  const lockupNeo = document.querySelector('.lockup-neo');
  const lockupFluid3d = document.querySelector('.lockup-fluid3d');
  const baselineTag = document.querySelector('.baseline-tag');

  if (!baselineTag) return;
  const originalHtml = baselineTag.innerHTML;

  if (lockupNeo) {
    lockupNeo.style.cursor = 'pointer';
    lockupNeo.addEventListener('mouseenter', () => {
      baselineTag.innerHTML = '<span style="color:#00D2FF; font-weight:700;">PREFIJO NEO:</span> CIENCIA & FLUIDO CONTINUO (#00D2FF)';
    });
    lockupNeo.addEventListener('mouseleave', () => {
      baselineTag.innerHTML = originalHtml;
    });
  }

  if (lockupFluid3d) {
    lockupFluid3d.style.cursor = 'pointer';
    lockupFluid3d.addEventListener('mouseenter', () => {
      baselineTag.innerHTML = '<span style="color:#00E599; font-weight:700;">PALABRA FLUID³D:</span> CÓMPUTO PARALELO EN GPU & 3D (#00E599)';
    });
    lockupFluid3d.addEventListener('mouseleave', () => {
      baselineTag.innerHTML = originalHtml;
    });
  }
})();

/* ── 13. Blueprint Card Rule Interactive Highlights ── */
(function setupBlueprintInteractions() {
  document.querySelectorAll('.blueprint-rule-item').forEach(item => {
    item.style.cursor = 'default';
    item.addEventListener('mouseenter', () => {
      item.style.borderColor = 'rgba(0, 210, 255, 0.45)';
      item.style.background = 'rgba(0, 210, 255, 0.04)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.borderColor = '';
      item.style.background = '';
    });
  });
})();

/* ── 14. Interactive Core Architecture Inspection Subsystem ── */
(function setupCoreArchitectureInteraction() {
  const layerBoxes = document.querySelectorAll('.arch-layer-box');
  if (!layerBoxes || layerBoxes.length === 0) return;

  const layerMessages = {
    '1': 'Capa 01: Inyección de mallas de colisión y constantes físicas globales',
    '2': 'Capa 02: Memoria de partículas 100% contigua en VRAM (Zero-PCIe latency)',
    '3': 'Capa 03: Núcleo SPH autónomo resolviendo gradientes de presión y viscosidad',
    '4': 'Capa 04: Extracción geométrica de isosuperficies y desacoplamiento de render'
  };

  layerBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const layerId = box.getAttribute('data-layer');
      layerBoxes.forEach(b => b.classList.remove('active'));
      box.classList.add('active');
      if (layerMessages[layerId]) {
        showToast(layerMessages[layerId]);
      }
    });
  });
})();



/* ── 16. Presentation Interactive Deck Launcher (Zero Block Guarantee) ── */
(function setupDeckLauncher() {
  const launchBtn = document.getElementById('btn-open-deck-genesis');
  if (launchBtn) {
    launchBtn.addEventListener('click', (e) => {
      // Allow natural anchor navigation, but enforce fallback in local file:/// scenarios
      try {
        const opened = window.open('presentation/index.html#slide-3', '_blank');
        if (opened) {
          e.preventDefault();
        }
      } catch (err) {}
    });
  }
})();
