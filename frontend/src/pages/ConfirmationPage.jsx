import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../layout/Header/Header';
import { API_BASE_URL } from '../utils/constants';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats, passengers, reservaId, tiquetes, pago } = location.state || {};
  const [bookingCode, setBookingCode] = useState('');
  const [confirmacionData, setConfirmacionData] = useState(null);

  useEffect(() => {
    const cargarConfirmacion = async () => {
      try {
        if (reservaId) {
          // Obtener confirmación desde el backend
          const response = await axios.get(`${API_BASE_URL}/tiquetes/confirmacion/${reservaId}`);
          setConfirmacionData(response.data);
          setBookingCode(response.data.codigoReserva);
        } else {
          // Fallback si no hay reservaId
          const code = 'AF' + Math.random().toString(36).substr(2, 6).toUpperCase();
          setBookingCode(code);
        }
      } catch (error) {
        console.error('Error cargando confirmación:', error);
        // Fallback
        const code = 'AF' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setBookingCode(code);
      }
    };

    cargarConfirmacion();

    // Limpiar localStorage después de mostrar confirmación
    setTimeout(() => {
      localStorage.removeItem('selectedFlight');
      localStorage.removeItem('selectedSeats');
      localStorage.removeItem('searchPassengers');
      localStorage.removeItem('passengerRegistration');
      localStorage.removeItem('reservaId');
    }, 5000);
  }, [reservaId]);

  const handleDownloadPDF = async () => {
    try {
      if (confirmacionData?.tiquetes?.length > 0) {
        // Descargar PDF del primer tiquete
        const response = await axios.get(`${API_BASE_URL}/tiquetes/${confirmacionData.tiquetes[0].idTiquete}/pdf`, {
          responseType: 'blob'
        });

        // Crear enlace de descarga
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tiquete-${bookingCode}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al descargar el PDF. Inténtalo de nuevo.');
    }
  };

  const handleDownloadJSON = async () => {
    try {
      if (confirmacionData?.tiquetes?.length > 0) {
        // Descargar JSON del primer tiquete
        const response = await axios.get(`${API_BASE_URL}/tiquetes/${confirmacionData.tiquetes[0].idTiquete}/json`, {
          responseType: 'blob'
        });

        // Crear enlace de descarga
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tiquete-${bookingCode}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error descargando JSON:', error);
      alert('Error al descargar el JSON. Inténtalo de nuevo.');
    }
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
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Descargar PDF
            </button>

            <button
              onClick={handleDownloadJSON}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Descargar JSON
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