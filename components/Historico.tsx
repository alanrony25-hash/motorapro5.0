
import React, { useState } from 'react';
import { IconHistory } from './Icons';
import { EarningEntry } from '../types';

interface HistoricoProps {
  isStealthMode: boolean;
}

const Historico: React.FC<HistoricoProps> = ({ isStealthMode }) => {
  const [filter, setFilter] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  
  const cardBg = isStealthMode ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-200 shadow-sm';
  const textColor = isStealthMode ? 'text-white' : 'text-slate-900';
  const secondaryTextColor = isStealthMode ? 'text-gray-500' : 'text-slate-400';

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right duration-500 pb-10">
      <header className="flex items-center justify-between">
         <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isStealthMode ? 'text-[#00f5d4]' : 'text-blue-600'}`}>Relatórios Táticos</span>
            <h1 className={`text-xl font-black uppercase italic tracking-tighter ${textColor}`}>HISTÓRICO CORE</h1>
         </div>
         <button className={`p-2 rounded-xl border ${isStealthMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
         </button>
      </header>

      <div className={`flex p-1 rounded-2xl border transition-colors duration-500 ${isStealthMode ? 'bg-[#121212] border-white/5' : 'bg-slate-200 border-slate-200'}`}>
        {(['dia', 'semana', 'mes', 'ano'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${filter === t ? (isStealthMode ? 'bg-[#3b82f6] text-white' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-2xl p-4 border flex flex-col transition-colors duration-500 ${cardBg}`}>
           <div className={`flex items-center space-x-1 text-[9px] font-bold uppercase tracking-widest mb-2 ${secondaryTextColor}`}>
             <span className={`${isStealthMode ? 'text-[#00f5d4]' : 'text-blue-600'}`}>$</span>
             <span>TOTAL GANHOS</span>
           </div>
           <div className="flex items-baseline space-x-1">
              <span className={`text-xs font-black italic ${isStealthMode ? 'text-gray-400' : 'text-slate-500'}`}>R$</span>
              <span className={`text-2xl font-black italic tracking-tighter ${textColor}`}>0</span>
           </div>
        </div>
        <div className={`rounded-2xl p-4 border flex flex-col transition-colors duration-500 ${cardBg}`}>
           <div className={`flex items-center space-x-1 text-[9px] font-bold uppercase tracking-widest mb-2 ${secondaryTextColor}`}>
             <IconHistory className={`w-3 h-3 ${isStealthMode ? 'text-[#00f5d4]' : 'text-blue-600'}`} />
             <span>MÉDIA/TURNO</span>
           </div>
           <div className="flex items-baseline space-x-1">
              <span className={`text-xs font-black italic ${isStealthMode ? 'text-gray-400' : 'text-slate-500'}`}>R$</span>
              <span className={`text-2xl font-black italic tracking-tighter ${textColor}`}>0</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-30">
        <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center transition-colors duration-500 ${isStealthMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200 shadow-inner'}`}>
          <IconHistory className={`w-8 h-8 ${isStealthMode ? 'text-gray-600' : 'text-slate-400'}`} />
        </div>
        <div className="text-center">
          <h3 className={`text-xs font-black uppercase tracking-widest ${textColor}`}>Nenhum registro encontrado</h3>
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${secondaryTextColor}`}>Complete turnos para ver o histórico</p>
        </div>
      </div>
    </div>
  );
};

export default Historico;
