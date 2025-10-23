import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../layout/Header/Header';
import PassengerForm from '../features/passenger-registration/components/PassengerForm/PassengerForm';
import { API_BASE_URL } from '../utils/constants';

const PassengerRegistrationPage = () => {
  const navigate = useNavigate();
  const [pasajeros, setPasajeros] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // NUEVO: States para guardar los conteos de la búsqueda
  const [adultosBuscados, setAdultosBuscados] = useState(0);
  const [infantesBuscados, setInfantesBuscados] = useState(0);

  useEffect(() => {
    // Cargar datos del localStorage
    const vuelo = localStorage.getItem('selectedFlight');
    const asientosJSON = localStorage.getItem('selectedSeats');
    // NUEVO: Cargar datos de la búsqueda
    const pasajerosSearchJSON = localStorage.getItem('searchPassengers');

    if (!vuelo || !asientosJSON || !pasajerosSearchJSON) {
      navigate('/');
      return;
    }

    const asientosParseados = JSON.parse(asientosJSON);
    // NUEVO: Parsear datos de la búsqueda
    const { adultos, infantes } = JSON.parse(pasajerosSearchJSON);
    const totalPasajerosBuscados = adultos + infantes;

    setVueloSeleccionado(JSON.parse(vuelo));
    setAsientosSeleccionados(asientosParseados);
    // NUEVO: Guardar conteos en el state
    setAdultosBuscados(adultos);
    setInfantesBuscados(infantes);

    // CAMBIO: Inicializar formularios basado en el TOTAL de la búsqueda (ej. 5)
    const pasajerosIniciales = Array.from({ length: totalPasajerosBuscados }, (_, index) => {
      
      // Asignar asiento solo a los primeros N formularios (los adultos)
      const asientoAsignadoVisual = asientosParseados[index]?.nombreVisual || null;

      return {
        id: index + 1,
        primerApellido: '',
        segundoApellido: '',
        nombres: '',
        fechaNacimiento: '',
        genero: '',
        tipoDocumento: '',
        numeroDocumento: '',
        telefono: '',
        email: '',
        infante: false,
        // CAMBIO: Asigna asiento solo si el índice es menor que la cantidad de adultos
        asientoAsignado: index < adultos ? asientoAsignadoVisual : null
      };
    });

    setPasajeros(pasajerosIniciales);
  }, [navigate]);

  const handlePassengerUpdate = (index, passengerData) => {
    const nuevosPasajeros = [...pasajeros];
    nuevosPasajeros[index] = { ...nuevosPasajeros[index], ...passengerData };
    setPasajeros(nuevosPasajeros);
  };

  const validarPasajeros = () => {
    const errores = [];
    let adultosRegistrados = 0;
    let infantesRegistrados = 0;

    pasajeros.forEach((pasajero, index) => {
      // ... (Validaciones de campos requeridos (líneas 75-88)) ...
      if (!pasajero.primerApellido.trim()) errores.push(`Pasajero ${index + 1}: Primer apellido requerido`);
      if (!pasajero.segundoApellido.trim()) errores.push(`Pasajero ${index + 1}: Segundo apellido requerido`);
      if (!pasajero.nombres.trim()) errores.push(`Pasajero ${index + 1}: Nombres requeridos`);
      if (!pasajero.fechaNacimiento) errores.push(`Pasajero ${index + 1}: Fecha de nacimiento requerida`);
      if (!pasajero.genero) errores.push(`Pasajero ${index + 1}: Género requerido`);
      if (!pasajero.tipoDocumento) errores.push(`Pasajero ${index + 1}: Tipo de documento requerido`);
      if (!pasajero.numeroDocumento.trim()) errores.push(`Pasajero ${index + 1}: Número de documento requerido`);
      if (!pasajero.telefono.trim()) errores.push(`Pasajero ${index + 1}: Teléfono requerido`);
      if (!pasajero.email.trim()) errores.push(`Pasajero ${index + 1}: Correo electrónico requerido`);

      // ... (Validación email (línea 91)) ...
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (pasajero.email && !emailRegex.test(pasajero.email)) {
        errores.push(`Pasajero ${index + 1}: Correo electrónico inválido`);
      }

      // Validar fecha de nacimiento y contar adultos/infantes
      if (pasajero.fechaNacimiento) {
        const fechaNacimiento = new Date(pasajero.fechaNacimiento);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const esMenor3 = edad < 3 || (edad === 3 && hoy < new Date(fechaNacimiento.getFullYear() + 3, fechaNacimiento.getMonth(), fechaNacimiento.getDate()));

        if (esMenor3) {
          infantesRegistrados++;
        } else {
          adultosRegistrados++;
        }
        
        // (Validaciones de consistencia (líneas 100-105))
        if (pasajero.infante && !esMenor3) {
          errores.push(`Pasajero ${index + 1}: La fecha de nacimiento no corresponde a un infante`);
        }
        if (!pasajero.infante && esMenor3) {
          errores.push(`Pasajero ${index + 1}: La fecha de nacimiento corresponde a un infante`);
        }
      }
    });

    // CAMBIO: Validar conteo de adultos/infantes contra la BÚSQUEDA
    if (adultosRegistrados !== adultosBuscados) {
      errores.push(`Debe registrar exactamente ${adultosBuscados} adultos (mayores de 3 años). (Registró ${adultosRegistrados})`);
    }
    if (infantesRegistrados !== infantesBuscados) {
      errores.push(`Debe registrar exactamente ${infantesBuscados} infantes (menores de 3 años). (Registró ${infantesRegistrados})`);
    }

    return errores;
  };

  const handleContinue = async () => {
    const errores = validarPasajeros();

    if (errores.length > 0) {
      setError(errores.join('\n'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar datos para enviar al backend - formato correcto para RegistroPasajerosRequest
      const registroData = {
        idReserva: null, // Se genera en el backend
        pasajeros: pasajeros.map(pasajero => ({
          primerApellido: pasajero.primerApellido,
          segundoApellido: pasajero.segundoApellido,
          nombres: pasajero.nombres,
          fechaNacimiento: pasajero.fechaNacimiento,
          genero: pasajero.genero,
          tipoDocumento: pasajero.tipoDocumento,
          numeroDocumento: pasajero.numeroDocumento,
          telefono: pasajero.telefono, // Campo correcto según PasajeroDTO
          email: pasajero.email, // Campo correcto según PasajeroDTO
          infante: pasajero.infante // Campo correcto según PasajeroDTO
        }))
      };

      // Enviar al backend usando Axios
      const response = await axios.post(`${API_BASE_URL}/reservas/`, registroData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      });

      // Guardar respuesta del backend
      localStorage.setItem('passengerRegistration', JSON.stringify(response.data));
      localStorage.setItem('reservaId', response.data.idReserva);

      // Crear reserva después de registrar pasajeros
      const reservaData = {
        pasajeros: response.data // Lista de PasajeroDTO
      };

      const reservaResponse = await axios.post(`${API_BASE_URL}/reservas/`, reservaData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      });

      // Guardar ID de la reserva creada
      localStorage.setItem('reservaCreadaId', reservaResponse.data.idReserva);

      navigate('/payment', {
        state: {
          selectedSeats: asientosSeleccionados,
          passengers: response.data,
          reservaId: reservaResponse.data.idReserva
        }
      });


    } catch (err) {
      setError('Error al registrar los pasajeros. Por favor, inténtelo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ... (JSX de loading) ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Información del vuelo y asientos */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Registro de Pasajeros</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {/* ... (Detalles del vuelo) ... */}
              <p><span className="font-medium">Asientos seleccionados:</span> {asientosSeleccionados.map(a => a.nombreVisual).join(', ')}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Resumen</h2>
              <div className="space-y-2">
                {/* CAMBIO: Mostrar conteo de la búsqueda */}
                <p><span className="font-medium">Total pasajeros:</span> {pasajeros.length}</p>
                <p><span className="font-medium">Adultos:</span> {adultosBuscados}</p>
                <p><span className="font-medium">Infantes:</span> {infantesBuscados}</p>
                <p className="text-sm text-gray-600">* Los infantes deben tener menos de 3 años</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formularios de pasajeros */}
        <div className="space-y-6">
          {pasajeros.map((pasajero, index) => (
            <PassengerForm
              key={pasajero.id}
              pasajero={pasajero}
              index={index}
              onUpdate={handlePassengerUpdate}
            />
          ))}
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium mb-2">Errores de validación:</h3>
            <ul className="text-red-700 text-sm space-y-1">
              {error.split('\n').map((err, index) => (
                <li key={index}>• {err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Botón continuar */}
        {/* ... (Botón de continuar sin cambios) ... */}
         <div className="flex justify-center mt-8">
          <button
            onClick={handleContinue}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin mr-2"></div>
                Registrando...
              </>
            ) : (
              'Continuar al Pago'
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PassengerRegistrationPage;