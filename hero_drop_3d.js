/**
 * NeoFluid3D - High-Performance 3D Rotating Hero Isotype
 * Genesis-canonical straight vertical drop geometry
 */
(function setupHero3DDrop() {
  const canvas = document.getElementById('hero-drop-3d');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let angle = Math.atan2(-2.3, 2.5); // Camera azimuth angle
  const speed = 0.011; // Continuous smooth rotation speed

  // Exact Mathematical Constants from Genesis
  const SQRT5 = Math.sqrt(5); // ≈ 2.236068
  const X0 = 2 * SQRT5 / 5;   // ≈ 0.894427
  const Y0 = SQRT5 / 5;       // ≈ 0.447214
  const CC = 0.2956;          // Centroid z in cut plane
  const SALTO = 0.4204;       // Ring delta
  const R_XY = Math.hypot(2.5, -2.3); // ≈ 3.397056 (Camera orbit radius in XY)
  const Z_CAM = 0.42;         // Fixed camera Z
  const TARGET_Z = (SQRT5 - 1.0) / 2; // ≈ 0.618034 (Geometric center)

  // ── 3 RINGS: equal step, outer rings nudged slightly inward to avoid thin triangles ──
  const SALTO_NEW = 3 * SALTO / 2;  // ≈ 0.6306 — base step between rings
  const NUDGE    = 0.12;             // slight inward pull for top and bottom rings
  const ringConfigs = [
    { z: Y0 - NUDGE,                   r: Math.sqrt(Math.max(0, 1 - (Y0 - NUDGE)**2)) },
    { z: Y0 - SALTO_NEW,               r: Math.sqrt(Math.max(0, 1 - (Y0 - SALTO_NEW)**2)) },
    { z: Y0 - 2 * SALTO_NEW + NUDGE,   r: Math.sqrt(Math.max(0, 1 - (Y0 - 2*SALTO_NEW + NUDGE)**2)) }
  ];

  // 8 Canonical Meridian Arcs from Genesis Software
  const meridianAngles = [
    0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4,
    Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4
  ];

  function getCutPoint(theta) {
    const k = 0.6 * (Math.cos(theta) + Math.sin(theta));
    const rt = (SQRT5 - 0.3) / (k + 2);
    const zt = SQRT5 - 2 * rt;
    if (zt >= Y0) {
      return { r: rt, z: zt, x: rt * Math.cos(theta), y: rt * Math.sin(theta) };
    } else {
      const A = 1 + k * k;
      const B = 0.6 * k;
      const C_eq = 0.3 * 0.3 - 1;
      const disc = B * B - 4 * A * C_eq;
      const rb = (-B + Math.sqrt(Math.max(0, disc))) / (2 * A);
      const zb = k * rb + 0.3;
      return { r: rb, z: zb, x: rb * Math.cos(theta), y: rb * Math.sin(theta) };
    }
  }

  let w = 161, h = 260;
  function updateDimensions() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.offsetWidth || canvas.clientWidth || 161;
    h = canvas.offsetHeight || canvas.clientHeight || 260;
    if (w < 40) w = 161;
    if (h < 40) h = 260;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  updateDimensions();
  window.addEventListener('resize', updateDimensions);
  window.addEventListener('load', () => { updateDimensions(); renderFrame(); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDimensions);
  }

  // Interactive Mouse Modulation
  let mouseInfluence = 0;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    mouseInfluence = nx * 0.4;
  });
  canvas.addEventListener('mouseleave', () => {
    mouseInfluence = 0;
  });

  function renderFrame() {
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    // Precisely scale drop so its 3D vertical span (SQRT5 + 1.0) fills 97.5% of canvas height h
    // Scale 3D drop so its 3D vertical span (SQRT5 + 1.0) matches the 239.8px optical span of the text (apex y=10.1px, base y=249.9px, cy=130px)
    const scale = (h * 0.922) / (SQRT5 + 1.0);

    // 1. Compute Orbiting Camera Transformation
    const camX = R_XY * Math.cos(angle);
    const camY = R_XY * Math.sin(angle);
    const camZ = Z_CAM;

    const vDirRaw = { x: camX, y: camY, z: camZ - TARGET_Z };
    const lenV = Math.hypot(vDirRaw.x, vDirRaw.y, vDirRaw.z);
    const vDir = { x: vDirRaw.x / lenV, y: vDirRaw.y / lenV, z: vDirRaw.z / lenV };

    const upGlobal = { x: 0, y: 0, z: 1 };
    const rRaw = { x: vDir.y * upGlobal.z - vDir.z * upGlobal.y, y: vDir.z * upGlobal.x - vDir.x * upGlobal.z, z: 0 };
    const lenR = Math.hypot(rRaw.x, rRaw.y, rRaw.z);
    const rVec = { x: rRaw.x / lenR, y: rRaw.y / lenR, z: 0 };

    const uRaw = {
      x: rVec.y * vDir.z - rVec.z * vDir.y,
      y: rVec.z * vDir.x - rVec.x * vDir.z,
      z: rVec.x * vDir.y - rVec.y * vDir.x
    };
    const lenU = Math.hypot(uRaw.x, uRaw.y, uRaw.z);
    const uVec = { x: uRaw.x / lenU, y: uRaw.y / lenU, z: uRaw.z / lenU };

    const camDir2D = { x: Math.cos(angle), y: Math.sin(angle) };

    function projectPoint(x, y, z) {
      const dx = x, dy = y, dz = z - TARGET_Z;
      const x2d = -(dx * rVec.x + dy * rVec.y + dz * rVec.z);
      const y2d = -(dx * uVec.x + dy * uVec.y + dz * uVec.z);
      return {
        px: cx + x2d * scale,
        py: cy + y2d * scale,
        wx: x, wy: y, wz: z
      };
    }

    // ── LAYER 0: Curved 3D Space Coordinate Manifold Grid (Complex Plane Deformation) ──

    // ── LAYER 1: Full Drop Solid Dark Base (Silhouette) ──
    const numS = 60;
    const thetaIzq = angle + Math.PI / 2;
    const thetaDer = angle - Math.PI / 2;
    const cpIzq = getCutPoint(thetaIzq);
    const cpDer = getCutPoint(thetaDer);

    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= numS; i++) {
      const z = -1.0 + (i / numS) * (SQRT5 + 1.0);
      const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
      const pt = projectPoint(r * Math.cos(thetaIzq), r * Math.sin(thetaIzq), z);
      i === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
    }
    for (let i = numS; i >= 0; i--) {
      const z = -1.0 + (i / numS) * (SQRT5 + 1.0);
      const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
      const pt = projectPoint(r * Math.cos(thetaDer), r * Math.sin(thetaDer), z);
      ctx.lineTo(pt.px, pt.py);
    }
    ctx.closePath();
    ctx.fillStyle = '#070B0E';
    ctx.fill();
    ctx.restore();

    // ── LAYER 2: Back-Facing Lower Sphere Grid (Emerald Green #39FF14) ──
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.30)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ringConfigs.forEach(ring => {
      const numStepsRing = 60;
      let isDrawing = false;
      ctx.beginPath();
      for (let i = 0; i <= numStepsRing; i++) {
        const t = (i / numStepsRing) * Math.PI * 2;
        const x = ring.r * Math.cos(t);
        const y = ring.r * Math.sin(t);
        const z = ring.z;
        if (z > 0.6 * (x + y) + 0.3) { isDrawing = false; continue; }

        const dot = x * camDir2D.x + y * camDir2D.y;
        if (dot >= 0) { isDrawing = false; continue; } // Back only

        const pt = projectPoint(x, y, z);
        if (!isDrawing) { ctx.moveTo(pt.px, pt.py); isDrawing = true; }
        else { ctx.lineTo(pt.px, pt.py); }
      }
      ctx.stroke();
    });

    meridianAngles.forEach(t => {
      const dot = Math.cos(t) * camDir2D.x + Math.sin(t) * camDir2D.y;
      if (dot < 0) { // Back only
        const cp = getCutPoint(t);
        const numM = 30;
        ctx.beginPath();
        for (let i = 0; i <= numM; i++) {
          const z = -1.0 + (i / numM) * (cp.z - (-1.0));
          const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
          const x = r * Math.cos(t);
          const y = r * Math.sin(t);
          const pt = projectPoint(x, y, z);
          i === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
      }
    });
    ctx.restore();

    // ── LAYER 3: TAPA B_t & B_b (Superficie de Corte Oblicua) ──
    const numTapaU = 36;
    const numTapaV = 4;

    for (let i = 0; i < numTapaU; i++) {
      const b1 = (i / numTapaU) * Math.PI * 2;
      const b2 = ((i + 1) / numTapaU) * Math.PI * 2;
      const cp1 = getCutPoint(b1);
      const cp2 = getCutPoint(b2);

      ctx.fillStyle = 'rgba(7, 18, 24, 0.94)';
      ctx.strokeStyle = (i % 2 === 0) ? 'rgba(0, 240, 255, 0.20)' : 'transparent';
      ctx.lineWidth = 0.6;

      for (let j = 0; j < numTapaV; j++) {
        const t1 = j / numTapaV, t2 = (j + 1) / numTapaV;

        const p1 = projectPoint(t1 * cp1.x, t1 * cp1.y, CC + t1 * (cp1.z - CC));
        const p2 = projectPoint(t1 * cp2.x, t1 * cp2.y, CC + t1 * (cp2.z - CC));
        const p3 = projectPoint(t2 * cp2.x, t2 * cp2.y, CC + t2 * (cp2.z - CC));
        const p4 = projectPoint(t2 * cp1.x, t2 * cp1.y, CC + t2 * (cp1.z - CC));

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.lineTo(p3.px, p3.py); ctx.lineTo(p4.px, p4.py);
        ctx.closePath();
        ctx.fill();
        if (i % 2 === 0 || j === numTapaV - 1) ctx.stroke();
      }
    }

    // ── LAYER 4: UPPER FLUID DOME (ELECTRIC CYAN CONFORMAL VOLUME) ──
    const numU = 60;
    const N_SPH = 4;   // 4 subdivisions (3 extra quiebres) for spherical curve continuity
    const N_CONE = 5;  // 5 subdivisions for the straight conic generator
    const numV = N_SPH + N_CONE;
    const pApex = projectPoint(0, 0, SQRT5);

    function getDomePoint(theta, k) {
      if (k >= numV) return pApex;
      const cp = getCutPoint(theta);
      let z, r;
      if (cp.z < Y0) {
        if (k <= N_SPH) {
          const s = k / N_SPH;
          z = cp.z + s * (Y0 - cp.z);
          r = Math.sqrt(Math.max(0, 1 - z * z));
        } else {
          const s = (k - N_SPH) / N_CONE;
          z = Y0 + s * (SQRT5 - Y0);
          r = (SQRT5 - z) / 2;
        }
      } else {
        const s = k / numV;
        z = cp.z + s * (SQRT5 - cp.z);
        r = (SQRT5 - z) / 2;
      }
      return projectPoint(r * Math.cos(theta), r * Math.sin(theta), z);
    }

    for (let i = 0; i < numU; i++) {
      const b1 = (i / numU) * Math.PI * 2;
      const b2 = ((i + 1) / numU) * Math.PI * 2;

      const midAng = (b1 + b2) / 2;
      const dot = Math.cos(midAng) * camDir2D.x + Math.sin(midAng) * camDir2D.y;
      const isFront = (dot >= 0);

      ctx.fillStyle = isFront ? 'rgba(0, 240, 255, 0.88)' : 'rgba(0, 240, 255, 0.22)';
      ctx.strokeStyle = (i % 3 === 0) ? (isFront ? 'rgba(0, 240, 255, 0.95)' : 'rgba(0, 240, 255, 0.35)') : 'transparent';
      ctx.lineWidth = 0.7;

      for (let j = 0; j < numV; j++) {
        const p1 = getDomePoint(b1, j);
        const p2 = getDomePoint(b2, j);
        const p3 = (j === numV - 1) ? pApex : getDomePoint(b2, j + 1);
        const p4 = (j === numV - 1) ? pApex : getDomePoint(b1, j + 1);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p3.px, p3.py);
        if (j < numV - 1) ctx.lineTo(p4.px, p4.py);
        ctx.closePath();
        ctx.fill();
        if (i % 3 === 0) ctx.stroke();
      }
    }

    // ── LAYER 5: Front-Facing Lower Sphere Grid (Precision Emerald Green #39FF14) ──
    ctx.save();
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#39FF14';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ringConfigs.forEach(ring => {
      const numStepsRing = 60;
      let isDrawing = false;
      ctx.beginPath();
      for (let i = 0; i <= numStepsRing; i++) {
        const t = (i / numStepsRing) * Math.PI * 2;
        const x = ring.r * Math.cos(t);
        const y = ring.r * Math.sin(t);
        const z = ring.z;
        if (z > 0.6 * (x + y) + 0.3) { isDrawing = false; continue; }

        const dot = x * camDir2D.x + y * camDir2D.y;
        if (dot < 0) { isDrawing = false; continue; } // Front only

        const pt = projectPoint(x, y, z);
        if (!isDrawing) { ctx.moveTo(pt.px, pt.py); isDrawing = true; }
        else { ctx.lineTo(pt.px, pt.py); }
      }
      ctx.stroke();
    });

    meridianAngles.forEach(t => {
      const dot = Math.cos(t) * camDir2D.x + Math.sin(t) * camDir2D.y;
      if (dot >= 0) { // Front only
        const cp = getCutPoint(t);
        const numM = 30;
        ctx.beginPath();
        for (let i = 0; i <= numM; i++) {
          const z = -1.0 + (i / numM) * (cp.z - (-1.0));
          const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
          const x = r * Math.cos(t);
          const y = r * Math.sin(t);
          const pt = projectPoint(x, y, z);
          i === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
      }
    });
    ctx.restore();

    // ── LAYER 6: Glowing Curved Cut Perimeter ──
    [false, true].forEach(isFrontPass => {
      ctx.save();
      ctx.lineWidth = isFrontPass ? 3.6 : 1.8;
      ctx.strokeStyle = isFrontPass ? '#00F0FF' : 'rgba(0, 240, 255, 0.35)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const numCutPts = 60;
      let isDrawing = false;
      ctx.beginPath();
      for (let i = 0; i <= numCutPts; i++) {
        const t = (i / numCutPts) * Math.PI * 2;
        const cp = getCutPoint(t);
        const dot = cp.x * camDir2D.x + cp.y * camDir2D.y;
        const isFront = (dot >= 0);
        if (isFront !== isFrontPass) { isDrawing = false; continue; }

        const pt = projectPoint(cp.x, cp.y, cp.z);
        if (!isDrawing) { ctx.moveTo(pt.px, pt.py); isDrawing = true; }
        else { ctx.lineTo(pt.px, pt.py); }
      }
      ctx.stroke();
      ctx.restore();
    });

    // ── LAYER 7: CONFORMAL DUAL-COLOR SILHOUETTE CONTOUR ──
    const numSub = 30;

    // 7A. Lower Sphere Contour (Verde Computación #39FF14)
    ctx.save();
    ctx.strokeStyle = '#39FF14';
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    for (let i = 0; i <= numSub; i++) {
      const z = cpIzq.z - (i / numSub) * (cpIzq.z - (-1.0));
      const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
      const pt = projectPoint(r * Math.cos(thetaIzq), r * Math.sin(thetaIzq), z);
      i === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
    }
    for (let i = 0; i <= numSub; i++) {
      const z = -1.0 + (i / numSub) * (cpDer.z - (-1.0));
      const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
      const pt = projectPoint(r * Math.cos(thetaDer), r * Math.sin(thetaDer), z);
      ctx.lineTo(pt.px, pt.py);
    }
    ctx.stroke();
    ctx.restore();

    // 7B. Upper Fluid Cone Contour (Cian Eléctrico #00F0FF)
    ctx.save();
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    for (let i = 0; i <= numSub; i++) {
      const z = cpIzq.z + (i / numSub) * (SQRT5 - cpIzq.z);
      const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
      const pt = projectPoint(r * Math.cos(thetaIzq), r * Math.sin(thetaIzq), z);
      i === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
    }
    for (let i = 0; i <= numSub; i++) {
      const z = SQRT5 - (i / numSub) * (SQRT5 - cpDer.z);
      const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
      const pt = projectPoint(r * Math.cos(thetaDer), r * Math.sin(thetaDer), z);
      ctx.lineTo(pt.px, pt.py);
    }
    ctx.stroke();
    ctx.restore();

    angle += speed;
  }

  // Viewport Culling Observer & Guaranteed Animation Loop
  let isHeroDropVisible = true;
  let isHeroDropRunning = true;

  function heroDropLoop() {
    if (!isHeroDropVisible) {
      isHeroDropRunning = false;
      return;
    }
    renderFrame();
    requestAnimationFrame(heroDropLoop);
  }

  // Start immediately
  renderFrame();
  requestAnimationFrame(heroDropLoop);

  if ('IntersectionObserver' in window) {
    const heroDropObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroDropVisible = entry.isIntersecting;
        if (isHeroDropVisible && !isHeroDropRunning) {
          isHeroDropRunning = true;
          requestAnimationFrame(heroDropLoop);
        }
      });
    }, { threshold: 0.01 });
    heroDropObs.observe(canvas);
  }
})();

