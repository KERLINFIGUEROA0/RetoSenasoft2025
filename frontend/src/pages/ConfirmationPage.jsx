import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../layout/Header/Header';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats, passengers } = location.state || {};
  const [bookingCode, setBookingCode] = useState('');

  useEffect(() => {
    // Generar código de reserva único
    const code = 'AF' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setBookingCode(code);

    // Limpiar localStorage después de mostrar confirmación
    setTimeout(() => {
      localStorage.removeItem('selectedFlight');
      localStorage.removeItem('selectedSeats');
      localStorage.removeItem('searchPassengers');
      localStorage.removeItem('passengerRegistration');
    }, 5000);
  }, []);

  const handlePrintTickets = () => {
    window.print();
  };

  const handleNewBooking = () => {
    navigate('/');
  };

  if (!selectedSeats || !passengers) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Mensaje de éxito principal */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              ¡Su pago fue exitoso!
            </h1>

            <p className="text-xl text-gray-700 mb-2">
              Gracias por confiar en Airfy
            </p>

            <p className="text-lg text-gray-600">
              Su reserva ha sido confirmada exitosamente
            </p>
          </div>

          {/* Código de reserva */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Código de Reserva</h2>
            <div className="text-4xl font-mono font-bold text-blue-600 bg-blue-50 py-4 px-8 rounded-lg inline-block">
              {bookingCode}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Guarde este código para futuras referencias
            </p>
          </div>

          {/* Detalles de la reserva */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles de su Reserva</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Información del vuelo */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Información del Vuelo</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Origen:</span> {selectedSeats[0]?.vuelo?.origen || 'N/A'}</p>
                  <p><span className="font-medium">Destino:</span> {selectedSeats[0]?.vuelo?.destino || 'N/A'}</p>
                  <p><span className="font-medium">Fecha:</span> {selectedSeats[0]?.vuelo?.fecha || 'N/A'}</p>
                  <p><span className="font-medium">Hora:</span> {selectedSeats[0]?.vuelo?.hora || 'N/A'}</p>
                </div>
              </div>

              {/* Asientos y pasajeros */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Asientos Reservados</h4>
                <div className="space-y-1">
                  {selectedSeats.map((seat, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span className="font-medium">Asiento {seat.nombreVisual}</span>
                      <span className="text-sm text-gray-600">
                        {passengers[index]?.nombres} {passengers[index]?.primerApellido}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Información importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">Información Importante</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Presente su documento de identidad y el código de reserva en el aeropuerto
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                El check-in comienza 2 horas antes de la salida del vuelo
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Recibirá confirmación por correo electrónico con todos los detalles
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Para cambios o cancelaciones, contacte nuestro servicio al cliente
              </li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePrintTickets}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Imprimir Tiquetes
            </button>

            <button
              onClick={handleNewBooking}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Nueva Reserva
            </button>
          </div>

          {/* Mensaje final */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              ¿Necesita ayuda? Contacte nuestro servicio al cliente 24/7
            </p>
            <p className="text-blue-600 font-medium mt-1">
              Teléfono: (1) 800-123-4567 | Email: soporte@airfy.com
            </p>
          </div>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container { max-width: none !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default ConfirmationPage;