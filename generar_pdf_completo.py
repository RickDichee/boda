import os
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import Color
from reportlab.lib.units import inch

# --- 1. CONFIGURACIÓN DE DATOS Y ESTILOS ---

# Colores extraídos de tu CSS
COLOR_GOLD_HEX = '#b8956a'
COLOR_BLACK_HEX = '#1a1a1a'
COLOR_GRAY_HEX = '#555555'

# Datos extraídos de tu HTML (index.html)
DATA = {
    "nombres": "Carlos & Naty",
    "subtitulo": "¡NOS CASAMOS!",
    # Fecha derivada del countdown (08/11/2025)
    "fecha_dia": "SÁBADO 08 DE NOVIEMBRE",
    "fecha_anio": "2025",
    "lugar1_titulo": "CEREMONIA",
    "lugar1_nombre": "Parroquia de Santa María",
    "lugar1_loc": "Ozumbilla, Méx.",
    "lugar1_hora": "14:00 HRS",
    "lugar2_titulo": "RECEPCIÓN",
    "lugar2_nombre": "Salón \"Jardín Los Pinos\"",
    "lugar2_loc": "Ozumbilla, Méx.", 
    "lugar2_hora": "16:00 HRS",
    "detalle1_titulo": "CÓDIGO DE VESTIMENTA",
    "detalle1_desc": "Formal Riguroso",
    "detalle2_titulo": "SUGERENCIA DE REGALO",
    "detalle2_desc": "Lluvia de Sobres (Efectivo)",
    "web_url": "https://carlosynaty.mx",
    "web_texto": "CONFIRMAR ASISTENCIA EN NUESTRA WEB"
}

FONT_SERIF_BOLD = "Times-Bold"
FONT_SERIF = "Times-Roman"
FONT_SANS = "Helvetica"

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip('#')
    return tuple(int(hex_code[i:i+2], 16)/255.0 for i in (0, 2, 4))

c_gold = Color(*hex_to_rgb(COLOR_GOLD_HEX))
c_black = Color(*hex_to_rgb(COLOR_BLACK_HEX))
c_gray = Color(*hex_to_rgb(COLOR_GRAY_HEX))

current_y_pos = 0

def move_down(amount):
    global current_y_pos
    current_y_pos -= amount

def draw_centered_text(c, text, font_name, font_size, color, width, space_after=20):
    c.setFont(font_name, font_size)
    c.setFillColor(color)
    # CORRECCIÓN: Usamos ortografía británica 'Centred'
    c.drawCentredString(width / 2, current_y_pos, text)
    move_down(space_after)

def draw_separator(c, width):
    move_down(10)
    c.setStrokeColor(c_gold)
    c.setLineWidth(1)
    margin = width * 0.33
    c.line(margin, current_y_pos, width - margin, current_y_pos)
    move_down(30)

# --- FUNCIÓN PRINCIPAL ---
def generar_pdf_con_datos():
    global current_y_pos
    
    folder_name = "boda_assets"
    image_filename = "invitacion-whatsapp.png" 
    output_pdf = "Invitacion_Completa_CN.pdf"

    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
        print(f"⚠️ Carpeta creada. Por favor coloca '{image_filename}' dentro de '{folder_name}'.")
        return

    img_path = os.path.join(folder_name, image_filename)
    pdf_path = os.path.join(folder_name, output_pdf)

    if not os.path.exists(img_path):
        print(f"❌ Error: No encuentro '{image_filename}' en la carpeta '{folder_name}'.")
        return

    try:
        img = ImageReader(img_path)
        width, height = img.getSize()
        c = canvas.Canvas(pdf_path, pagesize=(width, height))
        c.setTitle("Boda Carlos & Naty")

        # Dibujar fondo
        c.drawImage(img_path, 0, 0, width=width, height=height)

        # Empezar a dibujar textos
        # Ajustamos el inicio vertical al 88% de la altura
        current_y_pos = height * 0.88 

        # --- BLOQUE HEADER ---
        draw_centered_text(c, DATA['subtitulo'], FONT_SANS, 14, c_gray, width, 25)
        draw_centered_text(c, DATA['nombres'], FONT_SERIF_BOLD, 42, c_gold, width, 50)

        # --- BLOQUE FECHA ---
        draw_centered_text(c, DATA['fecha_dia'], FONT_SERIF_BOLD, 18, c_gold, width, 22)
        draw_centered_text(c, DATA['fecha_anio'], FONT_SERIF, 16, c_black, width, 20)
        
        draw_separator(c, width)

        # --- BLOQUE UBICACIONES ---
        draw_centered_text(c, DATA['lugar1_titulo'], FONT_SERIF_BOLD, 15, c_gold, width, 20)
        draw_centered_text(c, DATA['lugar1_nombre'], FONT_SERIF, 14, c_black, width, 18)
        draw_centered_text(c, DATA['lugar1_loc'], FONT_SERIF, 12, c_gray, width, 18)
        draw_centered_text(c, DATA['lugar1_hora'], FONT_SERIF_BOLD, 14, c_black, width, 35)

        draw_centered_text(c, DATA['lugar2_titulo'], FONT_SERIF_BOLD, 15, c_gold, width, 20)
        draw_centered_text(c, DATA['lugar2_nombre'], FONT_SERIF, 14, c_black, width, 18)
        draw_centered_text(c, DATA['lugar2_hora'], FONT_SERIF_BOLD, 14, c_black, width, 20)

        draw_separator(c, width)

        # --- BLOQUE DETALLES ---
        draw_centered_text(c, DATA['detalle1_titulo'], FONT_SERIF_BOLD, 13, c_gold, width, 18)
        draw_centered_text(c, DATA['detalle1_desc'], FONT_SERIF, 13, c_black, width, 30)

        draw_centered_text(c, DATA['detalle2_titulo'], FONT_SERIF_BOLD, 13, c_gold, width, 18)
        draw_centered_text(c, DATA['detalle2_desc'], FONT_SERIF, 13, c_black, width, 40)

        # --- BLOQUE FINAL (LINK) ---
        move_down(20)
        
        button_width = 300
        button_height = 40
        button_x = (width - button_width) / 2
        button_y = current_y_pos - 10
        c.setFillColor(c_gold)
        c.roundRect(button_x, button_y, button_width, button_height, 10, fill=1, stroke=0)
        
        c.setFillColor(c_black)
        c.setFont(FONT_SANS, 12)
        # CORRECCIÓN: 'Centred' aquí también
        c.drawCentredString(width / 2, current_y_pos, DATA['web_texto'])

        c.linkURL(DATA['web_url'], (button_x, button_y, button_x + button_width, button_y + button_height), relative=1)

        c.save()
        print(f"✅ PDF Completo Generado: {pdf_path}")

    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    generar_pdf_con_datos()
