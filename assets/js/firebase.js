// ===== FIREBASE CONFIGURATION =====

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuración de Firebase (usa la misma que ya tienes)
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
    // Puedes agregar un fallback aquí
}

// ===== FUNCIONES DE FIREBASE =====

/**
 * Guarda una confirmación en Firestore
 * @param {Object} data - Datos de la confirmación
 * @returns {Promise<string>} - ID del documento creado
 */
export async function saveConfirmation(data) {
    if (!db) {
        throw new Error('Firebase no está inicializado');
    }
    
    try {
        // Añadir timestamp del servidor
        const confirmationData = {
            ...data,
            timestamp: serverTimestamp(),
            createdAt: new Date().toISOString()
        };
        
        // Guardar en la colección 'confirmations'
        const docRef = await addDoc(collection(db, 'confirmations'), confirmationData);
        console.log('Confirmación guardada con ID:', docRef.id);
        
        return docRef.id;
        
    } catch (error) {
        console.error('Error guardando confirmación:', error);
        throw error;
    }
}

/**
 * Guarda datos en localStorage como fallback
 * @param {Object} data - Datos a guardar
 */
export function saveToLocalStorage(data) {
    try {
        // Obtener confirmaciones existentes
        const existing = JSON.parse(localStorage.getItem('pendingConfirmations') || '[]');
        
        // Añadir nueva confirmación
        existing.push({
            ...data,
            localSaveTime: new Date().toISOString(),
            synced: false
        });
        
        // Guardar en localStorage
        localStorage.setItem('pendingConfirmations', JSON.stringify(existing));
        console.log('Datos guardados en localStorage');
        
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
    }
}

/**
 * Intenta sincronizar confirmaciones pendientes
 */
export async function syncPendingConfirmations() {
    if (!navigator.onLine || !db) {
        return;
    }
    
    try {
        const pending = JSON.parse(localStorage.getItem('pendingConfirmations') || '[]');
        
        if (pending.length === 0) {
            return;
        }
        
        console.log(`Sincronizando ${pending.length} confirmaciones pendientes...`);
        
        const synced = [];
        
        for (const confirmation of pending) {
            if (!confirmation.synced) {
                try {
                    await saveConfirmation(confirmation);
                    confirmation.synced = true;
                    confirmation.syncedAt = new Date().toISOString();
                } catch (error) {
                    console.warn('Error sincronizando confirmación:', error);
                }
            }
            synced.push(confirmation);
        }
        
        // Actualizar localStorage
        localStorage.setItem('pendingConfirmations', JSON.stringify(synced.filter(c => !c.synced)));
        console.log('Sincronización completada');
        
    } catch (error) {
        console.error('Error en sincronización:', error);
    }
}

// Exportar instancias de Firebase
export { app, db };
