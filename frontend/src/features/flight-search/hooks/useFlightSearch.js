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
          'arauca': 'ARAUCA',
          'cúcuta': 'CUCUTA',
          'ibagué': 'IBAGUE',
          'montería': 'MONTERIA',
          'popayán': 'POPAYAN',
          'san andrés': 'SAN_ANDRES',
          'puerto carreño': 'PUERTO_CARREÑO'
        };

        return mapeoCiudades[ciudadLimpia] || ciudadLimpia.toUpperCase().replace(/\s+/g, '_');
      };

      const requestData = {
        origen: mapearCiudad(formData.origen),
        destino: mapearCiudad(formData.destino),
        fechaSalida: formData.fechaSalida,
        cantidadPasajeros: formData.adultos + formData.infantes
      };

      console.log('Enviando request a backend:', requestData);

      const response = await axios.post(`${API_BASE_URL}/vuelos/`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      });

      console.log('Respuesta del backend:', response);

      // Usar datos del backend
      if (response.data && response.data.length > 0) {
        setVuelos(response.data);
        console.log('Vuelos encontrados:', response.data.length);
      } else {
        setVuelos([]);
        setError('No se encontraron vuelos disponibles para la fecha y ruta seleccionada.');
      }
      console.log('Vuelos del backend:', response.data);
    } catch (err) {
      console.error('Error al buscar vuelos:', err);
      setError('No se encontraron vuelos disponibles para la fecha y ruta seleccionada.');
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