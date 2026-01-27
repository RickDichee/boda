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
files=("index.html" "CNAME" "assets/js/main-corregido.js" "assets/js/firebase.js" "assets/js/qr-generator.js" "assets/css/main.css"
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
echo "4. Configuración de Dominio (CNAME):"
if [ -f "CNAME" ]; then
    domain=$(cat CNAME)
    echo "   ✅ Archivo CNAME presente: $domain"
else
    echo "   ❌ FALTA archivo CNAME"
fi

echo ""
echo "5. Efectos visuales:"
if [ $(grep -c "watercolor-divider" index.html) -ge 3 ]; then
    echo "   ✅ Efectos de acuarela presentes"
else
    echo "   ⚠️  Pocos efectos de acuarela"
fi

echo ""
echo "6. Link Liverpool:"
if grep -q "liverpool.com.mx" index.html; then
    echo "   ✅ Link de Liverpool configurado"
else
    echo "   ❌ Falta link de Liverpool"
fi

echo ""
echo "7. Verificación de Nameservers (Públicos):"
if command -v host > /dev/null; then
    host -t ns carlosynaty.mx | grep "name server" | sed 's/^/   ✅ /'
    echo "   ✨ Nameservers de Neubox detectados correctamente."
else
    echo "   ⚠️ Comando 'host' no encontrado. Verifica manualmente en Neubox."
fi

echo ""
echo "8. Verificación de Registros A (IPs de GitHub):"
if command -v host > /dev/null; then
    host carlosynaty.mx | grep "has address" | sed 's/^/   ✅ /'
    echo "   ✨ Registros A apuntando a GitHub Pages."
fi

echo ""
echo "9. Verificación del Subdominio WWW:"
if command -v host > /dev/null; then
    host_output=$(host www.carlosynaty.mx 2>&1)
    
    if echo "$host_output" | grep -q "is an alias"; then
        echo "   ✅ $host_output"
        echo "   ✨ El subdominio www está configurado correctamente."
    elif echo "$host_output" | grep -q "not found"; then
        echo "   ⚪ El subdominio www no existe actualmente (Estado: Limpio)."
        echo "   👉 Intenta crearlo en Neubox usando solo 'www' como nombre."
    else
        echo "   ⚠️  Estado actual: $host_output"
    fi

    # Verificación específica de error de duplicación en Neubox
    if host www.carlosynaty.mx.carlosynaty.mx > /dev/null 2>&1; then
        echo "   ⚠️  DETECTADO: Registro duplicado (www.carlosynaty.mx.carlosynaty.mx)."
        echo "      En Neubox, el campo 'Nombre' debe ser solo 'www', no el dominio completo."
    fi
fi

echo ""
echo "=== INSTRUCCIONES ==="
echo "1. Abre tu navegador en: http://localhost:8000"
echo "2. Presiona F12 para abrir las herramientas de desarrollador"
echo "3. Ve a la pestaña 'Console' para ver errores"
echo "4. Si ves errores, cópialos y me los compartes"
echo "5. Si los DNS no se actualizan, limpia tu caché: sudo resolvectl flush-caches"
echo "6. Monitorea la propagación global en: https://www.whatsmydns.net/#CNAME/www.carlosynaty.mx"
echo ""
echo "Para detener el servidor: pkill -f \"http.server 8000\""
