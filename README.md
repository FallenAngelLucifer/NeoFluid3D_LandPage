# 🟢 NeoFluid3D: Landing Page & Technical Showcase

> **Motor de Dinámica de Fluidos en Tiempo Real Acelerado por GPU**  
> Plataforma oficial de presentación técnica y comercial para **NeoFluid3D** — Diseñado para gemelos digitales industriales, prototipado pre-CFD, middlewares de producción virtual y licenciamiento de middleware gráfico B2B.

---

## 💎 Identidad Visual y Sistema de Diseño (Teoría del Color & Tipografía)

- **Paleta Cromática de Alta Precisión**:
  - `Cian Eléctrico` (`#00D2FF` / HSL: 191°, 100%, 50%): Fluido continuo, dinamismo y prefijo *Neo*. Diseñado para eliminar la aberración cromática frente a tonos fluorescentes descalibrados.
  - `Verde Esmeralda GPU` (`#00E599` / HSL: 160°, 100%, 45%): Malla discreta de cómputo, aceleración paralela y telemetría de rendimiento.
  - `Pizarra Obsidiana Deep` (`#070B0E` / HSL: 206°, 33%, 4%): Base de alto contraste óptico que atenúa la fatiga visual.
  - `Titanio Técnico / HUD` (`#8FA6B2` / HSL: 201°, 19%, 63%): Etiquetas de inspección, telemetría y metadatos analíticos.
- **Tipografía Híbrida y Sistema de Fuentes**:
  - **Identidad del Logo (Master Brand)**:
    - **Neo**: `Poppins` (Black 900) — Geometría circular de alta masa para el prefijo de marca.
    - **Fluid³D**: `JetBrains Mono` (Bold 700 / Regular 400) — Rigor ingenieril y dimensiones de cómputo espacial.
  - **Tipografía del Sitio Web (HUD & Estación de Trabajo)**:
    - **Títulos & Display**: `Oxanium` (Semi-Bold 600 / Bold 700 / Extra-Bold 800) — Tipografía geométrica y angular de alta tecnología para encabezados, menús y botones.
    - **Cuerpo & Lectura**: `IBM Plex Sans` (Light 300 / Regular 400 / Medium 500) — Lectura nítida y moderna para especificaciones técnicas y documentación.
    - **Telemetría & Código**: `JetBrains Mono` (Regular 400 / Bold 700) — Métricas en vivo, terminales interactivas y bloques de código SDK.

---

## 🚀 Arquitectura y Componentes Web

- **Arquitectura Modular Vanilla**: Cero dependencias pesadas, carga instantánea y optimización nativa en GPU.
- **Módulos Interactivos**:
  - `hero_drop_3d.js`: Renderizador tridimensional interactivo de la gota en Canvas con mallas wireframe, cúpula continua y partículas orbitales.
  - `genesis_controller.js`: Visor analítico de 19 pasos matemáticos de la gota $\mathbb{R}^3 \to \mathbb{R}^2$ con renderizado de fórmulas KaTeX, rotación orbital 3D y telemetría en vivo.
  - `plexus_controller.js`: Navegador vertical 3D Plexus sincronizado dinámicamente con el scroll y trazado de vectores interactivos.
  - `main.js`: Controlador general, tabs interactivos de SDK (C++, Python, HLSL/Compute Shader con copiado en 1 clic), selector interactivo de hardware/benchmarks (RTX 4070, RTX 4090, Apple Silicon M3 Max, Multi-GPU) y fallbacks procedimentales para videos y modos de render.

---

## 📑 Estructura de Secciones (B2B Narrative Flow)

1. **`00. #hero`**: Gota 3D interactiva en tiempo real, propuesta de valor de alto impacto e indicadores de latencia/rendimiento en vivo.
2. **`01. #vision`**: Arquitectura del motor de cálculo en GPU y pipeline computacional.
3. **`02. #demos`**: Muestrario de simulaciones en video con canvases procedimentales de respaldo.
4. **`03. #benchmarks`**: Tabla comparativa frente a CFD tradicional (CPU) y shaders de vértices, con simulador interactivo de rendimiento por hardware.
5. **`04. #sdk`**: Especificaciones de integración para Unreal Engine 5, NVIDIA Omniverse, Vulkan, DirectX 12 y WebGPU, con ventana interactiva de código multilenguaje.
6. **`05. #modes`**: Inspección visual multicapa (Isosuperficie, Partículas SPH, Tensión Plexus, Campo Euleriano).
7. **`06. #possibilities`**: Casos de uso comerciales (Gemelos digitales, prototipado pre-CFD, simuladores VR, VFX y desarrollo a medida).
8. **`07. #roadmap`**: Estrategia de evolución comercial y técnica en 5 etapas.
9. **`08. #brand`**: ADN matemático del símbolo (Visor paramétrico KaTeX) y muestras cromáticas oficiales con copiado de valores HEX.
10. **`09. #contact`**: Formulario corporativo B2B para solicitud de demos técnicas privadas y licenciamiento.

---

## 📁 Estructura del Proyecto

```text
📦 WebPage
 ┣ 📂 videos/                  -> Clips y demostraciones de simulación (.mp4 / .webm)
 ┃  ┗ 📜 README.md             -> Especificaciones técnicas de video
 ┣ 📜 favicon.svg              -> Isotipo vectorial oficial optimizado
 ┣ 📜 hero_drop_3d.js          -> Motor 3D interactivo del Hero Drop
 ┣ 📜 genesis_controller.js    -> Workbench 3D/2D del ADN Matemático
 ┣ 📜 plexus_controller.js     -> Menú vertical interactivo tipo Plexus
 ┣ 📜 main.js                  -> Controlador de interactividad, tabs de SDK y benchmarks
 ┣ 📜 styles.css               -> Sistema de diseño, variables de color y estilos responsivos
 ┣ 📜 index.html               -> Documento HTML principal
 ┗ 📜 README.md                -> Documentación del repositorio
```

---

## 📄 Licencia

Tecnología propietaria y propiedad intelectual © 2025–2026 **NeoFluid3D**. Todos los derechos reservados.
