
import React, { useState, useEffect, useRef } from 'react';
import { IconBolt, IconPlay, IconPiggyBank, IconRotateCcw, IconTrash } from './Icons';
import { getNeuralBriefing } from '../services/geminiService';
import { TacticalGoal, ReserveCell } from '../types';

interface CockpitProps {
  isTurnoAtivo: boolean;
  setIsTurnoAtivo: (val: boolean) => void;
  isStealthMode: boolean;
}

const Cockpit: React.FC<CockpitProps> = ({ isTurnoAtivo, setIsTurnoAtivo, isStealthMode }) => {
  const [briefing, setBriefing] = useState('ANÁLISE DE MERCADO: CONDIÇÕES FAVORÁVEIS');
  const [loadingBriefing, setLoadingBriefing] = useState(true);
  
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{item: TacticalGoal | ReserveCell, type: 'goal' | 'cell'} | null>(null);
  const [showAddCellModal, setShowAddCellModal] = useState(false);

  // Estados de Tempo e Odômetro
  const [startTime, setStartTime] = useState('09:17');
  const [initialOdo, setInitialOdo] = useState('250');
  const [finalOdo, setFinalOdo] = useState('250');

  // Estados de Pausa
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTime, setPauseTime] = useState(0);
  const pauseIntervalRef = useRef<number | null>(null);

  // Ganhos e Custos do Debriefing
  const [earnings, setEarnings] = useState({ uber: 0, app99: 0, inDrive: 0, particular: 0 });
  const [fuelCost, setFuelCost] = useState(0);
  const [otherCosts, setOtherCosts] = useState<{category: string, value: number, description: string}[]>([]);
  const [newCost, setNewCost] = useState({ category: '🍔 Alimentação', value: 0, description: '' });
  const [notes, setNotes] = useState('');

  const [goals, setGoals] = useState<TacticalGoal[]>([
    { id: 'daily', label: 'META DIÁRIA', current: 0, target: 260, color: '#00f5d4' },
    { id: 'monthly', label: 'META MENSAL', current: 630, target: 7800, color: '#ffea00' }
  ]);

  const [reserveCells, setReserveCells] = useState<ReserveCell[]>([
    { id: 'car', label: 'Parcela do Carro', current: 0, target: 1802, color: '#ffea00', iconType: 'car', percentage: 40 },
    { id: 'card', label: 'Cartão', current: 0, target: 1000, color: '#ffea00', iconType: 'card', percentage: 20 },
    { id: 'house', label: 'Gasto de Casa', current: 0, target: 1200, color: '#ffea00', iconType: 'home', percentage: 30 },
    { id: 'travel', label: 'Reserva/Viagem', current: 0, target: 3800, color: '#ffea00', iconType: 'piggy', percentage: 10 }
  ]);

  useEffect(() => {
    const fetchBriefing = async () => {
      setLoadingBriefing(true);
      const status = isPaused ? "EM PAUSA PARA ALMOÇO/DESCANSO" : (isTurnoAtivo ? "OPERANDO EM ALTA PERFORMANCE" : "AGUARDANDO COMANDO INICIAL");
      const text = await getNeuralBriefing(status);
      setBriefing(text);
      setLoadingBriefing(false);
    };
    fetchBriefing();
  }, [isTurnoAtivo, isPaused]);

  useEffect(() => {
    if (isPaused) {
      pauseIntervalRef.current = window.setInterval(() => {
        setPauseTime(prev => prev + 1);
      }, 1000);
    } else {
      if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
    }
    return () => { if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current); };
  }, [isPaused]);

  const formatPauseTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleUpdateItem = (updated: TacticalGoal | ReserveCell, type: 'goal' | 'cell') => {
    if (type === 'goal') {
      setGoals(prev => prev.map(g => g.id === updated.id ? (updated as TacticalGoal) : g));
    } else {
      setReserveCells(prev => prev.map(c => c.id === updated.id ? (updated as ReserveCell) : c));
    }
    setEditingItem(null);
  };

  const handleResetItem = (id: string, type: 'goal' | 'cell') => {
    if (type === 'goal') {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, current: 0 } : g));
    } else {
      setReserveCells(prev => prev.map(c => c.id === id ? { ...c, current: 0 } : c));
    }
  };

  const handleAddCell = (newCell: ReserveCell) => {
    setReserveCells([...reserveCells, newCell]);
    setShowAddCellModal(false);
  };

  const handleDeleteCell = (id: string) => {
    setReserveCells(prev => prev.filter(c => c.id !== id));
  };

  const handleFinalizeTurno = () => {
    const totalOtherCosts = otherCosts.reduce((acc, c) => acc + c.value, 0);
    const totalGross = earnings.uber + earnings.app99 + earnings.inDrive + earnings.particular;
    const netProfit = totalGross - fuelCost - totalOtherCosts;

    if (netProfit > 0) {
      // Distribui o lucro líquido nos baldes de reserva baseado na porcentagem
      setReserveCells(prev => prev.map(cell => ({
        ...cell,
        current: Number((cell.current + (netProfit * (cell.percentage / 100))).toFixed(2))
      })));

      // Atualiza metas táticas
      setGoals(prev => prev.map(goal => ({
        ...goal,
        current: Number((goal.current + (goal.id === 'daily' ? totalGross : netProfit)).toFixed(2))
      })));
    }

    // Reseta estados do turno
    setIsTurnoAtivo(false);
    setShowEndModal(false);
    setIsPaused(false);
    setPauseTime(0);
    setEarnings({ uber: 0, app99: 0, inDrive: 0, particular: 0 });
    setFuelCost(0);
    setOtherCosts([]);
    setNotes('');
  };

  const totalOtherCosts = otherCosts.reduce((acc, c) => acc + c.value, 0);
  const totalGross = earnings.uber + earnings.app99 + earnings.inDrive + earnings.particular;

  const cardBg = isStealthMode ? 'bg-[#121212]/80 border-white/5' : 'bg-white border-slate-200 shadow-sm';
  const textColor = isStealthMode ? 'text-white' : 'text-slate-900';
  const secondaryTextColor = isStealthMode ? 'text-gray-500' : 'text-slate-400';

  const renderIcon = (type: string) => {
    switch (type) {
      case 'car': return <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.3 2 11.7 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>;
      case 'card': return <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
      case 'home': return <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
      case 'piggy': return <IconPiggyBank className="w-5 h-5 text-yellow-500" />;
      default: return <IconPiggyBank className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500 relative flex flex-col items-center w-full">
      {/* Header Branding */}
      <div className="w-full flex flex-col items-center space-y-2 mb-2">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
           <span className="text-3xl font-black text-black italic">FA</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
           <IconBolt className="w-3 h-3 text-[#00f5d4]" />
           <span className="text-[9px] font-bold tracking-[0.2em] uppercase">SISTEMA F.A. PRO v15.5</span>
        </div>
      </div>

      {/* Neural AI Briefing */}
      <section className={`w-full backdrop-blur-md rounded-2xl p-4 border flex items-center justify-between transition-colors duration-500 ${cardBg}`}>
        <div className="flex items-center space-x-3">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute h-full w-full rounded-full border border-[#00f5d4]/30 animate-ping"></div>
            <div className="h-6 w-6 rounded-full border bg-[#00f5d4]/10 border-[#00f5d4]/40 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]"></div>
            </div>
          </div>
          <p className={`text-[11px] font-black tracking-wide ${textColor}`}>{briefing}</p>
        </div>
        {isPaused && (
          <div className="bg-yellow-500/20 px-2 py-1 rounded-lg border border-yellow-500/30">
            <span className="text-[9px] font-black text-yellow-500">{formatPauseTime(pauseTime)}</span>
          </div>
        )}
      </section>

      {/* Operational Actions */}
      <div className="w-full grid grid-cols-2 gap-3 mt-2 px-1">
        {isTurnoAtivo ? (
          <>
            <button onClick={() => setIsPaused(!isPaused)} className={`py-5 rounded-2xl border transition-all ${isPaused ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-[#121212] text-gray-400 border-white/10'}`}>
              <span className="text-xs font-black uppercase tracking-widest italic">{isPaused ? 'RETOMAR' : 'PAUSAR'}</span>
            </button>
            <button onClick={() => setShowEndModal(true)} className="py-5 rounded-2xl bg-red-500 text-white shadow-lg">
              <span className="text-xs font-black uppercase tracking-widest italic">ENCERRAR</span>
            </button>
          </>
        ) : (
          <button onClick={() => setShowStartModal(true)} className="col-span-2 py-5 rounded-2xl bg-[#00f5d4] text-black shadow-lg font-black uppercase italic tracking-widest">
            INICIAR MISSÃO
          </button>
        )}
      </div>

      {/* Objetivos Táticos (Metas) */}
      <section className="w-full space-y-4 px-1">
        <div className="flex items-center justify-between px-1">
           <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">◆ OBJETIVOS TÁTICOS</span>
        </div>
        <div className={`rounded-2xl p-5 border space-y-6 ${cardBg}`}>
           {goals.map(goal => (
             <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                   <div className="flex items-center space-x-3">
                      <span className={textColor}>{goal.label}</span>
                      <div className="flex items-center space-x-2">
                         <button onClick={() => setEditingItem({item: goal, type: 'goal'})} className="text-gray-600 hover:text-white transition-colors"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg></button>
                         <button onClick={() => handleResetItem(goal.id, 'goal')} className="text-gray-600 hover:text-[#00f5d4] transition-colors"><IconRotateCcw className="w-3.5 h-3.5" /></button>
                      </div>
                   </div>
                   <span className="text-gray-500">R$ {goal.current} / R$ {goal.target}</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full transition-all duration-1000 shadow-[0_0_8px_currentColor]" style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%`, backgroundColor: goal.color, color: goal.color }}></div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Baldes de Distribuição */}
      <section className="w-full space-y-4 px-1 pb-24">
         <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">◆ BALDES DE DISTRIBUIÇÃO</span>
            <div className="flex items-center space-x-4">
               <span className="text-[9px] font-bold text-yellow-500 uppercase">Total Divisão: {reserveCells.reduce((a,b)=>a+b.percentage, 0)}%</span>
               <button onClick={() => setShowAddCellModal(true)} className="w-7 h-7 bg-[#00f5d4]/10 border border-[#00f5d4]/30 rounded-lg flex items-center justify-center text-[#00f5d4] hover:bg-[#00f5d4]/20 active:scale-95 transition-all">
                  <span className="text-lg font-black">+</span>
               </button>
            </div>
         </div>
         
         <div className="space-y-3">
            {reserveCells.map(cell => (
              <div key={cell.id} className={`rounded-2xl p-4 border transition-all duration-300 ${cardBg} hover:border-[#00f5d4]/30`}>
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">{renderIcon(cell.iconType)}</div>
                       <div>
                          <h4 className={`text-xs font-black italic ${textColor}`}>{cell.label}</h4>
                          <div className="flex items-center space-x-2">
                             <span className="text-[9px] font-black text-[#00f5d4] uppercase">{cell.percentage}% do lucro</span>
                             <span className="text-[8px] text-gray-600">| R$ {cell.target} Alvo</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-3">
                       <button onClick={() => setEditingItem({item: cell, type: 'cell'})} className="text-gray-600 hover:text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg></button>
                       <button onClick={() => handleResetItem(cell.id, 'cell')} className="text-gray-600 hover:text-[#00f5d4] transition-colors"><IconRotateCcw className="w-4 h-4" /></button>
                       <button onClick={() => handleDeleteCell(cell.id)} className="text-gray-600 hover:text-red-500 transition-colors"><IconTrash className="w-4 h-4" /></button>
                    </div>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-1 shadow-inner">
                    <div className="h-full bg-yellow-500 rounded-full transition-all duration-1000 shadow-[0_0_5px_rgba(234,179,8,0.5)]" style={{ width: `${Math.min(100, (cell.current / cell.target) * 100)}%` }}></div>
                 </div>
                 <div className="flex justify-between text-[9px] font-black italic">
                    <span className="text-gray-600">Acumulado: R$ {cell.current}</span>
                    <span className="text-[#00f5d4]">{((cell.current / cell.target) * 100).toFixed(1)}% Completo</span>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Modal End Shift (Debriefing) */}
      {showEndModal && (
        <div className="fixed inset-0 z-[1000] bg-black overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
           <div className="w-full max-w-sm mx-auto p-6 space-y-8 pb-32">
             <header className="flex items-center justify-between pt-4">
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">DEBRIEFING</p>
                   <h2 className="text-2xl font-black uppercase text-white italic tracking-tighter">ENCERRAR MISSÃO</h2>
                </div>
                <button onClick={() => setShowEndModal(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
             </header>

             <div className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">ODÔMETRO FINAL</label>
                   <input type="number" value={finalOdo} onChange={(e) => setFinalOdo(e.target.value)} className="w-full bg-[#141414] border border-white/5 rounded-xl px-5 py-4 text-3xl font-black text-white focus:ring-2 focus:ring-[#00f5d4]/20 focus:outline-none" />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">◆ GANHOS POR PLATAFORMA</label>
                   <div className="grid grid-cols-2 gap-4">
                      {['Uber', '99', 'InDrive', 'Particular'].map(plate => (
                        <div key={plate} className="space-y-2">
                           <label className="text-[11px] font-bold text-gray-500">{plate}</label>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">R$</span>
                              <input type="number" value={earnings[plate.toLowerCase() as keyof typeof earnings] || 0} onChange={(e) => setEarnings({...earnings, [plate.toLowerCase() as keyof typeof earnings]: Number(e.target.value)})} className="w-full bg-[#141414] border border-white/5 rounded-xl pl-9 pr-3 py-3 text-lg font-black text-white" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">◆ CUSTOS OPERACIONAIS</label>
                   <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500">Combustível</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">R$</span>
                         <input type="number" value={fuelCost} onChange={(e) => setFuelCost(Number(e.target.value))} className="w-full bg-[#141414] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-xl font-black text-white" />
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-black italic text-gray-500">Bruto</span>
                      <span className="text-3xl font-black italic text-[#00f5d4]">R$ {totalGross.toFixed(0)}</span>
                   </div>
                   <button onClick={handleFinalizeTurno} className="w-full bg-[#00f5d4] text-black py-6 rounded-2xl font-black uppercase italic tracking-widest text-lg shadow-[0_0_20px_#00f5d4]/20 active:scale-95 transition-all">FINALIZAR TURNO</button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Modal Add Bucket */}
      {showAddCellModal && (
        <div className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl relative">
              <button onClick={() => setShowAddCellModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              <h2 className="text-xl font-black uppercase italic text-white mb-6">CRIAR NOVO BALDE</h2>
              <div className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">IDENTIFICAÇÃO</label>
                    <input id="newCellName" type="text" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white font-black" placeholder="Ex: Reserva de Emergência" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase">META ALVO (R$)</label>
                       <input id="newCellTarget" type="number" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white font-black" placeholder="500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase">DIVISÃO (%)</label>
                       <input id="newCellPerc" type="number" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-[#00f5d4] font-black" placeholder="10" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">ÍCONE TÁTICO</label>
                    <select id="newCellIcon" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none font-black uppercase italic">
                       <option value="piggy">Reserva / Porquinho</option>
                       <option value="car">Manutenção / Carro</option>
                       <option value="card">Cartão / Crédito</option>
                       <option value="home">Despesas / Casa</option>
                    </select>
                 </div>
                 <button 
                    onClick={() => {
                       const name = (document.getElementById('newCellName') as HTMLInputElement).value;
                       const target = Number((document.getElementById('newCellTarget') as HTMLInputElement).value);
                       const perc = Number((document.getElementById('newCellPerc') as HTMLInputElement).value);
                       const icon = (document.getElementById('newCellIcon') as HTMLSelectElement).value as any;
                       if (name && target) handleAddCell({ id: Math.random().toString(), label: name, target, current: 0, color: '#ffea00', iconType: icon, percentage: perc });
                    }}
                    className="w-full bg-[#00f5d4] text-black py-4 rounded-xl font-black uppercase tracking-widest italic"
                 >ATIVAR BALDE</button>
              </div>
           </div>
        </div>
      )}

      {/* Edit Modal (Universal) */}
      {editingItem && (
        <div className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl relative">
              <button onClick={() => setEditingItem(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              <h2 className="text-xl font-black uppercase italic text-white mb-6 tracking-tighter">AJUSTAR {editingItem.item.label}</h2>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Valor Alvo (R$)</label>
                    <input type="number" defaultValue={editingItem.item.target} onChange={(e) => setEditingItem({...editingItem, item: {...editingItem.item, target: Number(e.target.value)}})} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white font-black" />
                 </div>
                 {editingItem.type === 'cell' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Divisão de Lucro (%)</label>
                      <input type="number" defaultValue={(editingItem.item as ReserveCell).percentage} onChange={(e) => setEditingItem({...editingItem, item: {...editingItem.item, percentage: Number(e.target.value)} as ReserveCell})} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-[#00f5d4] font-black" />
                      <p className="text-[8px] text-gray-600 uppercase font-black italic mt-1">Define quanto de cada real de lucro vai para este balde.</p>
                    </div>
                 )}
                 <button onClick={() => handleUpdateItem(editingItem.item, editingItem.type)} className="w-full bg-[#00f5d4] text-black py-4 rounded-xl font-black uppercase tracking-widest italic">SALVAR CONFIGURAÇÃO</button>
              </div>
           </div>
        </div>
      )}

      {/* Start Shift Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`${isStealthMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'} border rounded-3xl w-full max-w-sm p-8 shadow-2xl relative`}>
            <button onClick={() => setShowStartModal(false)} className={`${isStealthMode ? 'text-gray-500' : 'text-slate-400'} absolute top-6 right-6 hover:text-white transition-colors`}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="mb-8">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${secondaryTextColor}`}>PROTOCOLOS</p>
              <h2 className={`text-2xl font-black uppercase italic tracking-tighter ${textColor}`}>INICIAR MISSÃO</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${secondaryTextColor}`}>HORA DE INÍCIO</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={`w-full border rounded-xl px-4 py-4 text-2xl font-black tracking-tighter appearance-none ${isStealthMode ? 'bg-[#141414] border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${secondaryTextColor}`}>ODÔMETRO INICIAL (KM)</label>
                <input type="number" value={initialOdo} onChange={(e) => setInitialOdo(e.target.value)} className={`w-full border rounded-xl px-4 py-4 text-2xl font-black tracking-tighter ${isStealthMode ? 'bg-[#141414] border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              </div>
              <button onClick={() => {setIsTurnoAtivo(true); setShowStartModal(false);}} className={`w-full py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 ${isStealthMode ? 'bg-[#00f5d4] text-black shadow-lg' : 'bg-blue-600 text-white shadow-lg'}`}>
                <IconPlay className="w-5 h-5 fill-current" />
                <span className="text-sm font-black uppercase tracking-[0.2em] italic">ATIVAR TURNO</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, isStealthMode }: { label: string, value: string, isStealthMode: boolean }) => (
  <div className={`rounded-2xl p-4 flex flex-col items-center justify-center border transition-colors duration-500 ${isStealthMode ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
    <p className={`text-[8px] font-bold tracking-widest mb-1 ${isStealthMode ? 'text-gray-500' : 'text-slate-400'}`}>{label}</p>
    <p className={`text-xs font-black uppercase italic tracking-wide ${isStealthMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
  </div>
);

export default Cockpit;
