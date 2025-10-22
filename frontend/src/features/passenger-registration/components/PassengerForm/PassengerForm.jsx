import { useState, useEffect } from 'react';

const PassengerForm = ({ pasajero, index, onUpdate }) => {
  const [formData, setFormData] = useState(pasajero);

  useEffect(() => {
    setFormData(pasajero);
  }, [pasajero]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };

    // Si cambia la fecha de nacimiento, recalcular si es infante
    if (field === 'fechaNacimiento') {
      const fechaNacimiento = new Date(value);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const esMenor3 = edad < 3 || (edad === 3 && hoy < new Date(fechaNacimiento.getFullYear() + 3, fechaNacimiento.getMonth(), fechaNacimiento.getDate()));

      newData.esInfante = esMenor3;
    }

    setFormData(newData);
    onUpdate(index, newData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Pasajero {index + 1}
          {formData.asientoAsignado && (
            <span className="ml-2 text-sm text-blue-600 font-normal">
              (Asiento {formData.asientoAsignado})
            </span>
          )}
        </h2>
        {formData.esInfante && (
          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
            Infante (menor de 3 años)
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Apellidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primer Apellido *
          </label>
          <input
            type="text"
            value={formData.primerApellido}
            onChange={(e) => handleChange('primerApellido', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el primer apellido"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Segundo Apellido *
          </label>
          <input
            type="text"
            value={formData.segundoApellido}
            onChange={(e) => handleChange('segundoApellido', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el segundo apellido"
            required
          />
        </div>

        {/* Nombres */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombres *
          </label>
          <input
            type="text"
            value={formData.nombres}
            onChange={(e) => handleChange('nombres', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese los nombres completos"
            required
          />
        </div>

        {/* Fecha de nacimiento y género */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Género *
          </label>
          <select
            value={formData.genero}
            onChange={(e) => handleChange('genero', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccione género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Tipo y número de documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Documento *
          </label>
          <select
            value={formData.tipoDocumento}
            onChange={(e) => handleChange('tipoDocumento', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccione tipo</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="RC">Registro Civil</option>
            <option value="PA">Pasaporte</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Documento *
          </label>
          <input
            type="text"
            value={formData.numeroDocumento}
            onChange={(e) => handleChange('numeroDocumento', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el número de documento"
            required
          />
        </div>

        {/* Contacto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Celular *
          </label>
          <input
            type="tel"
            value={formData.celular}
            onChange={(e) => handleChange('celular', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el número de celular"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico *
          </label>
          <input
            type="email"
            value={formData.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
      </div>

      {/* Información adicional para infantes */}
      {formData.esInfante && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>Nota:</strong> Este pasajero es considerado infante (menor de 3 años).
            Los infantes viajan sin costo adicional pero requieren acompañante adulto.
          </p>
        </div>
      )}
    </div>
  );
};

export default PassengerForm;