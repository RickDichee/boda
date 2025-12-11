// ===== QR CODE GENERATOR =====

// Esta función se llama desde main.js cuando se necesita generar un QR

let qrCodeInstance = null;

/**
 * Genera un código QR con la información de confirmación
 * @param {string} confirmationId - ID único de confirmación
 * @param {Object} userData - Datos del usuario
 */
export function generateQRCode(confirmationId, userData = {}) {
    const qrcodeDiv = document.getElementById('qrcode');
    
    if (!qrcodeDiv) {
        console.error('Elemento qrcode no encontrado');
        return;
    }
    
    // Limpiar QR anterior
    qrcodeDiv.innerHTML = '';
    
    // Crear datos para el QR
    const qrData = createQRData(confirmationId, userData);
    
    // Crear nueva instancia de QR
    qrCodeInstance = new QRCode(qrcodeDiv, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#1a1a1a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    console.log('QR generado para ID:', confirmationId);
}

/**
 * Crea el texto para el código QR
 * @param {string} confirmationId - ID de confirmación
 * @param {Object} userData - Datos del usuario
 * @returns {string} - Texto formateado para QR
 */
function createQRData(confirmationId, userData) {
    return `BODA NATY & CARLOS
--------------------------------
ID de Confirmación: ${confirmationId}
Nombre: ${userData.nombre || 'Invitado'}
Fecha: 28 de Febrero 2026
Lugar: Los Cedros Quinta
--------------------------------
Este código QR es tu entrada.
Preséntalo a la llegada.`;
}

/**
 * Descarga el código QR como imagen PNG
 */
export function downloadQR() {
    if (!qrCodeInstance) {
        console.warn('No hay código QR para descargar');
        return;
    }
    
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        console.warn('Canvas no encontrado');
        return;
    }
    
    try {
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.download = `qr-boda-naty-carlos-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        console.log('QR descargado exitosamente');
        
    } catch (error) {
        console.error('Error descargando QR:', error);
        alert('Error al descargar el QR. Por favor intenta tomar una captura de pantalla.');
    }
}

/**
 * Muestra el contenedor del QR
 */
export function showQRDisplay() {
    const qrDisplay = document.getElementById('qrDisplay');
    if (qrDisplay) {
        qrDisplay.classList.add('show');
    }
}

/**
 * Oculta el contenedor del QR
 */
export function hideQRDisplay() {
    const qrDisplay = document.getElementById('qrDisplay');
    if (qrDisplay) {
        qrDisplay.classList.remove('show');
    }
}
