import alasql from 'alasql';
import readline from 'readline';

// Inicializar y Popular
alasql('CREATE TABLE clientes (id INT, nombre STRING, ciudad STRING)');
alasql("INSERT INTO clientes VALUES (1, 'Juan Pérez', 'Medellín'), (2, 'Ana Gómez', 'Bogotá'), (3, 'Carlos Ruiz', 'Cali'), (4, 'María López', 'Medellín')");

alasql('CREATE TABLE ventas (id INT, cliente_id INT, fecha STRING, total NUMBER)');
alasql("INSERT INTO ventas VALUES (1, 1, '2026-04-01', 5000), (2, 2, '2026-04-02', 2000), (3, 1, '2026-04-03', 4500), (4, 3, '2026-04-04', 1500), (5, 4, '2026-04-05', 8000)");

console.log('\n--- TERMINAL SQL ---');
console.log('Tablas cargadas: clientes (id, nombre, ciudad), ventas (id, cliente_id, fecha, total)');
console.log('Puedes probar comandos como:\n SELECT * FROM clientes WHERE ciudad = "Medellín"');
console.log('Escribe "exit" para cerrar.\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'SQL> '
});

rl.prompt();

rl.on('line', (line) => {
    const query = line.trim();
    if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
        process.exit(0);
    }

    if (query) {
        try {
            // Some queries like CREATE VIEW return a single value, SELECT returns array of objects
            const result = alasql(query);
            if (Array.isArray(result)) {
                if (result.length > 0) {
                    console.table(result);
                } else {
                    console.log('0 filas retornadas.');
                }
            } else {
                console.log('Éxito:', result);
            }
        } catch (err) {
            console.error('Error:', err.message);
        }
    }
    rl.prompt();
}).on('close', () => {
    console.log('Adiós.');
    process.exit(0);
});
