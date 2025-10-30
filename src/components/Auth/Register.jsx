import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TermsModal from '../TermsModal';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    petName: '',
    petType: 'Perro',
    petBreed: '',
    termsAccepted: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTermsAccept = () => {
    setFormData(prev => ({ ...prev, termsAccepted: true }));
    setShowTerms(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold text-gray-800">Pet Spa</h1>
          <p className="text-gray-600 mt-2">Crea tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="300 123 4567"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Información de tu Mascota</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Mascota
                </label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Firulais"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raza
                  </label>
                  <input
                    type="text"
                    name="petBreed"
                    value={formData.petBreed}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Mestizo"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-4">
            <input
              type="checkbox"
              id="terms"
              checked={formData.termsAccepted}
              onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Acepto los{' '}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                términos y condiciones
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleTermsAccept}
      />
    </div>
  );
};

export default Register;