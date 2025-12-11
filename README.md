# Sitio Web de Boda - Naty & Carlos

Sitio web elegante y responsive para la boda de Naty y Carlos.

## 🎯 Características

- ✅ Diseño moderno y elegante
- ✅ Totalmente responsive
- ✅ Formulario de confirmación con Firebase
- ✅ Generador de códigos QR
- ✅ Galería de fotos
- ✅ Timeline interactivo
- ✅ Offline support
- ✅ Animaciones suaves

## 🏗️ Estructura del Proyecto

boda/
├── index.html # Página principal
├── assets/ # Recursos estáticos
│ ├── css/ # Hojas de estilo
│ ├── js/ # Scripts JavaScript
│ ├── images/ # Imágenes y fotos
│ └── fonts/ # Fuentes locales
├── pages/ # Páginas adicionales
├── components/ # Componentes reutilizables
└── data/ # Datos y configuración

text

## 🚀 Instalación y Uso

### Requisitos
- Node.js (opcional, para desarrollo)
- Cuenta de Firebase
### Pasos para desarrollo

1. **Clonar el proyecto:**

git clone <tu-repositorio>
cd boda
2. **Configurar Firebase:**

Crea un proyecto en Firebase Console

Obtén la configuración y actualiza assets/js/firebase.js

Habilita Firestore Database

3. **Servir localmente:**

bash
# Con Python (simple)
python3 -m http.server 8000

# Con Node.js (opcional)
npx serve .

4. **Acceder:**

Abre http://localhost:8000 en tu navegador.
