const API_URL = 'http://localhost:3001/api/v1/telemetry/current';

async function obtenerDatosTelemetria() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error('Error en la respuesta');
    
    const resultado = await respuesta.json();
    const datos = resultado.data || resultado;
    actualizarInterfaz(datos);

  } catch (error) {
    console.error('Error al conectar con la API:', error);
    const statusText = document.getElementById('api-status-text');
    if (statusText) {
      statusText.textContent = 'API DESCONECTADA';
      statusText.style.color = '#ef4444';
    }
  }
}

function actualizarInterfaz(datos) {
  // 1. Estado de API
  const statusText = document.getElementById('api-status-text');
  if (statusText) {
    statusText.textContent = 'API CONECTADA';
    statusText.style.color = '#22c55e';
  }

  // 2. Extraer datos con fallback de nombres
  const presion = datos.presionPozo ?? datos.presion ?? '--';
  const temp = datos.temperaturaLinea ?? datos.temperatura ?? '--';
  const flujo = datos.flujoDiario ?? datos.flujo ?? '--';
  const flota = datos.estadoFlota ?? datos.flota ?? '18 / 20';
  const fecha = datos.timestamp ? new Date(datos.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();

  // 3. Renderizar en Tarjetas KPI
  const elPresion = document.getElementById('kpi-presion');
  const elTemp = document.getElementById('kpi-temp');
  const elFlujo = document.getElementById('kpi-flujo');
  const elFlota = document.getElementById('kpi-flota');

  if (elPresion) elPresion.innerHTML = `${presion} <small>PSI</small>`;
  if (elTemp) elTemp.innerHTML = `${temp} <small>°C</small>`;
  if (elFlujo) elFlujo.innerHTML = `${flujo} <small>BPD</small>`;
  if (elFlota) elFlota.textContent = flota;

  // 4. Renderizar en Tabla Histórica
  const tablaBody = document.getElementById('table-telemetry-body');
  if (tablaBody) {
    if (tablaBody.innerText.includes('Cargando')) {
      tablaBody.innerHTML = '';
    }

    const nuevaFila = document.createElement('tr');
    const esAlerta = typeof temp === 'number' && temp > 76.0;

    nuevaFila.innerHTML = `
      <td>${fecha}</td>
      <td>Yacimiento Sector Norte - Pozo #4</td>
      <td><strong>${presion} PSI</strong></td>
      <td>${temp} °C</td>
      <td><span class="badge ${esAlerta ? 'alert' : 'ok'}">${esAlerta ? 'PRECAUCIÓN' : 'OPERATIVO'}</span></td>
    `;

    tablaBody.insertBefore(nuevaFila, tablaBody.firstChild);

    if (tablaBody.children.length > 6) {
      tablaBody.removeChild(tablaBody.lastChild);
    }
  }
}

// Inicializar ciclo de telemetría
obtenerDatosTelemetria();
setInterval(obtenerDatosTelemetria, 3000);

// ==========================================
// FUNCIÓN PARA NAVEGACIÓN Y CAMBIO DE SECCIONES
// ==========================================
function cambiarSeccion(idSeccion, urlImagenFondo, evt) {
  // 1. Cambiar la imagen de fondo del body
  if (urlImagenFondo) {
    document.body.style.backgroundImage = `url('${urlImagenFondo}')`;
  }

  // 2. Ocultar todas las secciones
  const secciones = document.querySelectorAll('.seccion-pagina');
  secciones.forEach(sec => sec.style.display = 'none');

  // 3. Mostrar la sección seleccionada
  const seccionActiva = document.getElementById(idSeccion);
  if (seccionActiva) {
    seccionActiva.style.display = 'block';
  }

  // 4. Actualizar estado estético del botón activo
  const botones = document.querySelectorAll('.nav-btn');
  botones.forEach(btn => btn.classList.remove('active'));

  const targetBtn = (evt && evt.currentTarget) ? evt.currentTarget : (window.event ? window.event.currentTarget : null);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
}