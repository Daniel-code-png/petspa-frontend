import { useState } from 'react';
import api from '../../utils/api';

const CommentForm = ({ onSuccess }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    setError('');

    // Convertir a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage({
        data: reader.result,
        type: file.type
      });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    setLoading(true);

    try {
      await api.post('/comments', {
        text: text.trim(),
        image: image?.data || null,
        imageType: image?.type || null
      });

      setText('');
      setImage(null);
      setImagePreview(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al publicar el comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Comparte tu Experiencia</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cuéntanos sobre tu experiencia en nuestro spa o comparte fotos de tu mascota..."
            rows="4"
            maxLength="1000"
            className="input-field resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {text.length}/1000 caracteres
          </div>
        </div>

        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <span className="text-2xl">📷</span>
            <span className="text-sm font-medium text-gray-700">Agregar Foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;