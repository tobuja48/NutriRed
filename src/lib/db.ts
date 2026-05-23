import alasql from 'alasql';

// Nombre de la base de datos en LocalStorage
const DB_NAME = 'nutrired_db';

/**
 * Inicializa la base de datos simulada en LocalStorage si no existe
 */
export function initDB() {
    // Intentar cargar o crear la base de datos en localStorage
    alasql(`CREATE localStorage DATABASE IF NOT EXISTS ${DB_NAME}`);
    alasql(`ATTACH localStorage DATABASE ${DB_NAME}`);
    alasql(`USE ${DB_NAME}`);

    // Crear la tabla de usuarios si no existe
    const tableExists = alasql(`SHOW TABLES LIKE 'usuarios'`).length > 0;
    
    if (!tableExists) {
        alasql(`
            CREATE TABLE usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre STRING,
                email STRING UNIQUE,
                password STRING,
                rol STRING -- 'banco' o 'cliente'
            )
        `);

        // Insertar usuarios por defecto
        alasql(`
            INSERT INTO usuarios (nombre, email, password, rol) VALUES
            ('Administrador Banco', 'admin@nutrired.com', '123', 'banco'),
            ('Juan Pérez (Cliente)', 'cliente@nutrired.com', '123', 'cliente')
        `);
        
        console.log("Base de datos inicializada con usuarios por defecto.");
    }
}

// Ejecutar inicialización al cargar
try {
    initDB();
} catch (e) {
    console.warn("Error inicializando db:", e);
}

/**
 * Busca un usuario por email en la base de datos local
 */
export function getUserByEmail(email: string) {
    try {
        const users = alasql(`SELECT * FROM usuarios WHERE email = ?`, [email]);
        return users.length > 0 ? users[0] : null;
    } catch (e) {
        console.error("Error al buscar usuario:", e);
        return null;
    }
}

/**
 * Registra un nuevo usuario en la base de datos local.
 * Retorna un objeto con success y message.
 */
export function registerUser(nombre: string, email: string, password: string, rol: 'banco' | 'cliente') {
    try {
        // Verificar si ya existe
        const existing = getUserByEmail(email);
        if (existing) {
            return { success: false, message: 'Ya existe un usuario con este correo electrónico.' };
        }

        alasql(`INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)`, [nombre, email, password, rol]);
        return { success: true };
    } catch (e: any) {
        console.error("Error al registrar usuario:", e);
        return { success: false, message: 'Error inesperado al registrar el usuario.' };
    }
}

