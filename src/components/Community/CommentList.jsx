import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CommentList = ({ refresh }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    loadComments();
  }, [refresh]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/comments');
      setComments(data);
    } catch (error) {
      console.error('Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
    setEditImagePreview(comment.image || null);
    setEditImage(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImage({
        data: reader.result,
        type: file.type
      });
      setEditImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeEditImage = () => {
    setEditImage({ data: null, type: null });
    setEditImagePreview(null);
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/comments/${id}`, {
        text: editText,
        image: editImage?.data !== undefined ? editImage.data : undefined,
        imageType: editImage?.type !== undefined ? editImage.type : undefined
      });
      setEditingId(null);
      loadComments();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al actualizar el comentario');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) {
      return;
    }

    try {
      await api.delete(`/comments/${id}`);
      loadComments();
    } catch (error) {
      alert('Error al eliminar el comentario');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
    <div className="space-y-4">
      {comments.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-600">Aún no hay comentarios. ¡Sé el primero en compartir!</p>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="card">
            {editingId === comment._id ? (
              // Modo edición
              <div className="space-y-4">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows="4"
                  maxLength="1000"
                  className="input-field resize-none"
                />

                {editImagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeEditImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    📷 Cambiar Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => handleUpdate(comment._id)}
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
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {comment.user.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        🐾 {comment.user.petName} • {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {(user._id === comment.user._id || user.isAdmin) && (
                    <div className="flex space-x-2">
                      {user._id === comment.user._id && (
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.text}</p>

                {comment.image && (
                  <img
                    src={comment.image}
                    alt="Comentario"
                    className="max-w-full h-auto rounded-lg"
                  />
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;