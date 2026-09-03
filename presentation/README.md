# 🎬 NeoFluid3D — Presentación Interactiva de Diseño (Startup Deck)
### Hackathon Nicaragua 2026 — Primera Etapa de Evaluación de Diseño

Esta aplicación web independiente y modular convierte el documento oficial [`Entregable_Diseno_Hackathon_Nicaragua_2026.md`](../docs/Entregable_Diseno_Hackathon_Nicaragua_2026.md) en una **presentación interactiva en tiempo real (Deck Engine)** diseñada bajo los estándares estéticos y técnicos del [Manual de Marca Oficial (`Manual de marca NEO.pdf`)](../docs/Manual%20de%20marca%20NEO.pdf).

---

## 🚀 Cómo Ejecutar la Presentación

1. **Vía Navegador Directo:**
   Abre el archivo `presentation/index.html` en cualquier navegador web moderno (Chrome, Edge, Firefox, Brave, Safari). No requiere dependencias externas ni compilación (zero dependencies).
2. **Vía Servidor Local:**
   Puedes iniciar un servidor web estático en la raíz del proyecto:
   ```bash
   python -m http.server 8080
   # Luego abrir en tu navegador:
   # http://localhost:8080/presentation/
   ```

---

## 📱 Consola Remota de Pitch & Doble Pantalla (`remote.html`)

La presentación cuenta con una **Consola de Control Remoto y Libreto para el Orador** que corre en una pestaña, ventana secundaria o tablet/móvil:

* **Sincronización Bidireccional en Tiempo Real:** Utiliza la API moderna `BroadcastChannel` con respaldo en `localStorage`. Cualquier cambio en el control remoto desplaza la presentación en la pantalla principal en menos de 5ms, y viceversa.
* **Libreto Cronometrado:** Despliega el guion completo de pitch para cada lámina, con tiempo sugerido por diapositiva (ej. *45 segundos*), puntos clave que el expositor debe recalcar y posibles preguntas del jurado.
* **Control Remoto Táctil:** Botones táctiles grandes de [◄ Anterior] y [Siguiente ►], selector directo de salto a lámina, previsualización de la siguiente diapositiva y Pantalla Completa.
* **Desbloqueo de Seguridad (Código Konami):** La consola remota está protegida y oculta en memoria volátil. Se desbloquea introduciendo en el teclado la secuencia canónica: <kbd>↑</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> <kbd>←</kbd> <kbd>→</kbd> <kbd>B</kbd> <kbd>A</kbd>. Una vez desbloqueada, se presiona la tecla <kbd>S</kbd> o el botón **`Remoto (S) ↗`** en la barra superior.

---

## 💧 Animaciones Dinámicas de Fluidos (No Simples Apariciones)

En lugar del típico fundido genérico, el cambio entre láminas ejecuta **4 dinámicas hidrodinámicas rotativas**:

1. **Tensión Superficial & Expansión de Gota (`fluid-fx-droplet`):** Expansión radial orgánica con efecto de menisco líquido y deformación elástica.
2. **Barrido Laminar de Líneas de Corriente (`fluid-fx-laminar`):** Desplazamiento horizontal continuo que emula una lámina de agua en flujo laminar.
3. **Oleaje Hidráulico & Choque (`fluid-fx-surge`):** Oleada vertical ascendente que simula la apertura súbita de una compuerta hidráulica.
4. **Vórtice & Rotación de Masa (`fluid-fx-vortex`):** Disipación y concentración rotacional emulando la vorticidad de un fluido turbulento.
5. **Trazado de Tuberías Vectoriales (`svg-draw-fluid`):** Los planos y diagramas técnicos dibujan sus trazos SVG al entrar, como líquido circulando por conductos.

---

## 📐 Recursos de Marca Incorporados (Manual de Marca NEO)

* **Barras Verticales Fragmentadas (Pág. 10):** Rieles laterales de telemetría de datos en tiempo real que pulsan simulando la entrada de datos continuos y velocidad de cálculo en GPU.
* **Geometría Hexagonal Modular (Pág. 10):** Marcas de agua y patrones hexagonales en esquinas representando la optimización espacial sin huecos.
* **Grilla Canónica 4 × 2.4 cm & Marcas de Registro (Pág. 4):** Cruces de registro (`⊕`), marcas de encuadre en $L$ y $T$, y cotas milimétricas paramétricas.
* **Cero Emojis:** 100% de la iconografía está construida con los 13 glifos vectoriales SVG oficiales de la marca (trazo uniforme de 2px con terminaciones redondeadas).

---

## ⌨️ Controles y Atajos de Teclado

| Tecla / Combinación | Acción | Descripción |
|:---:|:---:|---|
| <kbd>→</kbd> / <kbd>Espacio</kbd> / <kbd>↓</kbd> | **Avanzar** | Pasa a la siguiente diapositiva con transición de fluido. |
| <kbd>←</kbd> / <kbd>↑</kbd> / <kbd>Backspace</kbd> | **Retroceder** | Regresa a la diapositiva anterior. |
| <kbd>Inicio</kbd> (Home) | **Ir al Inicio** | Salta directamente a la Portada (Slide 01). |
| <kbd>Fin</kbd> (End) | **Ir al Final** | Salta a la Conclusión & Enlaces (Slide 19). |
| <kbd>↑ ↑ ↓ ↓ ← → ← → B A</kbd> | **Código Konami** | Desbloquea en memoria la Consola Remota de Orador. |
| <kbd>S</kbd> | **Consola Remota** | Abre `remote.html` sincronizado (solo tras desbloqueo Konami). |
| <kbd>O</kbd> o <kbd>Esc</kbd> | **Vista Cuadrícula** | Abre la vista general con miniaturas de las 19 láminas. |
| <kbd>F</kbd> | **Pantalla Completa** | Alterna el modo Fullscreen del navegador. |
| <kbd>1</kbd> a <kbd>6</kbd> | **Modos 3D** | En la Diapositiva 13, conmuta en vivo los modos del simulador. |
| <kbd>Ctrl</kbd> + <kbd>P</kbd> | **Exportar PDF** | Genera un archivo PDF apaisado de alta resolución. |

---

## 🔄 Conexión Bidireccional con el Sitio Web

La presentación está comunicada bidireccionalmente con el sitio web principal (`../index.html`):

1. **Desde la Presentación hacia el Sitio:**
   * El botón superior derecho `Sitio Web ↗` calcula automáticamente a qué sección del sitio dirigirse en función de la diapositiva activa:
     * Slides 01–02 ➔ `#hero`
     * Slides 03–08 ➔ `#brand` (ADN Técnico y Marca)
     * Slides 09–12 ➔ `#sdk` (Componentes y SDK)
     * Slides 13–14 ➔ `#modes` (Modos de Simulación)
     * Slides 15–16 ➔ `#benchmarks`
     * Slides 17–19 ➔ `#vision`
2. **Desde el Sitio hacia la Presentación:**
   * Mediante hash o query string: `presentation/index.html#slide-3` o `presentation/index.html?slide=13`.
   * La aplicación recuerda la última diapositiva visitada mediante `localStorage`.

---

## 🖨️ Exportación a PDF de Alta Resolución

Para entregar la presentación como un documento PDF estático ante el comité del Hackathon:

1. Abre `presentation/index.html` en tu navegador.
2. Presiona <kbd>Ctrl</kbd> + <kbd>P</kbd> (o <kbd>Cmd</kbd> + <kbd>P</kbd> en Mac).
3. Configuración de impresión:
   * **Destino:** Guardar como PDF.
   * **Diseño:** Horizontal (Landscape).
   * **Márgenes:** Ninguno (None).
   * **Gráficos de fondo:** Activado (Background graphics: ON).
