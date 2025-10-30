import { useState, useEffect } from 'react';
import api from '../../utils/api';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: 30,
    isActive: true
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/services');
      setServices(data);
    } catch (error) {
      console.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: 30,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      isActive: service.isActive
    });
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData);
        alert('Servicio actualizado exitosamente');
      } else {
        await api.post('/services', formData);
        alert('Servicio creado exitosamente');
      }
      resetForm();
      loadServices();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar el servicio');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) {
      return;
    }

    try {
      await api.delete(`/services/${id}`);
      alert('Servicio eliminado exitosamente');
      loadServices();
    } catch (error) {
      alert('Error al eliminar el servicio');
    }
  };

  const toggleStatus = async (service) => {
    try {
      await api.put(`/services/${service._id}`, {
        ...service,
        isActive: !service.isActive
      });
      loadServices();
    } catch (error) {
      alert('Error al cambiar el estado del servicio');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Servicios</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Servicio'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Servicio
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
                placeholder="Ej: Baño Completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="3"
                className="input-field resize-none"
                placeholder="Describe el servicio..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (COP)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  className="input-field"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="input-field"
                >
                  <option value="30">30 minutos</option>
                  <option value="60">60 minutos</option>
                  <option value="90">90 minutos</option>
                  <option value="120">120 minutos</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Servicio activo
              </label>
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Actualizar' : 'Crear'} Servicio
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service._id} className="card">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {service.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3">{service.description}</p>

            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-600">Precio:</span>
              <span className="font-bold text-primary-600">${service.price.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-600">Duración:</span>
              <span className="font-bold text-gray-800">{service.duration} min</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(service)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => toggleStatus(service)}
                className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              >
                {service.isActive ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🛁</div>
          <p className="text-gray-600">No hay servicios registrados</p>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;