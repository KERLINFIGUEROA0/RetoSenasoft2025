import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

export const useFlightSearch = () => {
  const [vuelos, setVuelos] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState('');

  const buscarVuelos = async (formData) => {
    setBuscando(true);
    setError('');

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filtrar vuelos mock según criterios de búsqueda
      const vuelosFiltrados = mockVuelos.filter(vuelo => {
        const origenInput = formData.origen.split(' - ')[0]?.toLowerCase() || '';
        const destinoInput = formData.destino.split(' - ')[0]?.toLowerCase() || '';

        const origenMatch = vuelo.origen.nombre.toLowerCase().includes(origenInput);
        const destinoMatch = vuelo.destino.nombre.toLowerCase().includes(destinoInput);
        const fechaMatch = vuelo.fechaSalida.startsWith(formData.fechaSalida);

        console.log('Filtro:', { origenInput, destinoInput, fechaSalida: formData.fechaSalida, vuelo, origenMatch, destinoMatch, fechaMatch });

        return origenMatch && destinoMatch && fechaMatch;
      });

      console.log('Vuelos filtrados:', vuelosFiltrados);
      setVuelos(vuelosFiltrados);

      // Conexión real con backend usando Axios
      // Mapear nombres de ciudades a enum del backend
      const mapearCiudad = (ciudadInput) => {
        const ciudadLimpia = ciudadInput.split(' - ')[0]?.toLowerCase().trim();

        const mapeoCiudades = {
          'bogotá': 'BOGOTA',
          'medellín': 'MEDELLIN',
          'rionegro': 'RIONEGRO',
          'cali': 'CALI',
          'cartagena': 'CARTAGENA',
          'barranquilla': 'BARRANQUILLA',
          'santa marta': 'SANTA_MARTA',
          'pereira': 'PEREIRA',
          'manizales': 'MANIZALES',
          'armenia': 'ARMENIA',
          'bucaramanga': 'BUCARAMANGA',
          'cúcuta': 'CUCUTA',
          'neiva': 'NEIVA',
          'ibagué': 'IBAGUE',
          'montería': 'MONTERIA',
          'pasto': 'PASTO',
          'popayán': 'POPAYAN',
          'valledupar': 'VALLEDUPAR',
          'riohacha': 'RIOHACHA',
          'leticia': 'LETICIA',
          'san andrés': 'SAN_ANDRES',
          'yopal': 'YOPAL',
          'tunja': 'TUNJA',
          'villavicencio': 'VILLAVICENCIO',
          'florencia': 'FLORENCIA',
          'quibdó': 'QUIBDO',
          'mitú': 'MITU',
          'mocoa': 'MOCOA',
          'puerto carreño': 'PUERTO_CARREÑO',
          'arauca': 'ARAUCA'
        };

        return mapeoCiudades[ciudadLimpia] || ciudadLimpia.toUpperCase().replace(/\s+/g, '_');
      };

      const requestData = {
        origen: mapearCiudad(formData.origen),
        destino: mapearCiudad(formData.destino),
        fechaSalida: formData.fechaSalida,
        cantidadPasajeros: formData.adultos + formData.infantes
      };

      const response = await axios.post(`${API_BASE_URL}/vuelos/`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      });

      // Usar datos del backend en lugar de mock
      setVuelos(response.data);
      console.log('Vuelos del backend:', response.data);
    } catch (err) {
      setError('Error al buscar vuelos. Verifica la conexión con el servidor.');
      console.error(err);
      // Sin fallback a datos mock - mostrar error
      setVuelos([]);
    } finally {
      setBuscando(false);
    }
  };

  return {
    vuelos,
    buscando,
    error,
    buscarVuelos,
    setVuelos,
    setError
  };
};