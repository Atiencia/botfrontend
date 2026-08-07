import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, User, Send, ArrowLeft, MessageSquare, BarChart3, 
  BookOpen, Users, Clock, Zap, Settings, PauseCircle, 
  Image as ImageIcon, Plus, Search 
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type TabType = 'chat' | 'conversations' | 'dashboard' | 'knowledge' | 'settings';

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  
  // Chat Bot State
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy Eli, la asistente virtual. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/simulate`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    const newMessages = [...messages, { role: 'user', content: userMessage } as Message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con la API');
      }

      const data = await response.json();
      
      setMessages([...newMessages, { role: 'assistant', content: data.reply || data.response || 'Hubo un error al procesar la respuesta.' }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: 'Lo siento, ha ocurrido un error al conectar con el servidor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'chat', label: 'Chat Bot', icon: MessageSquare },
    { id: 'conversations', label: 'Conversaciones', icon: Users },
    { id: 'dashboard', label: 'Panel', icon: BarChart3 },
    { id: 'knowledge', label: 'Conocimiento', icon: BookOpen },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-3 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 shadow-lg shadow-sky-900/20 z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
          <span className="text-white font-medium text-sm sm:text-base text-center">
            Modo Demo - Explora todas las funciones de Eli System
          </span>
        </div>
        <Link 
          to="/login"
          className="bg-white text-blue-600 hover:bg-gray-100 px-5 py-1.5 rounded-full text-sm font-bold transition-colors shadow-sm"
        >
          Crear cuenta gratis
        </Link>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/" className="p-2 hover:bg-gray-900 rounded-full transition-colors group mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-white" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Experiencia Demo Interactiva
            </h1>
            <p className="text-gray-400 mt-1">Prueba las herramientas que potenciarán tu negocio</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          <div className="flex bg-gray-900/60 backdrop-blur-xl border border-white/10 p-1.5 rounded-full w-max mx-auto sm:mx-0 shadow-lg shadow-black/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-sky-500/20 text-sky-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 flex flex-col bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in duration-500">
          
          {/* TAB 1: Chat Bot */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-[600px] sm:h-auto min-h-[500px]">
              <div className="p-4 border-b border-white/10 bg-gray-900/80 flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-white">Eli (Demo Bot)</h2>
                  <span className="text-xs text-green-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    En línea
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
                        msg.role === 'user' ? 'bg-gray-800 border border-white/10' : 'bg-gradient-to-br from-sky-500 to-blue-600'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4 text-gray-300" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      <div className={`p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-sky-600/90 text-white rounded-tr-sm backdrop-blur-sm' 
                          : 'bg-gray-800/90 text-gray-100 rounded-tl-sm border border-white/10 backdrop-blur-sm'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-800/90 rounded-tl-sm border border-white/10 flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-gray-900/80 border-t border-white/10">
                <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe un mensaje para probar el bot..."
                    className="flex-1 bg-gray-950 border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-white placeholder-gray-500 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl px-5 py-3.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-sky-500/20"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: Conversaciones */}
          {activeTab === 'conversations' && (
            <div className="flex-1 flex flex-col sm:flex-row h-[700px]">
              {/* Sidebar list */}
              <div className="w-full sm:w-80 border-r border-white/10 bg-gray-900/40 flex flex-col">
                <div className="p-4 border-b border-white/10">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Buscar cliente..." className="w-full bg-gray-950 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white disabled:opacity-70" disabled />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-3 bg-sky-500/10 border-l-2 border-sky-500 cursor-pointer hover:bg-sky-500/20 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white">María García</span>
                      <span className="text-xs text-gray-500">2:41 PM</span>
                    </div>
                    <div className="text-sm text-gray-400 truncate">¡Genial! Tenemos en negro, blanco...</div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 w-max px-2 py-0.5 rounded-full">
                      <Bot className="w-3 h-3" /> Bot Activo
                    </div>
                  </div>
                  
                  <div className="p-3 border-l-2 border-transparent cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-300">Carlos López</span>
                      <span className="text-xs text-gray-500">Ayer</span>
                    </div>
                    <div className="text-sm text-gray-400 truncate">Perfecto, realizaré el pago ahora.</div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 w-max px-2 py-0.5 rounded-full">
                      <User className="w-3 h-3" /> Humano al mando
                    </div>
                  </div>

                  <div className="p-3 border-l-2 border-transparent cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-300">Ana Rodríguez</span>
                      <span className="text-xs text-gray-500">Mar</span>
                    </div>
                    <div className="text-sm text-gray-400 truncate">Gracias por la información.</div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 w-max px-2 py-0.5 rounded-full">
                      <Bot className="w-3 h-3" /> Bot Activo
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat View */}
              <div className="flex-1 flex flex-col bg-gray-950/50 relative">
                {/* Header */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-gray-900/60">
                  <div>
                    <h3 className="font-bold text-white">María García</h3>
                    <p className="text-xs text-gray-400">Última act: 2:41 p.m.</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors disabled:opacity-50">
                    <PauseCircle className="w-4 h-4" />
                    Pausar Bot (Handoff)
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  <div className="flex justify-end">
                    <div className="bg-sky-600/90 text-white p-4 rounded-2xl rounded-tr-sm max-w-[75%]">
                      Hola, tienen polos oversize?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[75%]">
                      <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-sky-400" />
                      </div>
                      <div className="bg-gray-800/90 text-gray-200 border border-white/10 p-4 rounded-2xl rounded-tl-sm">
                        ¡Hola María! Sí, tenemos polos oversize disponibles en tallas S, M, L y XL. ¿Te gustaría ver los colores disponibles?
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-sky-600/90 text-white p-4 rounded-2xl rounded-tr-sm max-w-[75%]">
                      Sí, qué colores tienen?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[75%]">
                      <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-sky-400" />
                      </div>
                      <div className="bg-gray-800/90 text-gray-200 border border-white/10 p-4 rounded-2xl rounded-tl-sm">
                        ¡Genial! Tenemos en negro, blanco, beige y azul marino. Todos a S/. 45.00. ¿Cuál te interesa?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-900/60 border-t border-white/10">
                  <div className="flex items-end gap-2 bg-gray-950 border border-white/10 rounded-xl p-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-not-allowed" disabled>
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <textarea 
                      placeholder="Responde a la conversación..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-white resize-none max-h-32 min-h-[44px] py-2.5 px-1 cursor-not-allowed"
                      disabled
                      rows={1}
                    ></textarea>
                    <button className="p-3 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed" disabled>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Demo Badge overlay */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-xs border border-white/10 shadow-xl flex items-center gap-2 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Vista de demostración - Las funciones interactivas requieren una cuenta
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Panel */}
          {activeTab === 'dashboard' && (
            <div className="flex-1 p-6 lg:p-8 space-y-8 bg-gray-900/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/60 border border-white/10 p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-sky-400" />
                  </div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">Total Clientes</h4>
                  <div className="text-3xl font-bold text-white">24</div>
                </div>
                
                <div className="bg-gray-900/60 border border-white/10 p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">Mensajes del Bot</h4>
                  <div className="text-3xl font-bold text-white">1,847</div>
                </div>

                <div className="bg-gray-900/60 border border-white/10 p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">Tiempo Ahorrado</h4>
                  <div className="text-3xl font-bold text-white">61 horas</div>
                </div>
              </div>

              <div className="bg-gray-900/60 border border-white/10 p-6 rounded-2xl">
                <h3 className="font-bold text-lg text-white mb-8">Actividad de los últimos 7 días</h3>
                <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-4">
                  {[
                    { day: 'Lun', h: 40 },
                    { day: 'Mar', h: 70 },
                    { day: 'Mié', h: 45 },
                    { day: 'Jue', h: 90 },
                    { day: 'Vie', h: 65 },
                    { day: 'Sáb', h: 80 },
                    { day: 'Dom', h: 55 }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <div className="w-full relative flex items-end justify-center h-full bg-gray-800/30 rounded-t-lg overflow-hidden group">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-lg transition-all duration-700 ease-out group-hover:opacity-80"
                          style={{ height: `${bar.h}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Conocimiento */}
          {activeTab === 'knowledge' && (
            <div className="flex-1 p-6 lg:p-8 bg-gray-900/20 h-[700px] overflow-y-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Base de Conocimiento</h2>
                  <p className="text-gray-400 text-sm max-w-2xl">
                    Aquí defines lo que el bot sabe. El bot utilizará esta información para responder a las preguntas de tus clientes de manera precisa y contextual.
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
                  <Plus className="w-4 h-4" />
                  Nuevo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/60 border border-white/10 p-5 rounded-2xl hover:bg-gray-800/60 transition-colors">
                  <div className="text-xs text-sky-400 font-bold tracking-wider uppercase mb-3">Horarios</div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Atendemos de lunes a viernes de 9am a 6pm, y sábados de 9am a 1pm.
                  </p>
                </div>
                
                <div className="bg-gray-900/60 border border-white/10 p-5 rounded-2xl hover:bg-gray-800/60 transition-colors">
                  <div className="text-xs text-sky-400 font-bold tracking-wider uppercase mb-3">Envíos</div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Realizamos envíos a todo el país en 24-48 horas con Olva Courier.
                  </p>
                </div>

                <div className="bg-gray-900/60 border border-white/10 p-5 rounded-2xl hover:bg-gray-800/60 transition-colors">
                  <div className="text-xs text-sky-400 font-bold tracking-wider uppercase mb-3">Devoluciones</div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Aceptamos devoluciones dentro de los 15 días posteriores a la compra.
                  </p>
                </div>

                <div className="bg-gray-900/60 border border-white/10 p-5 rounded-2xl hover:bg-gray-800/60 transition-colors">
                  <div className="text-xs text-sky-400 font-bold tracking-wider uppercase mb-3">Pagos</div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Aceptamos Yape, Plin, transferencia bancaria y tarjetas de crédito.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Configuración */}
          {activeTab === 'settings' && (
            <div className="flex-1 p-6 lg:p-8 bg-gray-900/20 h-[700px] overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-8">
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
                  <div className="mt-0.5 text-amber-500"><Settings className="w-5 h-5"/></div>
                  <div>
                    <h4 className="text-amber-500 font-medium text-sm">Modo de Solo Lectura</h4>
                    <p className="text-amber-500/80 text-sm mt-1">
                      Los campos están deshabilitados en la demo. En la versión completa, puedes personalizar completamente el comportamiento y la integración de tu bot.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt (Personalidad del Bot)</label>
                    <textarea 
                      className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-4 text-gray-400 text-sm cursor-not-allowed resize-none h-32"
                      disabled
                      value="Eres Eli, una asistente de ventas amigable y profesional para una tienda de ropa. Responde siempre en español de manera concisa y clara. Utiliza emojis ocasionalmente para ser amigable."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Modelo de IA</label>
                      <select disabled className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-3 text-gray-400 text-sm cursor-not-allowed appearance-none">
                        <option>llama-3.1-8b-instant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Temperatura (Creatividad)</label>
                      <input type="text" disabled value="0.7" className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-3 text-gray-400 text-sm cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-6">
                    <h3 className="font-medium text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-sky-400" />
                      Integración con WhatsApp/Meta
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Meta Access Token</label>
                      <input type="password" disabled value="••••••••••••••••••••••••••••••••" className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-3 text-gray-400 text-sm cursor-not-allowed tracking-widest" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Meta Verify Token</label>
                      <input type="password" disabled value="••••••••••••••••" className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-3 text-gray-400 text-sm cursor-not-allowed tracking-widest" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button disabled className="bg-sky-500/50 text-white/50 px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
                      Guardar Cambios
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
