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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          🐾 Bienvenido a Pet Spa
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Cuida a tu mascota con nuestros servicios profesionales
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          📅 Agendar Cita
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
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
        <div className="space-y-4 sm:space-y-6">
          <CommentForm onSuccess={handleCommentSuccess} />
          <CommentList refresh={refreshComments} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;