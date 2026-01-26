#!/bin/bash
echo "=== VERIFICACIÓN FINAL DEL SITIO ==="
echo ""

# Verificar archivos críticos (esperados en el repositorio):
echo "1. Archivos críticos (esperados en el repositorio):"
files=("index.html" "assets/js/main-corregido.js" "assets/js/firebase.js" "assets/js/qr-generator.js" "assets/css/main.css"
       "assets/images/fotos/foto1.jpg" "assets/images/fotos/foto2.jpg" "assets/images/fotos/foto3.jpg")

all_ok=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" 2>/dev/null | cut -f1 || echo "?")
        echo "   ✅ $file ($size)"
    else
        echo "   ❌ FALTA: $file"
        all_ok=false
    fi
done

echo ""
echo "2. Verificaciones técnicas:"

# Verificar que index.html tenga todo
echo "   • Formulario presente:" $(grep -c "rsvpForm" index.html) "ocurrencias"
echo "   • Sección ubicación:" $(grep -c "location-container" index.html) "ocurrencias"
echo "   • Efectos acuarela:" $(grep -c "watercolor-divider" index.html) "divididores"
echo "   • Link Liverpool:" $(grep -c "liverpool.com.mx" index.html) "enlaces"

echo ""
echo "3. Iniciando servidor de prueba..."
pkill -f "http.server" 2>/dev/null || true

# Iniciar servidor en puerto 7777
python3 -m http.server 7777 &
SERVER_PID=$!
sleep 3

echo ""
echo "=== INSTRUCCIONES ==="
echo "✅ Servidor iniciado: http://localhost:7777 (PID: $SERVER_PID)"
echo ""
echo "🔍 POR FAVOR VERIFICA EN TU NAVEGADOR:"
echo "1. Hero Section: ¿Se ve el título y fecha correctamente?"
echo "2. Fotos: ¿Aparecen 3 fotos con animaciones al pasar el mouse?"
echo "3. Ubicación: ¿Aparece la dirección y el link a Google Maps?"
echo "4. Liverpool: ¿Hay un botón rosa para la mesa de regalos?"
echo "5. Formulario:"
echo "   • ¿Tiene el mensaje de 'pase único'?"
echo "   • ¿Al enviar, aparece el QR SIN recargar la página?"
echo "   • ¿El QR tiene botón de descarga?"
echo ""
echo "📋 Si algo falla:"
echo "   - Presiona F12 en el navegador"
echo "   - Ve a 'Console' y copia errores en rojo"
echo "   - Toma screenshot de lo que ves"
echo ""
echo "🛑 Para detener el servidor: kill $SERVER_PID"
echo "📤 Para subir a GitHub: git add . && git commit -m 'Versión final' && git push"
