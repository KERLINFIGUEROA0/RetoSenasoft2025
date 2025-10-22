const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Método de pago</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción PSE */}
        <div
          onClick={() => onMethodChange('pse')}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === 'pse'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'pse' ? 'border-blue-500' : 'border-gray-300'
            }`}>
              {selectedMethod === 'pse' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">PSE</div>
              <div className="text-sm text-gray-600">Pago seguro en línea</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Transfiere desde tu cuenta bancaria de forma segura
          </div>
        </div>

        {/* Opción Tarjeta de Crédito/Débito */}
        <div
          onClick={() => onMethodChange('card')}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === 'card'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'card' ? 'border-blue-500' : 'border-gray-300'
            }`}>
              {selectedMethod === 'card' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">Tarjeta de Crédito/Débito</div>
              <div className="text-sm text-gray-600">Visa, MasterCard, American Express</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Paga con tu tarjeta de forma rápida y segura
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-blue-700">
            <p className="font-medium">Pago seguro garantizado</p>
            <p className="mt-1">
              Tus datos están protegidos con encriptación SSL de 256 bits.
              No almacenamos información de tarjetas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;