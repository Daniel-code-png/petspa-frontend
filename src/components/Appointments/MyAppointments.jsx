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
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Mis Citas</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <div className="text-4xl md:text-6xl mb-4">📅</div>
          <p className="text-gray-600 text-sm md:text-base">No tienes citas agendadas</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
            >
              {editingId === appointment._id ? (
                // Modo edición
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Servicio
                    </label>
                    <select
                      value={editForm.service}
                      onChange={(e) => setEditForm(prev => ({ ...prev, service: e.target.value }))}
                      className="input-field text-sm"
                    >
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} - ${service.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => handleEditDateChange(e.target.value)}
                      min={getMinDate()}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Horario
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, time: slot }))}
                          className={`px-2 py-2 text-xs md:text-sm rounded-lg border-2 transition-all ${
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

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleUpdate(appointment._id)}
                      className="btn-primary w-full sm:w-auto text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn-secondary w-full sm:w-auto text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">
                          {appointment.service.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>

                      <p className="text-gray-600 text-xs md:text-sm mb-3">
                        {appointment.service.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span className="capitalize truncate">{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🕐</span>
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💰</span>
                          <span>${appointment.service.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{appointment.service.duration} min</span>
                        </div>
                      </div>
                    </div>

                    {appointment.status !== 'Cancelada' && appointment.status !== 'Completada' && (
                      <div className="flex flex-row sm:flex-col gap-2">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs md:text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
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