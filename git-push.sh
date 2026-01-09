#!/bin/bash

echo "📦 Preparando cambios..."
git add .

echo "📝 Realizando commit..."
git commit -m "Fix: Cambio texto Ceremonia a Recepción y corrección nombre salón en og:image"

echo "🚀 Subiendo a GitHub..."
git push

echo "✅ ¡Todo listo! Los cambios están en línea."