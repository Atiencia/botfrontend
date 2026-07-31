import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Bot, Search, PauseCircle, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  instagram_user_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Customer {
  id: string;
  instagram_user_id: string;
  is_bot_active: boolean;
  updated_at: string;
}

const API_CHATS = `${import.meta.env.VITE_API_URL}/chats`;
const API_CUSTOMERS = `${import.meta.env.VITE_API_URL}/customers`;

export default function ChatsPage() {
  const { session } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (session?.access_token) {
      fetchCustomers();
      const interval = setInterval(fetchCustomers, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  useEffect(() => {
    if (session?.access_token && selectedCustomer) {
      fetchChats(selectedCustomer.instagram_user_id);
      const interval = setInterval(() => fetchChats(selectedCustomer.instagram_user_id), 3000);
      return () => clearInterval(interval);
    }
  }, [session, selectedCustomer]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(API_CUSTOMERS, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  };

  const fetchChats = async (instagramUserId: string) => {
    try {
      // In a real app we would filter by instagramUserId on the backend, 
      // but since the endpoint returns all chats, we filter on frontend for the MVP
      // We should ideally update the backend /chats endpoint to accept a query param.
      const res = await axios.get(API_CHATS, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      const filtered = res.data.filter((c: ChatMessage) => c.instagram_user_id === instagramUserId);
      setChats(filtered);
    } catch (error) {
      console.error('Error fetching chats', error);
    }
  };

  const toggleBot = async (customer: Customer) => {
    try {
      const res = await axios.post(
        `${API_CUSTOMERS}/${customer.instagram_user_id}/toggle`,
        { is_bot_active: !customer.is_bot_active },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );
      setCustomers(customers.map(c => c.instagram_user_id === customer.instagram_user_id ? res.data : c));
      if (selectedCustomer?.instagram_user_id === customer.instagram_user_id) {
        setSelectedCustomer(res.data);
      }
    } catch (error) {
      console.error('Error toggling bot status', error);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.instagram_user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto h-screen flex flex-col">
      <div className="mb-6 shrink-0">
        <h2 className="text-3xl font-bold text-white mb-2">Bandeja de Entrada</h2>
        <p className="text-gray-400">Supervisa las conversaciones y pausa el bot si necesitas intervenir (Handoff).</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar Clientes */}
        <div className="w-1/3 glass rounded-2xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">No hay clientes recientes.</div>
            ) : (
              filteredCustomers.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-4 border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/30 transition-colors ${selectedCustomer?.id === c.id ? 'bg-gray-800/50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">Cliente: {c.instagram_user_id}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          {c.is_bot_active ? (
                            <span className="text-indigo-400 flex items-center gap-1"><Bot className="w-3 h-3"/> Bot Activo</span>
                          ) : (
                            <span className="text-amber-500 flex items-center gap-1"><User className="w-3 h-3"/> Humano al mando</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 glass rounded-2xl border border-gray-800 flex flex-col overflow-hidden">
          {selectedCustomer ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-200">Cliente: {selectedCustomer.instagram_user_id}</div>
                    <div className="text-xs text-gray-500">Última act: {new Date(selectedCustomer.updated_at).toLocaleTimeString()}</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleBot(selectedCustomer)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    selectedCustomer.is_bot_active 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                  }`}
                >
                  {selectedCustomer.is_bot_active ? (
                    <><PauseCircle className="w-4 h-4"/> Pausar Bot (Handoff)</>
                  ) : (
                    <><PlayCircle className="w-4 h-4"/> Reanudar Bot</>
                  )}
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chats.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    No hay mensajes en esta conversación.
                  </div>
                ) : (
                  chats.map((msg) => {
                    const isBot = msg.role === 'assistant';
                    return (
                      <div key={msg.id} className={`flex ${isBot ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`flex max-w-[80%] space-x-3 ${isBot ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                          <div className="shrink-0 mt-1">
                            {isBot ? (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Bot className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className={`flex flex-col ${isBot ? 'items-end' : 'items-start'}`}>
                            <div className="text-xs text-gray-500 mb-1 px-1 flex items-center space-x-2">
                              <span>{isBot ? 'Eli (Bot)' : `Cliente`}</span>
                              <span>•</span>
                              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm shadow-sm ${
                              isBot 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-gray-800/80 text-gray-100 rounded-tl-none border border-gray-700'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4">
              <Bot className="w-12 h-12 text-gray-700" />
              <p>Selecciona una conversación para ver los mensajes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
