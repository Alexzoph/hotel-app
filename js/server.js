const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost', // Cambia si tu MySQL está en otro servidor
    user: 'tu_usuario', // Reemplaza con tu usuario de MySQL
    password: 'tu_contraseña', // Reemplaza con tu contraseña
    database: 'nombre_base_datos' // Reemplaza con el nombre de tu base de datos
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Endpoint para obtener habitaciones disponibles
app.get('/api/habitaciones', (req, res) => {
    const { checkin, checkout } = req.query;

    // Validar fechas
    if (!checkin || !checkout) {
        return res.status(400).json({ error: 'Se requieren fechas de entrada y salida' });
    }

    // Consulta SQL para encontrar habitaciones disponibles
    const query = `
        SELECT h.*
        FROM Habitaciones h
        WHERE h.estado = 'Disponible'
        AND h.id_habitacion NOT IN (
            SELECT r.id_habitacion
            FROM Reservas r
            WHERE (r.fecha_entrada <= ? AND r.fecha_salida >= ?)
        )
    `;

    db.query(query, [checkout, checkin], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

