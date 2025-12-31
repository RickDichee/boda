// ===== FIREBASE IMPORT =====
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "boda-nyc.firebaseapp.com",
    projectId: "boda-nyc",
    storageBucket: "boda-nyc.firebasestorage.app",
    messagingSenderId: "470601485280",
    appId: "1:470601485280:web:21319eb00ca630800ff985"
};

// Inicializar Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase inicializado correctamente');
} catch (error) {
    console.error('Error inicializando Firebase:', error);
}

// ===== CONFIGURACIÓN =====
const CONFIG = {
    appName: 'Naty & Carlos Boda',
    weddingDate: '28 de Febrero 2026',
    location: 'Salón Zimpanio',
    maxGuests: 1
};

// ===== DATOS =====
const APP_DATA = {
    photos: [
        {
            src: 'assets/images/fotos/foto1.jpg',
            alt: 'Naty y Carlos',
            caption: 'Nuestro amor',
            fallback: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
        }
    ],
    
    timeline: [
        { time: '18:00', period: 'Tarde', title: 'Llegada de invitados', description: 'Recepción y bienvenida con cocteles y música.' },
        { time: '18:30', period: 'Tarde', title: 'Ceremonia Civil', description: 'Acompáñanos a decir "Sí, acepto".' },
        { time: '19:30', period: 'Noche', title: 'Cena', description: 'Una deliciosa cena para celebrar juntos.' },
        { time: '22:00', period: 'Noche', title: 'Fiesta', description: '¡Bailaremos hasta el amanecer!' }
    ]
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log(CONFIG.appName + ' - Inicializando aplicación');
    
    initGallery();
    initTimeline();
    initFormLogic();
    initScrollAnimations();
});

// ===== FUNCIONES =====
function initGallery() {
    const photoGrid = document.getElementById('photoGrid');
    if (!photoGrid) return;
    
    photoGrid.innerHTML = '';
    
    APP_DATA.photos.forEach((photo, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt;
        img.loading = 'lazy';
        img.onerror = function() {
            this.src = photo.fallback;
            console.warn(`Foto ${index + 1} falló, usando fallback`);
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        overlay.innerHTML = `<p>${photo.caption}</p>`;
        
        photoCard.appendChild(img);
        photoCard.appendChild(overlay);
        
        // Añadir animación de entrada
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

function initTimeline() {
    const timelineContainer = document.getElementById('timelineContainer');
    if (!timelineContainer) return;
    
    timelineContainer.innerHTML = '';
    
    APP_DATA.timeline.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
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

function initFormLogic() {
    const form = document.getElementById('rsvpForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// ===== FIREBASE FUNCTIONS =====
async function saveToFirebase(formData) {
    if (!db) {
        console.warn('Firebase no está disponible, guardando localmente');
        return;
    }
    
    try {
        const confirmationData = {
            nombre: formData.nombre,
            telefono: formData.telefono,
            email: formData.email,
            asistencia: formData.asistencia,
            mensaje: formData.mensaje,
            confirmationId: formData.confirmationId,
            numPersonas: formData.numPersonas,
            timestamp: serverTimestamp(),
            createdAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, 'confirmations'), confirmationData);
        console.log('Confirmación guardada en Firebase:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error guardando en Firebase:', error);
        throw error;
    }
}



function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formWrapper = document.getElementById('formWrapper');
    const qrDisplay = document.getElementById('qrDisplay');
    
    if (!validateForm()) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    const formData = getFormData();
    
    // Guardar en Firebase
    saveToFirebase(formData).then(() => {
        generateQRCode(formData.confirmationId, formData);
        
        formWrapper.style.display = 'none';
        qrDisplay.classList.add('show');
        qrDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        e.target.reset();
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Confirmación';
    }).catch((error) => {
        console.error('Error guardando confirmación:', error);
        alert('Hubo un error al guardar tu confirmación. Por favor intenta de nuevo.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Confirmación';
    });
}

function validateForm() {
    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const asistencia = document.querySelector('input[name="asistencia"]:checked');
    
    return nombre.value.trim() && telefono.value.trim() && asistencia;
}

function getFormData() {
    const asistenciaRadio = document.querySelector('input[name="asistencia"]:checked');
    
    return {
        nombre: document.getElementById('nombre').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim() || 'No proporcionado',
        asistencia: asistenciaRadio ? asistenciaRadio.value : 'no',
        numPersonas: '1',
        nombreAcompanante: 'N/A',
        mensaje: document.getElementById('mensaje').value.trim() || 'Sin mensaje',
        confirmationId: generateConfirmationId()
    };
}

function generateConfirmationId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `NYC-${timestamp}-${randomStr}`.toUpperCase();
}

function generateQRCode(confirmationId, userData) {
    const qrcodeDiv = document.getElementById('qrcode');
    if (!qrcodeDiv) return;
    
    qrcodeDiv.innerHTML = '';
    
    const qrData = `BODA NATY & CARLOS
--------------------------------
ID de Confirmación: ${confirmationId}
Nombre: ${userData.nombre}
Fecha: 28 de Febrero 2026
Lugar: Los Cedros Quinta
--------------------------------
Este código QR es tu entrada.
Preséntalo a la llegada.`;
    
    new QRCode(qrcodeDiv, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#1a1a1a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

window.downloadQR = function() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `qr-boda-naty-carlos-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
};
