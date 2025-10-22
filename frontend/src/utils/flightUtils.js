// Utilidades para manejo de vuelos
export const formatHora = (fecha) => {
  return new Date(fecha).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

import { CIUDADES } from './constants';

export const filtrarCiudades = (input) => {
  return CIUDADES.filter(ciudad =>
    ciudad.nombre.toLowerCase().includes(input.toLowerCase()) ||
    ciudad.codigo.toLowerCase().includes(input.toLowerCase())
  );
};

export const validarBusqueda = (formData) => {
  const errores = [];

  if (!formData.origen) errores.push('Selecciona una ciudad de origen');
  if (!formData.destino) errores.push('Selecciona una ciudad de destino');
  if (!formData.fechaSalida) errores.push('Selecciona una fecha de salida');

  if (formData.origen && formData.destino && formData.origen === formData.destino) {
    errores.push('El origen y destino no pueden ser iguales');
  }

  const fechaSalidaDate = new Date(formData.fechaSalida);
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1); // Permitir desde ayer para que hoy sea válido
  ayer.setHours(0, 0, 0, 0);

  // Permitir fechas desde ayer (para que hoy sea válido)
  if (fechaSalidaDate < ayer) {
    errores.push('La fecha de salida debe ser hoy o posterior');
  }

  if (formData.tipoViaje === 'IDA_VUELTA' && formData.fechaRegreso) {
    const fechaRegresoDate = new Date(formData.fechaRegreso);
    if (fechaRegresoDate <= fechaSalidaDate) {
      errores.push('La fecha de regreso debe ser posterior a la fecha de salida');
    }
  }

  const totalPasajeros = formData.adultos + formData.infantes;
  if (totalPasajeros > 5) {
    errores.push('El máximo de pasajeros es 5');
  }

  return errores;
};