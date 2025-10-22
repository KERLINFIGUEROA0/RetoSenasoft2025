import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../layout/Header/Header';
import PaymentForm from '../features/payment/components/PaymentForm/PaymentForm';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats, passengers } = location.state || {};

  const handlePaymentSuccess = () => {
    // Aquí iría la lógica para procesar el pago
    navigate('/confirmation', {
      state: { selectedSeats, passengers }
    });
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