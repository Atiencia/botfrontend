import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_CUSTOMERS = `${import.meta.env.VITE_API_URL}/customers`;

interface Customer {
  id: string;
  instagram_user_id: string;
  is_bot_active: boolean;
}

export default function NotificationCenter() {
  const { session } = useAuth();
  const [pendingChats, setPendingChats] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.access_token) return;

    const fetchPending = async () => {
      try {
        const res = await axios.get(API_CUSTOMERS, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        const pending = res.data.filter((c: Customer) => !c.is_bot_active);
        setPendingChats(pending);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchPending();
    const interval = setInterval(fetchPending, 15000); // Polling cada 15 seg
    return () => clearInterval(interval);
  }, [session]);

  // Cerrar al clickear afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
      >
        <Bell className="w-5 h-5" />
        {pendingChats.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-950 animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-3 border-b border-gray-800 bg-gray-950/50">
            <h3 className="font-semibold text-gray-200 text-sm">Chats Pendientes</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {pendingChats.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Todo está en orden.
              </div>
            ) : (
              pendingChats.map(c => (
                <Link
                  key={c.id}
                  to="/chats"
                  onClick={() => setIsOpen(false)}
                  className="block p-3 border-b border-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <p className="text-xs text-gray-400 mb-1">Requiere ayuda humana</p>
                  <p className="text-sm font-medium text-gray-200 truncate">{c.instagram_user_id}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
