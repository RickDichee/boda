#!/bin/bash

# Puerto por defecto
PORT=8000

echo "========================================"
echo "🚀 Iniciando servidor para la Boda"
echo "📍 URL: http://localhost:$PORT"
echo "========================================"

python3 -m http.server $PORT