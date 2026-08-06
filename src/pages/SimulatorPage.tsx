import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL}/simulate`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function SimulatorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Â¡Hola! Soy Eli, la asistente virtual. Â¿En quÃ© te puedo ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content })).slice(-10); // Mandar los Ãºltimos 10
      const res = await axios.post(API_URL, {
        message: userMessage.content,
        chatHistory
      });

      const botMessage = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: res.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error simulating chat:', error);
      const errorMessage = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: 'Lo siento, hubo un error de conexiÃ³n con mi servidor.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] relative z-10">
        
        {/* Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white leading-tight">Eli (Demo Bot)</h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> En lÃ­nea
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`flex max-w-[80%] space-x-2 ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className="shrink-0 mt-auto">
                    {isBot ? (
                      <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm ${
                    isBot 
                      ? 'bg-gray-800 text-gray-100 rounded-bl-none' 
                      : 'bg-sky-600 text-white rounded-br-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1 shadow-sm">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-gray-800 border-t border-gray-700 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-900 border border-gray-700 text-gray-100 rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-white disabled:opacity-50 transition-opacity shrink-0"
          >
            <Send className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

