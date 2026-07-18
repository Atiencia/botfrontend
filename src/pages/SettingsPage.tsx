import { useState, useEffect } from 'react';
import { Key, Bot, Save, Loader2, Link2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = `${import.meta.env.VITE_API_URL}/bot-config`;

export default function SettingsPage() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [config, setConfig] = useState({
    system_prompt: '',
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    meta_access_token: '',
    meta_verify_token: '',
    is_active: true
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });

  useEffect(() => {
    if (session?.access_token) {
      fetchConfig();
    }
  }, [session]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, getHeaders());
      setConfig({
        system_prompt: res.data.system_prompt || '',
        model: res.data.model || 'llama-3.1-8b-instant',
        temperature: res.data.temperature ?? 0.7,
        meta_access_token: res.data.meta_access_token || '',
        meta_verify_token: res.data.meta_verify_token || '',
        is_active: res.data.is_active ?? true
      });
    } catch (error) {
      console.error('Error fetching config', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      await axios.post(API_URL, config, getHeaders());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving config', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Configuración</h2>
          <p className="text-gray-400">Personaliza a Eli y conéctalo con tu página de Meta.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/30 font-medium disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Configuración guardada exitosamente.</span>
        </div>
      )}

      <div className="space-y-6">
        
        {/* Core Bot Setup */}
        <div className="glass rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Comportamiento Base</h3>
                <p className="text-gray-400 text-sm">Define la personalidad y modelo de Eli.</p>
              </div>
            </div>
            
            {/* Activar/Desactivar Bot */}
            <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800">
              <span className="text-sm font-medium text-gray-300">Estado del Bot:</span>
              <button
                onClick={() => setConfig({...config, is_active: !config.is_active})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.is_active ? 'bg-indigo-500' : 'bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-bold ${config.is_active ? 'text-indigo-400' : 'text-gray-500'}`}>
                {config.is_active ? 'ACTIVO' : 'PAUSADO'}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">System Prompt (Instrucción Base)</label>
              <textarea
                value={config.system_prompt}
                onChange={(e) => setConfig({...config, system_prompt: e.target.value})}
                rows={4}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                placeholder="Eres un asistente amigable especializado en ventas de cruceros..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Modelo de Groq</label>
                <input
                  type="text"
                  value={config.model}
                  onChange={(e) => setConfig({...config, model: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Temperatura ({config.temperature})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                  className="w-full mt-3 accent-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">0 = Preciso y literal. 1 = Creativo y variado.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Integration Section */}
        <div className="glass rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Conexión con Meta Webhooks</h3>
              <p className="text-gray-400 text-sm">Claves para enlazar directamente con Instagram / Messenger</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Meta Access Token (Page Token)</label>
              <div className="relative">
                <input
                  type="password"
                  value={config.meta_access_token}
                  onChange={(e) => setConfig({...config, meta_access_token: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                  placeholder="EAAB..."
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center">
                <Key className="w-3 h-3 mr-1" />
                Lo obtienes en el panel de Meta for Developers.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Verify Token (Para el Webhook)</label>
              <div className="relative">
                <input
                  type="text"
                  value={config.meta_verify_token}
                  onChange={(e) => setConfig({...config, meta_verify_token: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                  placeholder="ej. mi_palabra_secreta_123"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Invéntalo tú y cópialo exactamente igual en la configuración del Webhook en Meta.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
