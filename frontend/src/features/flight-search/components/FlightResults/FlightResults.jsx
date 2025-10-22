import FlightCard from '../FlightCard/FlightCard.jsx';

const FlightResults = ({ vuelos, loading, error, onSelectFlight }) => {
  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-base">Buscando vuelos disponibles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 border border-red-200 rounded-xl">
          <div className="text-3rem mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al buscar vuelos</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (vuelos.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border border-gray-200 rounded-xl">
          <div className="text-3rem mb-4">✈️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron vuelos</h3>
          <p className="text-sm text-gray-600">Intenta cambiar las fechas o destinos de búsqueda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 m-0">Vuelos Disponibles</h3>
        <p className="text-sm text-gray-600 m-0">{vuelos.length} vuelo{vuelos.length !== 1 ? 's' : ''} encontrado{vuelos.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col gap-4">
        {vuelos.map((vuelo, index) => (
          <FlightCard
            key={vuelo.idVuelo || index}
            vuelo={vuelo}
            onSelect={onSelectFlight}
          />
        ))}
      </div>
    </div>
  );
};

export default FlightResults;