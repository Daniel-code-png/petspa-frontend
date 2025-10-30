import { useState } from 'react';
import AppointmentForm from '../components/Appointments/AppointmentForm';
import CommentForm from '../components/Community/CommentForm';
import CommentList from '../components/Community/CommentList';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [refreshComments, setRefreshComments] = useState(0);

  const handleCommentSuccess = () => {
    setRefreshComments(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🐾 Bienvenido a Pet Spa</h1>
        <p className="text-gray-600">Cuida a tu mascota con nuestros servicios profesionales</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'appointments'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          📅 Agendar Cita
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'community'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          💬 Comunidad
        </button>
      </div>

      {/* Contenido */}
      {activeTab === 'appointments' ? (
        <AppointmentForm />
      ) : (
        <div className="space-y-6">
          <CommentForm onSuccess={handleCommentSuccess} />
          <CommentList refresh={refreshComments} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;