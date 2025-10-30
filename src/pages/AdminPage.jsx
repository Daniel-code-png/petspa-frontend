import { useState } from 'react';
import Dashboard from '../components/Admin/Dashboard';
import ServiceManager from '../components/Admin/ServiceManager';
import AppointmentManager from '../components/Admin/AppointmentManager';
import CommentManager from '../components/Admin/CommentManager';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', component: Dashboard },
    { id: 'appointments', label: '📅 Citas', component: AppointmentManager },
    { id: 'services', label: '🛁 Servicios', component: ServiceManager },
    { id: 'comments', label: '💬 Comentarios', component: CommentManager }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona tu spa de mascotas</p>
      </div>

      {/* Tabs de navegación */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <ActiveComponent />
    </div>
  );
};

export default AdminPage;