import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardPage from './pages/DashboardPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <MyAppointmentsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Navbar />
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;