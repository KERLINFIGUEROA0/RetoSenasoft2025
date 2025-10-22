import Seat from './Seat';

const SeatMap = ({ asientos, asientosSeleccionados, onSeatSelect, capacidadAvion }) => {

  // Definimos las columnas como en la imagen
  const COLUMNAS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const ASIENTOS_POR_FILA = 6;
  // Calcular filas dinámicamente basado en la capacidad real del avión
  const NUMERO_FILAS = Math.ceil(capacidadAvion / ASIENTOS_POR_FILA);

  /**
   * Obtiene los datos del asiento (de la lista plana) basándose en la fila y columna.
   * Usa el nombreAsiento del backend que ya viene en formato "1A", "2B", etc.
   */
  const getAsientoData = (fila, columnaLetra) => {
    // El nombre visual esperado (ej. "1A", "2B")
    const nombreAsientoVisual = `${fila}${columnaLetra}`;

    // Buscar el asiento por su nombre visual exacto
    const asientoData = asientos.find(a => a.nombreVisual === nombreAsientoVisual);

    // Si no se encuentra en la data del backend
    if (!asientoData) {
      return {
        numeroAsiento: null,
        nombreVisual: nombreAsientoVisual,
        disponible: false, // Asumir ocupado si no está en la lista de disponibles
        idAsientoVuelo: null,
        invisible: false
      };
    }

    // Devolvemos el asiento con sus datos del backend
    return {
      ...asientoData,
      invisible: false
    };
  };


  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Selecciona tus asientos</h2>
        <p className="text-sm text-gray-600">
          Avión con capacidad de {capacidadAvion} asientos - {NUMERO_FILAS} filas - Máximo 5 asientos por reserva
        </p>
      </div>

      {/* Leyenda */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded border border-gray-400"></div>
          <span className="text-sm text-gray-600">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-400 rounded border border-green-500"></div>
          <span className="text-sm text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded border border-blue-600"></div>
          <span className="text-sm text-gray-600">Seleccionado</span>
        </div>
      </div>

      {/* Cabina del piloto */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg text-sm font-medium">
          Cabina del Piloto
        </div>
      </div>

      {/* Mapa de asientos */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg overflow-x-auto">
        <div className="flex flex-col items-center space-y-2 max-w-sm mx-auto">
          
          {/* Encabezados de Columna (A, B, C, D, E, F) */}
          <div className="flex w-full items-center">
            <div className="w-8"></div> {/* Spacer para número de fila */}
            <div className="flex-1 flex justify-around">
              <span className="w-8 text-center font-medium text-gray-500">A</span>
              <span className="w-8 text-center font-medium text-gray-500">B</span>
              <span className="w-8 text-center font-medium text-gray-500">C</span>
            </div>
            {/* Pasillo más ancho */}
            <div className="w-12"></div> {/* Spacer para pasillo */}
            <div className="flex-1 flex justify-around">
              <span className="w-8 text-center font-medium text-gray-500">D</span>
              <span className="w-8 text-center font-medium text-gray-500">E</span>
              <span className="w-8 text-center font-medium text-gray-500">F</span>
            </div>
            <div className="w-8"></div> {/* Spacer para número de fila */}
          </div>

          {/* Filas de Asientos */}
          {Array.from({ length: NUMERO_FILAS }, (_, i) => i + 1).map((filaNum) => {
            const asientosIzquierda = COLUMNAS.slice(0, 3).map(col => getAsientoData(filaNum, col));
            const asientosDerecha = COLUMNAS.slice(3, 6).map(col => getAsientoData(filaNum, col));

            return (
              <div key={filaNum} className="flex w-full items-center">
                
                {/* Número de Fila Izquierda */}
                <div className="w-8 text-center text-sm font-medium text-gray-600">
                  {filaNum}
                </div>

                {/* Asientos Izquierda (A, B, C) */}
                <div className="flex-1 flex justify-around">
                  {asientosIzquierda.map((asiento) => (
                    <Seat
                      key={asiento.nombreVisual || `l-${filaNum}-${asiento.numeroAsiento}`}
                      asiento={asiento}
                      isSelected={asientosSeleccionados.some(a => a.idAsientoVuelo === asiento.idAsientoVuelo)}
                      onSelect={() => onSeatSelect(asiento)}
                    />
                  ))}
                </div>

                {/* Pasillo Central (Vacío y más ancho) */}
                <div className="w-12">
                  {/* Espacio del pasillo */}
                </div>

                {/* Asientos Derecha (D, E, F) */}
                <div className="flex-1 flex justify-around">
                  {asientosDerecha.map((asiento) => (
                    <Seat
                      key={asiento.nombreVisual || `r-${filaNum}-${asiento.numeroAsiento}`}
                      asiento={asiento}
                      isSelected={asientosSeleccionados.some(a => a.idAsientoVuelo === asiento.idAsientoVuelo)}
                      onSelect={() => onSeatSelect(asiento)}
                    />
                  ))}
                </div>

                {/* Número de Fila Derecha */}
                <div className="w-8 text-center text-sm font-medium text-gray-600">
                  {filaNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <div className="bg-gray-700 text-white px-8 py-4 rounded-lg text-sm font-medium shadow-lg">
          COLA DEL AVIÓN
        </div>
      </div>
    </div>
  );
};

export default SeatMap;