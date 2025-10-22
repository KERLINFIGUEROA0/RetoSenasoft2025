const Seat = ({ asiento, isSelected, onSelect }) => {
  const getSeatClass = () => {
    if (!asiento.disponible) {
      return 'bg-gray-300 cursor-not-allowed border-gray-400';
    }
    if (isSelected) {
      return 'bg-blue-500 hover:bg-blue-600 border-blue-600 cursor-pointer';
    }
    return 'bg-green-400 hover:bg-green-500 border-green-500 cursor-pointer';
  };

  // Si el asiento es 'invisible' (no existe), renderiza un espacio vacío
  if (asiento.invisible) {
    return <div className="w-8 h-8 rounded" />;
  }

  return (
    <div
      className={`
        w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-medium transition-colors
        ${getSeatClass()}
        ${!asiento.disponible ? 'text-gray-500' : isSelected ? 'text-white' : 'text-gray-800'}
      `}
      onClick={asiento.disponible ? onSelect : undefined}
      title={asiento.disponible ? `Asiento ${asiento.nombreVisual}` : 'Asiento ocupado'}
    >
      {/* Mostramos el nombre visual (1A) en lugar del número (1) */}
      {asiento.nombreVisual}
    </div>
  );
};

export default Seat;