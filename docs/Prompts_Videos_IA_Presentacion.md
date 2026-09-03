# 🎬 Prompts de Video e IA Generativa para la Presentación de NeoFluid3D
### Hackathon Nicaragua 2026 — Categoría Startup

Este documento recopila una librería de **prompts técnicos optimizados** para herramientas generativas de video de última generación (**Runway Gen-3 Alpha, Luma Dream Machine, Kling AI, Sora / Minimax**). Estos prompts están formulados para producir bucles cinemáticos (*seamless loops*) de simulación hidrodinámica acelerada por GPU, perfectamente alineados con la estética de **NeoFluid3D** (Obsidiana Deep `#070B0E`, Celeste Eléctrico `#00F0FF` y Verde Neón `#39FF14`).

---

## 1. Guía de Estilo y Parámetros Globales

Para garantizar la coherencia visual con la identidad de marca, incluye siempre estas directivas base:
* **Paleta de Color:** Deep obsidian black background (`#070B0E`), electric cyan glow (`#00F0FF`), luminant radioactive green computational grid (`#39FF14`).
* **Iluminación:** High-contrast studio workstation lighting, edge-lit volumetric fluid, subtle HUD overlay scanlines, cyber-engineering aesthetic.
* **Cámara:** Macro close-up, slow smooth 360 orbital camera rotation, 60 FPS hyper-fluid physics, 4k resolution, raytraced reflections.

---

## 2. Prompts por Diapositiva / Módulo Temático

### A. Portada y Hero (La Gota Bipartita en Transformación)
> **Herramienta recomendada:** Luma Dream Machine / Runway Gen-3  
> **Prompt:**  
> `Cinematic macro shot of a solitary levitating water droplet transforming into a geometric 3D computational wireframe mesh. The upper half is glossy crystal-clear water with electric cyan (#00F0FF) inner glow and physical surface tension. The lower half dissolves into a precise glowing neon emerald green (#39FF14) latitudinal wireframe grid. Pitch black obsidian background (#070B0E), subtle futuristic engineering HUD telemetry floating in the air, 60fps slow motion, 8k, Octane render, unreal engine 5 scientific simulation.`

---

### B. Eje Conceptual Dual: Fluidez vs. Computación
> **Herramienta recomendada:** Kling AI / Runway Gen-3  
> **Prompt:**  
> `Split-screen visual harmony: on the left side, an organic, turbulent water wave flowing smoothly with cyan neon light streaks (#00F0FF); on the right side, an identical fluid stream rendered as a high-density mathematical particle plexus grid in glowing laser green (#39FF14). The two streams merge into a single vortex in the center. Futuristic CAD workstation aesthetic, deep black background, technical grid lines, ultra-detailed fluid dynamics simulation.`

---

### C. Modos de Renderizado: De Partículas SPH a Malla Continua
> **Herramienta recomendada:** Runway Gen-3 Alpha (Video-to-Video o Text-to-Video)  
> **Prompt:**  
> `A 3D simulation of a fluid splash hitting an invisible obstacle. The fluid smoothly transitions through visual states: first thousands of glowing spherical cyan particles, then connecting into an emerald plexus network, and finally solidifying into a continuous viscous water surface mesh with Marching Cubes reconstruction. Scientific CFD laboratory visualization, clean dark studio environment, crisp particle trails, 4k 60fps.`

---

### D. Mapa CFD Térmico (Jet Colormap en Turbulencia)
> **Herramienta recomendada:** Luma Dream Machine  
> **Prompt:**  
> `Scientific CFD velocity simulation around a sleek aerodynamic obstacle. The fluid velocity field is colored with a vibrant scientific Jet gradient: slow laminar blue and cyan streams (#00F0FF), medium green (#39FF14) and yellow flows, transitioning into intense orange and fiery red turbulent vortex shedding behind the object. Dark technical engineering interface background with floating velocity vectors and m/s data gauges.`

---

### E. Fondo Cinemático en Bucle para el Stand / Modo Cinema
> **Herramienta recomendada:** Runway Gen-3 / Minimax  
> **Prompt:**  
> `Seamless loopable background: subtle abstract 3D hydrodynamics fluid currents moving horizontally across an obsidian grid floor. Bioluminescent electric cyan and neon emerald green microscopic particles interacting with gentle viscosity waves. Minimalist tech wallpaper, 60fps smooth loop, clean scientific aesthetic, no blur, high contrast.`

---

## 3. Instrucciones de Integración en el Proyecto

1. **Generación del Clip:** Introduce el prompt en la plataforma de IA seleccionada con relación de aspecto `16:9` y duración de 5 a 10 segundos.
2. **Optimización de Archivo:**
   * Convierte a formato `MP4` (códec H.264) o `WebM` con resolución `1920x1080`.
   * Pasa el video por herramientas de compresión (ej. Handbrake o FFmpeg) manteniendo un bitrate de 4 a 6 Mbps para evitar retrasos de carga:
     ```bash
     ffmpeg -i input.mp4 -vcodec libx264 -crf 22 -preset slow -an -pix_fmt yuv420p output_optimized.mp4
     ```
3. **Ubicación:** Guarda los clips en la carpeta `videos/` del repositorio (ej. `videos/hero_fluid_loop.mp4`).
4. **Reproducción en Diapositivas:** Puedes sustituir el contenedor visual de cualquier diapositiva por una etiqueta `<video autoplay loop muted playsinline>` con opacidad controlada.
