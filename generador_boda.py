import os
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import Color

# --- 1. CONFIGURACIÓN DE COLORES (Extraídos de tu main.css) ---
# Usamos estos colores para mantener la consistencia de marca
COLOR_GOLD = '#b8956a'   # var(--gold)
COLOR_FOREST = '#3d5a4c' # var(--forest)
COLOR_BLACK = '#1a1a1a'  # var(--black)

def hex_to_rgb_tuple(hex_code):
    """Convierte hex a tupla (R, G, B) normalizada para ReportLab"""
    hex_code = hex_code.lstrip('#')
    return tuple(int(hex_code[i:i+2], 16)/255.0 for i in (0, 2, 4))

def generar_pdf_whatsapp():
    # Nombres de carpetas y archivos
    folder_name = "boda_assets"
    image_filename = "invitacion-whatsapp.jpg" # <--- Asegúrate que este sea el nombre exacto
    output_pdf = "Invitacion_Carlos_y_Naty.pdf"
    url_boda = "https://carlosynaty.mx"

    # Crear carpeta si no existe
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
        print(f"📂 Carpeta '{folder_name}' creada.")
        print(f"⚠️  ACCIÓN REQUERIDA: Por favor, mueve tu imagen '{image_filename}' dentro de la carpeta '{folder_name}' y ejecuta el script de nuevo.")
        return

    img_path = os.path.join(folder_name, image_filename)
    pdf_path = os.path.join(folder_name, output_pdf)

    # Verificar que la imagen esté ahí
    if not os.path.exists(img_path):
        print(f"❌ Error: No encuentro el archivo '{image_filename}' dentro de '{folder_name}'.")
        return

    try:
        # 1. Leer dimensiones de la imagen para hacer el PDF del tamaño exacto (Pixel Perfect)
        img = ImageReader(img_path)
        width, height = img.getSize()

        # 2. Inicializar el Canvas
        c = canvas.Canvas(pdf_path, pagesize=(width, height))
        c.setTitle("Boda Naty & Carlos")

        # 3. Dibujar la imagen de fondo
        c.drawImage(img_path, 0, 0, width=width, height=height)

        # 4. Crear el Área Interactiva (Link)
        # Basado en tu imagen, el texto "carlosynaty.mx" está casi al final.
        # Vamos a definir un rectángulo interactivo en el 15% inferior de la imagen.
        
        link_height = height * 0.12  # El 12% inferior de la altura
        link_y_pos = height * 0.05   # Un margen del 5% desde abajo
        
        # Coordenadas: (x1, y1, x2, y2)
        # x1=0, y1=link_y_pos, x2=width, y2=link_y_pos + link_height
        rect_link = (0, link_y_pos, width, link_y_pos + link_height)

        # Añadir el enlace a la URL
        c.linkURL(url_boda, rect_link, relative=1)

        # --- OPCIONAL: DEBUGGING ---
        # Descomenta las siguientes 2 líneas si quieres ver un recuadro verde donde está el link
        # c.setStrokeColor(Color(*hex_to_rgb_tuple(COLOR_FOREST))) # Usando tu verde forest
        # c.rect(0, link_y_pos, width, link_height, stroke=1, fill=0)

        c.save()
        print(f"✅ ¡Listo! PDF generado en: {pdf_path}")
        print(f"🎨 Colores de marca configurados: Gold {COLOR_GOLD}, Forest {COLOR_FOREST}")

    except Exception as e:
        print(f"❌ Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    generar_pdf_whatsapp()
