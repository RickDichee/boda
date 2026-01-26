#!/bin/bash
echo "=== VERIFICACIÓN COMPLETA DEL SITIO ==="
echo ""

# 1. Servidor corriendo
echo "1. Servidor web:"
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "   ✅ Servidor corriendo en http://localhost:8000"
    
    # Ver título
    title=$(curl -s http://localhost:8000 | grep -o "<title>.*</title>" | sed 's/<[^>]*>//g')
    echo "   📄 Título: '$title'"
else
    echo "   ❌ Servidor NO está corriendo"
    echo "   Ejecuta: python3 -m http.server 8000"
fi

echo ""
echo "2. Archivos críticos (esperados en el repositorio):"
files=("index.html" "assets/js/main-corregido.js" "assets/js/firebase.js" "assets/js/qr-generator.js" "assets/css/main.css"
       "assets/images/fotos/foto1.jpg" "assets/images/fotos/foto2.jpg" "assets/images/fotos/foto3.jpg")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "   ✅ $file ($size)"
    else
        echo "   ❌ FALTA: $file"
    fi
done

echo ""
echo "3. Carga de JavaScript en index.html:"
if grep -q "<script type=\"module\" src=\"assets/js/main-corregido.js\"></script>" index.html; then
    echo "   ✅ main-corregido.js cargado como módulo en HTML"
else
    echo "   ❌ main-corregido.js NO cargado correctamente como módulo"
    echo "   Asegúrate de que index.html contenga: <script type=\"module\" src=\"assets/js/main-corregido.js\"></script>"
fi

echo ""
echo "4. Efectos visuales:"
if [ $(grep -c "watercolor-divider" index.html) -ge 3 ]; then
    echo "   ✅ Efectos de acuarela presentes"
else
    echo "   ⚠️  Pocos efectos de acuarela"
fi

echo ""
echo "5. Link Liverpool:"
if grep -q "liverpool.com.mx" index.html; then
    echo "   ✅ Link de Liverpool configurado"
else
    echo "   ❌ Falta link de Liverpool"
fi

echo ""
echo "=== INSTRUCCIONES ==="
echo "1. Abre tu navegador en: http://localhost:8000"
echo "2. Presiona F12 para abrir las herramientas de desarrollador"
echo "3. Ve a la pestaña 'Console' para ver errores"
echo "4. Si ves errores, cópialos y me los compartes"
echo ""
echo "Para detener el servidor: pkill -f \"http.server 8000\""
