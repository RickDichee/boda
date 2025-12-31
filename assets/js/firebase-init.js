// ===== FIREBASE INITIALIZATION =====
// Este archivo debe cargarse ANTES de main-corregido.js

let window_db = null;
let window_collection = null;
let window_addDoc = null;

async function initFirebase() {
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const firebaseConfig = {
            apiKey: "***REMOVED***",
            authDomain: "boda-nyc.firebaseapp.com",
            projectId: "boda-nyc",
            storageBucket: "boda-nyc.firebasestorage.app",
            messagingSenderId: "470601485280",
            appId: "1:470601485280:web:21319eb00ca630800ff985"
        };

        const app = initializeApp(firebaseConfig);
        window.firebaseDb = getFirestore(app);
        window.firebaseCollection = collection;
        window.firebaseAddDoc = addDoc;
        
        console.log('Firebase inicializado correctamente');
    } catch (error) {
        console.warn('Error inicializando Firebase:', error);
    }
}

// Inicializar Firebase al cargar
initFirebase();
