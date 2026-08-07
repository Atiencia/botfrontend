import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  User, 
  Send, 
  ArrowLeft, 
  MessageSquare, 
  BarChart3, 
  BookOpen, 
  Users, 
  Clock, 
  Zap, 
  Settings, 
  PauseCircle, 
  Image as ImageIcon, 
  Plus, 
  Search, 
  MessageCircle,
  Activity,
  Phone
} from 'lucide-react';
import { Instagram } from '../components/icons/Instagram';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SimulatorPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  
  // Chat Bot Tab State
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: '¡Hola! Soy Eli, el asistente de IA. Pruébame escribiendo alguna pregunta, por ejemplo: "¿Qué servicios ofreces?"'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage } as ChatMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const API_URL = `${import.meta.env.VITE_API_URL}/simulate`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })) 
        })
      });

      if (!response.ok) throw new Error('Error al simular');
      
      const data = await response.json();
      
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: data.reply || data.response || 'No se recibió respuesta del servidor.' 
      }]);
    } catch (error) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Error de conexión. Asegúrate de que el backend esté corriendo y la URL sea correcta.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChatBot = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-gray-900/40">
        <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center relative">
          <Bot className="w-6 h-6 text-sky-400" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
        </div>
        <div>
          <h3 className="font-medium text-white">Eli Bot</h3>
          <p className="text-xs text-green-400">En línea</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-sky-600 text-white rounded-br-none' 
                : 'bg-gray-800 text-gray-200 border border-white/5 rounded-bl-none'
            }`}>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-gray-900/40">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje de prueba..."
            className="w-full bg-gray-950 border border-gray-800 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-sky-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderConversaciones = () => (
    <div className="flex h-full border border-white/10 rounded-xl overflow-hidden bg-gray-950/50">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-white/10 bg-gray-900/30 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-300 focus:outline-none focus:border-sky-500/50 pointer-events-none"
              readOnly
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Active User */}
          <div className="p-3 border-b border-white/5 bg-sky-900/20 cursor-pointer flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-white truncate flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" /> María García
                </h4>
                <span className="text-[10px] text-gray-500">2:41 p.m.</span>
              </div>
              <p className="text-xs text-sky-400 truncate mt-0.5">Sí, qué colores tienen?</p>
              <div className="mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] text-green-500 uppercase tracking-wider">Bot Activo</span>
              </div>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500"></div>
          </div>
          
          {/* Other Users */}
          <div className="p-3 border-b border-white/5 hover:bg-gray-800/30 cursor-pointer flex items-center gap-3 opacity-70">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-white truncate flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Carlos López
                </h4>
                <span className="text-[10px] text-gray-500">1:15 p.m.</span>
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">Necesito hablar con alguien</p>
              <div className="mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-[10px] text-amber-500 uppercase tracking-wider">Humano al mando</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-b border-white/5 hover:bg-gray-800/30 cursor-pointer flex items-center gap-3 opacity-70">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-white truncate flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-green-500" /> Ana Rodríguez
                </h4>
                <span className="text-[10px] text-gray-500">Ayer</span>
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">Gracias por la información</p>
              <div className="mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] text-green-500 uppercase tracking-wider">Bot Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Panel */}
      <div className="w-full md:w-2/3 flex flex-col relative">
        <div className="p-4 border-b border-white/10 bg-gray-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm flex items-center gap-2">
                Cliente: María García <Instagram className="w-4 h-4 text-pink-500" />
              </h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Última act: 2:41:58 p.m.
              </p>
            </div>
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg text-sm transition-colors border border-amber-500/20">
            <PauseCircle className="w-4 h-4" />
            Pausar Bot (Handoff)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0a0a0a]/50">
          {/* Msg 1 */}
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-4">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center gap-1 mb-1 ml-1 text-[11px] text-gray-500">
                <span className="font-medium">Cliente</span>
                <span>•</span>
                <span>2:35 p.m.</span>
              </div>
              <div className="bg-gray-800 border border-white/5 text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm">
                Hola, tienen polos oversize?
              </div>
            </div>
          </div>

          {/* Msg 2 */}
          <div className="flex gap-3 justify-end">
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center justify-end gap-1 mb-1 mr-1 text-[11px] text-gray-500">
                <span>2:35 p.m.</span>
                <span>•</span>
                <span className="font-medium text-sky-400">Eli</span>
              </div>
              <div className="bg-sky-900/40 border border-sky-500/20 text-sky-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm">
                ¡Hola María! Sí, tenemos polos oversize disponibles en tallas S, M, L y XL. ¿Te gustaría ver los colores disponibles?
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 mt-4">
              <Bot className="w-4 h-4 text-sky-400" />
            </div>
          </div>

          {/* Msg 3 */}
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-4">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center gap-1 mb-1 ml-1 text-[11px] text-gray-500">
                <span className="font-medium">Cliente</span>
                <span>•</span>
                <span>2:41 p.m.</span>
              </div>
              <div className="bg-gray-800 border border-white/5 text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm">
                Sí, qué colores tienen?
              </div>
            </div>
          </div>

          {/* Msg 4 */}
          <div className="flex gap-3 justify-end">
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center justify-end gap-1 mb-1 mr-1 text-[11px] text-gray-500">
                <span>2:41 p.m.</span>
                <span>•</span>
                <span className="font-medium text-sky-400">Eli</span>
              </div>
              <div className="bg-sky-900/40 border border-sky-500/20 text-sky-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm">
                ¡Genial! Tenemos en negro, blanco, beige y azul marino. Todos a S/. 45.00. ¿Cuál te interesa?
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 mt-4">
              <Bot className="w-4 h-4 text-sky-400" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-gray-900/50">
          <div className="flex items-center gap-2">
            <button disabled className="p-2 text-gray-500 hover:text-gray-400 transition-colors cursor-not-allowed hidden sm:block">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Escribe un mensaje para intervenir..."
              disabled
              className="flex-1 bg-gray-950 border border-gray-800 rounded-lg py-2.5 px-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none cursor-not-allowed"
            />
            <button disabled className="p-2 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full shadow-lg">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
          </p>
        </div>
      </div>
    </div>
  );

  const renderMetricas = () => {
    const chartData = [
      { day: 'Lun', received: 12, bot: 10 },
      { day: 'Mar', received: 18, bot: 16 },
      { day: 'Mié', received: 8, bot: 7 },
      { day: 'Jue', received: 25, bot: 22 },
      { day: 'Vie', received: 15, bot: 14 },
      { day: 'Sáb', received: 20, bot: 18 },
      { day: 'Dom', received: 10, bot: 9 },
    ];
    const maxVal = 25;

    return (
      <div className="space-y-4 h-full overflow-y-auto pr-2">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Métricas de Rendimiento</h2>
          <p className="text-sm text-gray-400">Resumen de la actividad del bot</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Clientes</p>
                <h3 className="text-2xl font-bold text-white">24</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Mensajes del Bot</p>
                <h3 className="text-2xl font-bold text-white">1,847</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tiempo Ahorrado (Aprox)</p>
                <h3 className="text-2xl font-bold text-white">61 horas</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-medium text-white">Actividad de los últimos 7 días</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-gray-400">Mensajes Recibidos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-gray-400">Respuestas del Bot</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between px-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="flex items-end gap-1 h-48">
                  {/* Received bar */}
                  <div className="w-4 sm:w-6 bg-indigo-500/80 hover:bg-indigo-400 rounded-t-sm transition-colors relative group" style={{ height: `${(d.received / maxVal) * 100}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded text-white whitespace-nowrap transition-opacity pointer-events-none z-10">
                      {d.received}
                    </div>
                  </div>
                  {/* Bot bar */}
                  <div className="w-4 sm:w-6 bg-emerald-500/80 hover:bg-emerald-400 rounded-t-sm transition-colors relative group" style={{ height: `${(d.bot / maxVal) * 100}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded text-white whitespace-nowrap transition-opacity pointer-events-none z-10">
                      {d.bot}
                    </div>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderConocimiento = () => (
    <div className="h-full overflow-y-auto pr-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Base de Conocimiento</h2>
          <p className="text-sm text-gray-400">Información que el bot usa para responder</p>
        </div>
        <button disabled className="flex items-center gap-2 bg-gray-800 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Precios y Productos', badge: 'Catálogo', desc: 'Lista de precios de polos, tallas disponibles y colores. Precios fijos a S/. 45.00.' },
          { title: 'Horarios de Atención', badge: 'General', desc: 'Lunes a Sábado de 9:00 am a 6:00 pm. Domingos no hay atención por canales humanos.' },
          { title: 'Políticas de Envío', badge: 'Logística', desc: 'Envíos a todo el país vía Olva Courier. Costo S/. 15.00 a provincia, S/. 10.00 en Lima.' },
          { title: 'Preguntas Frecuentes', badge: 'FAQ', desc: 'Tiempos de entrega, métodos de lavado, políticas de cambio y devoluciones (7 días).' }
        ].map((item, i) => (
          <div key={i} className="bg-gray-900/40 border border-white/5 rounded-xl p-5 hover:bg-gray-900/60 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-white">{item.title}</h3>
              <span className="bg-gray-800 text-gray-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfiguracion = () => (
    <div className="space-y-6 max-w-3xl mx-auto h-full overflow-y-auto pr-2">
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-lg flex gap-3 text-sm">
        <Activity className="w-5 h-5 shrink-0" />
        <p>Modo de Solo Lectura - Los campos están deshabilitados en la demo. En la aplicación real podrás modificar cómo se comporta tu bot en tiempo real.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">System Prompt</label>
          <textarea 
            disabled
            rows={5}
            className="w-full bg-gray-900/50 border border-white/10 rounded-lg p-3 text-sm text-gray-400 focus:outline-none resize-none cursor-not-allowed"
            value="Eres un asistente virtual amable y profesional para una tienda de ropa. Tu objetivo es ayudar a los clientes con información sobre polos oversize, tallas, colores y precios. Siempre responde en español."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Modelo AI</label>
            <select disabled className="w-full bg-gray-900/50 border border-white/10 rounded-lg p-2.5 text-sm text-gray-400 cursor-not-allowed appearance-none">
              <option>gpt-3.5-turbo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Temperatura</label>
            <input type="text" disabled value="0.7" className="w-full bg-gray-900/50 border border-white/10 rounded-lg p-2.5 text-sm text-gray-400 cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Token de Meta</label>
          <input type="password" disabled value="EAAGm0PX4ZCQoBO..." className="w-full bg-gray-900/50 border border-white/10 rounded-lg p-2.5 text-sm text-gray-400 cursor-not-allowed font-mono" />
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button disabled className="bg-sky-600/50 text-white/50 px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Floating CTA */}
      <Link to='/login' className='fixed bottom-6 right-6 z-50 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-xl shadow-sky-500/25 hover:-translate-y-1 transition-transform flex items-center gap-2 text-sm'>
        <Zap className='w-4 h-4' /> Crear cuenta gratis
      </Link>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8 md:pt-12 pb-20 md:pb-12 flex flex-col h-[100dvh]">
        
        {/* Header Area */}
        <div className="flex flex-col items-center justify-center gap-6 mb-8">
          <div className="w-full relative flex items-center justify-center">
            <Link to="/" className="absolute left-0 inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight text-center">
              Experiencia Demo
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-gray-900/60 p-1.5 rounded-full border border-white/5 backdrop-blur-sm overflow-x-auto w-full md:w-auto items-center justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { id: 'chat', label: 'Chat Bot', icon: MessageSquare },
              { id: 'conversaciones', label: 'Conversaciones', icon: Users },
              { id: 'metricas', label: 'Métricas', icon: BarChart3 },
              { id: 'conocimiento', label: 'Conocimiento', icon: BookOpen },
              { id: 'configuracion', label: 'Configuración', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-gray-800 text-white shadow-sm border border-white/10' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area - Glass Card */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex-1 flex flex-col min-h-0 overflow-hidden">
          {activeTab === 'chat' && renderChatBot()}
          {activeTab === 'conversaciones' && renderConversaciones()}
          {activeTab === 'metricas' && renderMetricas()}
          {activeTab === 'conocimiento' && renderConocimiento()}
          {activeTab === 'configuracion' && renderConfiguracion()}
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;
