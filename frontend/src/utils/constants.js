// Constantes de la aplicación
export const API_BASE_URL = 'http://localhost:8080/api';

// Enum de ciudades basado en el backend
export const CIUDADES = [
  { nombre: 'Bogotá - El Dorado', codigo: 'BOG' },
  { nombre: 'Medellín - José María Córdova', codigo: 'MDE' },
  { nombre: 'Rionegro - José María Córdova', codigo: 'MDE' },
  { nombre: 'Cali - Alfonso Bonilla Aragón', codigo: 'CLO' },
  { nombre: 'Cartagena - Rafael Núñez', codigo: 'CTG' },
  { nombre: 'Barranquilla - Ernesto Cortissoz', codigo: 'BAQ' },
  { nombre: 'Santa Marta - Simón Bolívar', codigo: 'SMR' },
  { nombre: 'Pereira - Matecaña', codigo: 'PEI' },
  { nombre: 'Manizales - La Nubia', codigo: 'MZL' },
  { nombre: 'Armenia - El Edén', codigo: 'AXM' },
  { nombre: 'Bucaramanga - Palonegro', codigo: 'BGA' },
  { nombre: 'Cúcuta - Camilo Daza', codigo: 'CUC' },
  { nombre: 'Neiva - Benito Salas', codigo: 'NVA' },
  { nombre: 'Ibagué - Perales', codigo: 'IBE' },
  { nombre: 'Montería - Los Garzones', codigo: 'MTR' },
  { nombre: 'Pasto - Antonio Nariño', codigo: 'PSO' },
  { nombre: 'Popayán - Guillermo León Valencia', codigo: 'PPN' },
  { nombre: 'Valledupar - Alfonso López Pumarejo', codigo: 'VUP' },
  { nombre: 'Riohacha - Almirante Padilla', codigo: 'RCH' },
  { nombre: 'Leticia - Alfredo Vásquez Cobo', codigo: 'LET' },
  { nombre: 'San Andrés - Gustavo Rojas Pinilla', codigo: 'ADZ' },
  { nombre: 'Yopal - El Alcaraván', codigo: 'EYP' },
  { nombre: 'Tunja - Gustavo Rojas Pinilla', codigo: 'TUN' },
  { nombre: 'Villavicencio - Vanguardia', codigo: 'VVC' },
  { nombre: 'Florencia - Gustavo Artunduaga', codigo: 'FLA' },
  { nombre: 'Quibdó - El Caraño', codigo: 'UIB' },
  { nombre: 'Mitú - Fabio Alberto León Bentley', codigo: 'MVP' },
  { nombre: 'Mocoa - Villagarzón', codigo: 'VGZ' },
  { nombre: 'Puerto Carreño - Germán Olano', codigo: 'PCR' },
  { nombre: 'Arauca - Santiago Pérez Quiroz', codigo: 'AUC' }
];

// Datos mock para simular respuesta del backend
export const mockVuelos = [
  {
    idVuelo: 1,
    origen: { nombre: 'Bogotá', codigo: 'BOG' },
    destino: { nombre: 'Pereira', codigo: 'PEI' },
    fechaSalida: '2025-10-25T08:00:00',
    fechaLlegada: '2025-10-25T10:30:00',
    precio: 150000,
    modeloAvion: 'Boeing 737',
    capacidadAvion: 150,
    asientosDisponibles: 75
  },
  {
    idVuelo: 2,
    origen: { nombre: 'Bogotá', codigo: 'BOG' },
    destino: { nombre: 'Pereira', codigo: 'PEI' },
    fechaSalida: '2025-10-25T14:00:00',
    fechaLlegada: '2025-10-25T16:30:00',
    precio: 180000,
    modeloAvion: 'Airbus A320',
    capacidadAvion: 180,
    asientosDisponibles: 90
  },
  {
    idVuelo: 3,
    origen: { nombre: 'Bogotá', codigo: 'BOG' },
    destino: { nombre: 'Cali', codigo: 'CLO' },
    fechaSalida: '2025-10-25T09:00:00',
    fechaLlegada: '2025-10-25T10:15:00',
    precio: 120000,
    modeloAvion: 'Boeing 737',
    capacidadAvion: 150,
    asientosDisponibles: 60
  }
];

// Función para generar asientos mock disponibles
export const generarAsientosMock = (vueloId, capacidadAvion, asientosDisponibles) => {
  const asientos = [];
  let asientosGenerados = 0;

  // Generar asientos disponibles (al menos 5 para pruebas)
  const minAsientosDisponibles = Math.max(5, Math.floor(asientosDisponibles * 0.8));

  for (let numeroAsiento = 1; numeroAsiento <= capacidadAvion && asientosGenerados < minAsientosDisponibles; numeroAsiento++) {
    // Hacer disponibles al menos los primeros 5 asientos de cada fila para pruebas
    const disponible = numeroAsiento <= minAsientosDisponibles ||
                      (numeroAsiento % 6 === 1 || numeroAsiento % 6 === 2 || numeroAsiento % 6 === 3);

    asientos.push({
      idAsientoVuelo: `${vueloId}-${numeroAsiento}`,
      numeroAsiento: numeroAsiento,
      disponible: disponible,
      precio: disponible ? mockVuelos.find(v => v.idVuelo === vueloId)?.precio || 150000 : null
    });

    if (disponible) asientosGenerados++;
  }

  return asientos;
};