// Constantes de la aplicación
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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

// Eliminados datos mock - ahora todo se obtiene del backend