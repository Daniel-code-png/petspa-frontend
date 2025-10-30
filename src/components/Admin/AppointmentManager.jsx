import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatDateDisplay } from '../../utils/dateHelpers';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/appointments');
      setAppointments(data);
    } catch (error) {
      console.error('Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}`, { status: newStatus });
      loadAppointments();
      alert('Estado actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar el estado');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Confirmada': 'bg-blue-100 text-blue-800',
      'Completada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Gestión de Citas</h2>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('Pendiente')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'Pendiente'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pendientes ({appointments.filter((a) => a.status === 'Pendiente').length})
          </button>
          <button
            onClick={() => setFilter('Confirmada')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'Confirmada'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Confirmadas ({appointments.filter((a) => a.status === 'Confirmada').length})
          </button>
          <button
            onClick={() => setFilter('Completada')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'Completada'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completadas ({appointments.filter((a) => a.status === 'Completada').length})
          </button>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600">No hay citas con este filtro</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {appointment.service.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cliente:</p>
                      <p className="font-semibold text-gray-800">{appointment.user.name}</p>
                      <p className="text-sm text-gray-600">{appointment.user.email}</p>
                      <p className="text-sm text-gray-600">{appointment.user.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mascota:</p>
                      <p className="font-semibold text-gray-800">{appointment.user.petName}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.user.petType} - {appointment.user.petBreed}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span>📅</span>
                      <span className="capitalize">{formatDateDisplay(appointment.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🕐</span>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>{appointment.service.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>💰</span>
                      <span>${appointment.service.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {appointment.status !== 'Cancelada' && appointment.status !== 'Completada' && (
                  <div className="flex flex-col space-y-2 ml-4">
                    {appointment.status === 'Pendiente' && (
                      <button
                        onClick={() => updateStatus(appointment._id, 'Confirmada')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
                      >
                        Confirmar
                      </button>
                    )}
                    {appointment.status === 'Confirmada' && (
                      <button
                        onClick={() => updateStatus(appointment._id, 'Completada')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm whitespace-nowrap"
                      >
                        Completar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentManager;