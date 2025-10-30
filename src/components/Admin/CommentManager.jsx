import { useState, useEffect } from 'react';
import api from '../../utils/api';

const CommentManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/comments');
      setComments(data);
    } catch (error) {
      console.error('Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.delete(`/comments/${id}`);
      loadComments();
      alert('Comentario eliminado correctamente');
    } catch (error) {
      alert('Error al eliminar el comentario');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <h2 className="text-2xl font-bold text-gray-800">Gestión de Comentarios</h2>

      <div className="card">
        <p className="text-gray-600 text-sm">
          Total de comentarios: <span className="font-bold">{comments.length}</span>
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Los comentarios solo pueden ser eliminados por el administrador. Los usuarios pueden editar sus propios comentarios.
        </p>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600">No hay comentarios registrados</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{comment.user.name}</h4>
                      <p className="text-sm text-gray-500">
                        {comment.user.email} • 🐾 {comment.user.petName}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">{formatDate(comment.createdAt)}</p>
                  
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.text}</p>

                  {comment.image && (
                    <img
                      src={comment.image}
                      alt="Comentario"
                      className="max-w-md h-auto rounded-lg"
                    />
                  )}
                </div>

                <button
                  onClick={() => handleDelete(comment._id)}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentManager;