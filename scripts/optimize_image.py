import os
import sys
try:
    from PIL import Image  # pip install Pillow
except ImportError:
    print("Error: Necesitas instalar Pillow. Ejecuta: pip install Pillow")
    sys.exit(1)

def optimize_for_whatsapp(input_path, output_path=None):
    """
    Automatiza los pasos 1 y 2:
    1. Redimensiona a 1200x630px (Estándar OG) manteniendo centro.
    2. Comprime para asegurar peso < 300KB.
    """
    if output_path is None:
        output_path = input_path

    if not os.path.exists(input_path):
        print(f"❌ Error: No se encontró el archivo: {input_path}")
        return

    try:
        img = Image.open(input_path)
        
        # --- PASO 2: DIMENSIONES (1200x630) ---
        target_width = 1200
        target_height = 630
        target_ratio = target_width / target_height
        
        # Convertir a RGB si es PNG/RGBA para poder guardar como JPG
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        # Calcular recorte para llenar 1200x630 sin deformar (Center Crop)
        img_ratio = img.width / img.height
        
        if img_ratio > target_ratio:
            # La imagen es más ancha, recortar lados
            new_width = int(img.height * target_ratio)
            offset = (img.width - new_width) // 2
            box = (offset, 0, offset + new_width, img.height)
        else:
            # La imagen es más alta, recortar arriba/abajo
            new_height = int(img.width / target_ratio)
            offset = (img.height - new_height) // 2
            box = (0, offset, img.width, offset + new_height)
            
        img = img.crop(box)
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        print(f"✅ Dimensiones ajustadas a {target_width}x{target_height}px")

        # --- PASO 1: PESO (< 300KB) ---
        # Usamos 290KB como límite seguro
        max_size_bytes = 290 * 1024 
        quality = 95
        
        while quality > 10:
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            file_size = os.path.getsize(output_path)
            
            if file_size < max_size_bytes:
                print(f"✅ Peso optimizado: {file_size/1024:.2f} KB (Calidad: {quality})")
                break
            
            quality -= 5
            
        if quality <= 10:
            print("⚠️ Advertencia: La imagen es muy compleja, se redujo mucho la calidad.")

        print(f"🎉 ¡Listo! Imagen guardada y optimizada en: {output_path}")

    except Exception as e:
        print(f"❌ Error procesando la imagen: {e}")

if __name__ == "__main__":
    # Ruta relativa basada en la estructura de tu proyecto
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    image_path = os.path.join(base_dir, 'assets', 'images', 'invitacion-whatsapp.jpg')
    
    print(f"Buscando imagen en: {image_path}")
    optimize_for_whatsapp(image_path)