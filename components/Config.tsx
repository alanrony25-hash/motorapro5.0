
import React, { useState, useEffect } from 'react';
import { IconLogOut, IconRotateCcw, IconBolt, IconTrash, IconChevronRight } from './Icons';

interface ConfigProps {
  isStealthMode: boolean;
  setIsStealthMode: (val: boolean) => void;
  onLogout?: () => void;
}

const Config: React.FC<ConfigProps> = ({ isStealthMode, setIsStealthMode, onLogout }) => {
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  
  const currentUser = localStorage.getItem('motora_pro_auth') || '';
  const isAdmin = currentUser === 'admin@motora.pro';

  useEffect(() => {
    const stored = localStorage.getItem('motora_pro_whitelist');
    if (stored) {
      setWhitelist(JSON.parse(stored));
    } else {
      const initial = ['admin@motora.pro'];
      setWhitelist(initial);
      localStorage.setItem('motora_pro_whitelist', JSON.stringify(initial));
    }
  }, []);

  const saveWhitelist = (newList: string[]) => {
    setWhitelist(newList);
    localStorage.setItem('motora_pro_whitelist', JSON.stringify(newList));
  };

  const handleAddEmail = () => {
    if (newEmail && newEmail.includes('@') && !whitelist.includes(newEmail.toLowerCase())) {
      const newList = [...whitelist, newEmail.toLowerCase()];
      saveWhitelist(newList);
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    if (email === 'admin@motora.pro') return;
    const newList = whitelist.filter(e => e !== email);
    saveWhitelist(newList);
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MOTORA PRO',
          text: 'Baixe o app tático para motoristas e motociclistas. Solicite seu acesso!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar', err);
      }
    } else {
      alert('Link copiado: ' + window.location.href);
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const cardBg = isStealthMode ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-200 shadow-sm';
  const textColor = isStealthMode ? 'text-white' : 'text-slate-900';
  const secondaryTextColor = isStealthMode ? 'text-gray-500' : 'text-slate-400';

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right duration-500 pb-20">
      <header className="flex flex-col items-start py-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-1">
             <IconBolt className="w-4 h-4 text-[#00f5d4]" />
             <span className={`text-[10px] font-bold uppercase tracking-widest ${secondaryTextColor}`}>Central de Comando</span>
          </div>
          <h1 className={`text-2xl font-black uppercase italic tracking-tighter ${textColor}`}>CONFIGURAÇÕES</h1>
      </header>

      {/* Informativo de Privacidade */}
      <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${isStealthMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
         <div className="mt-1">
            <svg className={`w-4 h-4 ${isStealthMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
         </div>
         <div className="flex-1">
            <p className={`text-[10px] font-black uppercase italic mb-0.5 ${isStealthMode ? 'text-blue-400' : 'text-blue-700'}`}>Privacidade de Dados</p>
            <p className={`text-[9px] font-medium leading-tight ${isStealthMode ? 'text-blue-300/60' : 'text-blue-600/80'}`}>
               Suas metas e faturamentos são armazenados localmente neste aparelho. Seus dados são privados e não são compartilhados com outros usuários.
            </p>
         </div>
      </div>

      {/* Seção de Compartilhamento - Para todos */}
      <section className="space-y-3">
         <button 
           onClick={handleShareApp}
           className="w-full glass-panel border border-[#00f5d4]/20 p-5 rounded-2xl flex items-center justify-between group active:scale-95 transition-all"
         >
            <div className="flex items-center space-x-4">
               <div className="w-10 h-10 rounded-xl bg-[#00f5d4]/10 flex items-center justify-center text-[#00f5d4]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
               </div>
               <div className="text-left">
                  <h3 className="text-xs font-black uppercase italic text-white">Compartilhar App</h3>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Enviar link para outros motoristas</p>
               </div>
            </div>
            <IconChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#00f5d4] transition-colors" />
         </button>
      </section>

      {/* Seção Admin */}
      {isAdmin && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2 px-1">
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
             <span className={`text-[10px] font-black uppercase tracking-widest italic text-yellow-500`}>Painel do Administrador</span>
          </div>
          
          <div className={`rounded-2xl p-5 border space-y-4 transition-colors duration-500 ${cardBg} border-yellow-500/20`}>
             <h3 className={`text-xs font-black uppercase italic ${textColor}`}>GESTÃO DE ACESSOS</h3>
             <div className="flex space-x-2">
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Novo e-mail para autorizar"
                  className={`flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:outline-none`}
                />
                <button 
                  onClick={handleAddEmail}
                  className="bg-yellow-500 text-black px-4 rounded-xl font-black text-xs active:scale-95 transition-all"
                >LIBERAR</button>
             </div>

             <div className="space-y-2 mt-4 max-h-40 overflow-y-auto no-scrollbar">
                {whitelist.map(email => (
                  <div key={email} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                     <span className="text-[10px] font-bold text-gray-300">{email}</span>
                     {email !== 'admin@motora.pro' && (
                       <button onClick={() => handleRemoveEmail(email)} className="text-gray-500 hover:text-red-500">
                         <IconTrash className="w-4 h-4" />
                       </button>
                     )}
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      <div className={`rounded-2xl p-5 border flex items-center justify-between transition-colors duration-500 ${cardBg}`}>
         <div className="flex flex-col">
            <h3 className={`text-sm font-black uppercase italic leading-none mb-1 ${textColor}`}>Modo Stealth</h3>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${secondaryTextColor}`}>Otimização de Bateria</p>
         </div>
         <button 
           onClick={() => setIsStealthMode(!isStealthMode)}
           className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isStealthMode ? 'bg-[#3b82f6]' : 'bg-slate-300'}`}
         >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isStealthMode ? 'right-1 shadow-sm' : 'left-1 shadow-md'}`}></div>
         </button>
      </div>

      <button 
        onClick={onLogout}
        className={`w-full py-5 rounded-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all ${isStealthMode ? 'bg-red-500/10 border border-red-500/30 text-red-500' : 'bg-red-50 border border-red-200 text-red-600 shadow-sm'}`}
      >
         <IconLogOut className="w-5 h-5" />
         <span className="text-sm font-black uppercase tracking-[0.2em] italic">ENCERRAR SESSÃO</span>
      </button>
      
      <div className="text-center pt-4">
         <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">MOTORA PRO - SOFTWARE TÁTICO</p>
         <p className="text-[7px] text-gray-800 mt-1">BUILD 15.8.0-GHOST</p>
      </div>
    </div>
  );
};

export default Config;
