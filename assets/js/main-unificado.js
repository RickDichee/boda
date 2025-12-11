// ===== CONFIGURACIÓN =====
const CONFIG = {
    appName: 'Naty & Carlos Boda',
    weddingDate: '28 de Febrero 2026',
    location: 'Los Cedros Quinta',
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
        { time: '6:00', period: 'PM', title: 'Recepción', description: 'Te recibiremos con cocteles y música.' },
        { time: '6:30', period: 'PM', title: 'Ceremonia Civil', description: 'Acompáñanos a decir "Sí, acepto".' },
        { time: '7:30', period: 'PM', title: 'Cena', description: 'Una deliciosa cena para celebrar juntos.' },
        { time: '8:30', period: 'PM', title: 'Fiesta', description: '¡Bailaremos hasta el amanecer!' }
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

// ===== GALERÍA DE FOTOS =====
function initGallery() {
    const photoGrid = document.getElementById('photoGrid');
    if (!photoGrid) {
        console.warn('Elemento photoGrid no encontrado');
        return;
    }
    
    photoGrid.innerHTML = '';
    
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
        
        // Animación de aparición escalonada
        photoCard.style.opacity = '0';
        photoCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            photoCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            photoCard.style.opacity = '1';
            photoCard.style.transform = 'translateY(0)';
        }, index * 150);
        
        photoGrid.appendChild(photoCard);
    });
}

// ===== TIMELINE =====
function initTimeline() {
    const timelineContainer = document.getElementById('timelineContainer');
    if (!timelineContainer) return;
    
    timelineContainer.innerHTML = '';
    
    APP_DATA.timeline.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
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

// ===== LÓGICA DEL FORMULARIO =====
function initFormLogic() {
    const form = document.getElementById('rsvpForm');
    if (!form) {
        console.warn('Formulario RSVP no encontrado');
        return;
    }
    
    form.addEventListener('submit', handleFormSubmit);
    console.log('Formulario configurado correctamente');
}

// ===== MANEJADOR DEL FORMULARIO =====
function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Formulario enviado, previniendo comportamiento por defecto');
    
    const submitBtn = document.getElementById('submitBtn');
    const formWrapper = document.getElementById('formWrapper');
    const qrDisplay = document.getElementById('qrDisplay');
    
    if (!validateForm()) {
        alert('Por favor completa todos los campos requeridos');
        return false;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    const formData = getFormData();
    console.log('Datos del formulario:', formData);
    
    // Simular envío (1.5 segundos)
    setTimeout(() => {
        // Generar QR
        generateQRCode(formData.confirmationId, formData);
        
        // Ocultar formulario, mostrar QR
        formWrapper.style.display = 'none';
        qrDisplay.classList.add('show');
        
        // Desplazar suavemente al QR
        qrDisplay.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Reiniciar formulario
        e.target.reset();
        
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Confirmación';
        
        console.log('QR generado exitosamente');
    }, 1500);
    
    return false;
}

// ===== VALIDACIÓN DEL FORMULARIO =====
function validateForm() {
    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const asistencia = document.querySelector('input[name="asistencia"]:checked');
    
    if (!nombre.value.trim()) {
        alert('Por favor ingresa tu nombre completo');
        return false;
    }
    
    if (!telefono.value.trim()) {
        alert('Por favor ingresa tu teléfono');
        return false;
    }
    
    if (!asistencia) {
        alert('Por favor selecciona si asistirás o no');
        return false;
    }
    
    return true;
}

// ===== OBTENER DATOS DEL FORMULARIO =====
function getFormData() {
    const asistenciaRadio = document.querySelector('input[name="asistencia"]:checked');
    
    return {
        nombre: document.getElementById('nombre').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim() || 'No proporcionado',
        asistencia: asistenciaRadio ? asistenciaRadio.value : 'no',
        numPersonas: '1', // Siempre 1 persona
        nombreAcompanante: 'N/A', // No aplica
        mensaje: document.getElementById('mensaje').value.trim() || 'Sin mensaje',
        confirmationId: generateConfirmationId()
    };
}

// ===== GENERAR ID DE CONFIRMACIÓN =====
function generateConfirmationId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `NYC-${timestamp}-${randomStr}`.toUpperCase();
}

// ===== GENERAR CÓDIGO QR =====
function generateQRCode(confirmationId, userData) {
    const qrcodeDiv = document.getElementById('qrcode');
    if (!qrcodeDiv) {
        console.error('Elemento qrcode no encontrado');
        return;
    }
    
    qrcodeDiv.innerHTML = '';
    
    // Crear un objeto con datos mínimos y convertirlo a JSON sin espacios
    const qrObject = {
        id: confirmationId,
        n: userData.nombre.substring(0, 30), // limitar longitud
        t: userData.telefono.substring(0, 15)
    };
    
    const qrData = JSON.stringify(qrObject);
    
    try {
        new QRCode(qrcodeDiv, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#1a1a1a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
        });
        console.log('QR generado para ID:', confirmationId);
    } catch (error) {
        console.error('Error generando QR:', error);
        // Intentar con un texto aún más corto: solo el ID
        qrcodeDiv.innerHTML = '';
        try {
            new QRCode(qrcodeDiv, {
                text: confirmationId,
                width: 200,
                height: 200,
                colorDark: "#1a1a1a",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            });
            console.log('QR generado solo con ID');
        } catch (error2) {
            console.error('Error generando QR con solo ID:', error2);
            qrcodeDiv.innerHTML = '<p style="color: red;">Error generando QR. Por favor recarga la página.</p>';
        }
    }
}

// ===== DESCARGAR QR =====
window.downloadQR = function() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        alert('No hay código QR para descargar');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.download = `qr-boda-naty-carlos-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        console.log('QR descargado exitosamente');
    } catch (error) {
        console.error('Error descargando QR:', error);
        alert('Error al descargar el QR. Por favor intenta tomar una captura de pantalla.');
    }
};

// ===== ANIMACIONES AL SCROLL =====
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
    
    console.log('Animaciones de scroll configuradas');
}

// ===== INICIALIZACIÓN FINAL =====
console.log('JavaScript de la boda cargado correctamente');
