import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, Settings, Bot, LogOut, Activity } from 'lucide-react';
import KnowledgePage from './pages/KnowledgePage';
import ChatsPage from './pages/ChatsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SimulatorPage from './pages/SimulatorPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: 'Métricas', icon: <Activity className="w-5 h-5" /> },
    { path: '/', label: 'Conocimiento', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/chats', label: 'Conversaciones', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen border-r border-gray-800 bg-gray-950/50 backdrop-blur-xl flex flex-col z-20 relative">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
            Eli Dashboard
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <div className={`${isActive ? 'text-indigo-400' : ''}`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800 space-y-4">
        <div className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Sesión iniciada como</p>
          <p className="text-sm font-medium text-gray-300 truncate">{user?.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden text-gray-100 relative">
      {/* Background Gradients for Aesthetics */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto z-10 relative">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/demo" element={<SimulatorPage />} />
          <Route path="/privacidad" element={<PrivacyPolicyPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/" element={<KnowledgePage />} />
              <Route path="/chats" element={<ChatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
