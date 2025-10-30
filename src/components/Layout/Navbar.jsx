import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-3xl">🐾</span>
            <span className="text-xl font-bold text-primary-600">Pet Spa</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-gray-600">
                  Hola, <span className="font-semibold">{user.name}</span>
                </span>
                
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Panel Admin
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Inicio
                </Link>

                <Link
                  to="/my-appointments"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Mis Citas
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;