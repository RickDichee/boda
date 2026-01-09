// ===== FIREBASE CONFIG =====
// Se inicializa en firebase-init.js
let getFirebaseDb = () => window.firebaseDb || null;
let getFirebaseCollection = () => window.firebaseCollection || null;
let getFirebaseAddDoc = () => window.firebaseAddDoc || null;

// ===== CONFIGURACIÓN =====
const CONFIG = {
    appName: 'Naty & Carlos Boda',
    weddingDate: '28 de Febrero 2026',
    location: 'Quinta Los Cedros',
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
        { time: '18:00', period: 'Tarde', title: 'Llegada de invitados', description: 'Recepción y bienvenida.' },
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
function saveToFirebase(formData) {
    // Retorna una promesa que se resuelve inmediatamente
    return new Promise((resolve) => {
        const db = getFirebaseDb();
        const collection = getFirebaseCollection();
        const addDoc = getFirebaseAddDoc();
        
        console.log('saveToFirebase called with:', formData);
        console.log('Firebase disponible?', !!db, !!collection, !!addDoc);
        
        if (!db || !collection || !addDoc) {
            console.warn('Firebase no disponible', { db: !!db, collection: !!collection, addDoc: !!addDoc });
            resolve();
            return;
        }
        
        const confirmationData = {
            nombre: formData.nombre,
            telefono: formData.telefono,
            email: formData.email,
            asistencia: formData.asistencia,
            mensaje: formData.mensaje,
            confirmationId: formData.confirmationId,
            numPersonas: formData.numPersonas,
            createdAt: new Date().toISOString()
        };
        
        console.log('Intentando guardar:', confirmationData);
        
        addDoc(collection(db, 'confirmations'), confirmationData)
            .then(docRef => {
                console.log('✅ Guardado en Firebase exitosamente:', docRef.id);
                resolve(docRef.id);
            })
            .catch(error => {
                console.error('❌ Error Firebase:', error);
                resolve(); // Resolver igual aunque falle
            });
    });
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
    
    // Generar QR inmediatamente
    generateQRCode(formData.confirmationId, formData);
    
    formWrapper.style.display = 'none';
    qrDisplay.classList.add('show');
    qrDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    e.target.reset();
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Confirmación';
    
    // Guardar en Firebase en background (no crítico)
    saveToFirebase(formData).catch(err => {
        console.warn('Firebase error (no crítico):', err);
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
    
    // Solo el ID de confirmación - el QR más simple posible
    const qrData = confirmationId;
    
    try {
        new QRCode(qrcodeDiv, {
            text: qrData,
            width: 280,
            height: 280,
            colorDark: "#1a1a1a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L  // L es el nivel de corrección más bajo
        });
        console.log('QR generado exitosamente');
    } catch (error) {
        console.error('Error generando QR:', error);
        qrcodeDiv.innerHTML = '<p>Error generando QR: ' + error.message + '</p>';
    }
}

window.downloadQR = function() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `qr-boda-naty-carlos-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
};
