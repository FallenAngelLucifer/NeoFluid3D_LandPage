/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NeoFluid3D — Motor de Presentación Interactiva (Deck Engine)
 * Hackathon Nicaragua 2026 — Categoría Startup
 * Control por teclado, animaciones GPU, canvas interactivo y sincronización bidireccional.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // PITCH SCRIPT & SPEAKER NOTES FOR EACH SLIDE
  // ═══════════════════════════════════════════════════════════════
  const SLIDE_NOTES = [
    {
      time: "0:30",
      talkingPoints: [
        "Presentación de NeoFluid3D: Motor de dinámica de fluidos en tiempo real acelerado en GPU.",
        "Categoría Startup - Hackathon Nicaragua 2026.",
        "Objetivo de la defensa: Demostrar que nuestra identidad de marca y sistema visual responden a una lógica técnica, modular y consistente."
      ]
    },
    {
      time: "0:45",
      talkingPoints: [
        "El diseño de NeoFluid3D se sostiene sobre 5 aspectos transversales irrenunciables:",
        "1. Coherencia: Cada píxel responde al eje Fluidez + Computación.",
        "2. Consistencia: Mismas reglas en Web, Simulador nativo y SDK.",
        "3. Intencionalidad: Decisiones de ingeniería visual, no mero capricho estético.",
        "4. Sistematización: Escala de 8px, módulo 1u y paleta cerrada de 6 tokens.",
        "5. Aplicación: Implementación activa en producción."
      ]
    },
    {
      time: "0:40",
      talkingPoints: [
        "Eje Conceptual Dual: La base de todo nuestro universo gráfico.",
        "Fluidez (Prefijo Neo / Celeste #00F0FF): Lo orgánico, agua en movimiento y dinámica física continua.",
        "Computación (Sufijo Fluid³D / Verde #39FF14): Rigor matemático, aceleración GPU y retículas de cálculo.",
        "La síntesis: Un motor científico capaz de calcular hidrodinámica a 60 FPS."
      ]
    },
    {
      time: "0:40",
      talkingPoints: [
        "Anatomía del Isotipo: La Gota Bipartita sintetiza la dualidad en un solo golpe de vista.",
        "Cima Lisa (Celeste #00F0FF): Representa la tensión superficial y el continuo del fluido.",
        "Base Reticulada (Verde #39FF14): Tres anillos latitudinales y meridianos que ilustran la discretización en GPU.",
        "La unión no es un degradado difuso; es un corte curvo preciso de ingeniería."
      ]
    },
    {
      time: "0:35",
      talkingPoints: [
        "Composición Tipográfica del Imagotipo: Versión apilada oficial.",
        "Fila 1: 'NEO' en Clash Display Variable Bold. Peso visual dominante y vanguardista.",
        "Fila 2: 'Fluid³D' en JetBrains Mono Bold. Calidad técnica de código y telemetría.",
        "El detalle ³D: Flat-depth balanceando el exponente cúbico con la D dimensional."
      ]
    },
    {
      time: "0:50",
      talkingPoints: [
        "Manual de Marca: El Sistema Modular de Construcción (Blueprint).",
        "Altura total dividida en 4 unidades exactas: H = 4u.",
        "Separación horizontal exacta entre isotipo y texto: Gap = 1u (H/4).",
        "Área de reserva perimetral libre de 1u en los 4 costados para garantizar legibilidad absoluta.",
        "Muestra de cotas paramétricas en vivo aplicadas al imagotipo."
      ]
    },
    {
      time: "0:45",
      talkingPoints: [
        "Paleta Cromática Oficial: Sistema cerrado de 6 tokens funcionales.",
        "Primarios: Celeste (#00F0FF) para masa fluida y Verde (#39FF14) para cómputo GPU.",
        "Base y HUD: Obsidiana Deep (#070B0E) para contraste óptico y Titanio Técnico (#8FA6B2) para telemetría.",
        "CFD Secundarios: Azul Simulación (#3B82F6) para flujo laminar y Naranja Térmico (#FF9100) para turbulencia.",
        "Cumple estándares WCAG de alto contraste sobre estaciones de trabajo."
      ]
    },
    {
      time: "0:40",
      talkingPoints: [
        "Tipografías Oficiales del Ecosistema:",
        "Clash Display (Logo Neo), JetBrains Mono (Logo, código y telemetría), Oxanium (Títulos de HUD).",
        "IBM Plex Sans SemiCondensed (Subtítulos y métricas), Inter (Lectura y UI general).",
        "Recursos gráficos: Retícula de ingeniería de 40px y gradientes dirigidos."
      ]
    },
    {
      time: "0:45",
      talkingPoints: [
        "Coherencia de Identidad: Matriz de 4 Contextos.",
        "Demostración de que la marca se reconoce de inmediato en Sitio Web, Simulador Desktop, Documentación SDK y Material de Presentación.",
        "Se mantienen los 4 pilares: Mismo par cromático, mismo isotipo, misma tipografía dual y fondo oscuro reticulado."
      ]
    },
    {
      time: "0:35",
      talkingPoints: [
        "Estructura Visual y Jerarquía en 3 Planos:",
        "Plano de Fondo (Base): Obsidiana Deep #070B0E con retícula de descanso visual.",
        "Plano de Contenido (Tarjetas/Paneles): Superficies con bordes de 1px a baja opacidad (glassmorphism sutil).",
        "Plano de Acción (Acentos): Botones y controles que brillan en Celeste y Verde para guiar la interacción."
      ]
    },
    {
      time: "0:45",
      talkingPoints: [
        "Catálogo de Componentes UI y sus 3 Estados:",
        "Botón primario (gradiente Celeste→Verde), secundario (delineado), paneles de datos, badges e inputs.",
        "Cada componente cuenta con estados documentados: Reposo (neutral), Hover/Foco (iluminación interactiva) y Activo (confirmación sólida).",
        "Probable en vivo directamente en esta diapositiva."
      ]
    },
    {
      time: "0:40",
      talkingPoints: [
        "Iconografía Técnica: Familia de 13 íconos vectoriales SVG.",
        "Diseñados con trazo uniforme de 2px y terminaciones redondeadas (stroke-linecap: round).",
        "Codificación semántica por color: Celeste para comandos de sistema/interacción, Verde para hardware, GPU y exportación.",
        "Ningún ícono genérico: Cada glifo tiene un propósito dentro del software."
      ]
    },
    {
      time: "0:50",
      talkingPoints: [
        "Modos de Visualización del Fluido en el Simulador 3D:",
        "Teclas 1 a 6 mapeadas en el motor nativo:",
        "[1] Partículas (SPH individual), [2] Plexus (topología de interacción vecina),",
        "[3] Malla Superficie (Marching Cubes continuo), [4] Vectores (campos de aceleración),",
        "[5] Líneas de Flujo (estelas cinéticas), [6] Mapa CFD (presión y velocidad).",
        "Interactividad en vivo en el visor de la diapositiva."
      ]
    },
    {
      time: "0:40",
      talkingPoints: [
        "Representación de Obstáculos 3D y Escala Térmica Jet:",
        "4 variantes de geometría: Sólido (CAD), Wireframe (malla poligonal), Silueta/Ghost (guía) y Oculto.",
        "Escala Térmica Jet estándar CFD: Desde Azul (0% régimen laminar) pasando por Verde/Amarillo hasta Rojo (100% turbulencia/vórtice).",
        "Barra graduada vertical calibrada en metros por segundo (m/s)."
      ]
    },
    {
      time: "0:45",
      talkingPoints: [
        "Arquitectura de Interfaz del Simulador (HUD):",
        "Distribución ergonómica en 5 zonas funcionales:",
        "Barra Superior (telemetría GPU, FPS), Panel Izquierdo (capas físicas y variables),",
        "Viewport 3D central, Panel Derecho (emisores y telemetría de partícula), y Barra Inferior (atajos de teclado).",
        "Diseñada para operar en pantallas táctiles o estaciones de trabajo multimonitor."
      ]
    },
    {
      time: "0:40",
      talkingPoints: [
        "Reglas de Diseño y Lógica Visual Compartida:",
        "Métrica de espaciado en múltiplos de 8px (8, 16, 24, 32, 48px).",
        "Radios controlados: 6px para controles interactivos y 10px para contenedores.",
        "4 reglas universales: Misma base cromática de 6 tokens, mismo grosor de trazo (1-2px), misma cuadrícula y jerarquía tipográfica invariable."
      ]
    },
    {
      time: "0:40",
      talkingPoints: [
        "Checklist Oficial de Evidencias (Categoría Startup):",
        "Auditoría completa de los 12 criterios de evaluación del Hackathon Nicaragua 2026.",
        "100% de los criterios documentados, validados y aplicados en código ejecutable.",
        "Todas las evidencias cuentan con respaldo en el manual de marca, sitio web y simulador."
      ]
    },
    {
      time: "0:50",
      talkingPoints: [
        "Síntesis de Evaluación — Las 4 Respuestas Clave:",
        "1. ¿Identidad definida? Sí, eje Fluidez + Computación aplicado a todos los elementos.",
        "2. ¿Documentación suficiente? Sí, manual modular con cotas 4u, áreas de reserva y paleta cerrada.",
        "3. ¿Sistema visual reutilizable? Sí, UI Kit, 13 íconos, 6 modos de fluido y HUD en 5 zonas.",
        "4. ¿Lógica compartida? Sí, reglas universales de trazo, espaciado y jerarquía en todo el software."
      ]
    },
    {
      time: "0:30",
      talkingPoints: [
        "Conclusión y Cierre de la Presentación:",
        "NeoFluid3D combina ciencia hidrodinámica rigurosa con un sistema de diseño maduro y coherente.",
        "Acceso inmediato al sitio web interactivo, repositorio y simulador nativo.",
        "Agradecimiento al jurado del Hackathon Nicaragua 2026 y espacio para preguntas."
      ]
    }
  ];

  // ═══════════════════════════════════════════════════════════════
  // STATE & DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  // Unique Instance ID to bind the remote control exclusively to this window
  const deckInstanceId = 'deck_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
  window.__neofluid_deck_id = deckInstanceId;

  let currentSlide = 0;
  let remoteConsoleWindow = null;
  // Strict volatile memory for Speaker Remote Control (Never saved in storage!)
  let isRemoteUnlocked = false;
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  let pitchSeconds = 0;
  let pitchTimerInterval = null;

  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;

  const progressBar = document.getElementById('progress-bar-fill');
  const slideNumCurrent = document.getElementById('slide-num-current');
  const slideNumTotal = document.getElementById('slide-num-total');
  const hudSlideTitle = document.getElementById('hud-slide-title');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const overviewBtn = document.getElementById('btn-overview');
  const notesBtn = document.getElementById('btn-notes');
  const fullscreenBtn = document.getElementById('btn-fullscreen');
  const overviewModal = document.getElementById('overview-modal');
  const overviewGrid = document.getElementById('overview-grid');
  const closeOverviewBtn = document.getElementById('close-overview');
  const presenterDrawer = document.getElementById('presenter-drawer');
  const closeNotesBtn = document.getElementById('close-notes');
  const presenterContent = document.getElementById('presenter-notes-content');
  const pitchTimerDisplay = document.getElementById('pitch-timer');
  const returnSiteBtn = document.getElementById('return-site-btn');

  function saveLastSlide(index) {
    try {
      localStorage.setItem(`neofluid_deck_slide_${deckInstanceId}`, index.toString());
      localStorage.setItem('neofluid_presentation_active_slide', index.toString());
    } catch (e) {}
  }

  // ═══════════════════════════════════════════════════════════════
  // BIDIRECTIONAL NAVIGATION MAPPING
  // ═══════════════════════════════════════════════════════════════
  const SLIDE_TO_WEBSITE_MAP = {
    0: "../index.html#hero",
    1: "../index.html#hero",
    2: "../index.html#brand",
    3: "../index.html#brand",
    4: "../index.html#brand",
    5: "../index.html#brand",
    6: "../index.html#brand",
    7: "../index.html#brand",
    8: "../index.html#brand",
    9: "../index.html#sdk",
    10: "../index.html#sdk",
    11: "../index.html#sdk",
    12: "../index.html#modes",
    13: "../index.html#modes",
    14: "../index.html#modes",
    15: "../index.html#benchmarks",
    16: "../index.html#vision",
    17: "../index.html#vision",
    18: "../index.html#contact"
  };

  function updateBidirectionalLinks(index) {
    if (returnSiteBtn) {
      const targetAnchor = SLIDE_TO_WEBSITE_MAP[index] || "../index.html";
      returnSiteBtn.href = targetAnchor;
      returnSiteBtn.title = `Volver al Sitio Web (${targetAnchor.split('#')[1] || 'inicio'})`;
    }
    saveLastSlide(index);
  }

  // ═══════════════════════════════════════════════════════════════
  // BIDIRECTIONAL SYNC WITH REMOTE CONSOLE (Instance-targeted)
  // ═══════════════════════════════════════════════════════════════
  const syncChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('neofluid_deck_sync') : null;

  function handleRemoteCommand(cmd) {
    if (!cmd || cmd.type !== 'REMOTE_COMMAND') return;
    // Strict instance matching: if the command specified a target instance, ignore if not ours!
    if (cmd.targetInstance && cmd.targetInstance !== deckInstanceId) {
      return;
    }
    if (cmd.action === 'GOTO') {
      goToSlide(cmd.value);
    } else if (cmd.action === 'TOGGLE_FULLSCREEN') {
      toggleFullscreen();
    }
  }

  if (syncChannel) {
    syncChannel.onmessage = (e) => {
      if (e.data && e.data.type === 'REMOTE_COMMAND') {
        if (e.data.action === 'GOTO') {
          goToSlide(e.data.value);
        } else if (e.data.action === 'TOGGLE_FULLSCREEN') {
          toggleFullscreen();
        }
      }
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'neofluid_remote_sync') {
      try {
        const data = JSON.parse(e.newValue);
        if (data && data.action === 'GOTO') {
          goToSlide(data.value);
        } else if (data && data.action === 'TOGGLE_FULLSCREEN') {
          toggleFullscreen();
        }
      } catch (err) {}
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // CORE SLIDE NAVIGATION & FLUID DYNAMICS TRANSITIONS
  // ═══════════════════════════════════════════════════════════════
  const FLUID_FX_CLASSES = ['fluid-fx-droplet', 'fluid-fx-laminar', 'fluid-fx-surge', 'fluid-fx-vortex'];

  function goToSlide(index, updateUrl = true) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    slides.forEach((s, idx) => {
      s.classList.remove('active', 'prev', ...FLUID_FX_CLASSES);
      if (idx === index) {
        s.classList.add('active');
        // Apply hydrodynamic fluid transition
        const fxClass = FLUID_FX_CLASSES[index % FLUID_FX_CLASSES.length];
        s.classList.add(fxClass);
      } else if (idx < index) {
        s.classList.add('prev');
      }
    });

    currentSlide = index;

    // Broadcast change to remote pitch console (strictly tagged with this instance ID)
    if (syncChannel) {
      syncChannel.postMessage({
        type: 'SLIDE_CHANGED',
        sourceInstance: deckInstanceId,
        slide: index,
        timestamp: Date.now()
      });
    }
    if (remoteConsoleWindow && !remoteConsoleWindow.closed) {
      try {
        remoteConsoleWindow.postMessage({
          type: 'SLIDE_CHANGED',
          sourceInstance: deckInstanceId,
          slide: index,
          timestamp: Date.now()
        }, '*');
      } catch (err) {}
    }
    try {
      localStorage.setItem(`neofluid_deck_slide_${deckInstanceId}`, index.toString());
      localStorage.setItem('neofluid_presentation_active_slide', index.toString());
    } catch (e) {}

    

    // Update Progress
    const pct = totalSlides > 1 ? (index / (totalSlides - 1)) * 100 : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;

    // Counters
    if (slideNumCurrent) slideNumCurrent.textContent = String(index + 1).padStart(2, '0');
    if (slideNumTotal) slideNumTotal.textContent = String(totalSlides).padStart(2, '0');

    // Title in HUD
    const activeSlideElem = slides[index];
    const categoryElem = activeSlideElem.querySelector('.slide-category');
    const titleElem = activeSlideElem.querySelector('.slide-title');
    if (hudSlideTitle) {
      const catText = categoryElem ? categoryElem.textContent.trim() : '';
      const tText = titleElem ? titleElem.textContent.trim() : `Slide ${index + 1}`;
      hudSlideTitle.innerHTML = `<span style="color:var(--color-cyan); font-size:0.75rem;">${catText}</span> <span style="opacity:0.4;">/</span> ${tText}`;
    }

    // Button states
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === totalSlides - 1;

    // Update URL hash / history
    if (updateUrl) {
      history.replaceState(null, '', `#slide-${index + 1}`);
    }

    // Update Presenter Notes
    updatePresenterNotes(index);

    // Update Overview thumbnails highlight
    updateOverviewHighlight(index);

    // Update bidirectional deep-links
    updateBidirectionalLinks(index);

    // Trigger slide-specific animations
    triggerSlideCustomBehavior(index);
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PRESENTER NOTES & SINGLE-INSTANCE REMOTE CONSOLE
  // ═══════════════════════════════════════════════════════════════
  function updatePresenterNotes(index) {
    if (!presenterContent) return;
    const noteData = PITCH_NOTES[index] || {
      category: "GENERAL",
      talkingPoints: ["Explicar el contenido de la lámina técnica."]
    };

    let html = `
      <div style="font-size:0.8rem; color:var(--color-cyan); margin-bottom:12px; font-weight:700; font-family:var(--font-mono);">
        [PUNTOS CLAVE DE DEFENSA // ${noteData.category}]
      </div>
      <ul style="padding-left:18px; margin:0; line-height:1.6;">
    `;
    noteData.talkingPoints.forEach(pt => {
      html += `<li style="margin-bottom:8px;">${pt}</li>`;
    });
    html += `</ul>`;
    presenterContent.innerHTML = html;
  }

  function openRemotePitchTab() {
    // SINGLE REMOTE CONTROL ENFORCEMENT:
    // If a remote control window is already open for this presentation, focus it and do NOT open another
    if (remoteConsoleWindow && !remoteConsoleWindow.closed) {
      try {
        remoteConsoleWindow.focus();
        showToast('Consola de Control Remoto ya abierta (Ventana enfocada)');
        return;
      } catch (err) {}
    }

    const remoteUrl = `remote.html?instance=${encodeURIComponent(deckInstanceId)}&slide=${currentSlide}`;
    const windowName = `neofluid_remote_win_${deckInstanceId}`;
    remoteConsoleWindow = window.open(remoteUrl, windowName, 'width=1060,height=760,menubar=no,toolbar=no,status=no');
    
    if (remoteConsoleWindow) {
      try {
        remoteConsoleWindow.focus();
        showToast(`Control Remoto vinculado a esta ventana (${deckInstanceId.substring(0, 10)})`);
      } catch (err) {}
    } else {
      if (presenterDrawer) {
        presenterDrawer.classList.toggle('open');
      }
      showToast('Navegador bloqueó ventana emergente. Abriendo libreto lateral.');
    }
  }

  function toggleNotes() {
    openRemotePitchTab();
  }

  function startPitchTimer() {
    if (pitchTimerInterval) clearInterval(pitchTimerInterval);
    pitchTimerInterval = setInterval(() => {
      pitchSeconds++;
      const mins = Math.floor(pitchSeconds / 60);
      const secs = pitchSeconds % 60;
      if (pitchTimerDisplay) {
        pitchTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }, 1000);
  }

  // ═══════════════════════════════════════════════════════════════
  // KONAMI CODE ENGINE (STRICT VOLATILE SPEAKER ACCESS)
  // ═══════════════════════════════════════════════════════════════
  function handleKonamiInput(key) {
    if (isRemoteUnlocked) return;
    const expectedKey = KONAMI_CODE[konamiIndex];
    const isMatch = (expectedKey.length === 1)
      ? key.toLowerCase() === expectedKey.toLowerCase()
      : key === expectedKey;

    if (isMatch) {
      konamiIndex++;
      if (konamiIndex === KONAMI_CODE.length) {
        isRemoteUnlocked = true;
        konamiIndex = 0;
        unlockSpeakerConsole();
      }
    } else {
      // Strict reset on any sequence error
      konamiIndex = (key === 'ArrowUp') ? 1 : 0;
    }
  }

  function unlockSpeakerConsole() {
    if (notesBtn) {
      notesBtn.style.display = 'inline-flex';
      notesBtn.classList.remove('konami-locked');
      notesBtn.classList.add('konami-unlocked');
    }
    const footerPitch = document.getElementById('footer-shortcut-pitch');
    if (footerPitch) {
      footerPitch.style.display = 'inline';
    }
    showToast("🔓 [ACCESO DE ORADOR CONCEDIDO] Consola Remota Desbloqueada (S)");
  }
// ═══════════════════════════════════════════════════════════════
  // OVERVIEW MODAL
  // ═══════════════════════════════════════════════════════════════
  function buildOverviewGrid() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';
    slides.forEach((s, idx) => {
      const titleElem = s.querySelector('.slide-title');
      const catElem = s.querySelector('.slide-category');
      const titleText = titleElem ? titleElem.textContent.trim() : `Slide ${idx + 1}`;
      const catText = catElem ? catElem.textContent.trim() : '';

      const card = document.createElement('div');
      card.className = `thumb-card ${idx === currentSlide ? 'active' : ''}`;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="thumb-num">#${String(idx + 1).padStart(2, '0')}</span>
          <span style="font-family:var(--font-mono); font-size:0.65rem; color:var(--color-cyan);">${catText}</span>
        </div>
        <div class="thumb-title">${titleText}</div>
        <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--color-text-dim);">Haz clic para ir</div>
      `;
      card.addEventListener('click', () => {
        goToSlide(idx);
        closeOverview();
      });
      overviewGrid.appendChild(card);
    });
  }

  function toggleOverview() {
    if (!overviewModal) return;
    const isOpen = overviewModal.classList.toggle('open');
    if (isOpen) buildOverviewGrid();
    if (overviewBtn) overviewBtn.classList.toggle('active', isOpen);
  }

  function closeOverview() {
    if (overviewModal) overviewModal.classList.remove('open');
    if (overviewBtn) overviewBtn.classList.remove('active');
  }

  function updateOverviewHighlight(index) {
    if (!overviewGrid) return;
    const cards = overviewGrid.querySelectorAll('.thumb-card');
    cards.forEach((c, idx) => {
      c.classList.toggle('active', idx === index);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // FULLSCREEN TOGGLE
  // ═══════════════════════════════════════════════════════════════
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      if (fullscreenBtn) fullscreenBtn.classList.add('active');
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      if (fullscreenBtn) fullscreenBtn.classList.remove('active');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TOAST NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════
  function showToast(msg) {
    let toast = document.getElementById('deck-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'deck-toast';
      toast.style.cssText = `
        position: fixed;
        top: 64px;
        right: 24px;
        background: rgba(14, 22, 28, 0.92);
        border: 1px solid var(--border-cyan);
        box-shadow: var(--glow-cyan);
        color: #FFF;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        padding: 8px 16px;
        border-radius: 6px;
        z-index: 300;
        pointer-events: none;
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0;
        transform: translateY(-8px);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
    }, 2400);
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE-SPECIFIC CUSTOM BEHAVIORS & INTERACTIVITY
  // ═══════════════════════════════════════════════════════════════
  function triggerSlideCustomBehavior(index) {
    // Slide 03: Dual concept highlight
    if (index === 2) {
      initDualConceptWidget();
    }
    // Slide 06: Blueprint animation
    if (index === 5) {
      initBlueprintAnimation();
    }
    // Slide 07: Color swatch copier
    if (index === 6) {
      initColorSwatchCopier();
    }
    // Slide 11: UI Kit State Tester
    if (index === 10) {
      initUIKitStateTester();
    }
    // Slide 13: Live Mini Simulation Canvas
    if (index === 12) {
      initFluidModeSimulator();
    }
    // Slide 14: Jet colormap probe
    if (index === 13) {
      initJetColorProbe();
    }
    // Slide 15: HUD Architecture zone clicker
    if (index === 14) {
      initHudArchitectureZones();
    }
  }

  // Slide 03: Dual Concept Interactivity
  function initDualConceptWidget() {
    const cardFluid = document.getElementById('dual-card-fluid');
    const cardCompute = document.getElementById('dual-card-compute');
    const centerTitle = document.getElementById('synthesis-status-text');

    if (cardFluid && cardCompute) {
      cardFluid.onclick = () => {
        cardFluid.classList.add('active');
        cardCompute.classList.remove('active');
        if (centerTitle) centerTitle.textContent = "ENFOQUE: FLUIDEZ HIDRODINÁMICA";
      };
      cardCompute.onclick = () => {
        cardCompute.classList.add('active');
        cardFluid.classList.remove('active');
        if (centerTitle) centerTitle.textContent = "ENFOQUE: CÓMPUTO & ACELERACIÓN GPU";
      };
    }
  }

  // Slide 06: Blueprint Animation Controls
  function initBlueprintAnimation() {
    const replayBtn = document.getElementById('bp-btn-replay');
    const toggleCotasBtn = document.getElementById('bp-btn-cotas');
    const svgBlueprint = document.getElementById('live-blueprint-svg');

    if (replayBtn && svgBlueprint) {
      replayBtn.onclick = () => {
        svgBlueprint.style.opacity = '0.3';
        setTimeout(() => {
          svgBlueprint.style.transition = 'opacity 0.8s ease';
          svgBlueprint.style.opacity = '1';
          showToast("Blueprint Recalibrado (H = 4u, Gap = 1u)");
        }, 150);
      };
    }
    if (toggleCotasBtn && svgBlueprint) {
      toggleCotasBtn.onclick = () => {
        const cotas = svgBlueprint.querySelectorAll('line, text');
        let hidden = false;
        cotas.forEach(el => {
          if (el.getAttribute('stroke') === '#FFFFFF' || el.getAttribute('font-family')) {
            el.style.display = el.style.display === 'none' ? '' : 'none';
            hidden = el.style.display === 'none';
          }
        });
        showToast(hidden ? "Cotas Ocultas" : "Cotas Visibles");
      };
    }
  }

  // Slide 07: Color Swatch Copy
  function initColorSwatchCopier() {
    const cards = document.querySelectorAll('.color-card');
    cards.forEach(card => {
      card.onclick = () => {
        const hex = card.getAttribute('data-hex');
        if (hex) {
          navigator.clipboard.writeText(hex).then(() => {
            showToast(`Copiado: ${hex}`);
          });
        }
      };
    });
  }

  // Slide 11: UI Kit State Tester
  function initUIKitStateTester() {
    const stateTabs = document.querySelectorAll('.ui-state-tab');
    const demoButtons = document.querySelectorAll('.demo-test-btn');

    stateTabs.forEach(tab => {
      tab.onclick = () => {
        stateTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const state = tab.getAttribute('data-state');
        demoButtons.forEach(btn => {
          btn.classList.remove('state-reposo', 'state-hover', 'state-activo');
          btn.classList.add(`state-${state}`);
        });
        showToast(`Estado UI: ${state.toUpperCase()}`);
      };
    });
  }

  // Slide 13: Live 6-Mode Fluid Simulation Canvas
        // ═══════════════════════════════════════════════════════════════
  // SLIDE 13: 3D VULKAN ENGINE SIMULATOR (ORGANIC SPH + CFD SURFACE MESH)
  // ═══════════════════════════════════════════════════════════════
  let currentFluidMode = 1;
  let fluidModeKeyBound = false;
  let simAnimFrameId = null;

  const MODE_INFO = {
    1: { name: 'Partículas', desc: 'Simulación SPH de alta densidad con volumen orgánico, dispersión hidrodinámica y sombreado esférico GPU', hasSpeed: false },
    2: { name: 'Plexus', desc: 'Red topológica vecinal conectando partículas en 3D con radio de interacción h (Topología Vulkan)', hasSpeed: false },
    3: { name: 'Malla Superficie', desc: 'Reconstrucción continua de isosuperficie líquida Marching Cubes con volumen y estanque', hasSpeed: false },
    4: { name: 'Vectores', desc: 'Campo de vectores de velocidad 3D orientados según el flujo y coloreados por gradiente cinético', hasSpeed: true },
    5: { name: 'Líneas Flujo', desc: 'Estelas dinámicas de corriente laminar continua desde la boquilla hasta el estanque', hasSpeed: true },
    6: { name: 'Mapa CFD', desc: 'Malla de superficie continua texturizada con gradiente térmico científico Jet Colormap (0.0 a 6.2 m/s)', hasSpeed: true }
  };

  function initFluidModeSimulator() {
    const canvas = document.getElementById('vulkan-3d-canvas');
    const modeNameElem = document.getElementById('sim-current-mode-name');
    const modeDescElem = document.getElementById('sim-current-mode-desc');
    const speedBar = document.getElementById('vulkan-speed-bar');
    const timeElem = document.getElementById('vulkan-live-simtime');
    const fpsElem = document.getElementById('vulkan-live-fps');
    const coordsElem = document.getElementById('vulkan-live-coords');
    const tabs = document.querySelectorAll('.sim-mode-item');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width) || 800;
      const h = Math.round(rect.height) || 500;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      return { w, h };
    }

    // ── 3D Camera Orbit State ──
    let camTheta = 0.58;     // azimuth
    let camPhi = 0.38;       // elevation
    let camDist = 5.6;       // distance
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    canvas.onmousedown = (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      canvas.style.cursor = 'grabbing';
    };

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      camTheta += dx * 0.009;
      camPhi = Math.max(-0.25, Math.min(1.2, camPhi + dy * 0.009));
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = 'grab';
      }
    });

    // Touch support
    canvas.ontouchstart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };
    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
      camTheta += dx * 0.01;
      camPhi = Math.max(-0.25, Math.min(1.2, camPhi + dy * 0.01));
    });
    window.addEventListener('touchend', () => { isDragging = false; });

    // ── Jet Colormap Function (0.0 to 6.2 m/s) ──
    function getJetColor(speed, alpha = 1) {
      const t = Math.max(0, Math.min(1, speed / 6.2));
      let r, g, b;
      if (t < 0.125) {
        r = 0; g = 0; b = 0.5 + 4 * t;
      } else if (t < 0.375) {
        r = 0; g = 4 * (t - 0.125); b = 1;
      } else if (t < 0.625) {
        r = 4 * (t - 0.375); g = 1; b = 1 - 4 * (t - 0.375);
      } else if (t < 0.875) {
        r = 1; g = 1 - 4 * (t - 0.625); b = 0;
      } else {
        r = 1 - 2 * (t - 0.875); g = 0; b = 0;
      }
      return 'rgba(' + Math.floor(r * 255) + ',' + Math.floor(g * 255) + ',' + Math.floor(b * 255) + ',' + alpha + ')';
    }

    // ── 3D Projection Math ──
    function project3D(x, y, z, cx, cy, scale) {
      const cosT = Math.cos(camTheta);
      const sinT = Math.sin(camTheta);
      const x1 = x * cosT - z * sinT;
      const z1 = x * sinT + z * cosT;

      const cosP = Math.cos(camPhi);
      const sinP = Math.sin(camPhi);
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP + camDist;

      if (z2 <= 0.1) return null;
      const fov = scale / z2;
      return { x: cx + x1 * fov, y: cy - y2 * fov, z: z2, fov: fov };
    }

    // ── Wireframe Bounding Box ──
    const boxMinX = -2.2, boxMaxX = 2.2;
    const boxMinY = -2.2, boxMaxY = 1.8;
    const boxMinZ = -2.2, boxMaxZ = 2.2;
    const boxEdges = [
      [[boxMinX, boxMinY, boxMinZ], [boxMaxX, boxMinY, boxMinZ]],
      [[boxMaxX, boxMinY, boxMinZ], [boxMaxX, boxMinY, boxMaxZ]],
      [[boxMaxX, boxMinY, boxMaxZ], [boxMinX, boxMinY, boxMaxZ]],
      [[boxMinX, boxMinY, boxMaxZ], [boxMinX, boxMinY, boxMinZ]],
      [[boxMinX, boxMaxY, boxMinZ], [boxMaxX, boxMaxY, boxMinZ]],
      [[boxMaxX, boxMaxY, boxMinZ], [boxMaxX, boxMaxY, boxMaxZ]],
      [[boxMaxX, boxMaxY, boxMaxZ], [boxMinX, boxMaxY, boxMaxZ]],
      [[boxMinX, boxMaxY, boxMaxZ], [boxMinX, boxMaxY, boxMinZ]],
      [[boxMinX, boxMinY, boxMinZ], [boxMinX, boxMaxY, boxMinZ]],
      [[boxMaxX, boxMinY, boxMinZ], [boxMaxX, boxMaxY, boxMinZ]],
      [[boxMaxX, boxMinY, boxMaxZ], [boxMaxX, boxMaxY, boxMaxZ]],
      [[boxMinX, boxMinY, boxMaxZ], [boxMinX, boxMaxY, boxMaxZ]],
    ];

    // Spline Anchor Points
    const pNozzle = { x: 1.1, y: 0.9, z: -0.1 };
    const pMid = { x: 0.2, y: 0.1, z: 0.2 };
    const pImpact = { x: -0.6, y: -1.75, z: 0.45 };

    // ── Generate 550 Organic Natural SPH Particles ──
    const NUM_PARTS = 550;
    const organicParticles = [];
    for (let i = 0; i < NUM_PARTS; i++) {
      const zone = i < 90 ? 'bottle' : (i < 360 ? 'jet' : 'pool');
      organicParticles.push({
        zone: zone,
        t: Math.random(),
        speedMult: 0.88 + Math.random() * 0.25,
        seedX: (Math.random() - 0.5) * 2,
        seedY: (Math.random() - 0.5) * 2,
        seedZ: (Math.random() - 0.5) * 2,
        radius: 0.038 + Math.random() * 0.035
      });
    }

    function getOrganicParticlePos(p, time) {
      if (p.zone === 'bottle') {
        // Sloshing in bottle lower belly
        const f = 0.25 + p.t * 0.70;
        const bx = 1.1 * (1 - f) + 2.1 * f;
        const by = 0.9 * (1 - f) + 1.8 * f - 0.12 + Math.sin(time * 2.2 + p.seedX * 4) * 0.035;
        const bz = -0.1 * (1 - f) + -0.6 * f;
        return {
          x: bx + p.seedX * 0.16,
          y: by + p.seedY * 0.10,
          z: bz + p.seedZ * 0.16,
          speed: 0.8 + Math.abs(p.seedX) * 0.5
        };
      } else if (p.zone === 'jet') {
        // Continuous dense stream pouring down
        const t = (p.t + time * 0.68 * p.speedMult) % 1;
        const u = 1 - t;
        const bx = u * u * pNozzle.x + 2 * u * t * pMid.x + t * t * pImpact.x;
        const by = u * u * pNozzle.y + 2 * u * t * pMid.y + t * t * pImpact.y;
        const bz = u * u * pNozzle.z + 2 * u * t * pMid.z + t * t * pImpact.z;
        const dispersion = 0.04 + t * 0.14;
        const speed = 1.2 + 5.0 * (t * t);
        return {
          x: bx + p.seedX * dispersion,
          y: by + p.seedY * dispersion * 0.85,
          z: bz + p.seedZ * dispersion,
          speed: speed
        };
      } else {
        // Natural organic volumetric pool (NOT a spiral!)
        const ang = p.t * Math.PI * 2 + time * 0.45 * (p.seedX > 0 ? 1 : -1);
        const dist = Math.sqrt(Math.abs(p.seedY)) * 0.95 + 0.08;
        const px = pImpact.x + Math.cos(ang) * dist * 1.25 + p.seedX * 0.09;
        const pz = pImpact.z + Math.sin(ang) * dist * 0.95 + p.seedZ * 0.09;
        const wave = Math.sin(time * 3.8 - dist * 6.5 + p.seedX * 2.5) * 0.045;
        let py = -1.82 + wave;
        // Bouncing splash droplets near impact
        if (p.seedZ > 0.55 && dist < 0.45) {
          const splashT = (time * 2.0 + p.seedY) % 1;
          py += Math.sin(splashT * Math.PI) * 0.32;
        }
        const speed = Math.max(0.4, 3.2 - dist * 2.7);
        return { x: px, y: py, z: pz, speed: speed };
      }
    }

    // ── Build 3D Surface Mesh Quads (Marching Cubes Representation) ──
    function createSurfaceMesh(time) {
      const quads = [];
      const numRings = 26;
      const numPts = 10;
      const rings = [];

      for (let r = 0; r <= numRings; r++) {
        const t = r / numRings;
        const u = 1 - t;
        const cx = u * u * pNozzle.x + 2 * u * t * pMid.x + t * t * pImpact.x;
        const cy = u * u * pNozzle.y + 2 * u * t * pMid.y + t * t * pImpact.y;
        const cz = u * u * pNozzle.z + 2 * u * t * pMid.z + t * t * pImpact.z;

        const radX = 0.11 + Math.sin(t * Math.PI * 0.85) * 0.22 + Math.sin(t * 12 - time * 6) * 0.018;
        const radY = 0.09 + Math.sin(t * Math.PI * 0.85) * 0.16;

        const ring = [];
        for (let k = 0; k < numPts; k++) {
          const ang = (k / numPts) * Math.PI * 2;
          const jitter = Math.sin(ang * 3 + t * 8 + time * 4) * 0.015;
          const px = cx + Math.cos(ang) * (radX + jitter);
          const py = cy + Math.sin(ang) * (radY + jitter);
          const pz = cz + Math.sin(ang) * (radX + jitter) * 0.7;
          const speed = 1.0 + 5.2 * (t * t);
          ring.push({ x: px, y: py, z: pz, speed: speed });
        }
        rings.push(ring);
      }

      for (let r = 0; r < numRings; r++) {
        const ringA = rings[r];
        const ringB = rings[r + 1];
        for (let k = 0; k < numPts; k++) {
          const nextK = (k + 1) % numPts;
          quads.push({
            p1: ringA[k], p2: ringA[nextK], p3: ringB[nextK], p4: ringB[k],
            speed: (ringA[k].speed + ringB[k].speed) * 0.5,
            isPool: false
          });
        }
      }

      // Add pool surface disc quads at bottom
      const poolRings = 5;
      const poolSectors = 12;
      for (let pr = 0; pr < poolRings; pr++) {
        const rA = (pr / poolRings) * 1.18;
        const rB = ((pr + 1) / poolRings) * 1.18;
        for (let s = 0; s < poolSectors; s++) {
          const angA = (s / poolSectors) * Math.PI * 2;
          const angB = ((s + 1) / poolSectors) * Math.PI * 2;

          const waveA = Math.sin(time * 3.8 - rA * 6.0) * 0.04;
          const waveB = Math.sin(time * 3.8 - rB * 6.0) * 0.04;

          const p1 = { x: pImpact.x + Math.cos(angA) * rA * 1.25, y: -1.82 + waveA, z: pImpact.z + Math.sin(angA) * rA * 0.95, speed: Math.max(0.4, 2.5 - rA * 2.0) };
          const p2 = { x: pImpact.x + Math.cos(angB) * rA * 1.25, y: -1.82 + waveA, z: pImpact.z + Math.sin(angB) * rA * 0.95, speed: Math.max(0.4, 2.5 - rA * 2.0) };
          const p3 = { x: pImpact.x + Math.cos(angB) * rB * 1.25, y: -1.82 + waveB, z: pImpact.z + Math.sin(angB) * rB * 0.95, speed: Math.max(0.4, 2.5 - rB * 2.0) };
          const p4 = { x: pImpact.x + Math.cos(angA) * rB * 1.25, y: -1.82 + waveB, z: pImpact.z + Math.sin(angA) * rB * 0.95, speed: Math.max(0.4, 2.5 - rB * 2.0) };

          quads.push({
            p1, p2, p3, p4,
            speed: (p1.speed + p3.speed) * 0.5,
            isPool: true
          });
        }
      }

      return quads;
    }

    // ── Mode Switching Logic ──
    function switchMode(modeNum) {
      const target = MODE_INFO[modeNum];
      if (!target) return;
      currentFluidMode = modeNum;

      tabs.forEach(t => {
        const tMode = parseInt(t.getAttribute('data-mode'), 10);
        t.classList.toggle('active', tMode === modeNum);
      });

      if (modeNameElem) modeNameElem.textContent = target.name;
      if (modeDescElem) modeDescElem.textContent = target.desc;
      if (speedBar) speedBar.style.display = target.hasSpeed ? 'flex' : 'none';

      showToast('Modo [' + modeNum + '] ' + target.name + ' Activado');
    }

    window.switchFluidMode = switchMode;

    tabs.forEach(tab => {
      tab.onclick = () => {
        const m = parseInt(tab.getAttribute('data-mode'), 10) || 1;
        switchMode(m);
      };
    });

    if (!fluidModeKeyBound) {
      fluidModeKeyBound = true;
      window.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '6') {
          const currentSlide = document.querySelector('.slide.active');
          if (currentSlide && currentSlide.getAttribute('data-slide') === '13') {
            switchMode(parseInt(e.key, 10));
          }
        }
      });
    }

    // ── Main Render Loop ──
    let lastTime = performance.now();
    let simTime = 1.040;
    let fpsFrames = 0;
    let fpsTimer = performance.now();
    let curFps = 60.0;

    function renderLoop(now) {
      now = (typeof now === 'number' && !isNaN(now)) ? now : performance.now();
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.05);
      lastTime = now;
      simTime += dt;

      fpsFrames++;
      if (now - fpsTimer >= 500) {
        curFps = Math.round((fpsFrames * 1000) / (now - fpsTimer) * 10) / 10;
        fpsFrames = 0;
        fpsTimer = now;
        if (fpsElem) fpsElem.textContent = 'FPS: ' + curFps.toFixed(1);
      }

      if (timeElem) timeElem.textContent = 'SIM_TIME: ' + simTime.toFixed(3) + ' s';
      if (coordsElem) {
        coordsElem.textContent = 'X: ' + (Math.cos(camTheta) * 5.2).toFixed(1) + ' | Y: ' + (camPhi * 4.0).toFixed(1) + ' | Z: ' + (Math.sin(camTheta) * 5.2).toFixed(1);
      }

      const { w, h } = resizeCanvas();
      ctx.save();

      ctx.fillStyle = '#010406';
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.50;
      const cy = h * 0.52;
      const scale = Math.min(w, h) * 0.85;

      // ── 1. Floor Grid & Bounding Box ──
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
      ctx.lineWidth = 1;
      for (let gx = -2.0; gx <= 2.05; gx += 0.8) {
        const pA = project3D(gx, boxMinY, boxMinZ, cx, cy, scale);
        const pB = project3D(gx, boxMinY, boxMaxZ, cx, cy, scale);
        if (pA && pB) {
          ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.stroke();
        }
      }
      for (let gz = -2.0; gz <= 2.05; gz += 0.8) {
        const pA = project3D(boxMinX, boxMinY, gz, cx, cy, scale);
        const pB = project3D(boxMaxX, boxMinY, gz, cx, cy, scale);
        if (pA && pB) {
          ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.stroke();
        }
      }

      // Box edges
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = 1.6;
      boxEdges.forEach(edge => {
        const pA = project3D(edge[0][0], edge[0][1], edge[0][2], cx, cy, scale);
        const pB = project3D(edge[1][0], edge[1][1], edge[1][2], cx, cy, scale);
        if (pA && pB) {
          ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.stroke();
        }
      });

      const pDim = project3D(boxMinX, boxMaxY, boxMaxZ, cx, cy, scale);
      if (pDim) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
        ctx.font = '11px monospace';
        ctx.fillText('6.00 u', pDim.x + 4, pDim.y - 4);
      }

      // ── 2. Tilted Bottle Wireframe ──
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.6;
      for (let ringStep = 0; ringStep <= 4; ringStep++) {
        const f = ringStep / 4;
        const ringCenter = {
          x: 1.1 * (1 - f) + 2.1 * f,
          y: 0.9 * (1 - f) + 1.8 * f,
          z: -0.1 * (1 - f) + -0.6 * f
        };
        const ringRad = 0.22 + f * 0.28;
        ctx.beginPath();
        for (let s = 0; s <= 12; s++) {
          const ang = (s / 12) * Math.PI * 2;
          const rx = ringCenter.x + Math.cos(ang) * ringRad * 0.6;
          const ry = ringCenter.y + Math.sin(ang) * ringRad;
          const rz = ringCenter.z + Math.cos(ang) * ringRad * 0.8;
          const pr = project3D(rx, ry, rz, cx, cy, scale);
          if (pr) {
            if (s === 0) ctx.moveTo(pr.x, pr.y);
            else ctx.lineTo(pr.x, pr.y);
          }
        }
        ctx.stroke();
      }

      // Axis Gizmo
      const pGizmo = project3D(2.1, 1.8, -0.6, cx, cy, scale);
      const pGizmoX = project3D(2.45, 1.8, -0.6, cx, cy, scale);
      const pGizmoY = project3D(2.1, 2.15, -0.6, cx, cy, scale);
      const pGizmoZ = project3D(2.1, 1.8, -0.25, cx, cy, scale);
      if (pGizmo && pGizmoX && pGizmoY && pGizmoZ) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FF3366'; ctx.beginPath(); ctx.moveTo(pGizmo.x, pGizmo.y); ctx.lineTo(pGizmoX.x, pGizmoX.y); ctx.stroke();
        ctx.strokeStyle = '#39FF14'; ctx.beginPath(); ctx.moveTo(pGizmo.x, pGizmo.y); ctx.lineTo(pGizmoY.x, pGizmoY.y); ctx.stroke();
        ctx.strokeStyle = '#00F0FF'; ctx.beginPath(); ctx.moveTo(pGizmo.x, pGizmo.y); ctx.lineTo(pGizmoZ.x, pGizmoZ.y); ctx.stroke();
      }

      // ── 3. Calculate Projected Particles ──
      const allProjected = [];
      organicParticles.forEach(p => {
        const pt = getOrganicParticlePos(p, simTime);
        const proj = project3D(pt.x, pt.y, pt.z, cx, cy, scale);
        if (proj) {
          allProjected.push({ proj, pt, p, isPool: p.zone === 'pool' });
        }
      });
      allProjected.sort((a, b) => b.proj.z - a.proj.z);

      // ── 4. RENDER ACTIVE MODE ──

      // ── MODE 1: PARTÍCULAS SPH ORGÁNICAS (Natural Fine Spray & Liquid Pool) ──
      if (currentFluidMode === 1) {
        allProjected.forEach(item => {
          const pr = item.proj;
          const rad = Math.max(1.4, item.p.radius * pr.fov * 1.8);

          // Soft organic glow body
          ctx.fillStyle = item.isPool ? 'rgba(0, 210, 255, 0.72)' : 'rgba(0, 240, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, rad, 0, Math.PI * 2);
          ctx.fill();

          // Tiny specular liquid core highlight
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(pr.x - rad * 0.28, pr.y - rad * 0.28, rad * 0.35, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── MODE 2: PLEXUS (Dynamic 3D Mesh connecting organic nodes) ──
      else if (currentFluidMode === 2) {
        ctx.lineWidth = 1;
        const maxDist = 0.42;
        const stride = 2;
        for (let i = 0; i < allProjected.length; i += stride) {
          const ptA = allProjected[i].pt;
          const prA = allProjected[i].proj;
          for (let j = i + 1; j < allProjected.length; j += stride) {
            const ptB = allProjected[j].pt;
            const prB = allProjected[j].proj;
            const dx = ptA.x - ptB.x;
            const dy = ptA.y - ptB.y;
            const dz = ptA.z - ptB.z;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d < maxDist) {
              const alpha = (1 - d / maxDist) * 0.65;
              ctx.strokeStyle = allProjected[i].isPool ? 'rgba(57, 255, 20, ' + alpha + ')' : 'rgba(0, 240, 255, ' + alpha + ')';
              ctx.beginPath();
              ctx.moveTo(prA.x, prA.y);
              ctx.lineTo(prB.x, prB.y);
              ctx.stroke();
            }
          }
        }

        allProjected.forEach(item => {
          const pr = item.proj;
          const rad = Math.max(1.2, item.p.radius * pr.fov * 0.8);
          ctx.fillStyle = item.isPool ? '#39FF14' : '#00F0FF';
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, rad, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── MODE 3: MALLA SUPERFICIE (Marching Cubes Volumetric Liquid Mesh) ──
      else if (currentFluidMode === 3) {
        const quads = createSurfaceMesh(simTime);
        const projQuads = [];
        quads.forEach(q => {
          const pr1 = project3D(q.p1.x, q.p1.y, q.p1.z, cx, cy, scale);
          const pr2 = project3D(q.p2.x, q.p2.y, q.p2.z, cx, cy, scale);
          const pr3 = project3D(q.p3.x, q.p3.y, q.p3.z, cx, cy, scale);
          const pr4 = project3D(q.p4.x, q.p4.y, q.p4.z, cx, cy, scale);
          if (pr1 && pr2 && pr3 && pr4) {
            const avgZ = (pr1.z + pr2.z + pr3.z + pr4.z) * 0.25;
            projQuads.push({ pr1, pr2, pr3, pr4, avgZ, isPool: q.isPool });
          }
        });
        projQuads.sort((a, b) => b.avgZ - a.avgZ);

        projQuads.forEach(q => {
          ctx.fillStyle = q.isPool ? 'rgba(0, 180, 240, 0.35)' : 'rgba(0, 240, 255, 0.45)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(q.pr1.x, q.pr1.y);
          ctx.lineTo(q.pr2.x, q.pr2.y);
          ctx.lineTo(q.pr3.x, q.pr3.y);
          ctx.lineTo(q.pr4.x, q.pr4.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      }

      // ── MODE 4: VECTORES (Surface Mesh + 3D Velocity Directional Arrows) ──
      else if (currentFluidMode === 4) {
        // Draw underlying subtle surface mesh for reference
        const quads = createSurfaceMesh(simTime);
        quads.forEach((q, idx) => {
          if (idx % 3 === 0) {
            const pr1 = project3D(q.p1.x, q.p1.y, q.p1.z, cx, cy, scale);
            const pr2 = project3D(q.p2.x, q.p2.y, q.p2.z, cx, cy, scale);
            const pr3 = project3D(q.p3.x, q.p3.y, q.p3.z, cx, cy, scale);
            if (pr1 && pr2 && pr3) {
              ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(pr1.x, pr1.y); ctx.lineTo(pr2.x, pr2.y); ctx.lineTo(pr3.x, pr3.y);
              ctx.stroke();
            }
          }
        });

        // 3D Velocity vector arrows
        allProjected.forEach((item, idx) => {
          if (idx % 2 === 0) {
            const pr = item.proj;
            const pt = item.pt;
            let angle = Math.PI * 0.5;
            let arrowLen = Math.max(8, Math.min(26, pt.speed * 4.2));

            if (!item.isPool) {
              // Plunging stream
              angle = Math.PI * 0.42 + (pt.x - cx) * 0.001;
            } else {
              // Pool circulation
              angle = Math.atan2(pt.z - pImpact.z, pt.x - pImpact.x) + Math.PI * 0.5;
            }

            const color = getJetColor(pt.speed, 0.95);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(pr.x, pr.y);
            const tipX = pr.x + Math.cos(angle) * arrowLen;
            const tipY = pr.y + Math.sin(angle) * arrowLen;
            ctx.lineTo(tipX, tipY);
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(tipX - Math.cos(angle - 0.4) * 4.5, tipY - Math.sin(angle - 0.4) * 4.5);
            ctx.lineTo(tipX - Math.cos(angle + 0.4) * 4.5, tipY - Math.sin(angle + 0.4) * 4.5);
            ctx.closePath();
            ctx.fill();
          }
        });
      }

      // ── MODE 5: LÍNEAS FLUJO (Continuous Streamlines from Bottle to Pool) ──
      else if (currentFluidMode === 5) {
        const numStreamlines = 16;
        for (let lineIdx = 0; lineIdx < numStreamlines; lineIdx++) {
          const radOff = ((lineIdx % 4) / 4) * 0.65;
          const radAng = (lineIdx / numStreamlines) * Math.PI * 2;
          const steps = 30;
          ctx.beginPath();
          let started = false;
          for (let st = 0; st <= steps; st++) {
            const t = st / steps;
            const u = 1 - t;
            const bx = u * u * pNozzle.x + 2 * u * t * pMid.x + t * t * pImpact.x;
            const by = u * u * pNozzle.y + 2 * u * t * pMid.y + t * t * pImpact.y;
            const bz = u * u * pNozzle.z + 2 * u * t * pMid.z + t * t * pImpact.z;
            const spread = 0.05 + t * 0.16;
            const px = bx + Math.cos(radAng) * spread * radOff;
            const py = by + Math.sin(radAng) * spread * radOff * 0.8;
            const pz = bz + Math.sin(radAng) * spread * radOff;

            const pr = project3D(px, py, pz, cx, cy, scale);
            if (pr) {
              if (!started) { ctx.moveTo(pr.x, pr.y); started = true; }
              else ctx.lineTo(pr.x, pr.y);
            }
          }
          const col = getJetColor(1.2 + (lineIdx / numStreamlines) * 4.8, 0.85);
          ctx.strokeStyle = col;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }

        // Animated particles along the streamlines
        allProjected.forEach((item, idx) => {
          if (idx % 3 === 0) {
            const pr = item.proj;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pr.x, pr.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // ── MODE 6: MAPA CFD SOBRE MALLA DE SUPERFICIE (Jet Colormap on Surface Mesh) ──
      else if (currentFluidMode === 6) {
        // Build 3D Surface Mesh
        const quads = createSurfaceMesh(simTime);
        const projQuads = [];

        quads.forEach(q => {
          const pr1 = project3D(q.p1.x, q.p1.y, q.p1.z, cx, cy, scale);
          const pr2 = project3D(q.p2.x, q.p2.y, q.p2.z, cx, cy, scale);
          const pr3 = project3D(q.p3.x, q.p3.y, q.p3.z, cx, cy, scale);
          const pr4 = project3D(q.p4.x, q.p4.y, q.p4.z, cx, cy, scale);
          if (pr1 && pr2 && pr3 && pr4) {
            const avgZ = (pr1.z + pr2.z + pr3.z + pr4.z) * 0.25;
            projQuads.push({ pr1, pr2, pr3, pr4, speed: q.speed, avgZ });
          }
        });
        projQuads.sort((a, b) => b.avgZ - a.avgZ);

        // Render each polygonal facet of the surface mesh with Jet Colormap shading
        projQuads.forEach(q => {
          const col = getJetColor(q.speed, 0.92);
          ctx.fillStyle = col;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(q.pr1.x, q.pr1.y);
          ctx.lineTo(q.pr2.x, q.pr2.y);
          ctx.lineTo(q.pr3.x, q.pr3.y);
          ctx.lineTo(q.pr4.x, q.pr4.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });

        // Add break-off splash polygon droplets in high-velocity plunge zone
        for (let dp = 0; dp < 18; dp++) {
          const dAng = (dp / 18) * Math.PI * 2 + simTime * 1.5;
          const dDist = 0.2 + ((dp * 7) % 10) * 0.05;
          const dropX = pImpact.x + Math.cos(dAng) * dDist;
          const dropY = -1.70 + Math.sin(simTime * 4 + dp) * 0.12;
          const dropZ = pImpact.z + Math.sin(dAng) * dDist;
          const prDrop = project3D(dropX, dropY, dropZ, cx, cy, scale);
          if (prDrop) {
            const dropSpeed = 4.2 + (dp % 5) * 0.4;
            ctx.fillStyle = getJetColor(dropSpeed, 0.95);
            ctx.beginPath();
            ctx.arc(prDrop.x, prDrop.y, 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
      simAnimFrameId = requestAnimationFrame(renderLoop);
    }

    if (simAnimFrameId) cancelAnimationFrame(simAnimFrameId);
    renderLoop(performance.now());

    const urlParams = new URLSearchParams(window.location.search);
    const initMode = parseInt(urlParams.get('mode'), 10);
    switchMode(initMode >= 1 && initMode <= 6 ? initMode : 1);
  }

  // Slide 14: Jet Color Probe
  function initJetColorProbe() {
    const probeSlider = document.getElementById('jet-probe-slider');
    const readoutSpeed = document.getElementById('jet-probe-speed');
    const readoutColor = document.getElementById('jet-probe-color');

    if (probeSlider && readoutSpeed && readoutColor) {
      probeSlider.oninput = () => {
        const val = parseInt(probeSlider.value, 10);
        readoutSpeed.textContent = `${(val * 0.08).toFixed(2)} m/s (${val}%)`;
        if (val < 25) {
          readoutColor.textContent = "Azul / Celeste (Flujo Laminar)";
          readoutColor.style.color = "#00F0FF";
        } else if (val < 75) {
          readoutColor.textContent = "Verde / Amarillo (Velocidad Nominal)";
          readoutColor.style.color = "#39FF14";
        } else {
          readoutColor.textContent = "Naranja / Rojo (Turbulencia & Vórtice)";
          readoutColor.style.color = "#FF0000";
        }
      };
    }
  }

  // Slide 15: HUD Architecture Wireframe
  function initHudArchitectureZones() {
    const zones = document.querySelectorAll('.hud-zone');
    const zoneTitle = document.getElementById('hud-zone-desc-title');
    const zoneBody = document.getElementById('hud-zone-desc-body');

    const ZONE_DATA = {
      'top': { title: "BARRA SUPERIOR (TOP HUD)", text: "Muestra GPU activa, tiempo de cómputo transcurrido, framerate (FPS) y coordenadas de cámara tridimensional." },
      'left': { title: "PANEL IZQUIERDO (VARIABLES)", text: "Control de capas visuales y constantes físicas: gravedad, densidad, viscosidad cinemática y tensión superficial." },
      'center': { title: "VIEWPORT 3D PRINCIPAL", text: "Lienzo de renderizado acelerado en GPU con barra térmica Jet graduada vertical en metros por segundo." },
      'right': { title: "PANEL DERECHO (EMISORES)", text: "Configuración de emisores continuos, selección de perfiles de líquido (agua, aceite, etc.) y telemetría por partícula." },
      'bottom': { title: "BARRA INFERIOR (ATAJOS)", text: "Guía rápida de atajos de teclado del operador para alternar modos 1-6, pausar o reiniciar la simulación." }
    };

    zones.forEach(zone => {
      zone.onclick = () => {
        zones.forEach(z => z.classList.remove('active'));
        zone.classList.add('active');
        const key = zone.getAttribute('data-zone');
        if (ZONE_DATA[key] && zoneTitle && zoneBody) {
          zoneTitle.textContent = ZONE_DATA[key].title;
          zoneBody.textContent = ZONE_DATA[key].text;
        }
      };
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // AMBIENT BACKGROUND CANVAS (Lightweight Plexus Dynamics)
  // ═══════════════════════════════════════════════════════════════
  function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const nodes = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2
      });
    }

    function renderBg() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.fill();
      });

      requestAnimationFrame(renderBg);
    }

    renderBg();
  }

  // ═══════════════════════════════════════════════════════════════
  // KEYBOARD & TOUCH EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════
  function setupEvents() {
    window.addEventListener('keydown', (e) => {
      // Avoid hotkeys if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Check Konami Code progression on every keystroke
      handleKonamiInput(e.key);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
        case 'o':
        case 'O':
          e.preventDefault();
          toggleOverview();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          if (isRemoteUnlocked) {
            toggleNotes();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          // If on Slide 13 (simulation modes), map numbers 1-6 to modes!
          if (currentSlide === 12) {
            const targetTab = document.querySelector(`.sim-mode-item[data-mode="${e.key}"], .mode-tab-btn[data-mode="${e.key}"]`);
            if (targetTab) targetTab.click();
          }
          break;
      }
    });

    // Touch Swipe
    let touchStartX = 0;
    let touchEndX = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });

    // Buttons click
    if (prevBtn) prevBtn.onclick = prevSlide;
    if (nextBtn) nextBtn.onclick = nextSlide;
    if (overviewBtn) overviewBtn.onclick = toggleOverview;
    if (closeOverviewBtn) closeOverviewBtn.onclick = closeOverview;
    if (notesBtn) notesBtn.onclick = () => { if (isRemoteUnlocked) toggleNotes(); };
    if (closeNotesBtn) closeNotesBtn.onclick = toggleNotes;
    if (fullscreenBtn) fullscreenBtn.onclick = toggleFullscreen;
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION ON LOAD
  // ═══════════════════════════════════════════════════════════════
  window.addEventListener('DOMContentLoaded', () => {
    initBackgroundCanvas();
    setupEvents();
    startPitchTimer();
    // Auto-init 3D fluid simulator on load
    try { initFluidModeSimulator(); } catch (e) {}

    // Check URL hash (#slide-5) or query param (?slide=5)
    let initialSlide = 0;
    const hashMatch = window.location.hash.match(/#slide-(\d+)/);
    const searchParams = new URLSearchParams(window.location.search);
    const querySlide = searchParams.get('slide');

    if (hashMatch) {
      initialSlide = parseInt(hashMatch[1], 10) - 1;
    } else if (querySlide) {
      initialSlide = parseInt(querySlide, 10) - 1;
    } else {
      // Check localStorage for resuming if available
      try {
        const saved = localStorage.getItem('neofluid_presentation_active_slide');
        if (saved !== null) {
          const s = parseInt(saved, 10);
          if (!isNaN(s) && s >= 0 && s < totalSlides) {
            initialSlide = s;
          }
        }
      } catch (e) {}
    }

    goToSlide(initialSlide, false);
  });

})();
