/* ═══════════════════════════════════════════════════════════
   GENESIS MATEMATICA : 19-STEP INTERACTIVE ISOTYPE CONTROLLER (V27)
   - Zero Double-Step Jump: Immediate Step Index Sync & Debounce
   - Flawless 3D -> 2D Transition: Zero Flash / Parpadeo, Strict 0.0 Surface State
   - Guaranteed Initial KaTeX Typesetting: Auto-poll & Window Load Listener
   - Graceful Exit/Entrance Animations & Waterfall Cascade
═══════════════════════════════════════════════════════════ */
(function setupGenesisViewer() {
  const canvas = document.getElementById('genesis-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Inline Math Parser: Converts $...$ into KaTeX HTML
    // Smooth Color Interpolation Helper
  function lerpColor(c1, c2, t) {
    t = Math.max(0, Math.min(1, t));
    const parse = (c) => {
      if (c.startsWith('#')) {
        const hex = c.slice(1);
        if (hex.length === 3) {
          return [parseInt(hex[0]+hex[0], 16), parseInt(hex[1]+hex[1], 16), parseInt(hex[2]+hex[2], 16), 1];
        }
        const num = parseInt(hex, 16);
        return [num >> 16, (num >> 8) & 255, num & 255, 1];
      }
      const match = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) return [+match[1], +match[2], +match[3], match[4] !== undefined ? +match[4] : 1];
      return [0, 240, 255, 1];
    };
    const [r1, g1, b1, a1] = parse(c1);
    const [r2, g2, b2, a2] = parse(c2);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    const a = (a1 + (a2 - a1) * t).toFixed(3);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  function parseAndRenderInlineMath(text) {
    if (!text) return '';
    return text.replace(/\$([^$]+)\$/g, (match, latex) => {
      if (window.katex) {
        try {
          return katex.renderToString(latex, { displayMode: false, throwOnError: false });
        } catch(e) {
          return match;
        }
      }
      return match;
    });
  }

  // Exact Mathematical Constants
  const SQRT5 = Math.sqrt(5); // ≈ 2.236068
  const X0 = 2 * SQRT5 / 5;   // ≈ 0.894427
  const Y0 = SQRT5 / 5;       // ≈ 0.447214 (z_t)
  const CC = 0.2956;          // Centroid z
  const SALTO = 0.4204;       // Ring height delta
  const PHI = Math.PI / 4;    // 45 deg plane angle

  // Analytical cut curve transition angles
  const numRatio = (Y0 - 0.3) / (0.6 * X0 * Math.SQRT2);
  const THETA_1 = PHI + Math.acos(numRatio); // ≈ 2.1610 rad
  const THETA_2 = PHI - Math.acos(numRatio); // ≈ -0.5902 rad

  // Camera Transformation Matrix Parameters from shadow_maker.py
  const Cam = { x: 2.5, y: -2.3, z: 0.6 * (2.5 - 2.3) + 0.3 }; // z = 0.42
  const Target = { x: 0, y: 0, z: 0.3 };
  const vDirRaw = { x: Cam.x - Target.x, y: Cam.y - Target.y, z: Cam.z - Target.z };
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

  const camDir2D = {
    x: Cam.x / Math.hypot(Cam.x, Cam.y),
    y: Cam.y / Math.hypot(Cam.x, Cam.y)
  };

  const anguloCam = Math.atan2(Cam.y, Cam.x);
  const thetaIzq = anguloCam + Math.PI / 2; // ≈ 0.8270 rad
  const thetaDer = anguloCam - Math.PI / 2; // ≈ -2.3146 rad

  // Exact Euler Camera Angles for shadow_maker.py perspective alignment
  const CAM_PERSPECTIVE_ROTY = 0.8270;
  const CAM_PERSPECTIVE_ROTX = -0.0353;

  // 19-Step Database
  const STEPS = [
    {
      num: 1,
      phase: "Fase 1 : Base 2D",
      subphase: "1.1 Contorno",
      title: "Círculo Unitario Base",
      alias: String.raw`Circunferencia Base : $r_{\text{esfera}}$`,
      latex: String.raw`x^2 + y^2 = 1 \implies r(z) = \sqrt{1 - z^2}`,
      desc: "Se inicia la construcción geométrica delimitando la base inferior de la gota con una <strong>circunferencia unitaria</strong> de radio $R = 1$ centrada en el origen $(0,0)$.",
      note: "Establece el límite inferior $z \\in [-1.0, 0.45]$ y define el radio ecuatorial de la gota.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 2,
      phase: "Fase 1 : Base 2D",
      subphase: "1.1 Contorno",
      title: "Función Superior de Valor Absoluto",
      alias: "Rectas Tangentes Cónicas : $g(x)$",
      latex: String.raw`y = -2|x| + \sqrt{5}, \quad P_{\text{ápice}} = (0, \sqrt{5})`,
      desc: "Se coloca la función de valor absoluto simétrica que genera las paredes cónicas superiores, con vértice en el ápice $P_{\\text{ápice}} = (0, \\sqrt{5} \\approx 2.2361)$ y pendiente $m = -2$.",
      note: "La pendiente $m = -2$ surge de exigir que la distancia del origen a la recta sea exactamente $R = 1$.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 3,
      phase: "Fase 1 : Base 2D",
      subphase: "1.1 Contorno",
      title: "Intersección y Tangencia Suave C¹",
      alias: "Punto de Tangencia y Derivada : $(x_0, y_0)$",
      latex: String.raw`x_0 = \frac{2\sqrt{5}}{5} \approx 0.8944, \quad y_0 = \frac{\sqrt{5}}{5} \approx 0.4472`,
      desc: "Se calcula el punto de contacto donde la recta es exactamente tangente a la circunferencia. En este punto la derivada $\\frac{dy}{dx} = -\\frac{x_0}{y_0} = -2$ coincide con la pendiente de la recta, garantizando <strong>continuidad $C^1$</strong> sin aristas.",
      note: "Ángulo característico: $\\alpha = \\arctan(0.5) \\approx 26.57^\\circ$. Altura crítica de transición $z_t = y_0 = 0.4472$.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 4,
      phase: "Fase 1 : Base 2D",
      subphase: "1.1 Contorno",
      title: "Delimitación y Fusión del Perfil 2D Cerrado",
      alias: "Fusión de Funciones : Perfil Continuo $r(z)$",
      latex: String.raw`r(z) = \begin{cases} \sqrt{1 - z^2}, & -1.0 \le z \le \frac{\sqrt{5}}{5} \\[6pt] \frac{\sqrt{5} - z}{2}, & \frac{\sqrt{5}}{5} < z \le \sqrt{5} \end{cases}`,
      desc: "Se recortan ambas funciones en los puntos de tangencia $(x_0, y_0)$ y $(-x_0, y_0)$, <strong>desdibujando las secciones sobrantes</strong> y fusionándolas en un contorno cerrado único y suave.",
      note: "La frontera cerrada $\\partial\\Omega$ resultante posee continuidad $C^1$ y delimita el área generatriz.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 5,
      phase: "Fase 1 : Base 2D",
      subphase: "1.2 Centro y Corte",
      title: "Cálculo del Centroide de Masa",
      alias: "Teorema de Green : Baricentro $(0, C_c)$",
      latex: String.raw`A = \frac{1}{2}\oint (x dy - y dx) \approx -4.0344, \quad \bar{y} = \frac{M_x}{A} \approx 0.2956`,
      desc: "Se evalúan las integrales de contorno mediante el <strong>Teorema de Green</strong> sobre el perfil fusionado para calcular el área plana total $A$ y el momento de inercia estático $M_x$, obteniendo el centroide baricéntrico $(0, C_c) = (0, 0.2956)$.",
      note: "El centroide $C_c = 0.2956$ define la cota de anclaje del corte oblicuo.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 6,
      phase: "Fase 1 : Base 2D",
      subphase: "1.2 Centro y Corte",
      title: "Recta de Referencia del Plano",
      alias: "Recta Guía 2D : $p_0=(0.5,0)$ a Centroide",
      latex: String.raw`y_{\text{ref}}(x) = 0.5912 x + 0.2956 \approx 0.6x + 0.3`,
      desc: "Se traza la recta guía pasando por el punto $p_0 = (0.5, 0)$ y el centroide $(0, 0.2956)$. Esta recta establece la pendiente $m \\approx 0.6$ que gobernará el corte oblicuo.",
      note: "Esta recta sirvió de referencia 2D antes de trasladar la geometría al espacio tridimensional.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 7,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.1 R² → R³",
      title: "Traslación Espacial al Plano XZ",
      alias: "Ejes $y \rightarrow z$ en Espacio Tridimensional",
      latex: String.raw`\mathbf{r}_{\text{perfil}}(t) = \begin{pmatrix} x(t) \\ 0 \\ z(t) \end{pmatrix}, \quad (x, y) \rightarrow (x, 0, z)`,
      desc: "<strong>Transición a $\\mathbb{R}^3$:</strong> Se reorientan los ejes trasladando la generatriz al plano $XZ$ (intercambiando el eje $y$ por $z$), preparando la geometría para la rotación espacial.",
      note: "Acción: La cámara pivota en 3D para revelar la profundidad volumétrica del modelo.",
      dim: 3,
      camRot: { x: 0.35, y: -0.6 }
    },
    {
      num: 8,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.1 R² → R³",
      title: "Desarrollo Angular en el Plano XY",
      alias: "Rotación Orbital : 8 Meridianos en Cascada",
      latex: String.raw`\theta_i = i\frac{\pi}{4} \quad (i = 0, 1, \dots, 7), \quad \theta \in [0, 2\pi]`,
      desc: "Se replican las curvas generatrices girando en ángulos discretos $\\theta_i = i \\frac{\\pi}{4}$ en el plano $XY$, generando los 8 meridianos que forman la estructura de la jaula 3D en <strong>cascada suave descendente</strong>.",
      note: "Forma el esqueleto longitudinal de la gota en el espacio tridimensional.",
      dim: 3,
      camRot: { x: 0.4, y: -0.8 }
    },
    {
      num: 9,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.1 R² → R³",
      title: "Traslado del Centroide al Espacio 3D",
      alias: String.raw`Centroide Espacial : $\mathbf{C} = (0, 0, C_c)$`,
      latex: String.raw`\mathbf{C}_{\text{espacial}} = (0, 0, 0.2956), \quad C_c = \frac{M_x}{A}`,
      desc: "Se sitúa el centroide de masa en el eje vertical del espacio tridimensional $\\mathbf{C} = (0, 0, 0.2956)$. Este punto actúa como ancla del plano divisor y origen de medición de niveles.",
      note: "Punto pivote que equilibra el volumen de fluido continuo y la red de cálculo inferior.",
      dim: 3,
      camRot: { x: 0.42, y: -0.85 }
    },
    {
      num: 10,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.1 R² → R³",
      title: "Inserción del Plano de Corte Oblicuo 3D",
      alias: "Plano 3D : $z(x,y) = 0.6(x + y) + 0.3$",
      latex: String.raw`z(x, y) = 0.6(x + y) + 0.3, \quad \mathbf{n} = (0.6, 0.6, -1)^T`,
      desc: "Se inserta el plano de corte oblicuo tridimensional reemplazando $x$ por $(x + y)$ en la ecuación del centroide. El plano biseca la gota con una inclinación angular $\\phi = 45^\\circ$.",
      note: "Este plano espacial es el separador formal de la identidad de la marca.",
      dim: 3,
      camRot: { x: 0.48, y: -0.95 }
    },
    {
      num: 11,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.1 R² → R³",
      title: "Anillos Horizontales Distribuidos",
      alias: String.raw`Paralelos : $\Delta z = \frac{3}{2}\text{salto} \approx 0.6306$`,
      latex: String.raw`z_1 \approx 0.327, \quad z_2 \approx -0.183, \quad z_3 \approx -0.694`,
      desc: "Se trazan los 3 anillos horizontales (paralelos) distribuidos uniformemente a lo largo de la semiesfera inferior, con desplazamiento suave en los extremos para optimizar la proporción visual de la malla.",
      note: "Niveles de altura: $z_1 = y_0 - 0.12 \\approx 0.3272, \\; z_2 = y_0 - 0.6306 \\approx -0.1834, \\; z_3 = y_0 - 1.2613 + 0.12 \\approx -0.6941$.",
      dim: 3,
      camRot: { x: 0.45, y: -0.9 }
    },
    {
      num: 12,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.2 Limpieza",
      title: "Cálculo de la Curva de Intersección 3D",
      alias: String.raw`Curvas de Corte : $r_t(\theta)$ y $r_b(\theta)$`,
      latex: String.raw`r_t(\theta) = \frac{\sqrt{5} - 0.3}{k(\theta) + 2}, \quad r_b(\theta) = \frac{-0.6k + \sqrt{0.36k^2 + 3.64(1+k^2)}}{2(1+k^2)}`,
      desc: "Se calcula analíticamente la curva de corte espacial 3D generada por la intersección del plano con la gota en sus dos tramos (cónico y esférico).",
      note: "La curva de corte queda trazada sobre la superficie. A partir del siguiente paso se retira el plano.",
      dim: 3,
      camRot: { x: 0.45, y: -0.85 }
    },
    {
      num: 13,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.2 Limpieza",
      title: "Puntos de Intersección con Meridianos y Anillos",
      alias: String.raw`Intersecciones Exactas : $(\theta_1, \theta_2)$`,
      latex: String.raw`\theta_1 = \phi + \arccos\left(\frac{k_c}{R}\right), \quad \theta_2 = \phi - \arccos\left(\frac{k_c}{R}\right)`,
      desc: "<strong>Se retira el plano de corte</strong> y se marcan con <strong>puntos brillantes</strong> las intersecciones exactas de la curva de corte con los 8 meridianos y con los anillos horizontales $(\\theta_1, \\theta_2)$.",
      note: String.raw`Puntos de corte definidos por los ángulos límites $[\theta_2, \theta_1]$ en cada cota.`,
      dim: 3,
      camRot: { x: 0.45, y: -0.8 }
    },
    {
      num: 14,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.2 Limpieza",
      title: "Limpieza y Poda de la Malla Superior",
      alias: String.raw`Malla Inferior Activa : $z \le z_{\text{corte}}$`,
      latex: String.raw`\mathbf{r}(t) \text{ activo solo para } z \le 0.6(x + y) + 0.3`,
      desc: "Se eliminan todas las líneas de malla situadas <strong>por encima del plano de corte oblicuo</strong>. Se preservan las líneas del pseudo-cono que quedan por debajo del corte y la cuadrícula esférica.",
      note: "El hemisferio inferior queda limpio como una red matemática pura.",
      dim: 3,
      camRot: { x: 0.4, y: -0.7 }
    },
    {
      num: 15,
      phase: "Fase 2 : Desarrollo 3D",
      subphase: "2.3 Relleno",
      title: "Estructura de Superficies Paramétricas",
      alias: "$T_{t1}, T_{t2}, T_b, B_t, B_b$ : 5 Parches Paramétricos",
      latex: String.raw`T_{t1}, T_{t2}, T_b, B_t, B_b \implies \text{5 Superficies Paramétricas}`,
      desc: "Se visualizan las <strong>5 superficies paramétricas continuas</strong> que definen la envolvente tridimensional de la gota: el cono superior de fluido, el corte oblicuo y el casquete esférico inferior.",
      note: "Modelo continuo diferencial que unifica el fluido dinámico y la base de cálculo.",
      dim: 3,
      camRot: { x: 0.35, y: -0.5 }
    },
    {
      num: 16,
      phase: "Fase 3 : Retorno a 2D",
      subphase: "3.1 Proyección R³ → R²",
      title: "Proyección Vectorial Ortográfica a SVG",
      alias: String.raw`Script shadow_maker.py : Eye Point $\mathbf{C}=(2.5, -2.3, 0.42)$`,
      latex: String.raw`X_{\text{logo}} = -\mathbf{P} \cdot \mathbf{r}, \quad Y_{\text{logo}} = -\mathbf{P} \cdot \mathbf{u}`,
      desc: "<strong>Retorno al plano 2D:</strong> Se ejecuta el script de proyección <code>shadow_maker.py</code> proyectando toda la estructura espacial completa sobre la base de cámara $(\\mathbf{r}, \\mathbf{u})$ de forma transparente <strong>sin oclusión</strong>.",
      note: "Muestra la proyección bidimensional de todas las caras y aristas antes de ocultar las líneas traseras.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 17,
      phase: "Fase 3 : Retorno a 2D",
      subphase: "3.2 Limpieza y Coloreado",
      title: "Fusión de Curvas y Back-Face Culling en SVG",
      alias: String.raw`Oclusión Angular : $\mathbf{P}_{xy} \cdot \mathbf{C}_{\text{dir2D}} \ge 0.02$`,
      latex: String.raw`\mathbf{P}_{xy} \cdot \mathbf{C}_{\text{dir2D}} \ge 0.02 \implies \text{Back-Face Culling}`,
      desc: "Se aplica el algoritmo de <strong>Back-Face Culling</strong> descartando las líneas posteriores de la esfera y el cono, fusionando los nodos y siluetas para conformar los bucles cerrados limpios.",
      note: "Trazado vectorial neutro de alta fidelidad listo para inyección de color.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 18,
      phase: "Fase 3 : Retorno a 2D",
      subphase: "3.2 Limpieza y Coloreado",
      title: "Aplicación de la Paleta Cromática de Marca",
      alias: "Cian Eléctrico (#00F0FF) + Verde Esmeralda (#39FF14)",
      latex: String.raw`\text{Cima: Cian Eléctrico (\#00F0FF)}, \quad \text{Base: Verde Esmeralda (\#39FF14)}`,
      desc: "<strong>Coloreado de Marca:</strong> Se aplica la identidad visual oficial con degradado sólido en cian eléctrico `#00F0FF` en el dominio superior y trazos en verde esmeralda `#39FF14` sobre la cuadrícula inferior.",
      note: "Sella la armonía entre fluidodinámica suave y cómputo GPU de alta precisión.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    },
    {
      num: 19,
      phase: "Fase 3 : Retorno a 2D",
      subphase: "3.2 Limpieza y Coloreado",
      title: "Las 5 Variantes Oficiales de Marca",
      alias: "5 Variantes: Alto/Bajo Contraste, Monocromo y Simple",
      latex: String.raw`\text{Principal (AC/BC)} \;\big|\; \text{Monocromo (AC/BC)} \;\big|\; \text{Simple (AC)}`,
      desc: "Se consolidan las <strong>5 variantes oficiales de la marca</strong> con sus bases y siluetas vectoriales completas: (1) Uso principal AC, (2) Monocromático AC, (3) Simple AC, (4) Uso principal BC y (5) Monocromático BC con base negra y cuadrícula blanca.",
      note: "El manual de identidad y las variantes vectoriales quedan plenamente consolidados.",
      dim: 2,
      camRot: { x: 0, y: 0 }
    }
  ];

  let currentStepIdx = 0;
  let isAutoRotating = false;
  let isDragging = false;
  let lastMouseX = 0, lastMouseY = 0;
  let rotX = 0.0, rotY = 0.0;
  let targetRotX = 0.0, targetRotY = 0.0;

  // ASYMMETRIC FORWARD ENTRANCE VS BACKWARD EXIT-UNDO
  let stepNavDir = 1; // +1 = Forward, -1 = Backward
  let stepAnimStart = performance.now();
  let stepAnimDur = 650;

  // EXIT-UNDO STATE
  let exitState = {
    active: false,
    exitingStepNum: 0,
    startTime: 0,
    duration: 450
  };

  // ROBUST STATE MACHINE FOR COMPLEX DIMENSIONAL TRANSITIONS
  let animState = {
    active: false,
    mode: null,
    startTime: 0,
    duration: 500,
    startRotX: 0, startRotY: 0,
    endRotX: 0, endRotY: 0,
    crossfade: 0.0,
    deployT: 0.0
  };

  // DOM Elements
  const stepPhaseText = document.getElementById('step-phase-text');
  const stepCounter = document.getElementById('step-counter');
  const stepTitle = document.getElementById('step-title');
  const stepMathAlias = document.getElementById('step-math-alias');
  const stepMathFormula = document.getElementById('step-math-formula');
  const stepDesc = document.getElementById('step-desc');
  const stepNote = document.getElementById('step-note');
  const vpDimBadge = document.getElementById('vp-dim-badge');
  const vpDimText = document.getElementById('vp-dim-text');

  const btnStepPrev = document.getElementById('btn-step-prev');
  const btnStepNext = document.getElementById('btn-step-next');
  const btnStepFirst = document.getElementById('btn-step-first');
  const btnStepLast = document.getElementById('btn-step-last');
  const btnAutoRotate = document.getElementById('btn-auto-rotate');
  const btnResetCam = document.getElementById('btn-reset-cam');
  const vpHint = document.querySelector('.viewport-hint');

  function renderStepUI(idx) {
    const s = STEPS[idx];
    if (!s) return;

    if (stepPhaseText) stepPhaseText.textContent = `${s.phase} (${s.subphase})`;
    if (stepCounter) stepCounter.textContent = `Paso ${s.num} de ${STEPS.length}`;
    if (stepTitle) stepTitle.textContent = `Paso ${s.num} : ${s.title}`;
    if (stepMathAlias) stepMathAlias.innerHTML = parseAndRenderInlineMath(s.alias);
    
    if (stepDesc) stepDesc.innerHTML = parseAndRenderInlineMath(s.desc);
    if (stepNote) stepNote.innerHTML = '<strong>Nota:</strong> ' + parseAndRenderInlineMath(s.note);

    if (stepMathFormula) {
      if (window.katex) {
        try {
          katex.render(s.latex, stepMathFormula, { displayMode: true, throwOnError: false });
        } catch(e) {
          stepMathFormula.textContent = s.latex;
        }
      }
    }

    const is3D = (s.dim === 3);

    if (btnAutoRotate) btnAutoRotate.style.display = is3D ? 'flex' : 'none';
    if (btnResetCam) btnResetCam.style.display = is3D ? 'flex' : 'none';
    if (vpHint) vpHint.style.display = is3D ? 'block' : 'none';

    if (vpDimBadge && vpDimText) {
      if (is3D) {
        vpDimBadge.classList.add('dim-3d');
        vpDimText.textContent = "Espacio ℝ³";
      } else {
        vpDimBadge.classList.remove('dim-3d');
        vpDimText.textContent = "Plano ℝ²";
        isAutoRotating = false;
        if (btnAutoRotate) btnAutoRotate.classList.remove('active');
      }
    }

    if (btnStepPrev) btnStepPrev.disabled = (idx === 0);
    if (btnStepFirst) btnStepFirst.disabled = (idx === 0);
    if (btnStepNext) btnStepNext.disabled = (idx === STEPS.length - 1);
    if (btnStepLast) btnStepLast.disabled = (idx === STEPS.length - 1);
  }

  // Auto-poll to guarantee complete KaTeX typesetting on initial page load
  let katexCheckAttempts = 0;
  function ensureKaTeXLoaded() {
    if (window.katex) {
      renderStepUI(currentStepIdx);
    } else if (katexCheckAttempts < 80) {
      katexCheckAttempts++;
      setTimeout(ensureKaTeXLoaded, 50);
    }
  }
  ensureKaTeXLoaded();
  window.addEventListener('load', () => {
    renderStepUI(currentStepIdx);
  });

  // NAVIGATION DISPATCHER WITH IMMEDIATE STEP SYNC (ZERO DOUBLE-STEP JUMP)
  function goToStep(targetIdx, isDirectJump = false) {
    if (targetIdx < 0) targetIdx = 0;
    if (targetIdx >= STEPS.length) targetIdx = STEPS.length - 1;
    if (targetIdx === currentStepIdx && !animState.active) return;

    const fromIdx = currentStepIdx;
    const isForward = (targetIdx > fromIdx);
    stepNavDir = isForward ? 1 : -1;

    // IMMEDIATE INDEX SYNCHRONIZATION
    currentStepIdx = targetIdx;
    renderStepUI(currentStepIdx);

    stepAnimDur = (targetIdx === 7) ? 1400 : 650;
    stepAnimStart = performance.now();

    // If moving backward, activate exit/undo animation for the step being left
    if (!isForward && !isDirectJump) {
      exitState.active = true;
      exitState.exitingStepNum = STEPS[fromIdx].num;
      exitState.startTime = performance.now();
      exitState.duration = (fromIdx === 7) ? 1000 : 450;
    } else {
      exitState.active = false;
    }

    // DIRECT JUMP
    if (isDirectJump) {
      animState.active = false;
      exitState.active = false;
      if (STEPS[targetIdx].dim === 3) {
        rotX = targetRotX = STEPS[targetIdx].camRot.x;
        rotY = targetRotY = STEPS[targetIdx].camRot.y;
      } else {
        rotX = targetRotX = 0;
        rotY = targetRotY = 0;
      }
      return;
    }

    // 1. FORWARD: Step 6 (2D) -> Step 7 (3D)
    if (fromIdx === 5 && targetIdx === 6) {
      animState.active = true;
      animState.mode = '6_TO_7';
      animState.startTime = performance.now();
      animState.duration = 650;
      animState.startRotX = rotX;
      animState.startRotY = rotY;
      animState.endRotX = STEPS[6].camRot.x;
      animState.endRotY = STEPS[6].camRot.y;
      return;
    }

    // 2. BACKWARD: Step 7 (3D) -> Step 6 (2D)
    if (fromIdx === 6 && targetIdx === 5) {
      animState.active = true;
      animState.mode = '7_TO_6';
      animState.startTime = performance.now();
      animState.duration = 650;
      animState.startRotX = rotX;
      animState.startRotY = rotY;
      animState.endRotX = 0.0;
      animState.endRotY = 0.0;
      return;
    }

    // 3. FORWARD: Step 15 (3D) -> Step 16 (2D Projection)
    if (fromIdx === 14 && targetIdx === 15) {
      animState.active = true;
      animState.mode = '15_TO_16_PHASE1';
      animState.startTime = performance.now();
      animState.duration = 600;
      animState.startRotX = rotX;
      animState.startRotY = rotY;
      animState.endRotX = CAM_PERSPECTIVE_ROTX;
      animState.endRotY = CAM_PERSPECTIVE_ROTY;
      animState.crossfade = 0.0;
      return;
    }

    // 4. BACKWARD: Step 16 (2D Projection) -> Step 15 (3D)
    if (fromIdx === 15 && targetIdx === 14) {
      animState.active = true;
      animState.mode = '16_TO_15_PHASE1';
      animState.startTime = performance.now();
      animState.duration = 500;
      rotX = CAM_PERSPECTIVE_ROTX;
      rotY = CAM_PERSPECTIVE_ROTY;
      animState.startRotX = CAM_PERSPECTIVE_ROTX;
      animState.startRotY = CAM_PERSPECTIVE_ROTY;
      animState.endRotX = CAM_PERSPECTIVE_ROTX;
      animState.endRotY = CAM_PERSPECTIVE_ROTY;
      targetRotX = CAM_PERSPECTIVE_ROTX;
      targetRotY = CAM_PERSPECTIVE_ROTY;
      animState.crossfade = 1.0;
      return;
    }

    // 5. FORWARD: Step 18 -> Step 19 (5 Variants Clean Deck Sliding)
    if (fromIdx === 17 && targetIdx === 18) {
      animState.active = true;
      animState.mode = '18_TO_19';
      animState.startTime = performance.now();
      animState.duration = 750;
      animState.deployT = 0.0;
      return;
    }

    // 6. BACKWARD: Step 19 -> Step 18 (5 Variants Clean Deck Retraction)
    if (fromIdx === 18 && targetIdx === 17) {
      animState.active = true;
      animState.mode = '19_TO_18';
      animState.startTime = performance.now();
      animState.duration = 700;
      animState.deployT = 1.0;
      return;
    }


    // STANDARD NAVIGATION (Preserves camera in R^3 steps without unwanted resets)
    animState.active = false;
    if (STEPS[targetIdx].dim === 3) {
      if (STEPS[fromIdx].dim !== 3) {
        targetRotX = STEPS[targetIdx].camRot.x;
        targetRotY = STEPS[targetIdx].camRot.y;
      }
      // If moving within R^3 steps, keep current camera angle intact
    } else {
      targetRotX = 0;
      targetRotY = 0;
    }
  }

  if (btnStepPrev) btnStepPrev.addEventListener('click', () => goToStep(currentStepIdx - 1));
  if (btnStepNext) btnStepNext.addEventListener('click', () => goToStep(currentStepIdx + 1));
  if (btnStepFirst) btnStepFirst.addEventListener('click', () => goToStep(0, true));
  if (btnStepLast) btnStepLast.addEventListener('click', () => goToStep(STEPS.length - 1, true));

  if (btnAutoRotate) {
    btnAutoRotate.addEventListener('click', () => {
      if (STEPS[currentStepIdx].dim === 3) {
        isAutoRotating = !isAutoRotating;
        btnAutoRotate.classList.toggle('active', isAutoRotating);
      }
    });
  }

  if (btnResetCam) {
    btnResetCam.addEventListener('click', () => {
      const s = STEPS[currentStepIdx];
      if (s.dim === 3) {
        targetRotX = s.camRot.x;
        targetRotY = s.camRot.y;
        isAutoRotating = false;
        if (btnAutoRotate) btnAutoRotate.classList.remove('active');
      } else {
        targetRotX = 0;
        targetRotY = 0;
      }
    });
  }

  canvas.addEventListener('mousedown', (e) => {
    if (STEPS[currentStepIdx].dim !== 3 || animState.active) return;
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging || STEPS[currentStepIdx].dim !== 3 || animState.active) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    targetRotY += dx * 0.01;
    targetRotX += dy * 0.01;
    targetRotX = Math.max(-1.4, Math.min(1.4, targetRotX));
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('touchstart', (e) => {
    if (STEPS[currentStepIdx].dim !== 3 || animState.active) return;
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging || STEPS[currentStepIdx].dim !== 3 || animState.active || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMouseX;
    const dy = e.touches[0].clientY - lastMouseY;
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
    targetRotY += dx * 0.01;
    targetRotX += dy * 0.01;
  }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });

  // 3D Euler Rotation & Projection for Interactive Steps (1 to 15)
  function projectPoint(x, y, z, cx, cy, scale) {
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const x1 = x * cosY + y * sinY;
    const y1 = -x * sinY + y * cosY;
    const z1 = z;

    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    return {
      px: cx + x1 * scale,
      py: cy - z2 * scale,
      depth: y2,
      x3d: x, y3d: y, z3d: z
    };
  }

  // Exact Camera Projection from shadow_maker.py (Steps 16 to 19)
  function projectTo2DLogo(x, y, z, cx, cy, scale) {
    const x2d = -(x * rVec.x + y * rVec.y + z * rVec.z);
    const y2d = -(x * uVec.x + y * uVec.y + z * uVec.z);
    return {
      px: cx + x2d * scale,
      py: cy + y2d * scale
    };
  }

  // Exact 3D Cut Plane Intersection Calculator
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

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  // Render Full Logo Paths from shadow_maker.py into Canvas Context
  function renderShadowMakerLogo(ctx, cx, cy, scale, options) {
    const {
      fullBackingFill = null,
      outerBorderStroke = null,
      outerBorderWidth = 8.2,
      upperFill = null,
      lowerFill = null,
      upperStroke = '#00F0FF',
      cutStroke = '#00F0FF',
      cutStrokeWidth = null,
      gridStroke = '#39FF14',
      lowerContourStroke = null,
      lowerContourWidth = null,
      withBackCulling = true,
      lineWidth = 2.0,
      opacity = 1.0,
      drawProgress = 1.0
    } = options;

    if (opacity <= 0.001) return;

    ctx.save();
    if (opacity < 0.999) {
      ctx.globalAlpha = opacity;
    }

    const numSteps = 160;

    // 1. Build Silhouette Points
    const pIzq = [];
    const pDer = [];
    for (let i = 0; i <= numSteps; i++) {
      const z = -1.0 + (i / numSteps) * (SQRT5 + 1.0);
      const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
      pIzq.push({
        x: r * Math.cos(thetaIzq),
        y: r * Math.sin(thetaIzq),
        z: z,
        p2d: projectTo2DLogo(r * Math.cos(thetaIzq), r * Math.sin(thetaIzq), z, cx, cy, scale)
      });
      pDer.push({
        x: r * Math.cos(thetaDer),
        y: r * Math.sin(thetaDer),
        z: z,
        p2d: projectTo2DLogo(r * Math.cos(thetaDer), r * Math.sin(thetaDer), z, cx, cy, scale)
      });
    }

    // 2. Build Cut Curve Points
    const cutPoints = [];
    for (let i = 0; i <= numSteps; i++) {
      const theta = (i / numSteps) * Math.PI * 2;
      const cp = getCutPoint(theta);
      cutPoints.push({
        theta: theta,
        x: cp.x, y: cp.y, z: cp.z,
        p2d: projectTo2DLogo(cp.x, cp.y, cp.z, cx, cy, scale)
      });
    }

    const cpIzq = getCutPoint(thetaIzq);
    const cpDer = getCutPoint(thetaDer);

    // 3. FULL SILHOUETTE SOLID BACKING
    if (fullBackingFill) {
      ctx.save();
      ctx.fillStyle = fullBackingFill;
      ctx.beginPath();
      for (let i = 0; i < pIzq.length; i++) {
        i === 0 ? ctx.moveTo(pIzq[i].p2d.px, pIzq[i].p2d.py) : ctx.lineTo(pIzq[i].p2d.px, pIzq[i].p2d.py);
      }
      for (let i = pDer.length - 1; i >= 0; i--) {
        ctx.lineTo(pDer[i].p2d.px, pDer[i].p2d.py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 4. INDEPENDENT BOLD OUTER CONTAINER FRAME (Drawn FIRST as independent background shell)
    if (outerBorderStroke) {
      ctx.save();
      ctx.strokeStyle = outerBorderStroke;
      ctx.lineWidth = outerBorderWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i < pIzq.length; i++) {
        i === 0 ? ctx.moveTo(pIzq[i].p2d.px, pIzq[i].p2d.py) : ctx.lineTo(pIzq[i].p2d.px, pIzq[i].p2d.py);
      }
      for (let i = pDer.length - 1; i >= 0; i--) {
        ctx.lineTo(pDer[i].p2d.px, pDer[i].p2d.py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // 5. LOWER HEMISPHERE SOLID FILL
    if (lowerFill) {
      ctx.save();
      ctx.fillStyle = lowerFill;
      ctx.beginPath();

      let started = false;
      for (let i = pIzq.length - 1; i >= 0; i--) {
        const pt = pIzq[i];
        const zPlano = 0.6 * (pt.x + pt.y) + 0.3;
        if (pt.z <= zPlano) {
          if (!started) { ctx.moveTo(pt.p2d.px, pt.p2d.py); started = true; }
          else { ctx.lineTo(pt.p2d.px, pt.p2d.py); }
        }
      }

      for (let i = 0; i < pDer.length; i++) {
        const pt = pDer[i];
        const zPlano = 0.6 * (pt.x + pt.y) + 0.3;
        if (pt.z <= zPlano) {
          ctx.lineTo(pt.p2d.px, pt.p2d.py);
        }
      }

      for (let i = 0; i <= numSteps; i++) {
        const theta = thetaDer + (i / numSteps) * (thetaIzq - thetaDer);
        const cp = getCutPoint(theta);
        const pt2d = projectTo2DLogo(cp.x, cp.y, cp.z, cx, cy, scale);
        ctx.lineTo(pt2d.px, pt2d.py);
      }

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 6. UPPER FLUID SOLID FILL
    if (upperFill) {
      ctx.save();
      ctx.fillStyle = upperFill;
      ctx.beginPath();
      const pApex2D = projectTo2DLogo(0, 0, SQRT5, cx, cy, scale);
      ctx.moveTo(pApex2D.px, pApex2D.py);

      for (let i = pIzq.length - 1; i >= 0; i--) {
        const pt = pIzq[i];
        const zPlano = 0.6 * (pt.x + pt.y) + 0.3;
        if (pt.z >= zPlano) {
          ctx.lineTo(pt.p2d.px, pt.p2d.py);
        }
      }

      for (let i = 0; i <= numSteps; i++) {
        const theta = thetaIzq - (i / numSteps) * (thetaIzq - thetaDer);
        const cp = getCutPoint(theta);
        const pt2d = projectTo2DLogo(cp.x, cp.y, cp.z, cx, cy, scale);
        ctx.lineTo(pt2d.px, pt2d.py);
      }

      for (let i = 0; i < pDer.length; i++) {
        const pt = pDer[i];
        const zPlano = 0.6 * (pt.x + pt.y) + 0.3;
        if (pt.z >= zPlano) {
          ctx.lineTo(pt.p2d.px, pt.p2d.py);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 7. CUT CURVE STROKE
    if (cutStroke) {
      ctx.save();
      ctx.strokeStyle = cutStroke;
      ctx.lineWidth = lineWidth * 1.15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (withBackCulling) {
        const maxCutIdx = Math.floor(numSteps * drawProgress);
        for (let i = 0; i <= maxCutIdx; i++) {
          const theta = thetaDer + (i / numSteps) * (thetaIzq - thetaDer);
          const cp = getCutPoint(theta);
          const pt2d = projectTo2DLogo(cp.x, cp.y, cp.z, cx, cy, scale);
          i === 0 ? ctx.moveTo(pt2d.px, pt2d.py) : ctx.lineTo(pt2d.px, pt2d.py);
        }
      } else {
        const maxCutIdx = Math.floor(cutPoints.length * drawProgress);
        for (let i = 0; i <= maxCutIdx; i++) {
          const cp = cutPoints[i];
          if (!cp) continue;
          i === 0 ? ctx.moveTo(cp.p2d.px, cp.p2d.py) : ctx.lineTo(cp.p2d.px, cp.p2d.py);
        }
        if (drawProgress >= 0.99) ctx.closePath();
      }
      ctx.stroke();
      ctx.restore();
    }

    // 8. UPPER SILHOUETTE STROKE
    if (upperStroke) {
      ctx.save();
      ctx.strokeStyle = upperStroke;
      ctx.lineWidth = lineWidth * 1.1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const numS = 60;
      const maxS = Math.floor(numS * drawProgress);
      for (let i = 0; i <= maxS; i++) {
        const z = cpIzq.z + (i / numS) * (SQRT5 - cpIzq.z);
        const r = (SQRT5 - z) / 2;
        const pt = projectTo2DLogo(r * Math.cos(thetaIzq), r * Math.sin(thetaIzq), z, cx, cy, scale);
        i === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
      }
      for (let i = 0; i <= maxS; i++) {
        const z = SQRT5 - (i / numS) * (SQRT5 - cpDer.z);
        const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
        const pt = projectTo2DLogo(r * Math.cos(thetaDer), r * Math.sin(thetaDer), z, cx, cy, scale);
        ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 9. LOWER SPHERE WIREFRAME GRID
    if (gridStroke) {
      ctx.save();
      ctx.strokeStyle = gridStroke;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const SALTO_NEW = 3 * SALTO / 2;
      const NUDGE_G = 0.12;
      const ringConfigs = [
        { z: Y0 - NUDGE_G,                 r: Math.sqrt(Math.max(0, 1 - (Y0 - NUDGE_G)**2)) },
        { z: Y0 - SALTO_NEW,               r: Math.sqrt(Math.max(0, 1 - (Y0 - SALTO_NEW)**2)) },
        { z: Y0 - 2*SALTO_NEW + NUDGE_G,   r: Math.sqrt(Math.max(0, 1 - (Y0 - 2*SALTO_NEW + NUDGE_G)**2)) }
      ];

      ringConfigs.forEach(ring => {
        ctx.beginPath();
        const numStepsRing = 120;
        let isDrawing = false;
        for (let i = 0; i <= numStepsRing; i++) {
          const theta = (i / numStepsRing) * Math.PI * 2;
          const x = ring.r * Math.cos(theta);
          const y = ring.r * Math.sin(theta);
          const z = ring.z;

          if (withBackCulling) {
            const dot2D = x * camDir2D.x + y * camDir2D.y;
            if (dot2D < 0.02) { isDrawing = false; continue; }
          }

          const zPlano = 0.6 * (x + y) + 0.3;
          if (z > zPlano) { isDrawing = false; continue; }

          const pt2d = projectTo2DLogo(x, y, z, cx, cy, scale);
          if (!isDrawing) { ctx.moveTo(pt2d.px, pt2d.py); isDrawing = true; }
          else { ctx.lineTo(pt2d.px, pt2d.py); }
        }
        ctx.stroke();
      });

      const meridianAngles = [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4];
      meridianAngles.forEach(theta => {
        if (withBackCulling) {
          const testX = Math.cos(theta);
          const testY = Math.sin(theta);
          const dot2D = testX * camDir2D.x + testY * camDir2D.y;
          if (dot2D < 0.02) return;
        }

        const cp = getCutPoint(theta);
        const zCut = cp.z;
        const numStepsM = 60;
        const maxM = Math.floor(numStepsM * drawProgress);

        ctx.beginPath();
        for (let i = 0; i <= maxM; i++) {
          const t = i / numStepsM;
          const z = -1.0 + t * (zCut - (-1.0));
          const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);
          const pt2d = projectTo2DLogo(x, y, z, cx, cy, scale);
          i === 0 ? ctx.moveTo(pt2d.px, pt2d.py) : ctx.lineTo(pt2d.px, pt2d.py);
        }
        ctx.stroke();
      });
      ctx.restore();
    }

    // 10. LOWER SILHOUETTE PERIMETER CONTOUR
    const effectiveLowerContour = (lowerContourStroke !== undefined) ? lowerContourStroke : gridStroke;
    if (effectiveLowerContour) {
      ctx.save();
      ctx.strokeStyle = effectiveLowerContour;
      ctx.lineWidth = lowerContourWidth || (lineWidth * 1.15);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const numS = 60;
      const maxS = Math.floor(numS * drawProgress);
      ctx.beginPath();
      for (let i = 0; i <= maxS; i++) {
        const z = cpIzq.z - (i / numS) * (cpIzq.z - (-1.0));
        const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
        const pt = projectTo2DLogo(r * Math.cos(thetaIzq), r * Math.sin(thetaIzq), z, cx, cy, scale);
        i === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
      }
      for (let i = 0; i <= maxS; i++) {
        const z = -1.0 + (i / numS) * (cpDer.z - (-1.0));
        const r = z > Y0 ? (SQRT5 - z) / 2 : Math.sqrt(Math.max(0, 1 - z * z));
        const pt = projectTo2DLogo(r * Math.cos(thetaDer), r * Math.sin(thetaDer), z, cx, cy, scale);
        ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // Draw 3D Step 15 Surface Patches
  function renderStep15Surfaces3D(cx, cy, scale, alpha, fillProgress = 1.0) {
    if (alpha <= 0.001 || fillProgress <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    const pApex = projectPoint(0, 0, SQRT5, cx, cy, scale);
    const pCentroid = projectPoint(0, 0, CC, cx, cy, scale);
    const numU = 24;
    const numV = Math.max(1, Math.floor(8 * fillProgress));

        // Smooth animated color transition into unified cyan #00F0FF if moving to/from Step 16
    const unifyT = (currentStepIdx === 15) ? fillProgress : ((currentStepIdx > 15) ? 1.0 : 0.0);

    const colTt2 = lerpColor('rgba(249, 115, 22, 0.70)', 'rgba(0, 240, 255, 0.85)', unifyT);
    const colTt1 = lerpColor('rgba(168, 85, 247, 0.70)', 'rgba(0, 240, 255, 0.90)', unifyT);
    const colTb  = lerpColor('rgba(236, 72, 153, 0.70)', 'rgba(0, 240, 255, 0.85)', unifyT);
    const colBase = lerpColor('rgba(129, 140, 248, 0.75)', 'rgba(0, 240, 255, 0.92)', unifyT);

    // 1. T_t2: Full Pseudo-cone posterior
    ctx.fillStyle = colTt2;
    ctx.strokeStyle = lerpColor('rgba(251, 146, 60, 0.4)', 'rgba(0, 240, 255, 0.3)', unifyT);
    ctx.lineWidth = 0.8;
    for (let i = 0; i < numU; i++) {
      const b1 = THETA_1 + (i / numU) * (2 * Math.PI + THETA_2 - THETA_1);
      const b2 = THETA_1 + ((i + 1) / numU) * (2 * Math.PI + THETA_2 - THETA_1);
      for (let j = 0; j < numV; j++) {
        const t1 = j / 8, t2 = (j + 1) / 8;

        const p1 = projectPoint(t1 * X0 * Math.cos(b1), t1 * X0 * Math.sin(b1), SQRT5 + t1 * (Y0 - SQRT5), cx, cy, scale);
        const p2 = projectPoint(t1 * X0 * Math.cos(b2), t1 * X0 * Math.sin(b2), SQRT5 + t1 * (Y0 - SQRT5), cx, cy, scale);
        const p3 = projectPoint(t2 * X0 * Math.cos(b2), t2 * X0 * Math.sin(b2), SQRT5 + t2 * (Y0 - SQRT5), cx, cy, scale);
        const p4 = projectPoint(t2 * X0 * Math.cos(b1), t2 * X0 * Math.sin(b1), SQRT5 + t2 * (Y0 - SQRT5), cx, cy, scale);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.lineTo(p3.px, p3.py); ctx.lineTo(p4.px, p4.py);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
    }

    // 2. T_t1: Pseudo-cone anterior down to cut curve
    ctx.fillStyle = colTt1;
    ctx.strokeStyle = lerpColor('rgba(192, 132, 252, 0.4)', 'rgba(0, 240, 255, 0.3)', unifyT);
    for (let i = 0; i < numU; i++) {
      const b1 = THETA_2 + (i / numU) * (THETA_1 - THETA_2);
      const b2 = THETA_2 + ((i + 1) / numU) * (THETA_1 - THETA_2);
      const cp1 = getCutPoint(b1);
      const cp2 = getCutPoint(b2);

      for (let j = 0; j < numV; j++) {
        const t1 = j / 8, t2 = (j + 1) / 8;

        const p1 = projectPoint(t1 * cp1.x, t1 * cp1.y, SQRT5 + t1 * (cp1.z - SQRT5), cx, cy, scale);
        const p2 = projectPoint(t1 * cp2.x, t1 * cp2.y, SQRT5 + t1 * (cp2.z - SQRT5), cx, cy, scale);
        const p3 = projectPoint(t2 * cp2.x, t2 * cp2.y, SQRT5 + t2 * (cp2.z - SQRT5), cx, cy, scale);
        const p4 = projectPoint(t2 * cp1.x, t2 * cp1.y, SQRT5 + t2 * (cp1.z - SQRT5), cx, cy, scale);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.lineTo(p3.px, p3.py); ctx.lineTo(p4.px, p4.py);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
    }

    // 3. T_b: Spherical shell patch between cut curve and Y0
    ctx.fillStyle = colTb;
    ctx.strokeStyle = lerpColor('rgba(244, 114, 182, 0.4)', 'rgba(0, 240, 255, 0.3)', unifyT);
    for (let i = 0; i < numU; i++) {
      const b1 = THETA_1 + (i / numU) * (2 * Math.PI + THETA_2 - THETA_1);
      const b2 = THETA_1 + ((i + 1) / numU) * (2 * Math.PI + THETA_2 - THETA_1);
      const cp1 = getCutPoint(b1);
      const cp2 = getCutPoint(b2);

      const ang1 = Math.asin(Math.max(-1, Math.min(1, cp1.z)));
      const ang2 = Math.asin(Math.max(-1, Math.min(1, cp2.z)));
      const angY0 = Math.asin(Y0);

      for (let j = 0; j < numV; j++) {
        const t1 = j / 8, t2 = (j + 1) / 8;

        const a1_1 = ang1 * (1 - t1) + angY0 * t1;
        const a2_1 = ang2 * (1 - t1) + angY0 * t1;
        const a2_2 = ang2 * (1 - t2) + angY0 * t2;
        const a1_2 = ang1 * (1 - t2) + angY0 * t2;

        const p1 = projectPoint(Math.cos(a1_1) * Math.cos(b1), Math.cos(a1_1) * Math.sin(b1), Math.sin(a1_1), cx, cy, scale);
        const p2 = projectPoint(Math.cos(a2_1) * Math.cos(b2), Math.cos(a2_1) * Math.sin(b2), Math.sin(a2_1), cx, cy, scale);
        const p3 = projectPoint(Math.cos(a2_2) * Math.cos(b2), Math.cos(a2_2) * Math.sin(b2), Math.sin(a2_2), cx, cy, scale);
        const p4 = projectPoint(Math.cos(a1_2) * Math.cos(b1), Math.cos(a1_2) * Math.sin(b1), Math.sin(a1_2), cx, cy, scale);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.lineTo(p3.px, p3.py); ctx.lineTo(p4.px, p4.py);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
    }

    // 4 & 5. B_t & B_b: Planar cut base cross-section
    ctx.fillStyle = colBase;
    ctx.strokeStyle = lerpColor('rgba(165, 180, 252, 0.4)', 'rgba(0, 240, 255, 0.5)', unifyT);
    const maxEll = Math.floor(numU * 2 * fillProgress);
    for (let i = 0; i < maxEll; i++) {
      const b1 = (i / (numU * 2)) * Math.PI * 2;
      const b2 = ((i + 1) / (numU * 2)) * Math.PI * 2;
      const cp1 = getCutPoint(b1);
      const cp2 = getCutPoint(b2);

      const pt1 = projectPoint(cp1.x, cp1.y, cp1.z, cx, cy, scale);
      const pt2 = projectPoint(cp2.x, cp2.y, cp2.z, cx, cy, scale);

      ctx.beginPath();
      ctx.moveTo(pCentroid.px, pCentroid.py);
      ctx.lineTo(pt1.px, pt1.py);
      ctx.lineTo(pt2.px, pt2.py);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    for (let i = 0; i <= maxEll; i++) {
      const b = (i / (numU * 2)) * Math.PI * 2;
      const cp = getCutPoint(b);
      const pt = projectPoint(cp.x, cp.y, cp.z, cx, cy, scale);
      i === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
    }
    if (fillProgress >= 0.99) ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // CLEAN, CRISP DECK SLIDING ANIMATION (NO FADING / NO BLUR) + RADIAL ZOOM OUT FOR STEP 20
  function renderVariantsGridWithAnimation(w, h, deployT) {
    const gapX = 14;
    const gapY = 12;
    const cardW = Math.min(135, (w - 4 * gapX) / 3);
    const cardH = Math.min(195, (h - 3 * gapY) / 2);
    const varScaleTarget = Math.min(cardW, cardH) * 0.32;
    const origScale = Math.min(w, h) * 0.235 * 1.05;

    const totalW_row1 = 3 * cardW + 2 * gapX;
    const totalH = 2 * cardH + gapY;
    const startX_row1 = (w - totalW_row1) / 2;
    const startY_row1 = (h - totalH) / 2;

    const totalW_row2 = 2 * cardW + gapX;
    const startX_row2 = (w - totalW_row2) / 2;
    const startY_row2 = startY_row1 + cardH + gapY;

    const zDropCenter = (SQRT5 - 1.0) / 2;

    const origCardX = w / 2 - cardW / 2;
    const origCardY = h / 2 - cardH / 2;

    const targets = [
      // 1. Principal AC (Top-Left)
      {
        x: startX_row1, y: startY_row1,
        bgFill: '#070B0E', borderStroke: 'rgba(0, 210, 255, 0.4)',
        opts: { fullBackingFill: '#070B0E', upperFill: '#00F0FF', upperStroke: '#00F0FF', cutStroke: '#00F0FF', gridStroke: '#39FF14', lowerContourStroke: '#39FF14', withBackCulling: true, lineWidth: 2.0 }
      },
      // 2. Monocromático AC (Top-Center)
      {
        x: startX_row1 + cardW + gapX, y: startY_row1,
        bgFill: '#070B0E', borderStroke: 'rgba(255, 255, 255, 0.3)',
        opts: { fullBackingFill: '#070B0E', upperFill: '#FFFFFF', upperStroke: '#FFFFFF', cutStroke: '#FFFFFF', gridStroke: '#FFFFFF', lowerContourStroke: '#FFFFFF', withBackCulling: true, lineWidth: 2.0 }
      },
      // 3. Simple AC (Top-Right)
      {
        x: startX_row1 + 2 * (cardW + gapX), y: startY_row1,
        bgFill: '#FFFFFF', borderStroke: 'rgba(0, 0, 0, 0.3)',
        opts: { upperFill: '#000000', lowerFill: null, upperStroke: '#000000', cutStroke: '#000000', gridStroke: '#000000', lowerContourStroke: '#000000', withBackCulling: true, lineWidth: 2.0 }
      },
      // 4. Principal BC (Bottom-Left)
      {
        x: startX_row2, y: startY_row2,
        bgFill: '#FFFFFF', borderStroke: 'rgba(0, 0, 0, 0.25)',
        opts: { outerBorderStroke: '#000000', outerBorderWidth: 8.2, lowerFill: '#000000', upperFill: '#00F0FF', upperStroke: '#00F0FF', cutStroke: '#00F0FF', gridStroke: '#39FF14', lowerContourStroke: '#39FF14', withBackCulling: true, lineWidth: 2.0 }
      },
      // 5. Monocromático BC (Bottom-Right)
      {
        x: startX_row2 + cardW + gapX, y: startY_row2,
        bgFill: '#FFFFFF', borderStroke: 'rgba(0, 0, 0, 0.25)',
        opts: { outerBorderStroke: '#000000', outerBorderWidth: 8.2, lowerFill: '#000000', upperFill: '#FFFFFF', upperStroke: '#FFFFFF', cutStroke: '#FFFFFF', gridStroke: '#FFFFFF', lowerContourStroke: '#FFFFFF', withBackCulling: true, lineWidth: 2.0 }
      }
    ];

    const ease = easeInOutQuart(Math.max(0, Math.min(1, deployT)));
    const curScale = origScale + (varScaleTarget - origScale) * ease;

    const drawOrder = [4, 3, 2, 1, 0];
    drawOrder.forEach(idx => {
      const card = targets[idx];
      const curX = origCardX + (card.x - origCardX) * ease;
      const curY = origCardY + (card.y - origCardY) * ease;

      ctx.fillStyle = card.bgFill;
      ctx.fillRect(curX, curY, cardW, cardH);
      ctx.strokeStyle = card.borderStroke;
      ctx.strokeRect(curX, curY, cardW, cardH);

      const curLogoX = curX + cardW / 2;
      const curLogoY = curY + cardH / 2 + zDropCenter * curScale;
      renderShadowMakerLogo(ctx, curLogoX, curLogoY, curScale, card.opts);
    });
  }

  // 1:1 CANONICAL INKSCAPE SVG PATHS FOR MINI VARIANTS
  const svgPathContour = new Path2D("m 266.28986,559.95562 0.617,1.217 0.631,1.218 0.646,1.217 0.659,1.217 0.675,1.217 0.689,1.218 0.704,1.217 0.72,1.217 0.736,1.218 0.751,1.217 0.767,1.217 0.784,1.217 0.801,1.218 0.818,1.217 0.835,1.217 0.853,1.218 0.872,1.217 0.89,1.217 0.908,1.217 0.929,1.218 0.948,1.217 0.969,1.217 0.989,1.218 1.011,1.217 1.033,1.217 1.056,1.217 1.078,1.218 1.103,1.217 1.128,1.217 1.152,1.218 1.179,1.217 1.206,1.217 1.235,1.217 1.263,1.218 1.293,1.217 1.325,1.217 1.357,1.218 1.391,1.217 1.426,1.217 1.464,1.217 1.502,1.218 1.542,1.217 1.586,1.217 1.63,1.218 1.677,1.217 1.728,1.217 1.781,1.217 1.838,1.218 1.899,1.217 1.963,1.217 2.034,1.218 2.11,1.217 2.193,1.217 2.283,1.217 2.383,1.218 2.493,1.217 2.618,1.217 2.758,1.218 2.92,1.217 3.108,1.217 3.33,1.217 3.60198,1.218 3.942,1.217 4.388,1.217 5.013,1.218 5.983,1.217 7.847,1.217 9.3235,1.07056 9.7535,0.14644 9.2359,-0.5892 9.8411,-0.6278 7.847,-1.217 5.983,-1.217 5.013,-1.218 4.388,-1.217 3.942,-1.217 3.602,-1.218 3.33,-1.217 3.108,-1.217 2.92,-1.217 2.758,-1.218 2.618,-1.217 2.493,-1.217 2.383,-1.218 2.283,-1.217 2.193,-1.217 2.11,-1.217 2.034,-1.218 1.963,-1.217 1.899,-1.217 1.838,-1.218 1.781,-1.217 1.728,-1.217 1.677,-1.217 1.63,-1.218 1.586,-1.217 1.542,-1.217 1.502,-1.218 1.464,-1.217 1.426,-1.217 1.391,-1.217 1.357,-1.218 1.325,-1.217 1.293,-1.217 1.263,-1.218 1.235,-1.217 1.206,-1.217 1.179,-1.217 1.152,-1.218 1.128,-1.217 1.103,-1.217 1.078,-1.218 1.056,-1.217 1.033,-1.217 1.011,-1.217 0.989,-1.218 0.969,-1.217 0.948,-1.217 0.929,-1.218 0.908,-1.217 0.89,-1.217 0.872,-1.217 0.853,-1.218 0.835,-1.217 0.818,-1.217 0.801,-1.218 0.784,-1.217 0.767,-1.217 0.751,-1.217 0.736,-1.218 0.72,-1.217 0.704,-1.217 0.689,-1.218 0.675,-1.217 0.659,-1.217 0.646,-1.217 0.631,-1.218 0.617,-1.217 0.603,-1.217 0.589,-1.218 0.576,-1.217 0.563,-1.217 0.55,-1.217 0.536,-1.218 0.524,-1.217 0.511,-1.217 0.499,-1.218 0.486,-1.217 0.474,-1.217 0.461,-1.217 0.45,-1.218 0.438,-1.217 0.426,-1.217 0.414,-1.218 0.403,-1.217 0.391,-1.217 0.379,-1.217 0.369,-1.218 0.357,-1.217 0.346,-1.217 0.335,-1.218 0.324,-1.217 0.313,-1.217 0.302,-1.217 0.291,-1.218 0.281,-1.217 0.27,-1.217 0.259,-1.218 0.249,-1.217 0.238,-1.217 0.228,-1.217 0.218,-1.218 0.207,-1.217 0.197,-1.217 0.186,-1.218 0.177,-1.217 0.166,-1.217 0.156,-1.217 0.146,-1.218 0.136,-1.217 0.125,-1.217 0.116,-1.218 0.106,-1.217 0.096,-1.217 0.085,-1.217 0.076,-1.218 0.066,-1.217 0.056,-1.217 0.046,-1.218 0.036,-1.217 0.026,-1.217 0.016,-1.217 0.01,-1.218 v -1.217 l -0.013,-1.217 -0.023,-1.218 -0.033,-1.217 -0.043,-1.217 -0.053,-1.217 -0.063,-1.218 -0.073,-1.217 -0.083,-1.217 -0.093,-1.218 -0.103,-1.217 -0.112,-1.217 -0.123,-1.217 -0.133,-1.218 -0.143,-1.217 -0.153,-1.217 -0.163,-1.218 -0.173,-1.217 -0.184,-1.217 -0.194,-1.217 -0.204,-1.218 -0.214,-1.217 -0.225,-1.217 -0.235,-1.218 -0.246,-1.217 -0.256,-1.217 -0.267,-1.217 -0.278,-1.218 -0.288,-1.217 -0.299,-1.217 -0.31,-1.218 -0.32,-1.217 -0.332,-1.217 -0.343,-1.217 -0.353,-1.218 -0.365,-1.217 -0.377,-1.217 -0.387,-1.218 -0.4,-1.217 -0.41,-1.217 -0.423,-1.217 -0.434,-1.218 -0.446,-1.217 -0.458,-1.217 -0.471,-1.218 -0.482,-1.217 -0.495,-1.217 -0.507,-1.217 -0.52,-1.218 -0.533,-1.217 -0.546,-1.217 -0.559,-1.218 -0.572,-1.217 -0.585,-1.217 -0.599,-1.217 -0.5327,-1.218 -0.5778,-1.342 -0.5465,-1.2795 -0.484,-1.0305 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.61,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.61449,-1.24684 c -0.1756,-0.67759 -101.88771,-203.66446 -102.92506,-205.73916 -45.42747,90.84684 -91.25001,181.52709 -136.055,272.672 l -0.559,1.218 -0.546,1.217 -0.533,1.217 -0.52,1.218 -0.507,1.217 -0.495,1.217 -0.482,1.217 -0.471,1.218 -0.458,1.217 -0.446,1.217 -0.434,1.218 -0.423,1.217 -0.41,1.217 -0.4,1.217 -0.387,1.218 -0.377,1.217 -0.365,1.217 -0.353,1.218 -0.343,1.217 -0.332,1.217 -0.32,1.217 -0.31,1.218 -0.299,1.217 -0.288,1.217 -0.278,1.218 -0.267,1.217 -0.256,1.217 -0.246,1.217 -0.235,1.218 -0.225,1.217 -0.214,1.217 -0.204,1.218 -0.194,1.217 -0.184,1.217 -0.173,1.217 -0.163,1.218 -0.153,1.217 -0.143,1.217 -0.133,1.218 -0.123,1.217 -0.112,1.217 -0.103,1.217 -0.093,1.218 -0.083,1.217 -0.073,1.217 -0.063,1.218 -0.053,1.217 -0.043,1.217 -0.033,1.217 -0.023,1.218 -0.013,1.217 -0.004,1.217 0.007,1.218 0.016,1.217 0.026,1.217 0.036,1.217 0.046,1.218 0.056,1.217 0.066,1.217 0.076,1.218 0.085,1.217 0.096,1.217 0.106,1.217 0.116,1.218 0.125,1.217 0.136,1.217 0.146,1.218 0.156,1.217 0.166,1.217 0.177,1.217 0.186,1.218 0.197,1.217 0.207,1.217 0.218,1.218 0.228,1.217 0.238,1.217 0.249,1.217 0.259,1.218 0.27,1.217 0.281,1.217 0.291,1.218 0.302,1.217 0.313,1.217 0.324,1.217 0.335,1.218 0.346,1.217 0.357,1.217 0.369,1.218 0.379,1.217 0.391,1.217 0.403,1.217 0.414,1.218 0.426,1.217 0.438,1.217 0.45,1.218 0.461,1.217 0.474,1.217 0.486,1.217 0.499,1.218 0.511,1.217 0.524,1.217 0.536,1.218 0.55,1.217 0.563,1.217 0.576,1.217 0.589,1.218 0.704,1.396 z");
  const svgPathBottom = new Path2D("m 265.87882,560.07344 0.617,1.217 0.631,1.218 0.646,1.217 0.659,1.217 0.675,1.217 0.689,1.218 0.704,1.217 0.72,1.217 0.736,1.218 0.751,1.217 0.767,1.217 0.784,1.217 0.801,1.218 0.818,1.217 0.835,1.217 0.853,1.218 0.872,1.217 0.89,1.217 0.908,1.217 0.929,1.218 0.948,1.217 0.969,1.217 0.989,1.218 1.011,1.217 1.033,1.217 1.056,1.217 1.078,1.218 1.103,1.217 1.128,1.217 1.152,1.218 1.179,1.217 1.206,1.217 1.235,1.217 1.263,1.218 1.293,1.217 1.325,1.217 1.357,1.218 1.391,1.217 1.426,1.217 1.464,1.217 1.502,1.218 1.542,1.217 1.586,1.217 1.63,1.218 1.677,1.217 1.728,1.217 1.781,1.217 1.838,1.218 1.899,1.217 1.963,1.217 2.034,1.218 2.11,1.217 2.193,1.217 2.283,1.217 2.383,1.218 2.493,1.217 2.618,1.217 2.758,1.218 2.92,1.217 3.108,1.217 3.33,1.217 3.60198,1.218 3.942,1.217 4.388,1.217 5.013,1.218 5.983,1.217 7.847,1.217 9.3235,1.07056 9.7535,0.14644 9.2359,-0.5892 9.8411,-0.6278 7.847,-1.217 5.983,-1.217 5.013,-1.218 4.388,-1.217 3.942,-1.217 3.602,-1.218 3.33,-1.217 3.108,-1.217 2.92,-1.217 2.758,-1.218 2.618,-1.217 2.493,-1.217 2.383,-1.218 2.283,-1.217 2.193,-1.217 2.11,-1.217 2.034,-1.218 1.963,-1.217 1.899,-1.217 1.838,-1.218 1.781,-1.217 1.728,-1.217 1.677,-1.217 1.63,-1.218 1.586,-1.217 1.542,-1.217 1.502,-1.218 1.464,-1.217 1.426,-1.217 1.391,-1.217 1.357,-1.218 1.325,-1.217 1.293,-1.217 1.263,-1.218 1.235,-1.217 1.206,-1.217 1.179,-1.217 1.152,-1.218 1.128,-1.217 1.103,-1.217 1.078,-1.218 1.056,-1.217 1.033,-1.217 1.011,-1.217 0.989,-1.218 0.969,-1.217 0.948,-1.217 0.929,-1.218 0.908,-1.217 0.89,-1.217 0.872,-1.217 0.853,-1.218 0.835,-1.217 0.818,-1.217 0.801,-1.218 0.784,-1.217 0.767,-1.217 0.751,-1.217 0.736,-1.218 0.72,-1.217 0.704,-1.217 0.689,-1.218 0.675,-1.217 0.659,-1.217 0.646,-1.217 0.631,-1.218 0.617,-1.217 0.603,-1.217 0.589,-1.218 0.576,-1.217 0.563,-1.217 0.55,-1.217 0.536,-1.218 0.524,-1.217 0.511,-1.217 0.499,-1.218 0.486,-1.217 0.474,-1.217 0.461,-1.217 0.45,-1.218 0.438,-1.217 0.426,-1.217 0.414,-1.218 0.403,-1.217 0.391,-1.217 0.379,-1.217 0.369,-1.218 0.357,-1.217 0.346,-1.217 0.335,-1.218 0.324,-1.217 0.313,-1.217 0.302,-1.217 0.291,-1.218 0.281,-1.217 0.27,-1.217 0.259,-1.218 0.249,-1.217 0.238,-1.217 0.228,-1.217 0.218,-1.218 0.207,-1.217 0.197,-1.217 0.186,-1.218 0.177,-1.217 0.166,-1.217 0.156,-1.217 0.146,-1.218 0.136,-1.217 0.125,-1.217 0.116,-1.218 0.106,-1.217 0.096,-1.217 0.085,-1.217 0.076,-1.218 0.066,-1.217 0.056,-1.217 0.046,-1.218 0.036,-1.217 0.026,-1.217 0.016,-1.217 0.01,-1.218 v -1.217 l -0.013,-1.217 -0.023,-1.218 -0.033,-1.217 -0.043,-1.217 -0.053,-1.217 -0.063,-1.218 -0.073,-1.217 -0.083,-1.217 -0.093,-1.218 -0.103,-1.217 -0.112,-1.217 -0.123,-1.217 -0.133,-1.218 -0.143,-1.217 -0.153,-1.217 -0.163,-1.218 -0.173,-1.217 -0.184,-1.217 -0.194,-1.217 -0.204,-1.218 -0.214,-1.217 -0.225,-1.217 -0.235,-1.218 -0.246,-1.217 -0.256,-1.217 -0.267,-1.217 -0.278,-1.218 -0.288,-1.217 -0.299,-1.217 -0.31,-1.218 -0.32,-1.217 -0.332,-1.217 -0.343,-1.217 -0.353,-1.218 -0.365,-1.217 -0.377,-1.217 -0.387,-1.218 -0.4,-1.217 -0.41,-1.217 -0.423,-1.217 -0.434,-1.218 -0.446,-1.217 -0.458,-1.217 -0.471,-1.218 -0.482,-1.217 -0.495,-1.217 -0.507,-1.217 -0.52,-1.218 -0.533,-1.217 -0.546,-1.217 -0.559,-1.218 -0.572,-1.217 -0.585,-1.217 -0.599,-1.217 -0.5327,-1.218 -0.5778,-1.342 -0.5465,-1.2795 -0.484,-1.0305 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.61,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 -0.609,-1.217 -0.609,-1.218 -0.609,-1.217 -0.609,-1.217 z");
  const svgPathTop = new Path2D("m 265.27725,558.80944 -0.589,-1.218 -0.576,-1.217 -0.563,-1.217 -0.55,-1.217 -0.536,-1.218 -0.524,-1.217 -0.511,-1.217 -0.499,-1.218 -0.486,-1.217 -0.474,-1.217 -0.461,-1.217 -0.45,-1.218 -0.438,-1.217 -0.426,-1.217 -0.414,-1.218 -0.403,-1.217 -0.391,-1.217 -0.379,-1.217 -0.369,-1.218 -0.357,-1.217 -0.346,-1.217 -0.335,-1.218 -0.324,-1.217 -0.313,-1.217 -0.302,-1.217 -0.291,-1.218 -0.281,-1.217 -0.27,-1.217 -0.259,-1.218 -0.249,-1.217 -0.238,-1.217 -0.228,-1.217 -0.218,-1.218 -0.207,-1.217 -0.197,-1.217 -0.186,-1.218 -0.177,-1.217 -0.166,-1.217 -0.156,-1.217 -0.146,-1.218 -0.136,-1.217 -0.125,-1.217 -0.116,-1.218 -0.106,-1.217 -0.096,-1.217 -0.085,-1.217 -0.076,-1.218 -0.066,-1.217 -0.056,-1.217 -0.046,-1.218 -0.036,-1.217 -0.026,-1.217 -0.016,-1.217 -0.007,-1.218 0.004,-1.217 0.013,-1.217 0.023,-1.218 0.033,-1.217 0.043,-1.217 0.053,-1.217 0.063,-1.218 0.073,-1.217 0.083,-1.217 0.093,-1.218 0.103,-1.217 0.112,-1.217 0.123,-1.217 0.133,-1.218 0.143,-1.217 0.153,-1.217 0.163,-1.218 0.173,-1.217 0.184,-1.217 0.194,-1.217 0.204,-1.218 0.214,-1.217 0.225,-1.217 0.235,-1.218 0.246,-1.217 0.256,-1.217 0.267,-1.217 0.278,-1.218 0.288,-1.217 0.299,-1.217 0.31,-1.218 0.32,-1.217 0.332,-1.217 0.343,-1.217 0.353,-1.218 0.365,-1.217 0.377,-1.217 0.387,-1.218 0.4,-1.217 0.41,-1.217 0.423,-1.217 0.434,-1.218 0.446,-1.217 0.458,-1.217 0.471,-1.218 0.482,-1.217 0.495,-1.217 0.507,-1.217 0.52,-1.218 0.533,-1.217 0.546,-1.217 0.559,-1.218 c 44.80499,-91.14491 90.62753,-181.82516 136.055,-272.672 1.03735,2.0747 102.74946,205.06157 102.91958,205.70931 C 423.9479,428.7043 345.10549,494.75316 265.98125,560.20544 Z");
  const svgPathSlash = new Path2D("M 259.46192,567.62807 512.42862,357.1879 Z");

  function render2DCanonicalMiniDrop(ctx, cx, cy, scale, type) {
    const svgUnitScale = scale * 0.0055;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(svgUnitScale, svgUnitScale);
    ctx.translate(-385.5, -417.4);

    if (type === 'COLOR_DARK') {
      // 1. Bottom_Gota
      ctx.fillStyle = '#39ff14';
      ctx.fill(svgPathBottom);
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 19.65;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathBottom);

      // 2. Top_Gota
      ctx.fillStyle = '#00f0ff';
      ctx.fill(svgPathTop);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 19.65;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathTop);

      // 3. Slash
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 20.15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(svgPathSlash);

    } else if (type === 'MONO_DARK') {
      // 1. Bottom_Gota (stroke only)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 19.65;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathBottom);

      // 2. Top_Gota
      ctx.fillStyle = '#ffffff';
      ctx.fill(svgPathTop);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 19.65;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathTop);

      // 3. Slash
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 20.10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(svgPathSlash);

    } else if (type === 'COLOR_LIGHT') {
      // 1. Independent Contour (base silhouette + outer border)
      ctx.fillStyle = '#000000';
      ctx.fill(svgPathContour);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 49.13;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathContour);

      // 2. Bottom_Gota
      ctx.fillStyle = '#39ff14';
      ctx.fill(svgPathBottom);
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 19.65;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathBottom);

      // 3. Top_Gota
      ctx.fillStyle = '#00f0ff';
      ctx.fill(svgPathTop);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 19.65;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathTop);

      // 4. Slash
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 20.08;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(svgPathSlash);

    } else if (type === 'MONO_LIGHT') {
      // 1. Independent Contour (base silhouette + outer border)
      ctx.fillStyle = '#000000';
      ctx.fill(svgPathContour);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 49.13;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathContour);

      // 2. Bottom_Gota (White stroke only)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 19.65;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathBottom);

      // 3. Top_Gota (White fill + White stroke)
      ctx.fillStyle = '#ffffff';
      ctx.fill(svgPathTop);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 19.65;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(svgPathTop);

      // 4. Slash
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 20.08;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(svgPathSlash);
    }

    ctx.restore();
  }

  // 4 MINI-VARIANTS FOR MINIMUM SIZES (2x2 GRID)
  function renderMiniVariantsGridWithAnimation(w, h, deployT) {
    const gap = 16;
    const cardSize = Math.min(185, (h - 3 * gap) / 2, (w - 3 * gap) / 2);
    const cardW = cardSize;
    const cardH = cardSize;
    const varScaleTarget = cardSize * 0.255;
    const origScale = Math.min(w, h) * 0.235 * 1.05;

    const totalW = 2 * cardW + gap;
    const totalH = 2 * cardH + gap;
    const startX = (w - totalW) / 2;
    const startY = (h - totalH) / 2;

    const origCardX = w / 2 - cardW / 2;
    const origCardY = h / 2 - cardH / 2;

    const targets = [
      // 1. Color / Fondo Oscuro (Top-Left)
      {
        x: startX, y: startY,
        bgFill: '#000000', borderStroke: 'rgba(255, 255, 255, 0.18)',
        type: 'COLOR_DARK'
      },
      // 2. Monocromo / Fondo Oscuro (Top-Right)
      {
        x: startX + cardW + gap, y: startY,
        bgFill: '#000000', borderStroke: 'rgba(255, 255, 255, 0.18)',
        type: 'MONO_DARK'
      },
      // 3. Color con Borde / Fondo Claro (Bottom-Left)
      {
        x: startX, y: startY + cardH + gap,
        bgFill: '#FFFFFF', borderStroke: 'rgba(0, 0, 0, 0.2)',
        type: 'COLOR_LIGHT'
      },
      // 4. Monocromo / Fondo Claro (Bottom-Right)
      {
        x: startX + cardW + gap, y: startY + cardH + gap,
        bgFill: '#FFFFFF', borderStroke: 'rgba(0, 0, 0, 0.2)',
        type: 'MONO_LIGHT'
      }
    ];

    const ease = easeInOutQuart(Math.max(0, Math.min(1, deployT)));
    const curScale = origScale + (varScaleTarget - origScale) * ease;

    targets.forEach(card => {
      const curX = origCardX + (card.x - origCardX) * ease;
      const curY = origCardY + (card.y - origCardY) * ease;

      ctx.fillStyle = card.bgFill;
      ctx.fillRect(curX, curY, cardW, cardH);
      ctx.strokeStyle = card.borderStroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(curX, curY, cardW, cardH);

      const curLogoX = curX + cardW / 2;
      const curLogoY = curY + cardH / 2;
      render2DCanonicalMiniDrop(ctx, curLogoX, curLogoY, curScale, card.type);
    });
  }

  let genesisW = 650, genesisH = 520;
  function updateGenesisSize() {
    const dpr = window.devicePixelRatio || 1;
    genesisW = canvas.offsetWidth || 650;
    genesisH = canvas.offsetHeight || 520;
    canvas.width = genesisW * dpr;
    canvas.height = genesisH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  updateGenesisSize();
  window.addEventListener('resize', updateGenesisSize);

  let isGenesisVisible = true;
  let isGenesisRunning = false;

  function drawGenesisFrame(now) {
    if (!isGenesisVisible) {
      isGenesisRunning = false;
      return;
    }
    const w = genesisW;
    const h = genesisH;
    ctx.clearRect(0, 0, w, h);

    // Compute Step Internal Drawing Progress
    const stepElapsed = performance.now() - stepAnimStart;
    const stepRawProg = Math.min(1.0, stepElapsed / stepAnimDur);
    const stepProg = easeOutCubic(stepRawProg);

    // Compute Exit Undo Progress (1.0 -> 0.0)
    let exitProg = 0.0;
    if (exitState.active) {
      const exitElapsed = performance.now() - exitState.startTime;
      const exitRaw = Math.min(1.0, exitElapsed / exitState.duration);
      exitProg = 1.0 - easeOutCubic(exitRaw);
      if (exitRaw >= 1.0) {
        exitState.active = false;
      }
    }

    // COMPLEX DIMENSION TRANSITION STATE MACHINE
    if (animState.active) {
      const elapsed = performance.now() - animState.startTime;
      const p = Math.min(1.0, elapsed / animState.duration);
      const ease = easeInOutCubic(p);

      if (animState.mode === '6_TO_7' || animState.mode === '7_TO_6') {
        rotX = animState.startRotX + (animState.endRotX - animState.startRotX) * ease;
        rotY = animState.startRotY + (animState.endRotY - animState.startRotY) * ease;
        if (p >= 1.0) {
          animState.active = false;
          targetRotX = animState.endRotX;
          targetRotY = animState.endRotY;
        }
      } else if (animState.mode === '15_TO_16_PHASE1') {
        // Forward: Camera swoops to perspective, surfaces un-fill smoothly as exit animation
        rotX = animState.startRotX + (animState.endRotX - animState.startRotX) * ease;
        rotY = animState.startRotY + (animState.endRotY - animState.startRotY) * ease;
        animState.crossfade = 0.0;
        if (p >= 1.0) {
          animState.mode = '15_TO_16_PHASE2';
          animState.startTime = performance.now();
          animState.duration = 400;
        }
      } else if (animState.mode === '15_TO_16_PHASE2') {
        // Phase 2: Surfaces remain STRICTLY 0.0 (NO FLASH!), only wireframe crossfades to 2D
        rotX = CAM_PERSPECTIVE_ROTX;
        rotY = CAM_PERSPECTIVE_ROTY;
        animState.crossfade = ease;
        if (p >= 1.0) {
          animState.active = false;
          animState.crossfade = 1.0;
          targetRotX = 0; targetRotY = 0;
        }
      } else if (animState.mode === '16_TO_15_PHASE1') {
        // Backward: Crossfade 2D -> 3D and entrance-fill surfaces at perspective without rotating camera
        rotX = CAM_PERSPECTIVE_ROTX;
        rotY = CAM_PERSPECTIVE_ROTY;
        animState.crossfade = 1.0 - ease;
        if (p >= 1.0) {
          animState.active = false;
          animState.crossfade = 0.0;
          targetRotX = CAM_PERSPECTIVE_ROTX;
          targetRotY = CAM_PERSPECTIVE_ROTY;
        }
      } else if (animState.mode === '18_TO_19') {
        animState.deployT = p;
        if (p >= 1.0) {
          animState.active = false;
          animState.deployT = 1.0;
        }
      } else if (animState.mode === '19_TO_18') {
        animState.deployT = 1.0 - p;
        if (p >= 1.0) {
          animState.active = false;
          animState.deployT = 0.0;
        }
      }
    } else {
      rotX += (targetRotX - rotX) * 0.14;
      rotY += (targetRotY - rotY) * 0.14;

      if (isAutoRotating && STEPS[currentStepIdx].dim === 3) {
        targetRotY += 0.006;
      }
    }

    const s = STEPS[currentStepIdx];
    const stepNum = s.num;

    // EXACT MATHEMATICAL VERTICAL CENTERING
    const cx = w / 2;
    const scale = Math.min(w * 0.32, h * 0.235);
    const zCenter = (SQRT5 - 1.0) / 2;
    const cy = h / 2 + zCenter * scale;

    // STEP 19 & CLEAN SLIDING TRANSITIONS (18 <-> 19)
    if (stepNum === 19 || (animState.active && (animState.mode === '18_TO_19' || animState.mode === '19_TO_18'))) {
      const deployT = animState.active ? animState.deployT : 1.0;
      renderVariantsGridWithAnimation(w, h, deployT);
      requestAnimationFrame(drawGenesisFrame);
      return;
    }

    // Coordinate Axes
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    const orig = projectPoint(0, 0, 0, cx, cy, scale);
    const axX = projectPoint(1.4, 0, 0, cx, cy, scale);
    const axY = projectPoint(0, 1.4, 0, cx, cy, scale);
    const axZ = projectPoint(0, 0, 2.4, cx, cy, scale);

    ctx.beginPath(); ctx.moveTo(orig.px, orig.py); ctx.lineTo(axX.px, axX.py); ctx.stroke();
    if (s.dim === 3 || animState.active) {
      ctx.beginPath(); ctx.moveTo(orig.px, orig.py); ctx.lineTo(axY.px, axY.py); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(orig.px, orig.py); ctx.lineTo(axZ.px, axZ.py); ctx.stroke();
    ctx.restore();

    // ── 2D Steps (1 to 6) WITH SMOOTH REVERSE UN-DRAWING / ERASING IN STEP 4 ──
    if (stepNum <= 6 && !animState.active) {
      // Step 1: Base Circle
      if (stepNum === 1) {
        ctx.save();
        ctx.strokeStyle = '#93C5FD';
        ctx.lineWidth = 2.6;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(147, 197, 253, 0.5)';
        ctx.beginPath();
        const maxAngle = (stepNavDir === 1) ? Math.PI * 2 * stepProg : Math.PI * 2;
        for (let a = -Math.PI/2; a <= -Math.PI/2 + maxAngle + 0.02; a += 0.05) {
          const pt = projectPoint(Math.cos(a), 0, Math.sin(a), cx, cy, scale);
          a === -Math.PI/2 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
        ctx.restore();

        // If exiting from Step 2: cone lines un-draw back to apex
        if (exitState.active && exitState.exitingStepNum === 2) {
          ctx.save();
          ctx.strokeStyle = `rgba(245, 158, 11, ${exitProg})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          const pApex = projectPoint(0, 0, SQRT5, cx, cy, scale);
          const xExt = 1.25 * exitProg;
          const pLeft = projectPoint(-xExt, 0, -2 * xExt + SQRT5, cx, cy, scale);
          const pRight = projectPoint(xExt, 0, -2 * xExt + SQRT5, cx, cy, scale);
          ctx.moveTo(pLeft.px, pLeft.py); ctx.lineTo(pApex.px, pApex.py); ctx.lineTo(pRight.px, pRight.py);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Step 2 & 3: Circle + Absolute Value Lines
      if (stepNum === 2 || stepNum === 3) {
        ctx.save();
        ctx.strokeStyle = '#93C5FD';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.05) {
          const pt = projectPoint(Math.cos(a), 0, Math.sin(a), cx, cy, scale);
          a === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();

        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        const pApex = projectPoint(0, 0, SQRT5, cx, cy, scale);
        const xExt = 1.25 * ((stepNum === 2 && stepNavDir === 1) ? stepProg : 1.0);
        const pLeft = projectPoint(-xExt, 0, -2 * xExt + SQRT5, cx, cy, scale);
        const pRight = projectPoint(xExt, 0, -2 * xExt + SQRT5, cx, cy, scale);
        ctx.moveTo(pLeft.px, pLeft.py);
        ctx.lineTo(pApex.px, pApex.py);
        ctx.lineTo(pRight.px, pRight.py);
        ctx.stroke();
        ctx.restore();

        // Step 3 contact points
        if (stepNum === 3 || (exitState.active && exitState.exitingStepNum === 3)) {
          const pt1 = projectPoint(X0, 0, Y0, cx, cy, scale);
          const pt2 = projectPoint(-X0, 0, Y0, cx, cy, scale);
          const dotProg = (stepNum === 3) ? (stepNavDir === 1 ? stepProg : 1.0) : exitProg;
          if (dotProg > 0.001) {
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowBlur = 12 * dotProg;
            ctx.shadowColor = '#FFFFFF';
            [pt1, pt2].forEach(p => {
              ctx.beginPath(); ctx.arc(p.px, p.py, Math.max(1, 5 * dotProg), 0, Math.PI * 2); ctx.fill();
            });
            ctx.restore();
          }
        }
      }

      // Step 4, 5, 6: Delimited Fused Contour (with smooth physical un-drawing of discarded tails and upper arc)
      if (stepNum >= 4) {
        let eraseProg = 1.0;
        if (stepNum === 4 && stepNavDir === 1) {
          eraseProg = stepProg; // 0.0 -> 1.0
        } else if (exitState.active && exitState.exitingStepNum === 4) {
          eraseProg = 1.0 - exitProg; // 0.0 -> 1.0
        }

        if (eraseProg < 0.999) {
          const remaining = 1.0 - eraseProg;

          // 1. Discarded lower line tails: retract from bottom (x = 1.25) up to (X0, Y0)
          const xTail = X0 + (1.25 - X0) * remaining;
          ctx.save();
          ctx.strokeStyle = `rgba(245, 158, 11, ${remaining * 0.9})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          const pL_tan = projectPoint(-X0, 0, Y0, cx, cy, scale);
          const pL_cur = projectPoint(-xTail, 0, -2 * xTail + SQRT5, cx, cy, scale);
          const pR_tan = projectPoint(X0, 0, Y0, cx, cy, scale);
          const pR_cur = projectPoint(xTail, 0, -2 * xTail + SQRT5, cx, cy, scale);
          ctx.moveTo(pL_tan.px, pL_tan.py); ctx.lineTo(pL_cur.px, pL_cur.py);
          ctx.moveTo(pR_tan.px, pR_tan.py); ctx.lineTo(pR_cur.px, pR_cur.py);
          ctx.stroke();
          ctx.restore();

          // 2. Discarded upper circle arc above Y0: retracts symmetrically from apex to contact points
          ctx.save();
          ctx.strokeStyle = `rgba(147, 197, 253, ${remaining * 0.9})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          const aTan = Math.asin(Y0);
          const aSpan = (Math.PI/2 - aTan) * remaining;
          for (let a = Math.PI/2 - aSpan; a <= Math.PI/2 + aSpan + 0.02; a += 0.05) {
            const pt = projectPoint(Math.cos(a), 0, Math.sin(a), cx, cy, scale);
            a <= Math.PI/2 - aSpan + 0.01 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Draw solid kept fused contour in white
        ctx.save();
        ctx.strokeStyle = '#F8FAFC';
        ctx.lineWidth = 3.0;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();

        const pApex = projectPoint(0, 0, SQRT5, cx, cy, scale);
        const ptRight = projectPoint(X0, 0, Y0, cx, cy, scale);
        const ptLeft = projectPoint(-X0, 0, Y0, cx, cy, scale);

        ctx.moveTo(ptLeft.px, ptLeft.py);
        ctx.lineTo(pApex.px, pApex.py);
        ctx.lineTo(ptRight.px, ptRight.py);

        const aStart = Math.asin(Y0);
        for (let a = aStart; a >= -Math.PI - aStart; a -= 0.05) {
          const pt = projectPoint(Math.cos(a), 0, Math.sin(a), cx, cy, scale);
          ctx.lineTo(pt.px, pt.py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Step 5: Centroid Marker
      if (stepNum >= 5 || (exitState.active && exitState.exitingStepNum === 5)) {
        const pCentroid = projectPoint(0, 0, CC, cx, cy, scale);
        const cProg = (stepNum >= 5) ? ((stepNum === 5 && stepNavDir === 1) ? stepProg : 1.0) : exitProg;
        if (cProg > 0.001) {
          ctx.save();
          ctx.fillStyle = '#10B981';
          ctx.shadowBlur = 12 * cProg;
          ctx.shadowColor = '#10B981';
          ctx.beginPath(); ctx.arc(pCentroid.px, pCentroid.py, Math.max(1, 6 * cProg), 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }

      // Step 6: 2D Reference Line (Drawn only in Step 6, never while in 3D)
      if (stepNum === 6 || (exitState.active && exitState.exitingStepNum === 6)) {
        const lineProg = (stepNum === 6) ? ((stepNavDir === 1) ? stepProg : 1.0) : exitProg;
        if (lineProg > 0.001) {
          ctx.save();
          ctx.strokeStyle = '#34D399';
          ctx.setLineDash([6, 4]);
          ctx.lineWidth = 2.2;
          const xSpan = 1.2 * lineProg;
          const pL = projectPoint(-xSpan, 0, 0.5912 * (-xSpan) + CC, cx, cy, scale);
          const pR = projectPoint(xSpan, 0, 0.5912 * (xSpan) + CC, cx, cy, scale);
          ctx.beginPath(); ctx.moveTo(pL.px, pL.py); ctx.lineTo(pR.px, pR.py); ctx.stroke();
          ctx.restore();
        }
      }
    }

    // ── 3D Steps (7 to 15) WITH SLOW GRACEFUL OBLIQUE WATERFALL CASCADE ──
    const isHandling15to16Transition = animState.active && (
      animState.mode === '15_TO_16_PHASE1' ||
      animState.mode === '15_TO_16_PHASE2' ||
      animState.mode === '16_TO_15_PHASE1' ||
      animState.mode === '16_TO_15_PHASE2'
    );

    if ((stepNum >= 7 && stepNum <= 15) || isHandling15to16Transition || (animState.active && (animState.mode === '6_TO_7' || animState.mode === '7_TO_6'))) {
      const alpha3D = isHandling15to16Transition ? (1.0 - animState.crossfade) : 1.0;

      if (alpha3D > 0.001) {
        ctx.save();
        ctx.globalAlpha = alpha3D;

        // Step 7 -> 6 Return Transition: RENDER ONLY THE SINGLE CONTINUOUS PROFILE
        const isReturningTo2D = (animState.active && animState.mode === '7_TO_6');

        if (isReturningTo2D || stepNum === 7) {
          ctx.save();
          ctx.strokeStyle = '#F8FAFC';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          for (let a = -Math.PI/2; a <= Math.asin(Y0); a += 0.05) {
            const r = Math.cos(a), z = Math.sin(a);
            const pt = projectPoint(r, 0, z, cx, cy, scale);
            a === -Math.PI/2 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
          }
          const pApex = projectPoint(0, 0, SQRT5, cx, cy, scale);
          ctx.lineTo(pApex.px, pApex.py);
          ctx.stroke();
          ctx.restore();
        } else {
          // 8 Meridian Cascade
          const isStep8Forward = (stepNum === 8 && stepNavDir === 1);
          const isExitingStep8 = (exitState.active && exitState.exitingStepNum === 8);

          for (let i = 0; i < 8; i++) {
            const theta = i * Math.PI / 4;
            const cutPt = getCutPoint(theta);

            let mProgress = 1.0;
            if (i > 0) {
              if (isStep8Forward) {
                const tStart = (i - 1) / 7.0 * 0.45;
                const localP = Math.max(0, Math.min(1, (stepProg - tStart) / 0.55));
                mProgress = easeInOutCubic(localP);
              } else if (isExitingStep8) {
                const tStart = (7 - i) / 7.0 * 0.45;
                const localP = Math.max(0, Math.min(1, (exitProg - tStart) / 0.55));
                mProgress = easeInOutCubic(localP);
              }
            }

            if (mProgress <= 0.001) continue;

            ctx.save();
            ctx.strokeStyle = (stepNum >= 14 || isHandling15to16Transition) ? 'rgba(255, 255, 255, 0.75)' : 'rgba(148, 163, 184, 0.6)';
            ctx.lineWidth = 2.0;
            ctx.beginPath();

            if (stepNum >= 14 || isHandling15to16Transition) {
              const zMax = cutPt.z;
              const zSphEnd = Math.min(Y0, zMax);
              for (let a = -Math.PI/2; a <= Math.asin(Math.max(-1, Math.min(1, zSphEnd))); a += 0.05) {
                const r = Math.cos(a), z = Math.sin(a);
                const pt = projectPoint(r * Math.cos(theta), r * Math.sin(theta), z, cx, cy, scale);
                a === -Math.PI/2 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
              }
              if (zMax > Y0) {
                const pCut = projectPoint(cutPt.x, cutPt.y, cutPt.z, cx, cy, scale);
                ctx.lineTo(pCut.px, pCut.py);
              }
            } else {
              const zTarget = SQRT5 - mProgress * (SQRT5 - (-1.0));
              const numStepsCurve = 60;
              for (let k = 0; k <= numStepsCurve; k++) {
                const zVal = SQRT5 - (k / numStepsCurve) * (SQRT5 - (-1.0));
                if (zVal < zTarget) break;
                const rVal = (zVal > Y0) ? (SQRT5 - zVal) / 2 : Math.sqrt(Math.max(0, 1 - zVal * zVal));
                const pt = projectPoint(rVal * Math.cos(theta), rVal * Math.sin(theta), zVal, cx, cy, scale);
                k === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
              }
            }
            ctx.stroke();
            ctx.restore();
          }
        }

        // In Step 14: Show pruned upper lines smoothly fading away
        if (stepNum === 14 && stepNavDir === 1 && stepProg < 0.99) {
          const pruneAlpha = 1.0 - stepProg;
          ctx.save();
          ctx.strokeStyle = `rgba(255, 100, 100, ${pruneAlpha * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          for (let i = 0; i < 8; i++) {
            const theta = i * Math.PI / 4;
            const cutPt = getCutPoint(theta);
            if (cutPt.z < SQRT5) {
              const pCut = projectPoint(cutPt.x, cutPt.y, cutPt.z, cx, cy, scale);
              const pApex = projectPoint(0, 0, SQRT5, cx, cy, scale);
              ctx.beginPath(); ctx.moveTo(pCut.px, pCut.py); ctx.lineTo(pApex.px, pApex.py); ctx.stroke();
            }
          }
          ctx.restore();
        }

        // Step 9+: Centroide en 3D
        if (!isReturningTo2D && ((stepNum >= 9 && stepNum <= 13 && !isHandling15to16Transition) || (exitState.active && exitState.exitingStepNum === 9))) {
          const pCentroid3D = projectPoint(0, 0, CC, cx, cy, scale);
          const cProg = (stepNum >= 9) ? ((stepNum === 9 && stepNavDir === 1) ? stepProg : 1.0) : exitProg;
          if (cProg > 0.001) {
            ctx.save();
            ctx.fillStyle = '#10B981';
            ctx.shadowBlur = 14 * cProg;
            ctx.shadowColor = '#10B981';
            ctx.beginPath(); ctx.arc(pCentroid3D.px, pCentroid3D.py, Math.max(1, 6 * cProg), 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          }
        }

        // Step 10 & 11 & 12: Cutting Plane 3D
        if (!isReturningTo2D && (((stepNum >= 10 && stepNum <= 12 && !isHandling15to16Transition)) || (exitState.active && exitState.exitingStepNum === 10))) {
          const plProg = (stepNum >= 10) ? ((stepNum === 10 && stepNavDir === 1) ? stepProg : 1.0) : exitProg;
          if (plProg > 0.001) {
            const plSpan = 1.3 * plProg;
            ctx.save();
            ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
            ctx.strokeStyle = '#94A3B8';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([6, 4]);
            const p1 = projectPoint(-plSpan, -plSpan, 0.6*(-2*plSpan) + 0.3, cx, cy, scale);
            const p2 = projectPoint(plSpan, -plSpan, 0.6*(0) + 0.3, cx, cy, scale);
            const p3 = projectPoint(plSpan, plSpan, 0.6*(2*plSpan) + 0.3, cx, cy, scale);
            const p4 = projectPoint(-plSpan, plSpan, 0.6*(0) + 0.3, cx, cy, scale);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.lineTo(p3.px, p3.py); ctx.lineTo(p4.px, p4.py);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
            ctx.restore();
          }
        }

        // Step 11+: 3 Horizontal Parallel Rings (uniformly distributed)
        if (!isReturningTo2D && (stepNum >= 11 || isHandling15to16Transition || (exitState.active && exitState.exitingStepNum === 11))) {
          const SALTO_NEW2 = 3 * SALTO / 2;
          const NUDGE_G2 = 0.12;
          const rings = [
            { z: Y0 - NUDGE_G2,               r: Math.sqrt(Math.max(0, 1 - (Y0 - NUDGE_G2)**2)) },
            { z: Y0 - SALTO_NEW2,             r: Math.sqrt(Math.max(0, 1 - (Y0 - SALTO_NEW2)**2)) },
            { z: Y0 - 2*SALTO_NEW2 + NUDGE_G2, r: Math.sqrt(Math.max(0, 1 - (Y0 - 2*SALTO_NEW2 + NUDGE_G2)**2)) }
          ];

          const rProg = (stepNum >= 11) ? ((stepNum === 11 && stepNavDir === 1) ? stepProg : 1.0) : exitProg;
          const maxRings = Math.max(1, Math.floor(3 * rProg));

          for (let rIdx = 0; rIdx < maxRings; rIdx++) {
            const ring = rings[rIdx];
            ctx.save();
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            let started = false;
            for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.05) {
              const x = ring.r * Math.cos(a), y = ring.r * Math.sin(a);
              const zPlano = 0.6 * (x + y) + 0.3;
              if ((stepNum >= 14 || isHandling15to16Transition) && ring.z > zPlano) {
                started = false;
                continue;
              }
              const pt = projectPoint(x, y, ring.z, cx, cy, scale);
              if (!started) { ctx.moveTo(pt.px, pt.py); started = true; }
              else { ctx.lineTo(pt.px, pt.py); }
            }
            ctx.stroke();
            ctx.restore();
          }
        }

        // Step 12+: Exact 3D Cut Intersection Curve
        if (!isReturningTo2D && (stepNum >= 12 || isHandling15to16Transition || (exitState.active && exitState.exitingStepNum === 12))) {
          const cutCurveProg = (stepNum >= 12) ? ((stepNum === 12 && stepNavDir === 1) ? stepProg : 1.0) : exitProg;
          if (cutCurveProg > 0.001) {
            ctx.save();
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 3.0;
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#38BDF8';
            ctx.beginPath();
            const maxCutAng = Math.PI * 2 * cutCurveProg;
            for (let a = 0; a <= maxCutAng + 0.05; a += 0.03) {
              const cp = getCutPoint(a);
              const pt = projectPoint(cp.x, cp.y, cp.z, cx, cy, scale);
              a === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
            }
            if (cutCurveProg >= 0.99) ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }
        }

        // Step 13: Discrete Exact Intersection Points
        if (!isReturningTo2D && (((stepNum === 13 && !isHandling15to16Transition)) || (exitState.active && exitState.exitingStepNum === 13))) {
          const ptProg = (stepNum === 13) ? ((stepNavDir === 1) ? stepProg : 1.0) : exitProg;
          if (ptProg > 0.001) {
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#FFFFFF';

            const maxPts = Math.floor(8 * ptProg);
            for (let i = 0; i < maxPts; i++) {
              const theta = i * Math.PI / 4;
              const cp = getCutPoint(theta);
              const pt = projectPoint(cp.x, cp.y, cp.z, cx, cy, scale);
              ctx.beginPath(); ctx.arc(pt.px, pt.py, 5.0, 0, Math.PI * 2); ctx.fill();
            }

            const SALTO_NEW3 = 3 * SALTO / 2;
            const NUDGE_G3 = 0.12;
            const rings = [
              { z: Y0 - NUDGE_G3,               r: Math.sqrt(Math.max(0, 1 - (Y0 - NUDGE_G3)**2)) },
              { z: Y0 - SALTO_NEW3,             r: Math.sqrt(Math.max(0, 1 - (Y0 - SALTO_NEW3)**2)) },
              { z: Y0 - 2*SALTO_NEW3 + NUDGE_G3, r: Math.sqrt(Math.max(0, 1 - (Y0 - 2*SALTO_NEW3 + NUDGE_G3)**2)) }
            ];

            rings.forEach(ring => {
              const num = ring.z - 0.3;
              const den = 0.6 * ring.r * Math.SQRT2;
              const ratio = num / den;
              if (Math.abs(ratio) <= 1) {
                const dAng = Math.asin(ratio);
                const a1 = -Math.PI / 4 + dAng;
                const a2 = 3 * Math.PI / 4 - dAng;
                [a1, a2].forEach(a => {
                  const x = ring.r * Math.cos(a), y = ring.r * Math.sin(a);
                  const pt = projectPoint(x, y, ring.z, cx, cy, scale);
                  ctx.beginPath(); ctx.arc(pt.px, pt.py, 5.0 * ptProg, 0, Math.PI * 2); ctx.fill();
                });
              }
            });
            ctx.restore();
          }
        }

        // Step 15: 5 Surface Integrals
        // Forward 15 -> 16 Phase 1: Surfaces un-fill smoothly (1.0 -> 0.0)
        // Forward 15 -> 16 Phase 2: Surfaces are STRICTLY 0.0 (NO FLASH!)
        // Backward 16 -> 15 Phase 1: Surfaces entrance-fill (0.0 -> 1.0)
        // Backward 16 -> 15 Phase 2: Surfaces remain 1.0 as camera swoops
        if (!isReturningTo2D) {
          let sProg = 0.0;
          let shouldDrawSurfaces = false;

          if (animState.active && animState.mode === '15_TO_16_PHASE1') {
            const elapsed = performance.now() - animState.startTime;
            const p = Math.min(1.0, elapsed / animState.duration);
            sProg = Math.max(0.0, 1.0 - easeInOutCubic(p));
            shouldDrawSurfaces = (sProg > 0.001);
          } else if (animState.active && animState.mode === '15_TO_16_PHASE2') {
            // STRICTLY ZERO: DO NOT DRAW SURFACES IN PHASE 2
            shouldDrawSurfaces = false;
            sProg = 0.0;
          } else if (animState.active && animState.mode === '16_TO_15_PHASE1') {
            const elapsed = performance.now() - animState.startTime;
            const p = Math.min(1.0, elapsed / animState.duration);
            sProg = easeInOutCubic(p);
            shouldDrawSurfaces = (sProg > 0.001);
          } else if (stepNum === 15) {
            sProg = (stepNavDir === 1) ? stepProg : 1.0;
            shouldDrawSurfaces = true;
          } else if (exitState.active && exitState.exitingStepNum === 15) {
            sProg = exitProg;
            shouldDrawSurfaces = (sProg > 0.001);
          }

          if (shouldDrawSurfaces) {
            renderStep15Surfaces3D(cx, cy, scale, 1.0, sProg);
          }
        }

        ctx.restore();
      }
    }

    // ── Steps 16 to 18 : 2D SVG PROJECTION & CROSSFADE ──
    if ((stepNum >= 16 && stepNum <= 18) || isHandling15to16Transition) {
      const alpha2D = isHandling15to16Transition ? animState.crossfade : 1.0;

      if (alpha2D > 0.001) {
        if (stepNum === 16 || (isHandling15to16Transition && (animState.mode === '15_TO_16_PHASE2' || animState.mode === '16_TO_15_PHASE1'))) {
          renderShadowMakerLogo(ctx, cx, cy, scale * 1.05, {
            upperFill: null,
            upperStroke: '#94A3B8',
            cutStroke: '#94A3B8',
            gridStroke: '#94A3B8',
            lowerContourStroke: '#94A3B8',
            withBackCulling: false,
            lineWidth: 1.8,
            opacity: alpha2D
          });
        } else if (stepNum === 17) {
          renderShadowMakerLogo(ctx, cx, cy, scale * 1.05, {
            upperFill: null,
            upperStroke: '#94A3B8',
            cutStroke: '#94A3B8',
            gridStroke: '#94A3B8',
            lowerContourStroke: '#94A3B8',
            withBackCulling: true,
            lineWidth: 2.4,
            opacity: alpha2D
          });
        } else if (stepNum === 18) {
          renderShadowMakerLogo(ctx, cx, cy, scale * 1.05, {
            upperFill: '#00F0FF',
            upperStroke: '#00F0FF',
            cutStroke: '#00F0FF',
            gridStroke: '#39FF14',
            lowerContourStroke: '#39FF14',
            withBackCulling: true,
            lineWidth: 2.2,
            opacity: alpha2D
          });
        }
      }
    }

    if (isGenesisVisible) {
      requestAnimationFrame(drawGenesisFrame);
    } else {
      isGenesisRunning = false;
    }
  }

  if ('IntersectionObserver' in window) {
    const genesisObserver = new IntersectionObserver((entries) => {
      const wasVisible = isGenesisVisible;
      isGenesisVisible = entries[0].isIntersecting;
      if (isGenesisVisible && !isGenesisRunning) {
        isGenesisRunning = true;
        requestAnimationFrame(drawGenesisFrame);
      }
    }, { threshold: 0.05 });
    genesisObserver.observe(canvas);
  } else {
    isGenesisRunning = true;
    requestAnimationFrame(drawGenesisFrame);
  }

  // KaTeX guaranteed initializer & poller
  function initGenesis() {
    renderStepUI(currentStepIdx);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initGenesis, 50));
  } else {
    setTimeout(initGenesis, 50);
  }

  if (!window.katex) {
    const kInterval = setInterval(() => {
      if (window.katex) {
        clearInterval(kInterval);
        renderStepUI(currentStepIdx);
      }
    }, 80);
    setTimeout(() => clearInterval(kInterval), 4000);
  }

  // Init
  renderStepUI(0);
  isGenesisRunning = true;
  requestAnimationFrame(drawGenesisFrame);
})();

