import { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';

const PaymentForm = ({ selectedSeats, passengers, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('pse');
  const [formData, setFormData] = useState({
    // Datos para PSE
    bank: '',
    accountType: '',
    // Datos para tarjeta de crédito/débito
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    // Datos comunes
    email: '',
    phone: '',
    acceptTerms: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular total
  const basePrice = 350000; // Precio base por asiento
  const total = selectedSeats?.length * basePrice || 0;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'cardNumber') {
      // Formatear número de tarjeta con espacios cada 4 dígitos
      const formattedValue = value
        .replace(/\s/g, '') // Remover espacios existentes
        .replace(/(\d{4})(?=\d)/g, '$1 ') // Agregar espacio cada 4 dígitos
        .slice(0, 19); // Limitar a 19 caracteres (16 dígitos + 3 espacios)

      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    setIsProcessing(true);

    try {
      // Construir objeto de pago con datos reales
      const paymentData = {
        metodoPago: paymentMethod === 'pse' ? 'PSE' : 'TARJETA_CREDITO',
        nombrePagador: passengers?.[0]?.nombres + ' ' + passengers?.[0]?.primerApellido || formData.cardholderName || '',
        tipoDocumentoPagador: passengers?.[0]?.tipoDocumento || '',
        numeroDocumentoPagador: passengers?.[0]?.numeroDocumento || '',
        correoPagador: formData.email,
        telefonoPagador: formData.phone,
        terminosAceptados: formData.acceptTerms
      };

      // Pasar los datos al callback para que PaymentPage los envíe al backend
      await onPaymentSuccess(paymentData);
    } catch (error) {
      alert('Error en el procesamiento del pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = () => {
    if (!formData.acceptTerms) return false;

    if (paymentMethod === 'pse') {
      return formData.bank && formData.accountType && formData.email && formData.phone;
    } else {
      return formData.cardNumber && formData.expiryDate && formData.cvv &&
             formData.cardholderName && formData.email && formData.phone;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen de la reserva */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Resumen de tu reserva</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Asientos seleccionados:</span>
            <span>{selectedSeats?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Pasajeros:</span>
            <span>{passengers?.length || 0}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total a pagar:</span>
            <span>${total.toLocaleString('es-CO')}</span>
          </div>
        </div>
      </div>

      {/* Selector de método de pago */}
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={setPaymentMethod}
      />

      {/* Formulario de pago */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {paymentMethod === 'pse' ? (
          // Formulario PSE
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco *
              </label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona tu banco</option>
                <option value="bancolombia">Bancolombia</option>
                <option value="davivienda">Davivienda</option>
                <option value="bogota">Banco de Bogotá</option>
                <option value="occidente">Banco de Occidente</option>
                <option value="popular">Banco Popular</option>
                <option value="bbva">BBVA</option>
                <option value="colpatria">Colpatria</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de cuenta *
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona el tipo de cuenta</option>
                <option value="ahorros">Cuenta de ahorros</option>
                <option value="corriente">Cuenta corriente</option>
              </select>
            </div>
          </div>
        ) : (
          // Formulario Tarjeta
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="19"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de expiración *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/AA"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength="5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del titular *
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="Como aparece en la tarjeta"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        {/* Datos de contacto */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="300 123 4567"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label className="text-sm text-gray-700">
            Acepto los <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a> y
            la <a href="#" className="text-blue-600 hover:underline">política de privacidad</a>
          </label>
        </div>

        {/* Botón de pago */}
        <button
          type="submit"
          disabled={!isFormValid() || isProcessing}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
            isFormValid() && !isProcessing
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Procesando pago...
            </div>
          ) : (
            `Pagar $${total.toLocaleString('es-CO')}`
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;