import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header/Header';
import SearchForm from '../features/flight-search/components/SearchForm/SearchForm';
import FlightResults from '../features/flight-search/components/FlightResults/FlightResults';
import { useFlightSearch } from '../features/flight-search/hooks/useFlightSearch';

function HomePage() {
  const navigate = useNavigate();
  const { vuelos, buscando, error, buscarVuelos } = useFlightSearch();
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState(true);

  // Cargar vuelos próximos al montar el componente
  useEffect(() => {
    const loadUpcomingFlights = async () => {
      try {
        // Simular carga de vuelos próximos (puedes reemplazar con llamada real a API)
        const mockUpcomingFlights = [
          {
            idVuelo: 1,
            origen: 'Bogotá',
            destino: 'Medellín',
            fecha: '2025-01-15',
            hora: '08:00',
            precio: 180000,
            asientosDisponibles: 45
          },
          {
            idVuelo: 2,
            origen: 'Bogotá',
            destino: 'Cali',
            fecha: '2025-01-15',
            hora: '10:30',
            precio: 220000,
            asientosDisponibles: 32
          },
          {
            idVuelo: 3,
            origen: 'Medellín',
            destino: 'Bogotá',
            fecha: '2025-01-15',
            hora: '14:15',
            precio: 180000,
            asientosDisponibles: 28
          },
          {
            idVuelo: 4,
            origen: 'Bogotá',
            destino: 'Cartagena',
            fecha: '2025-01-16',
            hora: '09:00',
            precio: 350000,
            asientosDisponibles: 52
          }
        ];
        setUpcomingFlights(mockUpcomingFlights);
      } catch (error) {
        console.error('Error cargando vuelos próximos:', error);
      }
    };

    loadUpcomingFlights();
  }, []);

  // CAMBIO: Creamos un manejador para la búsqueda
  const handleSearch = (formData) => {
    // Guardamos la cantidad de pasajeros en localStorage para usarla después
    localStorage.setItem('searchPassengers', JSON.stringify({
      adultos: formData.adultos,
      infantes: formData.infantes
    }));

    // Llamamos a la función original de búsqueda
    buscarVuelos(formData);
    setShowUpcoming(false); // Ocultar vuelos próximos cuando se hace búsqueda
  };

  const handleFlightSelect = (vuelo) => {
    console.log('Vuelo seleccionado:', vuelo);
    // Navegar a la página de selección de asientos
    navigate(`/seats/${vuelo.idVuelo}`);
  };

  const handleUpcomingFlightSelect = (vuelo) => {
    // Para vuelos próximos, navegar directamente con datos mock
    localStorage.setItem('selectedFlight', JSON.stringify(vuelo));
    navigate(`/seats/${vuelo.idVuelo}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Bienvenida */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a <span className="text-blue-600">Airfy</span>!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tu aerolínea de confianza para viajar por Colombia.
            Reserva tus vuelos de forma fácil, rápida y segura.
          </p>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Destinos Nacionales</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Servicio al Cliente</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Pago Seguro</div>
            </div>
          </div>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Busca tu vuelo ideal
          </h2>
          <SearchForm onSearch={handleSearch} loading={buscando} />
        </div>

        {/* Resultados de búsqueda */}
        {(vuelos.length > 0 || buscando || error) && (
          <FlightResults
            vuelos={vuelos}
            loading={buscando}
            error={error}
            onSelectFlight={handleFlightSelect}
          />
        )}

        {/* Vuelos próximos - Solo mostrar si no hay búsqueda activa */}
        {showUpcoming && upcomingFlights.length > 0 && vuelos.length === 0 && !buscando && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                🚀 Vuelos Próximos a Salir
              </h2>
              <span className="text-sm text-gray-500">
                Actualizado en tiempo real
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingFlights.map((vuelo) => (
                <div
                  key={vuelo.idVuelo}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleUpcomingFlightSelect(vuelo)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {vuelo.origen} → {vuelo.destino}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(vuelo.fecha).toLocaleDateString('es-CO')} • {vuelo.hora}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        ${vuelo.precio.toLocaleString('es-CO')}
                      </div>
                      <div className="text-xs text-gray-500">
                        por persona
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {vuelo.asientosDisponibles} asientos disponibles
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Reservar Ahora
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Información adicional */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-700">
                  <p className="font-medium">¡Reserva con anticipación!</p>
                  <p className="mt-1">
                    Los mejores precios y más opciones de asientos disponibles.
                    Cancela o modifica tu reserva sin costo hasta 24 horas antes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;