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
    console.log('Cargando confirmación para reservaId:', reservaId);
    console.log('Datos de location.state:', location.state);

    const cargarConfirmacion = async () => {
      try {
        if (reservaId) {
          console.log('Haciendo petición GET a:', `${API_BASE_URL}/tiquetes/confirmacion/${reservaId}`);
          // Obtener confirmación desde el backend
          const response = await axios.get(`${API_BASE_URL}/tiquetes/confirmacion/${reservaId}`);
          console.log('Respuesta de confirmación:', response.data);
          setConfirmacionData(response.data);
          setBookingCode(response.data.codigoReserva);
        } else {
          console.log('No hay reservaId, usando fallback');
          // Fallback si no hay reservaId
          const code = 'AF' + Math.random().toString(36).substr(2, 6).toUpperCase();
          setBookingCode(code);
        }
      } catch (error) {
        console.error('Error cargando confirmación:', error);
        console.error('Detalles del error:', error.response?.data);
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

  const handleDownloadPDFIda = async () => {
    try {
      if (confirmacionData?.tiquetes?.length > 0) {
        // Encontrar tiquete de ida - buscar por ruta BOG→MDE
        const tiqueteIda = confirmacionData.tiquetes.find(t =>
          t.vuelo.origen === 'BOGOTA' && t.vuelo.destino === 'MEDELLIN'
        );

        if (!tiqueteIda) {
          console.error('Tiquetes disponibles:', confirmacionData.tiquetes);
          alert('No se encontró tiquete de ida. Verifica que tengas una reserva de ida y vuelta.');
          return;
        }

        console.log('Descargando tiquete de ida:', tiqueteIda);

        const response = await axios.get(`${API_BASE_URL}/tiquetes/${tiqueteIda.idTiquete}/pdf`, {
          responseType: 'blob'
        });

        // Crear enlace de descarga
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tiquete-ida-${bookingCode}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error descargando PDF de ida:', error);
      alert('Error al descargar el PDF de ida. Inténtalo de nuevo.');
    }
  };

  const handleDownloadPDFVuelta = async () => {
    try {
      if (confirmacionData?.tiquetes?.length > 0) {
        // Encontrar tiquete de vuelta - buscar por ruta MDE→BOG
        const tiqueteVuelta = confirmacionData.tiquetes.find(t =>
          t.vuelo.origen === 'MEDELLIN' && t.vuelo.destino === 'BOGOTA'
        );

        if (!tiqueteVuelta) {
          console.error('Tiquetes disponibles:', confirmacionData.tiquetes);
          alert('No se encontró tiquete de vuelta. Verifica que tengas una reserva de ida y vuelta.');
          return;
        }

        console.log('Descargando tiquete de vuelta:', tiqueteVuelta);

        const response = await axios.get(`${API_BASE_URL}/tiquetes/${tiqueteVuelta.idTiquete}/pdf`, {
          responseType: 'blob'
        });

        // Crear enlace de descarga
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tiquete-vuelta-${bookingCode}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error descargando PDF de vuelta:', error);
      alert('Error al descargar el PDF de vuelta. Inténtalo de nuevo.');
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

          {/* Detalles de los tiquetes */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles de sus Tiquetes</h3>

            {confirmacionData?.tiquetes ? (
              // Agrupar tiquetes por vuelo (ida y vuelta)
              (() => {
                const tiquetesPorVuelo = {};
                confirmacionData.tiquetes.forEach(tiquete => {
                  const vueloId = tiquete.vuelo?.idVuelo;
                  if (!tiquetesPorVuelo[vueloId]) {
                    tiquetesPorVuelo[vueloId] = [];
                  }
                  tiquetesPorVuelo[vueloId].push(tiquete);
                });

                return Object.entries(tiquetesPorVuelo).map(([vueloId, tiquetesVuelo], vueloIndex) => (
                  <div key={vueloId} className="mb-6 last:mb-0">
                    <h4 className="text-lg font-semibold text-blue-600 mb-3">
                      {tiquetesVuelo[0]?.vuelo?.origen} → {tiquetesVuelo[0]?.vuelo?.destino}
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        ({vueloIndex === 0 ? 'IDA' : 'VUELTA'})
                      </span>
                    </h4>

                    <div className="bg-gray-50 rounded-lg p-4">
                      {/* Información del vuelo */}
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Fecha de Salida:</span>
                          <p className="text-sm text-gray-800">
                            {new Date(tiquetesVuelo[0]?.vuelo?.fechaSalida).toLocaleDateString('es-CO', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(tiquetesVuelo[0]?.vuelo?.fechaSalida).toLocaleTimeString('es-CO', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-600">Fecha de Llegada:</span>
                          <p className="text-sm text-gray-800">
                            {new Date(tiquetesVuelo[0]?.vuelo?.fechaLlegada).toLocaleDateString('es-CO', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(tiquetesVuelo[0]?.vuelo?.fechaLlegada).toLocaleTimeString('es-CO', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-600">Precio por Persona:</span>
                          <p className="text-lg font-bold text-green-600">
                            ${tiquetesVuelo[0]?.vuelo?.precio?.toLocaleString('es-CO')}
                          </p>
                        </div>
                      </div>

                      {/* Lista de pasajeros para este vuelo */}
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Pasajeros:</h5>
                        <div className="space-y-2">
                          {tiquetesVuelo.map((tiquete, index) => (
                            <div key={tiquete.idTiquete} className="flex justify-between items-center bg-white p-3 rounded border">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                  {tiquete.pasajero?.nombres} {tiquete.pasajero?.primerApellido}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Documento: {tiquete.pasajero?.numeroDocumento}
                                </p>
                                {tiquete.asientoVuelo && (
                                  <p className="text-sm text-gray-600">
                                    Asiento: {tiquete.asientoVuelo.asiento?.nombre}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Precio</p>
                                <p className="font-bold text-green-600">
                                  ${tiquete.pago?.valorAPagar?.toLocaleString('es-CO')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })()
            ) : (
              // Fallback si no hay datos de confirmación
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
            )}
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
              onClick={handleDownloadPDFVuelta}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Descargar Tiquete Ida y Vuelta
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