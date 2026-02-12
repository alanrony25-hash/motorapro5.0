
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import Cockpit from './components/Cockpit';
import Conquistas from './components/Conquistas';
import Radar from './components/Radar';
import Config from './components/Config';
import Historico from './components/Historico';
import AuthGate from './components/AuthGate';
import { IconLayout, IconTrophy, IconRadar, IconSettings, IconHistory, IconBolt } from './components/Icons';
import { generateTacticalImage } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.COCKPIT);
  const [isTurnoAtivo, setIsTurnoAtivo] = useState(false);
  const [isStealthMode, setIsStealthMode] = useState(true);
  const [splashImage, setSplashImage] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  
  // Estado de Autenticação
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('motora_pro_auth'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('motora_pro_auth'));

  useEffect(() => {
    const loadSplash = async () => {
      const img = await generateTacticalImage();
      if (img) setSplashImage(img);
      // Mantém o splash por pelo menos 4.5 segundos
      setTimeout(() => setShowSplash(false), 4500);
    };
    loadSplash();
  }, []);

  const handleAuthorize = (email: string) => {
    localStorage.setItem('motora_pro_auth', email);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('motora_pro_auth');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  // Se estiver carregando o splash, mostra splash
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center overflow-hidden">
        {splashImage ? (
          <img 
            src={splashImage} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 animate-in fade-in zoom-in duration-[2000ms]" 
            alt="XENON GHOST" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black"></div>
        )}
        
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.3)] rotate-3 animate-bounce">
            <span className="text-4xl font-black text-black italic">FA</span>
          </div>
          
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-black tracking-tighter italic text-white mb-2 uppercase">MOTORA PRO</h1>
            <div className="flex items-center space-x-2 text-[#00f5d4]">
              <IconBolt className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Sincronizando Core Neural</span>
            </div>
          </div>

          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-8">
            <div className="h-full bg-[#00f5d4] animate-[shimmer_2s_infinite] shadow-[0_0_10px_#00f5d4]"></div>
          </div>
        </div>
        
        <div className="absolute bottom-12 text-center">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Prepare-se para a missão</p>
          <p className="text-[8px] text-gray-700 mt-2 uppercase">XENON-GHOST OS v15.8</p>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  // Se não estiver autenticado, mostra o portão de login
  if (!isAuthenticated) {
    return <AuthGate onAuthorize={handleAuthorize} />;
  }

  // Se estiver tudo certo, mostra o App principal
  const renderTab = () => {
    const commonProps = { isStealthMode, setIsStealthMode };
    switch (activeTab) {
      case AppTab.COCKPIT:
        return <Cockpit isTurnoAtivo={isTurnoAtivo} setIsTurnoAtivo={setIsTurnoAtivo} {...commonProps} />;
      case AppTab.CONQUISTAS:
        return <Conquistas {...commonProps} />;
      case AppTab.HISTORICO:
        return <Historico {...commonProps} />;
      case AppTab.RADAR:
        return <Radar {...commonProps} />;
      case AppTab.CONFIG:
        return <Config {...commonProps} onLogout={handleLogout} />;
      default:
        return <Cockpit isTurnoAtivo={isTurnoAtivo} setIsTurnoAtivo={setIsTurnoAtivo} {...commonProps} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto shadow-2xl relative overflow-hidden transition-colors duration-500 ${isStealthMode ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Indicador de Operador Logado */}
      <div className="absolute top-4 right-4 z-[60] flex items-center space-x-2">
         <div className="flex flex-col items-end">
            <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Operador Ativo</span>
            <span className="text-[8px] font-bold text-[#00f5d4] uppercase truncate max-w-[80px]">{userEmail?.split('@')[0]}</span>
         </div>
         <div className="w-2 h-2 rounded-full bg-[#00f5d4] shadow-[0_0_5px_#00f5d4]"></div>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderTab()}
      </main>

      <nav className={`absolute bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-2 z-50 transition-colors duration-500 ${isStealthMode ? 'glass-panel border-white/5 bg-black/40' : 'bg-white border-slate-200'}`}>
        <NavButton 
          active={activeTab === AppTab.COCKPIT} 
          onClick={() => setActiveTab(AppTab.COCKPIT)}
          icon={<IconLayout className="w-5 h-5" />}
          label="Cockpit"
          isStealthMode={isStealthMode}
        />
        <NavButton 
          active={activeTab === AppTab.HISTORICO} 
          onClick={() => setActiveTab(AppTab.HISTORICO)}
          icon={<IconHistory className="w-5 h-5" />}
          label="Histórico"
          isStealthMode={isStealthMode}
        />
        <NavButton 
          active={activeTab === AppTab.CONQUISTAS} 
          onClick={() => setActiveTab(AppTab.CONQUISTAS)}
          icon={<IconTrophy className="w-5 h-5" />}
          label="Conquistas"
          isStealthMode={isStealthMode}
        />
        <NavButton 
          active={activeTab === AppTab.RADAR} 
          onClick={() => setActiveTab(AppTab.RADAR)}
          icon={<IconRadar className="w-5 h-5" />}
          label="Radar"
          isStealthMode={isStealthMode}
        />
        <NavButton 
          active={activeTab === AppTab.CONFIG} 
          onClick={() => setActiveTab(AppTab.CONFIG)}
          icon={<IconSettings className="w-5 h-5" />}
          label="Config"
          isStealthMode={isStealthMode}
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isStealthMode: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, isStealthMode }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 w-[72px] h-12 rounded-xl ${
      active 
        ? (isStealthMode ? 'bg-white/5 text-[#00f5d4]' : 'bg-slate-100 text-blue-600') 
        : (isStealthMode ? 'text-gray-500' : 'text-slate-400')
    }`}
  >
    {icon}
    <span className={`text-[9px] font-medium tracking-wide ${active ? 'opacity-100' : 'opacity-60'}`}>
      {label}
    </span>
    {active && (
      <div className={`w-1 h-1 rounded-full mt-1 animate-pulse ${isStealthMode ? 'bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]' : 'bg-blue-600'}`}></div>
    )}
  </button>
);

export default App;
