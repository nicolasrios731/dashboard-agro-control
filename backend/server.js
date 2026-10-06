const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());

// Servir los archivos estáticos del frontend directamente
app.use(express.static(path.join(__dirname, '../frontend')));

// Generar telemetría aleatoria
function generarTelemetria() {
  return {
    timestamp: new Date().toISOString(),
    presionPozo: parseFloat((Math.random() * (2500 - 1800) + 1800).toFixed(1)),
    temperaturaLinea: parseFloat((Math.random() * (85 - 65) + 65).toFixed(1)),
    flujoDiario: Math.floor(Math.random() * (12000 - 9000) + 9000),
    estadoFlota: '18 / 20'
  };
}

// Endpoint de la API
app.get('/api/v1/telemetry/current', (req, res) => {
  res.json({
    status: 'success',
    data: generarTelemetria()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API y Frontend corriendo juntos en http://localhost:${PORT}`);
});