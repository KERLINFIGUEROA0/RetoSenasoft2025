import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../layout/Header/Header';
import PaymentForm from '../features/payment/components/PaymentForm/PaymentForm';
import { API_BASE_URL } from '../utils/constants';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats, passengers, reservaId } = location.state || {};

  const handlePaymentSuccess = async () => {
    try {
      // Obtener reservaId del localStorage si no viene en state
      const idReserva = reservaId || localStorage.getItem('reservaId');

      if (!idReserva) {
        alert('Error: No se encontró la reserva. Inténtalo de nuevo.');
        return;
      }

      // Preparar datos del pago
      const paymentData = {
        idReserva: parseInt(idReserva),
        metodoPago: 'TARJETA_CREDITO', // Por defecto, se puede cambiar según el formulario
        nombrePagador: 'Usuario de Prueba', // Esto debería venir del formulario
        tipoDocumentoPagador: 'CC',
        numeroDocumentoPagador: '123456789',
        correoPagador: 'usuario@email.com',
        telefonoPagador: '3001234567',
        aceptaTerminos: true
      };

      // Enviar pago al backend
      const response = await axios.post(`${API_BASE_URL}/pagos/simular`, paymentData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      });

      if (response.data.exitoso) {
        // Generar tiquetes después del pago exitoso
        const tiquetesResponse = await axios.post(`${API_BASE_URL}/tiquetes/generar`, {
          idReserva: parseInt(idReserva)
        });

        // Navegar a confirmación con datos completos
        navigate('/confirmation', {
          state: {
            selectedSeats,
            passengers,
            reservaId: idReserva,
            tiquetes: tiquetesResponse.data,
            pago: response.data
          }
        });
      } else {
        alert('Error en el pago: ' + response.data.mensaje);
      }
    } catch (error) {
      console.error('Error en el pago:', error);
      alert('Error al procesar el pago. Inténtalo de nuevo.');
    }
  };

  const handleBack = () => {
    navigate('/passengers', {
      state: { selectedSeats, passengers }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
              >
                ← Volver al registro de pasajeros
              </button>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Información de Pago
              </h1>
              <p className="text-gray-600">
                Completa los datos de pago para finalizar tu reserva
              </p>
            </div>

            <PaymentForm
              selectedSeats={selectedSeats}
              passengers={passengers}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;