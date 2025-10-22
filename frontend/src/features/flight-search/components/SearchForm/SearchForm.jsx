import { useState } from 'react';
import { filtrarCiudades, validarBusqueda } from '../../../../utils/flightUtils';

const SearchForm = ({ onSearch, loading }) => {
  const [tipoViaje, setTipoViaje] = useState('IDA');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaRegreso, setFechaRegreso] = useState('');
  const [adultos, setAdultos] = useState(1);
  const [infantes, setInfantes] = useState(0);
  const [errores, setErrores] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      tipoViaje,
      origen,
      destino,
      fechaSalida,
      fechaRegreso,
      adultos,
      infantes
    };

    const erroresValidacion = validarBusqueda(formData);
    setErrores(erroresValidacion);

    if (erroresValidacion.length === 0) {
      await onSearch(formData);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="search-form">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">¿A dónde viajas?</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Viaje</label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer text-base text-gray-700">
                <input
                  type="radio"
                  value="IDA"
                  checked={tipoViaje === 'IDA'}
                  onChange={(e) => setTipoViaje(e.target.value)}
                  className="mr-2 text-blue-600 accent-blue-600"
                />
                Solo Ida
              </label>
              <label className="flex items-center cursor-pointer text-base text-gray-700">
                <input
                  type="radio"
                  value="IDA_VUELTA"
                  checked={tipoViaje === 'IDA_VUELTA'}
                  onChange={(e) => setTipoViaje(e.target.value)}
                  className="mr-2 text-blue-600 accent-blue-600"
                />
                Ida y Vuelta
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">Origen</label>
              <input
                type="text"
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                placeholder="Ciudad de origen (ej. Bogotá)"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                list="origen-list"
              />
              <datalist id="origen-list">
                {filtrarCiudades(origen).map((ciudad, index) => (
                  <option key={index} value={`${ciudad.nombre} - ${ciudad.codigo}`} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ciudad de destino (ej. Pereira)"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                list="destino-list"
              />
              <datalist id="destino-list">
                {filtrarCiudades(destino).map((ciudad, index) => (
                  <option key={index} value={`${ciudad.nombre} - ${ciudad.codigo}`} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Salida</label>
              <input
                type="date"
                value={fechaSalida}
                onChange={(e) => setFechaSalida(e.target.value)}
                min={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                max={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {tipoViaje === 'IDA_VUELTA' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Regreso</label>
                <input
                  type="date"
                  value={fechaRegreso}
                  onChange={(e) => setFechaRegreso(e.target.value)}
                  min={fechaSalida || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pasajeros</label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 whitespace-nowrap">Adultos:</label>
                <select
                  value={adultos}
                  onChange={(e) => setAdultos(parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 whitespace-nowrap">Infantes (menores de 3 años):</label>
                <select
                  value={infantes}
                  onChange={(e) => setInfantes(parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                >
                  {[...Array(6 - adultos)].map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Total: {adultos + infantes} pasajero(s). Los infantes se cuentan pero no pagan vuelo.
            </p>
          </div>

          {errores.length > 0 && (
            <div className="mb-4">
              {errores.map((error, index) => (
                <div key={index} className="px-3 py-2 bg-red-50 border border-red-200 border-solid rounded-lg text-red-700 text-sm mb-2">
                  {error}
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 border-none rounded-lg text-base font-medium cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
                Buscando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar Vuelo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;