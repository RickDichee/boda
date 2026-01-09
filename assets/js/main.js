// ===== MAIN APPLICATION LOGIC =====

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuración de la aplicación
const CONFIG = {
    appName: 'Naty & Carlos Boda',
    weddingDate: '28 de Febrero 2026',
    location: 'Quinta Los Cedros',
    maxGuests: 2
};

// Datos iniciales

const APP_DATA = {
    photos: [
        {
            src: 'assets/images/fotos/foto1.jpg',
            alt: 'Naty y Carlos',
            caption: 'Nuestro amor',
            fallback: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
        },
        {
            src: 'assets/images/fotos/foto2.jpg',
            alt: 'Naty y Carlos',
            caption: 'Juntos para siempre',
            fallback: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'
        },
        {
            src: 'assets/images/fotos/foto3.jpg',
            alt: 'Naty y Carlos',
            caption: 'Felices',
            fallback: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80'
        }
    ],
    
    timeline: [
        { time: '6:00', period: 'PM', title: 'Llegada de invitados', description: 'Recepción y bienvenida.' },
        { time: '6:30', period: 'PM', title: 'Ceremonia Civil', description: 'Acompáñanos a decir "Sí, acepto".' },
        { time: '7:30', period: 'PM', title: 'Cena', description: 'Una deliciosa cena para celebrar juntos.' },
        { time: '8:30', period: 'PM', title: 'Fiesta', description: '¡Bailaremos hasta el amanecer!' }
    ]
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log(`${CONFIG.appName} - Inicializando aplicación`);
    
    // Inicializar componentes
    initGallery();
    initTimeline();
    initFormLogic();
    initScrollAnimations();
    initObservers();
    
    // Cargar datos iniciales
    loadInitialData();
});

// ===== FUNCIONES DE COMPONENTES =====

// Galería de fotos
function initGallery() {
    const photoGrid = document.getElementById('photoGrid');
    
    if (!photoGrid) {
        console.warn('Elemento photoGrid no encontrado');
        return;
    }
    
    // Limpiar contenido existente
    photoGrid.innerHTML = '';
    
    // Crear elementos de foto
    APP_DATA.photos.forEach((photo, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.innerHTML = `
            <img src="${photo.src}" 
                 alt="${photo.alt}" 
                 onerror="this.src='${photo.fallback}'"
                 loading="lazy">
            <div class="photo-overlay">
                <p>${photo.caption}</p>
            </div>
        `;
        
        // Añadir efecto de aparición
        photoCard.style.opacity = '0';
        photoCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            photoCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            photoCard.style.opacity = '1';
            photoCard.style.transform = 'translateY(0)';
        }, index * 100);
        
        photoGrid.appendChild(photoCard);
    });
}

// Timeline
function initTimeline() {
    const timelineContainer = document.getElementById('timelineContainer');
    
    if (!timelineContainer) return;
    
    timelineContainer.innerHTML = '';
    
    APP_DATA.timeline.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item fade-in';
        timelineItem.style.animationDelay = `${index * 0.2}s`;
        
        timelineItem.innerHTML = `
            <div>
                <div class="timeline-time">${item.time}</div>
                <div class="timeline-period">${item.period}</div>
            </div>
            <div class="timeline-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// Lógica del formulario (VERSIÓN 1 PERSONA)
function initFormLogic() {
    // Ya no necesitamos lógica para mostrar/ocultar campos de acompañante
    // Solo manejamos el envío del formulario
    
    const form = document.getElementById('rsvpForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // También podemos agregar aquí el mensaje de "pase único" directamente
    addUniquePassMessage();
}

// Función para agregar el mensaje de pase único
function addUniquePassMessage() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'unique-pass-message';
    messageDiv.innerHTML = `
        <div style="text-align: center; font-size: 14px; color: var(--grey); padding: 20px; border-top: 1px solid var(--light-grey); margin-top: 20px;">
            <p style="margin-bottom: 10px;"><strong>♥ Un detalle importante para nuestra celebración ♥</strong></p>
            <p style="font-style: italic; line-height: 1.5;">
                Para asegurar que todos nuestros seres queridos disfruten de este día especial con comodidad y seguridad, 
                <strong>cada invitación es personal e intransferible</strong>. 
                El código QR que generes será tu pase único para el evento. 
                Agradecemos de corazón que respetes esta intención.
            </p>
        </div>
    `;
    
    // Insertar antes del botón de enviar
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        form.insertBefore(messageDiv, submitBtn);
    }
}

// Animaciones al scroll
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    // Observar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Observadores adicionales
function initObservers() {
    // Observar cambios en la red
    window.addEventListener('online', () => {
        console.log('Conexión restablecida');
        showNotification('Conectado', 'success');
    });
    
    window.addEventListener('offline', () => {
        console.warn('Sin conexión a internet');
        showNotification('Sin conexión - Los datos se guardarán localmente', 'warning');
    });
}

// Cargar datos iniciales
async function loadInitialData() {
    try {
        // Aquí puedes cargar datos adicionales de una API si los necesitas
        console.log('Datos iniciales cargados');
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formWrapper = document.getElementById('formWrapper');
    const qrDisplay = document.getElementById('qrDisplay');
    
    if (!submitBtn || !formWrapper) return;
    
    // Deshabilitar botón
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // Obtener datos del formulario
    const formData = getFormData();
    
    try {
        // Enviar a Firebase
        await saveToFirebase(formData);
        
        // Mostrar QR
        formWrapper.style.display = 'none';
        qrDisplay.classList.add('show');
        qrDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reiniciar formulario
        e.target.reset();
        
        showNotification('¡Confirmación enviada exitosamente!', 'success');
        
    } catch (error) {
        console.error('Error al enviar:', error);
        showNotification('Error al enviar. Por favor intenta de nuevo.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Confirmación';
    }
}

// Validar formulario (VERSIÓN 1 PERSONA)
function validateForm() {
    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const asistencia = document.querySelector('input[name="asistencia"]:checked');
    
    // Solo validamos nombre, teléfono y si seleccionó asistencia
    // Ya no validamos numPersonas porque siempre será 1
    if (!nombre.value.trim() || !telefono.value.trim() || !asistencia) {
        return false;
    }
    
    return true;
}

// Obtener datos del formulario (VERSIÓN 1 PERSONA)
function getFormData() {
    const asistenciaRadio = document.querySelector('input[name="asistencia"]:checked');
    
    return {
        nombre: document.getElementById('nombre').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim() || 'No proporcionado',
        asistencia: asistenciaRadio ? asistenciaRadio.value : 'no',
        // SIEMPRE será 1 persona y sin acompañante
        numPersonas: '1',
        nombreAcompanante: 'N/A',
        mensaje: document.getElementById('mensaje').value.trim() || 'Sin mensaje',
        timestamp: new Date().toISOString(),
        confirmationId: generateConfirmationId(),
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
    };
}

// Generar ID de confirmación
function generateConfirmationId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `NYC-${timestamp}-${randomStr}`.toUpperCase();
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos básicos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        border-radius: 6px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Cormorant', serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Exportar funciones necesarias
export { 
    CONFIG, 
    APP_DATA, 
    generateConfirmationId,
    showNotification,
    validateForm
};
