
import React from 'react';
import { IconTrophy } from './Icons';

interface ConquistasProps {
  isStealthMode: boolean;
}

const Conquistas: React.FC<ConquistasProps> = ({ isStealthMode }) => {
  const achievements = [
    { id: 1, title: 'Primeira Missão', desc: 'Completou seu primeiro turno', status: 'completed', level: 'B' },
    { id: 2, title: 'R$ 1.000', desc: 'Acumule R$ 1.000 em lucros', status: 'locked', level: '?' },
    { id: 3, title: 'Eficiência A', desc: 'Mantenha eficiência A por 5 dias', status: 'locked', level: '?' },
    { id: 4, title: 'Zero Custos Extra', desc: 'Um turno sem gastos adicionais', status: 'locked', level: '?' },
    { id: 5, title: 'Meta Diária', desc: 'Atingiu 100% da meta diária', status: 'locked', level: '?' },
    { id: 6, title: 'Meta Mensal', desc: 'Atingiu 100% da meta mensal', status: 'locked', level: '?' },
    { id: 7, title: 'Maratonista', desc: 'Dirigiu por mais de 12h em um dia', status: 'locked', level: '?' },
    { id: 8, title: 'Mestre Motorista', desc: 'Completou 100 turnos', status: 'locked', level: '?' },
    { id: 9, title: 'Lenda Urbana', desc: 'Acumule R$ 10.000 em lucros totais', status: 'locked', level: '?' },
    { id: 10, title: 'Eco-Driver', desc: 'Combustível abaixo de 15% do bruto', status: 'locked', level: '?' },
    { id: 11, title: 'Fantasma da Noite', desc: '10 missões entre 22h e 04h', status: 'locked', level: '?' },
    { id: 12, title: 'Equilíbrio Perfeito', desc: '100% de todos os baldes no mês', status: 'locked', level: '?' },
    { id: 13, title: 'Guerreiro de Fim de Semana', desc: 'Trabalhou Sáb e Dom com lucro > R$ 400', status: 'locked', level: '?' },
    { id: 14, title: 'Reserva Blindada', desc: 'R$ 5.000 no balde de reserva', status: 'locked', level: '?' },
    { id: 15, title: 'Alta Velocidade', desc: 'Média > R$ 60/hora em um turno', status: 'locked', level: '?' },
    { id: 16, title: 'Veterano XENON', desc: '365 dias consecutivos no sistema', status: 'locked', level: '?' },
    { id: 17, title: 'Semana de Ouro', desc: '7 dias seguidos batendo a meta', status: 'locked', level: '?' },
    { id: 18, title: 'Madrugador Tático', desc: '5 turnos começando antes das 06:00', status: 'locked', level: '?' },
    { id: 19, title: 'Sniper de Corridas', desc: 'Nenhum cancelamento em 50 corridas', status: 'locked', level: '?' },
    { id: 20, title: 'Imperador da Zona', desc: 'Faturamento > R$ 1.500 em uma semana', status: 'locked', level: '?' },
    { id: 21, title: 'Mecânico Pro', desc: 'Realizou 3 trocas de óleo no prazo', status: 'locked', level: '?' },
    { id: 22, title: 'Caçador de Dinâmico', desc: 'Média > R$ 8/km em um turno', status: 'locked', level: '?' },
    { id: 23, title: 'Piloto Imbatível', desc: 'Lucro Líquido > R$ 2.000 no mês', status: 'locked', level: '?' },
    { id: 24, title: 'Alimentação Inteligente', desc: 'Custos com comida < R$ 150/semana', status: 'locked', level: '?' },
    { id: 25, title: 'Estrategista Ghost', desc: 'Utilizou o Radar Pro em 10 cidades', status: 'locked', level: '?' },
  ];

  const cardBg = isStealthMode ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-200 shadow-sm';
  const textColor = isStealthMode ? 'text-white' : 'text-slate-900';
  const secondaryTextColor = isStealthMode ? 'text-gray-500' : 'text-slate-400';

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right duration-500 pb-10">
      <header className="flex flex-col items-center py-8">
         <div className="relative group">
           <div className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-500 ${isStealthMode ? 'bg-orange-500/10' : 'bg-amber-500/10'}`}></div>
           <IconTrophy className={`w-16 h-16 mb-2 relative z-10 ${isStealthMode ? 'text-orange-500' : 'text-amber-500'}`} />
           <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 z-20 ${isStealthMode ? 'border-[#050505]' : 'border-white'} animate-pulse`}></div>
         </div>
         <h1 className={`text-2xl font-black uppercase italic tracking-tighter mt-4 ${textColor}`}>HALL DA FAMA</h1>
         <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${secondaryTextColor}`}>Sincronizando conquistas táticas</p>
      </header>

      <div className={`rounded-3xl p-6 border space-y-4 transition-all duration-500 shadow-lg ${cardBg}`}>
         <div className="flex justify-between items-baseline">
            <span className={`text-[12px] font-black uppercase tracking-widest italic ${textColor}`}>CARREIRA PROFISSIONAL</span>
            <span className={`text-sm font-black italic ${isStealthMode ? 'text-[#3b82f6]' : 'text-blue-600'}`}>1 / {achievements.length}</span>
         </div>
         <div className={`h-3 w-full rounded-full overflow-hidden border ${isStealthMode ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-slate-100 border-slate-100'}`}>
            <div 
              className={`h-full transition-all duration-1000 ${isStealthMode ? 'bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.6)]' : 'bg-amber-500'}`} 
              style={{ width: `${(1 / achievements.length) * 100}%` }}
            ></div>
         </div>
         <div className="flex justify-between items-center">
            <p className="text-[9px] font-black text-gray-500 uppercase italic tracking-wider">Próximo nível: COMANDANTE GHOST</p>
            <span className="text-[8px] font-bold text-[#00f5d4] uppercase tracking-widest animate-pulse">NOVO DESAFIO DISPONÍVEL</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-20">
        {achievements.map((ach) => (
          <div key={ach.id} className={`rounded-2xl p-5 border relative overflow-hidden flex flex-col items-start space-y-3 transition-all duration-300 ${cardBg} ${ach.status === 'locked' ? 'opacity-30 grayscale hover:grayscale-0 hover:opacity-100' : 'hover:scale-[1.05] active:scale-95 cursor-pointer border-[#00f5d4]/20'}`}>
             {ach.status === 'completed' ? (
               <div className={`absolute top-3 right-3 w-7 h-7 rounded-full border flex items-center justify-center ${isStealthMode ? 'bg-[#00f5d4]/20 border-[#00f5d4]/40 shadow-[0_0_10px_rgba(0,245,212,0.3)]' : 'bg-blue-50 border-blue-200'}`}>
                  <span className={`text-[11px] font-black italic ${isStealthMode ? 'text-[#00f5d4]' : 'text-blue-600'}`}>{ach.level}</span>
               </div>
             ) : (
               <div className="absolute top-3 right-3 opacity-30">
                 <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
               </div>
             )}
             
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-inner ${ach.status === 'completed' ? (isStealthMode ? 'bg-[#00f5d4]/10 border-[#00f5d4]/30' : 'bg-blue-50 border-blue-200') : (isStealthMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100')}`}>
                <svg className={`w-6 h-6 ${ach.status === 'completed' ? (isStealthMode ? 'text-[#00f5d4]' : 'text-blue-600') : 'text-gray-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13.13 2.23a.75.75 0 0 0-1.26 0l-7.5 11.25a.75.75 0 0 0 .63 1.17h5.25v7.1a.75.75 0 0 0 1.26.58l7.5-11.25a.75.75 0 0 0-.63-1.17h-5.25v-7.68Z"/>
                </svg>
             </div>
             
             <div className="w-full">
                <h4 className={`text-[11px] font-black italic leading-tight uppercase mb-1 ${textColor}`}>{ach.title}</h4>
                <p className={`text-[9px] font-bold uppercase tracking-tight leading-tight ${secondaryTextColor}`}>{ach.desc}</p>
             </div>

             {ach.status === 'completed' && (
                <div className="w-full h-1 mt-2 bg-[#00f5d4]/10 rounded-full overflow-hidden">
                   <div className="h-full bg-[#00f5d4] w-full shadow-[0_0_8px_#00f5d4]"></div>
                </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conquistas;
