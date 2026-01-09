#!/usr/bin/env python3
"""
Script para generar og-image.jpg para la invitación de boda
Requiere: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Configuración
WIDTH = 1200
HEIGHT = 630
BG_COLOR = (250, 250, 250)
TEXT_COLOR = (26, 26, 26)
ACCENT_COLOR = (184, 149, 106)
FOREST_COLOR = (61, 90, 76)
SAGE_COLOR = (143, 168, 159)

# Crear imagen
img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Intentar cargar fuentes (fallback a fuentes por defecto)
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf", 80)
    font_ampersand = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf", 70)
    font_details = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf", 28)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", 20)
except:
    font_title = ImageFont.load_default()
    font_ampersand = ImageFont.load_default()
    font_details = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Dibujar línea decorativa superior
line_width = 100
line_top = 80
draw.line([(WIDTH//2 - line_width//2, line_top), (WIDTH//2 + line_width//2, line_top)], fill=ACCENT_COLOR, width=3)

# Dibujar nombres
names_y = 130
draw.text((WIDTH//2, names_y), "Naty", font=font_title, fill=TEXT_COLOR, anchor="mm")
draw.text((WIDTH//2, names_y), "&", font=font_ampersand, fill=ACCENT_COLOR, anchor="mm")
draw.text((WIDTH//2, names_y), "Carlos", font=font_title, fill=TEXT_COLOR, anchor="mm")

# Dibujar línea decorativa inferior
draw.line([(WIDTH//2 - line_width//2, 250), (WIDTH//2 + line_width//2, 250)], fill=ACCENT_COLOR, width=3)

# Dibujar detalles
draw.text((WIDTH//2, 330), "Nos casamos", font=font_details, fill=TEXT_COLOR, anchor="mm")
draw.text((WIDTH//2, 400), "28 de Febrero · 2026", font=font_small, fill=FOREST_COLOR, anchor="mm")
draw.text((WIDTH//2, 450), "Quinta Los Cedros", font=font_details, fill=SAGE_COLOR, anchor="mm")

# Guardar imagen
output_path = os.path.join(os.path.dirname(__file__), 'assets/images/og-image.jpg')
img.save(output_path, 'JPEG', quality=90)
print(f"✅ Imagen generada: {output_path}")
