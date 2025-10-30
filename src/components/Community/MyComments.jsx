import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const MyComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    loadMyComments();
  }, []);

  const loadMyComments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/comments');
      // Filtrar solo los comentarios del usuario actual
      const myComments = data.filter(comment => comment.user._id === user._id);
      setComments(myComments);
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
    if (!editText.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    try {
      await api.put(`/comments/${id}`, {
        text: editText,
        image: editImage?.data !== undefined ? editImage.data : undefined,
        imageType: editImage?.type !== undefined ? editImage.type : undefined
      });
      setEditingId(null);
      loadMyComments();
      alert('Comentario actualizado exitosamente');
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
      loadMyComments();
      alert('Comentario eliminado correctamente');
    } catch (error) {
      alert('Error al eliminar el comentario');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditImage(null);
    setEditImagePreview(null);
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
    <div className="card">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Mis Comentarios</h2>

      {comments.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <div className="text-4xl md:text-6xl mb-4">💬</div>
          <p className="text-gray-600 text-sm md:text-base">Aún no has publicado comentarios</p>
          <p className="text-gray-500 text-xs md:text-sm mt-2">
            Ve a la comunidad para compartir tu experiencia
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              📊 Total de comentarios: <span className="font-bold">{comments.length}</span>
            </p>
          </div>

          {comments.map((comment) => (
            <div key={comment._id} className="border border-gray-200 rounded-lg p-3 md:p-4">
              {editingId === comment._id ? (
                // Modo edición
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Editar comentario
                    </label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows="4"
                      maxLength="1000"
                      className="input-field resize-none"
                      placeholder="Escribe tu comentario..."
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {editText.length}/1000 caracteres
                    </div>
                  </div>

                  {editImagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={editImagePreview}
                        alt="Preview"
                        className="max-w-full h-32 md:h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeEditImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 md:p-2 hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="cursor-pointer px-3 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs md:text-sm text-center">
                      📷 {editImagePreview ? 'Cambiar' : 'Agregar'} Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => handleUpdate(comment._id)}
                      className="btn-primary text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn-secondary text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                      {comment.createdAt !== comment.updatedAt && (
                        <p className="text-xs text-gray-400 italic">Editado</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 whitespace-pre-wrap text-sm md:text-base">
                    {comment.text}
                  </p>

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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComments;