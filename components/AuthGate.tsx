
import React, { useState, useEffect } from 'react';
import { IconBolt, IconMic } from './Icons';

interface AuthGateProps {
  onAuthorize: (email: string) => void;
}

const AuthGate: React.FC<AuthGateProps> = ({ onAuthorize }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'denied' | 'pending'>('idle');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;

    setStatus('checking');

    // Simula verificação no banco de dados (localStorage)
    setTimeout(() => {
      const storedWhitelist = localStorage.getItem('motora_pro_whitelist');
      const whitelist = storedWhitelist 
        ? JSON.parse(storedWhitelist) 
        : ['admin@motora.pro']; // E-mail mestre padrão caso não exista lista

      if (whitelist.includes(email.toLowerCase())) {
        onAuthorize(email);
      } else {
        setStatus('pending');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00f5d4]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
            <span className="text-3xl font-black text-black italic">FA</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">AUTENTICAÇÃO TÁTICA</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">XENON-GHOST OS v15.8</p>
          </div>
        </div>

        {status === 'pending' ? (
          <div className="glass-panel border border-yellow-500/30 rounded-3xl p-8 text-center space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-yellow-500/20">
              <IconMic className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black text-yellow-500 italic uppercase">ACESSO BLOQUEADO</h2>
              <p className="text-xs text-gray-400 font-medium">O e-mail <span className="text-white">{email}</span> aguarda liberação do administrador.</p>
              <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mt-4">Solicitação em processamento...</p>
            </div>
            <button 
              onClick={() => setStatus('idle')}
              className="w-full py-4 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors"
            >
              TENTAR OUTRO E-MAIL
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="glass-panel border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">IDENTIFICAÇÃO NEURAL</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={status === 'checking'}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-[#00f5d4]/50 transition-all"
                />
                {status === 'checking' && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#00f5d4] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={status === 'checking'}
              className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm transition-all active:scale-95 flex items-center justify-center space-x-3 ${
                status === 'checking' 
                  ? 'bg-gray-800 text-gray-600' 
                  : 'bg-[#00f5d4] text-black shadow-[0_0_20px_rgba(0,245,212,0.3)]'
              }`}
            >
              <IconBolt className="w-4 h-4" />
              <span>{status === 'checking' ? 'CONSULTANDO...' : 'ENTRAR NO CORE'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthGate;
