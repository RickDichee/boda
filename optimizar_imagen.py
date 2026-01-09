from PIL import Image
import os

def optimizar_imagen():
    # Rutas
    input_path = "assets/images/invitacion-whatsapp.png"
    output_path = "assets/images/invitacion-whatsapp-opt.jpg"
    
    print(f"🔄 Procesando: {input_path}")

    if not os.path.exists(input_path):
        print(f"❌ Error: No encuentro el archivo '{input_path}'")
        print("   Asegúrate de haber subido la imagen PNG a esa carpeta.")
        return

    try:
        with Image.open(input_path) as img:
            # 1. Convertir a RGB (por si el PNG tiene transparencia)
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # 2. Redimensionar (Thumbnail mantiene la relación de aspecto)
            # 1200x630 es el estándar recomendado para Facebook/WhatsApp
            img.thumbnail((1200, 630), Image.Resampling.LANCZOS)
            
            # 3. Guardar como JPG optimizado (Calidad 80 es ideal para web)
            img.save(output_path, 'JPEG', quality=80, optimize=True)
            
            # Verificar tamaño final
            size_kb = os.path.getsize(output_path) / 1024
            print(f"✅ ¡Listo! Imagen guardada en: {output_path}")
            print(f"📊 Tamaño final: {size_kb:.2f} KB (Perfecto para WhatsApp)")
            
    except Exception as e:
        print(f"❌ Error procesando imagen: {e}")

if __name__ == "__main__":
    optimizar_imagen()