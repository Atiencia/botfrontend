import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  instagram_user_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const API_URL = 'http://localhost:3000/api/chats';

export default function ChatsPage() {
  const { session } = useAuth();
  const [chats, setChats] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (session?.access_token) {
      fetchChats();
      // Polling simple para ver los últimos
      const interval = setInterval(fetchChats, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setChats(res.data);
    } catch (error) {
      console.error('Error fetching chats', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-screen flex flex-col">
      <div className="mb-8 shrink-0">
        <h2 className="text-3xl font-bold text-white mb-2">Conversaciones Recientes</h2>
        <p className="text-gray-400">Revisa cómo Eli está interactuando con los usuarios en tiempo real.</p>
      </div>

      <div className="flex-1 glass rounded-2xl border border-gray-800 overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chats.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No hay conversaciones recientes.
            </div>
          ) : (
            chats.map((msg) => {
              const isBot = msg.role === 'assistant';
              return (
                <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`flex max-w-[80%] space-x-3 ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                    
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

                    <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                      <div className="text-xs text-gray-500 mb-1 px-1 flex items-center space-x-2">
                        <span>{isBot ? 'Eli' : `Instagram: ${msg.instagram_user_id}`}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm shadow-sm ${
                        isBot 
                          ? 'bg-gray-800/80 text-gray-100 rounded-tl-none border border-gray-700' 
                          : 'bg-indigo-600 text-white rounded-tr-none'
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
      </div>
    </div>
  );
}
