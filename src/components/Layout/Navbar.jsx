import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl">🐾</span>
            <span className="text-lg md:text-xl font-bold text-primary-600">Pet Spa</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <span className="text-gray-600 text-sm">
                  Hola, <span className="font-semibold">{user.name}</span>
                </span>
                
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Panel Admin
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Inicio
                </Link>

                <Link
                  to="/my-appointments"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Mis Citas
                </Link>

                <Link
                  to="/my-comments"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Mis Comentarios
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && user && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <span className="text-gray-600 text-sm px-2">
                Hola, <span className="font-semibold">{user.name}</span>
              </span>
              
              {user.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-primary-600 hover:bg-primary-50 px-2 py-2 rounded-lg font-medium text-sm"
                >
                  Panel Admin
                </Link>
              )}

              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded-lg text-sm"
              >
                Inicio
              </Link>

              <Link
                to="/my-appointments"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded-lg text-sm"
              >
                Mis Citas
              </Link>

              <Link
                to="/my-comments"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded-lg text-sm"
              >
                Mis Comentarios
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50 px-2 py-2 rounded-lg text-sm text-left font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;