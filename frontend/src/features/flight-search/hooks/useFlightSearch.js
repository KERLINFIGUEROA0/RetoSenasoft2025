import { useState } from 'react';
import { API_BASE_URL, mockVuelos } from '../../../utils/constants';

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

      // Intentar conexión real con backend (comentado por ahora)
      /*
      const requestData = {
        origen: formData.origen.split(' - ')[0],
        destino: formData.destino.split(' - ')[0],
        fechaSalida: formData.fechaSalida,
        fechaRegreso: formData.tipoViaje === 'IDA_VUELTA' ? formData.fechaRegreso : null,
        cantidadPasajeros: formData.adultos + formData.infantes,
        tipoViaje: formData.tipoViaje
      };

      const response = await fetch(`${API_BASE_URL}/vuelos/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Error al buscar vuelos');
      }

      const data = await response.json();
      setVuelos(data);
      */
    } catch (err) {
      setError('Error al buscar vuelos. Usando datos de demostración.');
      console.error(err);
      // Fallback a datos mock
      setVuelos(mockVuelos.slice(0, 2));
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