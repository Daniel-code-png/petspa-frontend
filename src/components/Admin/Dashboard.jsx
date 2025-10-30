import { useState, useEffect } from 'react';
import api from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <p className="text-red-600">Error al cargar las estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard Administrativo</h2>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-lg font-semibold mb-1">Usuarios</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="text-lg font-semibold mb-1">Citas Totales</h3>
          <p className="text-3xl font-bold">{stats.totalAppointments}</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-3xl mb-2">🛁</div>
          <h3 className="text-lg font-semibold mb-1">Servicios</h3>
          <p className="text-3xl font-bold">{stats.totalServices}</p>
        </div>

        <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="text-lg font-semibold mb-1">Comentarios</h3>
          <p className="text-3xl font-bold">{stats.totalComments}</p>
        </div>
      </div>

      {/* Estadísticas del Mes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Este Mes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Citas Agendadas:</span>
              <span className="text-2xl font-bold text-primary-600">
                {stats.appointmentsThisMonth}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ingresos Estimados:</span>
              <span className="text-2xl font-bold text-green-600">
                ${stats.monthlyRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Citas por Estado</h3>
          <div className="space-y-2">
            {stats.appointmentsByStatus.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-600">{item._id}:</span>
                <span className="font-bold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Servicios Más Populares */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Servicios Más Solicitados</h3>
        <div className="space-y-3">
          {stats.popularServices.map((item, index) => (
            <div key={item._id._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-primary-600">#{index + 1}</span>
                <div>
                  <p className="font-semibold text-gray-800">{item._id.name}</p>
                  <p className="text-sm text-gray-600">${item._id.price.toLocaleString()}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-800">{item.count} citas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;