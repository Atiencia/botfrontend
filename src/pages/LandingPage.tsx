import { Link } from 'react-router-dom';
import { Bot, ArrowRight, Zap, Shield, BarChart3, MessageSquare, Code, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { session } = useAuth();

  const features = [
    {
      icon: <Bot className="w-6 h-6 text-sky-400" />,
      title: "IA Autónoma",
      description: "Eli responde a tus clientes al instante utilizando el poder de Llama 3 y búsqueda semántica."
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Handoff Silencioso",
      description: "Cuando la IA detecta que un humano debe intervenir, se pausa automáticamente sin enviar mensajes molestos."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-400" />,
      title: "Métricas en Tiempo Real",
      description: "Supervisa el rendimiento de tu bot, el ahorro de tiempo y el volumen de conversaciones al instante."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans selection:bg-sky-500/30">
      {/* Background Gradients */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-400">
            Eli System
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/demo" className="hidden sm:flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Probar Demo
          </Link>
          {session ? (
            <Link 
              to="/panel" 
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-lg shadow-sky-600/20 font-medium transition-all hover:-translate-y-0.5"
            >
              Ir al Panel
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600 rounded-xl font-medium transition-all hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in-up">
          <Zap className="w-4 h-4" />
          <span>El futuro del servicio al cliente</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-4xl animate-fade-in-up animation-delay-150">
          Automatiza tu negocio en <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">
            Instagram y Messenger
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 animate-fade-in-up animation-delay-300">
          Eli es una inteligencia artificial capaz de aprender sobre tu negocio, responder consultas, enviar imágenes y pausarse cuando necesites cerrar una venta humana.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-500">
          {session ? (
            <Link 
              to="/panel" 
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-sky-500/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/30"
            >
              <span>Acceder al Panel</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-sky-500/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/30"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          
          <Link 
            to="/demo" 
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white rounded-2xl font-bold transition-all hover:-translate-y-1"
          >
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <span>Ver Demo</span>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 border-t border-gray-800 bg-gray-950/50 backdrop-blur-3xl py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por qué elegir Eli</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Construido con las últimas tecnologías para garantizar una experiencia sin fricciones tanto para ti como para tus clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="glass p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors group">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 py-12 text-center text-gray-500">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Bot className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-400">Eli System</span>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Eli System. Todos los derechos reservados.
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-150 { animation-delay: 150ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
      `}} />
    </div>
  );
}
