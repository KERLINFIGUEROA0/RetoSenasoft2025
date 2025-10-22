import { formatHora } from '../../../../utils/flightUtils';

const FlightCard = ({ vuelo, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-4">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="mb-2">
            <div className="text-xl font-semibold text-gray-800 mb-1">
              {formatHora(vuelo.fechaSalida)} - {formatHora(vuelo.fechaLlegada)}
            </div>
            <div className="text-sm text-gray-600">
              {vuelo.origen?.codigo} → {vuelo.destino?.codigo}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Operado por AirFly
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            ${vuelo.precio?.toLocaleString('es-CO')}
          </div>
          <div className="text-sm text-gray-600">
            {vuelo.asientosDisponibles} asientos libres
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <button
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium cursor-pointer transition-colors hover:bg-blue-700"
          onClick={() => onSelect(vuelo)}
        >
          Seleccionar Vuelo
        </button>
      </div>
    </div>
  );
};

export default FlightCard;