import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface KnowledgeItem {
  id: string;
  category: string;
  content: string;
  created_at: string;
}

const API_URL = 'http://localhost:3000/api/knowledge';

export default function KnowledgePage() {
  const { session } = useAuth();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ category: '', content: '' });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });

  useEffect(() => {
    if (session?.access_token) {
      fetchKnowledge();
    }
  }, [session]);

  const fetchKnowledge = async () => {
    try {
      const res = await axios.get(API_URL, getHeaders());
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching knowledge', error);
    }
  };

  const openModal = (item?: KnowledgeItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ category: item.category, content: item.content });
    } else {
      setEditingId(null);
      setFormData({ category: '', content: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, getHeaders());
      } else {
        await axios.post(API_URL, formData, getHeaders());
      }
      fetchKnowledge();
      closeModal();
    } catch (error) {
      console.error('Error saving knowledge', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este conocimiento?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, getHeaders());
      fetchKnowledge();
    } catch (error) {
      console.error('Error deleting knowledge', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Base de Conocimiento</h2>
          <p className="text-gray-400">Administra la información que Eli utilizará para responder.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Conocimiento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="glass rounded-2xl p-6 transition-all duration-300 hover:border-gray-600 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/30">
                {item.category}
              </span>
              <div className="flex space-x-2">
                <button onClick={() => openModal(item)} className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-6">
              {item.content}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
              Creado: {new Date(item.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500 glass rounded-2xl border-dashed">
            No hay información en la base de conocimiento. Agrega algo para que Eli pueda aprender.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass bg-gray-900/90 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Editar Conocimiento' : 'Nuevo Conocimiento'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="ej. Precios, Horarios, FAQ"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Contenido / Información</label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe aquí toda la información detallada que Eli debe saber sobre este tema..."
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/30 font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
