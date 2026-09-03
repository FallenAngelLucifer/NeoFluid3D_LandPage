"""
NeoFluid3D - Canonical 3D to 2D Mathematical Isotype Projection Engine
Ports the 100% exact analytical projection engine from genesis_controller.js / shadow_maker.py
Outputs perfect vector SVG with 3 distributed rings, exact cut curve, and crisp typography-ready paths.
"""
import numpy as np
import os

# =====================================================================
# CONFIGURACIÓN Y PARÁMETROS DE CÁMARA
# =====================================================================
CONFIG = {
    "cam_x": 2.5,
    "cam_y": -2.3,
    "target_z": 0.3,
    "scale": 150.0,         # Escala de renderizado en píxeles
    "canvas_w": 800,
    "canvas_h": 800,
    "stroke_width": 20.0,    # Grosor de la cuadrícula interna (calibrado)
    "stroke_silhouette": 26.0, # Grosor de contorno y corte (calibrado)
    "output_svg": "NeoFluid3D_Logo.svg"
}

# Constantes exactas de la identidad matemática de NeoFluid3D
SQRT5 = np.sqrt(5)            # ~2.236068 (Ápice superior)
X0 = 2 * SQRT5 / 5            # ~0.894427 (Radio máximo de tangencia)
Y0 = SQRT5 / 5                # ~0.447214 (Cota Z de tangencia)
SALTO = 0.4204341369          # Delta canónico
SALTO_3 = 3 * SALTO / 2       # ~0.630651 (Paso para 3 anillos)
NUDGE = 0.12                  # Desplazamiento de anillos extremos

# Definición de los 3 anillos oficiales
RINGS = [
    {"z": Y0 - NUDGE,                 "r": np.sqrt(max(0, 1 - (Y0 - NUDGE)**2))},
    {"z": Y0 - SALTO_3,               "r": np.sqrt(max(0, 1 - (Y0 - SALTO_3)**2))},
    {"z": Y0 - 2 * SALTO_3 + NUDGE,   "r": np.sqrt(max(0, 1 - (Y0 - 2 * SALTO_3 + NUDGE)**2))}
]

MERIDIANS = [i * np.pi / 4 for i in range(8)]

# =====================================================================
# MATRIZ DE CÁMARA Y PROYECCIÓN 3D -> 2D
# =====================================================================
cam_z = 0.6 * (CONFIG["cam_x"] + CONFIG["cam_y"]) + 0.3 # 0.42

v_dir_raw = np.array([CONFIG["cam_x"], CONFIG["cam_y"], cam_z - CONFIG["target_z"]])
v_dir = v_dir_raw / np.linalg.norm(v_dir_raw)

up_global = np.array([0.0, 0.0, 1.0])
r_raw = np.cross(v_dir, up_global)
r_vec = r_raw / np.linalg.norm(r_raw)

u_raw = np.cross(r_vec, v_dir)
u_vec = u_raw / np.linalg.norm(u_raw)

cam_dir_2d = np.array([CONFIG["cam_x"], CONFIG["cam_y"]])
cam_dir_2d = cam_dir_2d / np.linalg.norm(cam_dir_2d)

angle_cam = np.arctan2(CONFIG["cam_y"], CONFIG["cam_x"])
theta_izq = angle_cam + np.pi / 2
theta_der = angle_cam - np.pi / 2

def project_to_2d(x, y, z, cx, cy, scale):
    p = np.array([x, y, z])
    x2d = -np.dot(p, r_vec)
    y2d = -np.dot(p, u_vec)
    return cx + x2d * scale, cy + y2d * scale

def get_cut_point(theta):
    """Calcula analíticamente el punto exacto de intersección del plano de corte con la gota."""
    k = 0.6 * (np.cos(theta) + np.sin(theta))
    
    # 1. Intento en el tramo cónico
    rt = (SQRT5 - 0.3) / (k + 2.0)
    zt = SQRT5 - 2.0 * rt
    if zt >= Y0:
        return {"r": rt, "z": zt, "x": rt * np.cos(theta), "y": rt * np.sin(theta)}
    
    # 2. Tramo esférico inferior
    A = 1.0 + k * k
    B = 0.6 * k
    C_eq = 0.3 * 0.3 - 1.0
    disc = B * B - 4.0 * A * C_eq
    rb = (-B + np.sqrt(max(0.0, disc))) / (2.0 * A)
    zb = k * rb + 0.3
    return {"r": rb, "z": zb, "x": rb * np.cos(theta), "y": rb * np.sin(theta)}

# =====================================================================
# MOTOR DE GENERACIÓN SVG
# =====================================================================
def generar_isotipo_svg():
    cx = CONFIG["canvas_w"] / 2
    cy = CONFIG["canvas_h"] / 2
    scale = CONFIG["scale"]
    
    num_steps = 180
    paths = []
    
    # 1. SILUETA EXTERIOR COMPLETA
    p_izq, p_der = [], []
    for i in range(num_steps + 1):
        z = -1.0 + (i / num_steps) * (SQRT5 + 1.0)
        r = (SQRT5 - z) / 2.0 if z > Y0 else np.sqrt(max(0.0, 1.0 - z * z))
        p_izq.append(project_to_2d(r * np.cos(theta_izq), r * np.sin(theta_izq), z, cx, cy, scale))
        p_der.append(project_to_2d(r * np.cos(theta_der), r * np.sin(theta_der), z, cx, cy, scale))
    
    # Path del contorno maestro completo
    d_contour = [f"M {p_izq[0][0]:.3f} {p_izq[0][1]:.3f}"]
    for p in p_izq[1:]:
        d_contour.append(f"L {p[0]:.3f} {p[1]:.3f}")
    for p in reversed(p_der):
        d_contour.append(f"L {p[0]:.3f} {p[1]:.3f}")
    d_contour.append("Z")
    
    paths.append({
        "id": "silhouette_outer",
        "d": " ".join(d_contour),
        "stroke": "#000000",
        "stroke_width": CONFIG["stroke_silhouette"],
        "fill": "none"
    })
    
    # 2. CURVA DE CORTE OBLICUO FRONTAL
    d_cut = []
    for i in range(num_steps + 1):
        theta = theta_der + (i / num_steps) * (theta_izq - theta_der)
        cp = get_cut_point(theta)
        pt = project_to_2d(cp["x"], cp["y"], cp["z"], cx, cy, scale)
        d_cut.append(f"{'M' if i == 0 else 'L'} {pt[0]:.3f} {pt[1]:.3f}")
        
    paths.append({
        "id": "cut_curve",
        "d": " ".join(d_cut),
        "stroke": "#000000",
        "stroke_width": CONFIG["stroke_silhouette"],
        "fill": "none"
    })
    
    # 3. LOS 3 ANILLOS HORIZONTALES (Recortados exactamente por el plano de corte)
    for idx, ring in enumerate(RINGS):
        d_ring = []
        is_drawing = False
        steps_ring = 180
        
        for i in range(steps_ring + 1):
            theta = (i / steps_ring) * np.pi * 2.0
            x = ring["r"] * np.cos(theta)
            y = ring["r"] * np.sin(theta)
            z = ring["z"]
            
            # Back-face culling: solo parte visible hacia la cámara
            dot_2d = x * cam_dir_2d[0] + y * cam_dir_2d[1]
            if dot_2d < 0.02:
                is_drawing = False
                continue
                
            # Recorte por el plano de corte oblicuo
            z_plano = 0.6 * (x + y) + 0.3
            if z > z_plano:
                is_drawing = False
                continue
                
            pt = project_to_2d(x, y, z, cx, cy, scale)
            if not is_drawing:
                d_ring.append(f"M {pt[0]:.3f} {pt[1]:.3f}")
                is_drawing = True
            else:
                d_ring.append(f"L {pt[0]:.3f} {pt[1]:.3f}")
                
        if d_ring:
            paths.append({
                "id": f"ring_{idx+1}",
                "d": " ".join(d_ring),
                "stroke": "#000000",
                "stroke_width": CONFIG["stroke_width"],
                "fill": "none"
            })
            
    # 4. LOS 8 MERIDIANOS VERTICALES (Desde el polo sur hasta la curva de corte)
    for idx, theta in enumerate(MERIDIANS):
        dot_2d = np.cos(theta) * cam_dir_2d[0] + np.sin(theta) * cam_dir_2d[1]
        if dot_2d < 0.02:
            continue # Ocultar meridiano posterior
            
        cp = get_cut_point(theta)
        d_meridian = []
        steps_m = 80
        
        for i in range(steps_m + 1):
            z = -1.0 + (i / steps_m) * (cp["z"] - (-1.0))
            r = (SQRT5 - z) / 2.0 if z > Y0 else np.sqrt(max(0.0, 1.0 - z * z))
            x = r * np.cos(theta)
            y = r * np.sin(theta)
            
            pt = project_to_2d(x, y, z, cx, cy, scale)
            d_meridian.append(f"{'M' if i == 0 else 'L'} {pt[0]:.3f} {pt[1]:.3f}")
            
        if d_meridian:
            paths.append({
                "id": f"meridian_{idx+1}",
                "d": " ".join(d_meridian),
                "stroke": "#000000",
                "stroke_width": CONFIG["stroke_width"],
                "fill": "none"
            })
            
    # Ensamblar SVG
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CONFIG["canvas_w"]} {CONFIG["canvas_h"]}" fill="none">',
        '  <!-- NeoFluid3D Master Canonical Projected Isotype (3 Distributed Rings) -->'
    ]
    for p in paths:
        svg.append(f'  <path id="{p["id"]}" d="{p["d"]}" stroke="{p["stroke"]}" stroke-width="{p["stroke_width"]}" stroke-linecap="round" stroke-linejoin="round" fill="{p["fill"]}" />')
    svg.append('</svg>')
    
    out_file = CONFIG["output_svg"]
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(svg))
        
    print(f"[OK] Isotipo proyectado con exito en: {os.path.abspath(out_file)}")

if __name__ == '__main__':
    generar_isotipo_svg()
