import { useState } from 'react';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl max-h-[90vh] overflow-y-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Términos y Condiciones
        </h2>

        <div className="space-y-4 text-gray-700 text-sm">
          <section>
            <h3 className="font-bold text-lg mb-2">1. Aceptación de Términos</h3>
            <p>
              Al registrarse en Pet Spa, usted acepta los siguientes términos y condiciones,
              así como las leyes aplicables en Colombia.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2">2. Ley 1774 de 2016 - Protección Animal</h3>
            <p className="mb-2">
              En cumplimiento de la Ley 1774 de 2016, por la cual se modifican el Código Civil,
              la Ley 84 de 1989, el Código Penal, el Código de Procedimiento Penal y se dictan
              otras disposiciones:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Los animales como seres sintientes no son cosas</li>
              <li>Recibirán especial protección contra el sufrimiento y el dolor</li>
              <li>El maltrato animal será sancionado según la ley</li>
              <li>Nos comprometemos al bienestar integral de su mascota</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2">3. Ley 1581 de 2012 - Protección de Datos</h3>
            <p className="mb-2">
              De conformidad con la Ley 1581 de 2012 de Protección de Datos Personales:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sus datos serán tratados de forma confidencial y segura</li>
              <li>Solo se usarán para la gestión de servicios del spa</li>
              <li>Tiene derecho a conocer, actualizar y rectificar sus datos</li>
              <li>Puede solicitar la supresión de sus datos en cualquier momento</li>
              <li>No compartiremos su información con terceros sin su consentimiento</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2">4. Uso del Servicio</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Debe proporcionar información veraz sobre usted y su mascota</li>
              <li>Es responsable de mantener la confidencialidad de su cuenta</li>
              <li>Puede cancelar citas con al menos 2 horas de anticipación</li>
              <li>Los comentarios deben ser respetuosos y apropiados</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2">5. Responsabilidades</h3>
            <p>
              Pet Spa se compromete a brindar servicios de calidad con personal capacitado,
              siguiendo protocolos de higiene y seguridad para el bienestar de las mascotas.
            </p>
          </section>
        </div>

        <div className="mt-6 flex items-start space-x-3">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-700">
            He leído y acepto los términos y condiciones, incluyendo la Ley 1774 de 2016
            sobre protección animal y la Ley 1581 de 2012 sobre protección de datos personales.
          </label>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`btn-primary ${!accepted && 'opacity-50 cursor-not-allowed'}`}
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;