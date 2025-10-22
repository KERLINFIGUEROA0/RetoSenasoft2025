import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header/Header';
import SeatMap from '../features/flight-search/components/SeatMap/SeatMap';
import { API_BASE_URL } from '../utils/constants';

const SeatSelectionPage = () => {
  const { vueloId } = useParams();
  const navigate = useNavigate();
  const [vuelo, setVuelo] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // NUEVO: State para guardar los datos de la búsqueda
  const [pasajerosBuscados, setPasajerosBuscados] = useState(null);

  useEffect(() => {
    // NUEVO: Cargar datos de la búsqueda (adultos/infantes)
    const searchData = localStorage.getItem('searchPassengers');
    if (searchData) {
      setPasajerosBuscados(JSON.parse(searchData));
    }
    
    cargarDatosVuelo();
  }, [vueloId]);

  const cargarDatosVuelo = async () => {
    try {
      setLoading(true);

      // Cargar información del vuelo
      const vueloResponse = await fetch(`${API_BASE_URL}/vuelos/${vueloId}`);
      if (!vueloResponse.ok) throw new Error('Error al cargar vuelo');
      const vueloData = await vueloResponse.json();
      setVuelo(vueloData);

      // Cargar asientos disponibles con datos mock mejorados
      const { generarAsientosMock } = await import('../utils/constants');
      const asientosData = generarAsientosMock(vueloId, vueloData.capacidadAvion, vueloData.asientosDisponibles);
      setAsientos(asientosData);

    } catch (err) {
      setError('Error al cargar los datos del vuelo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (asiento) => {
    setAsientosSeleccionados(prev => {
      const isSelected = prev.some(a => a.idAsientoVuelo === asiento.idAsientoVuelo);

      if (isSelected) {
        // Deseleccionar
        return prev.filter(a => a.idAsientoVuelo !== asiento.idAsientoVuelo);
      } else {
        // Verificar límite de 5 asientos (o el total de adultos)
        const maxAsientos = pasajerosBuscados ? pasajerosBuscados.adultos : 5;
        if (prev.length >= maxAsientos) {
          alert(`Solo puedes seleccionar ${maxAsientos} asientos (1 por adulto). Los infantes no ocupan asiento.`);
          return prev;
        }
        // Seleccionar
        return [...prev, asiento];
      }
    });
  };

  const handleContinue = () => {
    // NUEVA VALIDACIÓN: Asegurarnos que seleccionó 1 asiento por adulto
    if (pasajerosBuscados && asientosSeleccionados.length !== pasajerosBuscados.adultos) {
      alert(`Debes seleccionar exactamente ${pasajerosBuscados.adultos} asientos (uno para cada adulto).`);
      return;
    }
    
    if (asientosSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un asiento');
      return;
    }

    // Guardar selección en localStorage o context para la siguiente vista
    localStorage.setItem('selectedFlight', JSON.stringify(vuelo));
    localStorage.setItem('selectedSeats', JSON.stringify(asientosSeleccionados));

    // Navegar a registro de pasajeros
    navigate('/passengers');
  };

  // ... (JSX de loading y error) ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Información del vuelo */}
        {vuelo && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Selecciona tus asientos</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {/* ... (Detalles del vuelo) ... */}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Asientos seleccionados</h2>
                
                {/* NUEVO: Mostrar para cuántos pasajeros es la búsqueda */}
                {pasajerosBuscados && (
                  <div className="mb-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Búsqueda:</span> {pasajerosBuscados.adultos} adulto(s), {pasajerosBuscados.infantes} infante(s).
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      Debes seleccionar {pasajerosBuscados.adultos} asiento(s).
                    </p>
                  </div>
                )}
                
                {asientosSeleccionados.length > 0 ? (
                  <div className="space-y-2">
                    {asientosSeleccionados.map(asiento => (
                      <div key={asiento.idAsientoVuelo} className="flex justify-between items-center bg-blue-50 p-2 rounded">
                        <span className="font-medium">Asiento {asiento.nombreVisual}</span>
                        <span className="text-blue-600">${vuelo.precio?.toLocaleString('es-CO')}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-4">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span className="text-blue-600">${(vuelo.precio * asientosSeleccionados.length)?.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Ningún asiento seleccionado</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mapa de asientos */}
        <SeatMap
          asientos={asientos}
          asientosSeleccionados={asientosSeleccionados}
          onSeatSelect={handleSeatSelect}
          capacidadAvion={vuelo?.capacidadAvion || 180}
        />

        {/* Botón continuar */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleContinue}
            disabled={asientosSeleccionados.length === 0}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continuar con {asientosSeleccionados.length} asiento{asientosSeleccionados.length !== 1 ? 's' : ''} seleccionado{asientosSeleccionados.length !== 1 ? 's' : ''}
          </button>
        </div>
      </main>
    </div>
  );
};

export default SeatSelectionPage;