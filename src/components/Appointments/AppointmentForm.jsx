import { useState, useEffect } from 'react';
import api from '../../utils/api';

const AppointmentForm = ({ onSuccess }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar servicios al montar el componente
  useEffect(() => {
    loadServices();
  }, []);

  // Cargar horarios disponibles cuando cambia la fecha
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch (error) {
      setError('Error al cargar los servicios');
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const { data } = await api.get(`/appointments/available/${selectedDate}`);
      setAvailableSlots(data.availableSlots);
      setBookedSlots(data.bookedSlots);
      setSelectedTime('');
    } catch (error) {
      setError('Error al cargar horarios disponibles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validar que la fecha no sea en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(selectedDate);
    
    if (appointmentDate < today) {
      setError('No puedes agendar citas en fechas pasadas');
      return;
    }

    setLoading(true);

    try {
      await api.post('/appointments', {
        service: selectedService,
        date: selectedDate,
        time: selectedTime
      });

      setSuccess('¡Cita agendada exitosamente!');
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
      setAvailableSlots([]);
      
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Obtener fecha máxima (3 meses adelante)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Agendar Nueva Cita</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Servicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicio
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Selecciona un servicio</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - ${service.price.toLocaleString()} ({service.duration} min)
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar detalles del servicio seleccionado */}
        {selectedService && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            {services
              .filter((s) => s._id === selectedService)
              .map((service) => (
                <div key={service._id}>
                  <h3 className="font-semibold text-primary-800">{service.name}</h3>
                  <p className="text-sm text-primary-700 mt-1">{service.description}</p>
                  <div className="flex justify-between mt-2 text-sm text-primary-800">
                    <span>Precio: ${service.price.toLocaleString()}</span>
                    <span>Duración: {service.duration} minutos</span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Selección de Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            required
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">
            Horario de atención: 10:00 AM - 6:00 PM
          </p>
        </div>

        {/* Selección de Hora */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario
            </label>
            
            {availableSlots.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                No hay horarios disponibles para esta fecha
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedTime === slot
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {bookedSlots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Horarios ocupados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bookedSlots.map((slot) => (
                        <span
                          key={slot}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedService || !selectedDate || !selectedTime}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Agendando...' : 'Agendar Cita'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;