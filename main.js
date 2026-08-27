/**
 * NeoFluid3D - Core Web Interaction & Dynamic Visualizers Runtime
 * Hardware-Accelerated Procedural Fluid Canvases & UI Subsystems
 */

/* ── 1. Smooth Hardware-Accelerated Fluid Cursor ── */
(function setupCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;
  let isSleeping = true;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (isSleeping) {
      isSleeping = false;
      requestAnimationFrame(loopCursor);
    }
  }, { passive: true });

  function loopCursor() {
    const dDx = (mouseX - dotX) * 0.45;
    const dDy = (mouseY - dotY) * 0.45;
    const rDx = (mouseX - ringX) * 0.16;
    const rDy = (mouseY - ringY) * 0.16;

    dotX += dDx;
    dotY += dDy;
    ringX += rDx;
    ringY += rDy;

    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    if (Math.abs(dDx) < 0.15 && Math.abs(dDy) < 0.15 && Math.abs(rDx) < 0.15 && Math.abs(rDy) < 0.15) {
      isSleeping = true;
      return;
    }

    requestAnimationFrame(loopCursor);
  }
})();

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
  ctx.fillStyle = '#020608';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;

  ctx.save();
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00F0FF';
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
  ctx.fillStyle = '#020607';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    const s = i * 137.5;
    const x = (Math.sin(s + t * 0.25) * 0.5 + 0.5) * w;
    const y = (Math.cos(s * 0.7 + t * 0.2) * 0.5 + 0.5) * h;
    const r = 1.8 + Math.sin(s + t) * 0.8;
    const a = 0.35 + Math.sin(s * 2 + t * 0.4) * 0.35;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = '#00F0FF';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00F0FF';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
});

// Demo 3: Vector Velocity Fields
setupDynamicCanvas('vfb-3', (ctx, w, h, t) => {
  ctx.fillStyle = '#020708';
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
      const color = spd > 0.5 ? '#00F0FF' : '#39FF14';
      ctx.save();
      ctx.globalAlpha = 0.45 + spd * 0.45;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
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

/* ── 5. Mode Inspection Canvases (Analytical Previews) ── */
setupDynamicCanvas('mc-p1', (ctx, w, h, t) => {
  ctx.fillStyle = '#030809';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  for (let i = 1; i <= 9; i++) {
    const r = (i / 10) * Math.min(w, h) * 0.5;
    ctx.save();
    ctx.globalAlpha = 0.08 + (i / 10) * 0.3;
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.4;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#00F0FF';
    ctx.beginPath();
    for (let p = 0; p <= 90; p++) {
      const a = (p / 90) * Math.PI * 2;
      const n1 = Math.sin(a * 4 + t * 0.7 + i) * 0.1;
      const n2 = Math.cos(a * 6 - t * 0.5 + i * 1.2) * 0.06;
      const px = cx + Math.cos(a) * r * (1 + n1 + n2);
      const py = cy + Math.sin(a) * r * (1 + n1 + n2) * 0.72;
      p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
});

setupDynamicCanvas('mc-p2', (ctx, w, h, t) => {
  ctx.fillStyle = '#020506';
  ctx.fillRect(0, 0, w, h);
  const count = 90;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + t * 0.25;
    const r = ((i * 7.3 + t * 25) % (Math.min(w, h) * 0.55));
    const x = w / 2 + Math.cos(a) * r;
    const y = h / 2 + Math.sin(a) * r * 0.65;
    const alpha = 1 - r / (Math.min(w, h) * 0.55);
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha * 0.85);
    ctx.fillStyle = i % 3 === 0 ? '#00F0FF' : '#39FF14';
    ctx.shadowBlur = 6;
    ctx.shadowColor = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
});

setupDynamicCanvas('mc-p3', (ctx, w, h, t) => {
  ctx.fillStyle = '#020608';
  ctx.fillRect(0, 0, w, h);
  const cols = 22, rows = 12;
  const dx = w / cols, dy = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = dx * (c + 0.5), y = dy * (r + 0.5);
      const val = Math.sin(x * 0.035 + t * 0.9) * Math.cos(y * 0.045 - t * 0.7);
      const intensity = (val + 1) / 2;
      ctx.fillStyle = `rgba(0, 240, 255, ${intensity * 0.45})`;
      ctx.fillRect(dx * c + 1, dy * r + 1, dx - 2, dy - 2);
    }
  }
});

setupDynamicCanvas('mc-p4', (ctx, w, h, t) => {
  ctx.fillStyle = '#010405';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  ctx.save();
  ctx.strokeStyle = '#39FF14';
  ctx.lineWidth = 1.4;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#39FF14';
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const r = (i + 1) * 16;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
  ctx.stroke();
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
      baselineTag.innerHTML = '<span style="color:#00F0FF; font-weight:700;">PREFIJO NEO:</span> POPPINS 900 • CIAN FLUIDO (AGUA & FLUIDEZ)';
    });
    lockupNeo.addEventListener('mouseleave', () => {
      baselineTag.innerHTML = originalHtml;
    });
  }

  if (lockupFluid3d) {
    lockupFluid3d.style.cursor = 'pointer';
    lockupFluid3d.addEventListener('mouseenter', () => {
      baselineTag.innerHTML = '<span style="color:#39FF14; font-weight:700;">PALABRA FLUID³D:</span> JETBRAINS MONO 700 • VERDE GPU (TERMINAL & 3D)';
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
      item.style.borderColor = 'rgba(0, 240, 255, 0.45)';
      item.style.background = 'rgba(0, 240, 255, 0.04)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.borderColor = '';
      item.style.background = '';
    });
  });
})();
