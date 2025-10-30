import { useState, useEffect } from 'react';
import api from '../../utils/api';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    service: ''
  });
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    loadAppointments();
    loadServices();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch (error) {
      setError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch (error) {
      console.error('Error al cargar servicios');
    }
  };

  const loadAvailableSlotsForEdit = async (date, currentTime) => {
    try {
      const { data } = await api.get(`/appointments/available/${date}`);
      // Incluir el horario actual de la cita como disponible
      const slots = [...data.availableSlots, currentTime].sort();
      setAvailableSlots([...new Set(slots)]);
    } catch (error) {
      console.error('Error al cargar horarios');
    }
  };

  const handleEdit = (appointment) => {
    const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
    setEditingId(appointment._id);
    setEditForm({
      date: appointmentDate,
      time: appointment.time,
      service: appointment.service._id
    });
    loadAvailableSlotsForEdit(appointmentDate, appointment.time);
  };

  const handleEditDateChange = (date) => {
    setEditForm(prev => ({ ...prev, date, time: '' }));
    loadAvailableSlotsForEdit(date, '');
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/appointments/${id}`, editForm);
      setEditingId(null);
      loadAppointments();
      alert('Cita actualizada exitosamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al actualizar la cita');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta cita?')) {
      return;
    }

    try {
      await api.delete(`/appointments/${id}`);
      loadAppointments();
      alert('Cita cancelada exitosamente');
    } catch (error) {
      alert('Error al cancelar la cita');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Citas</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-600">No tienes citas agendadas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingId === appointment._id ? (
                // Modo edición
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Servicio
                    </label>
                    <select
                      value={editForm.service}
                      onChange={(e) => setEditForm(prev => ({ ...prev, service: e.target.value }))}
                      className="input-field"
                    >
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} - ${service.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => handleEditDateChange(e.target.value)}
                      min={getMinDate()}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horario
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, time: slot }))}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            editForm.time === slot
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(appointment._id)}
                      className="btn-primary"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {appointment.service.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      {appointment.service.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span className="capitalize">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>🕐</span>
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>💰</span>
                        <span>${appointment.service.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {appointment.status !== 'Cancelada' && appointment.status !== 'Completada' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;