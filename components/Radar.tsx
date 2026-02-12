
import React, { useState, useMemo } from 'react';
import { IconFuel, IconRadar } from './Icons';

interface RadarProps {
  isStealthMode: boolean;
  setIsStealthMode: (val: boolean) => void;
}

const brazilData: Record<string, string[]> = {
  "AC - Acre": ["Rio Branco", "Cruzeiro do Sul"],
  "AL - Alagoas": ["Maceió", "Arapiraca"],
  "AP - Amapá": ["Macapá", "Santana"],
  "AM - Amazonas": ["Manaus", "Parintins"],
  "BA - Bahia": ["Salvador", "Feira de Santana"],
  "CE - Ceará": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Sobral"],
  "DF - Distrito Federal": ["Brasília", "Taguatinga"],
  "ES - Espírito Santo": ["Vitória", "Vila Velha"],
  "GO - Goiás": ["Goiânia", "Anápolis"],
  "MA - Maranhão": ["São Luís", "Imperatriz"],
  "MT - Mato Grosso": ["Cuiabá", "Rondonópolis"],
  "MS - Mato Grosso do Sul": ["Campo Grande", "Dourados"],
  "MG - Minas Gerais": ["Belo Horizonte", "Uberlândia"],
  "PA - Pará": ["Belém", "Santarém"],
  "PB - Paraíba": ["João Pessoa", "Campina Grande"],
  "PR - Paraná": ["Curitiba", "Londrina"],
  "PE - Pernambuco": ["Recife", "Olinda"],
  "PI - Piauí": ["Teresina", "Parnaíba"],
  "RJ - Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Duque de Caxias"],
  "RN - Rio Grande do Norte": ["Natal", "Mossoró"],
  "RS - Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul"],
  "RO - Rondônia": ["Porto Velho", "Ji-Paraná"],
  "RR - Roraima": ["Boa Vista"],
  "SC - Santa Catarina": ["Florianópolis", "Joinville"],
  "SP - São Paulo": ["São Paulo", "Guarulhos", "Campinas", "Santos"],
  "SE - Sergipe": ["Aracaju"],
  "TO - Tocantins": ["Palmas"]
};

interface RegionInfo {
  fuelStations: { name: string; distance: string; price: string; type: string }[];
  events: { name: string; location: string; demand: string }[];
}

const tacticalData: Record<string, RegionInfo> = {
  "CE - Ceará": {
    fuelStations: [
      { name: "Posto Ipiranga Beira Mar", distance: "0.8 km", price: "5.39", type: "Gasolina" },
      { name: "Shell Aldeota", distance: "2.1 km", price: "5.42", type: "Gasolina" },
      { name: "Posto Cactus Sobral", distance: "4.5 km", price: "5.35", type: "Gasolina" }
    ],
    events: [
      { name: "Feira da Beira Mar", location: "Meireles", demand: "Alta" },
      { name: "Samba no Mercado", location: "Mercado dos Pinhões", demand: "Média" },
      { name: "Dragão do Mar Live", location: "Praia de Iracema", demand: "Alta" }
    ]
  },
  "SP - São Paulo": {
    fuelStations: [
      { name: "Posto Shell Centro", distance: "1.2 km", price: "5.49", type: "Gasolina" },
      { name: "Ipiranga Av. Principal", distance: "2.5 km", price: "5.52", type: "Gasolina" },
      { name: "BR Petrobras Sul", distance: "3.1 km", price: "5.45", type: "Gasolina" }
    ],
    events: [
      { name: "Evento Gastronômico Local", location: "Praça Central", demand: "Média" },
      { name: "Show Regional / Feira", location: "Pavilhão de Eventos", demand: "Alta" },
      { name: "Corrida Noturna", location: "Interlagos", demand: "Alta" }
    ]
  },
  "RJ - Rio de Janeiro": {
    fuelStations: [
      { name: "Posto BR Lagoa", distance: "0.5 km", price: "5.89", type: "Gasolina" },
      { name: "Ipiranga Copacabana", distance: "1.8 km", price: "5.92", type: "Gasolina" }
    ],
    events: [
      { name: "Baile do Vidigal", location: "Vidigal", demand: "Alta" },
      { name: "Roda de Samba", location: "Lapa", demand: "Média" }
    ]
  }
};

const defaultData: RegionInfo = {
  fuelStations: [
    { name: "Posto Local Padrão", distance: "2.0 km", price: "5.50", type: "Gasolina" }
  ],
  events: [
    { name: "Movimentação Central", location: "Centro da Cidade", demand: "Média" }
  ]
};

const Radar: React.FC<RadarProps> = ({ isStealthMode, setIsStealthMode }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedState, setSelectedState] = useState('SP - São Paulo');
  const [selectedCity, setSelectedCity] = useState('São Paulo');

  const availableCities = useMemo(() => brazilData[selectedState] || [], [selectedState]);

  const currentTacticalInfo = useMemo(() => {
    return tacticalData[selectedState] || defaultData;
  }, [selectedState]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity(brazilData[state][0]);
    handleScan();
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500);
  };

  const cardBg = isStealthMode ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-200 shadow-sm';
  const textColor = isStealthMode ? 'text-white' : 'text-slate-900';
  const secondaryTextColor = isStealthMode ? 'text-gray-500' : 'text-slate-400';

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right duration-500 pb-10">
      <header className="flex flex-col">
          <span className={`text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 ${isStealthMode ? 'text-[#3b82f6]' : 'text-blue-600'}`}>
            <IconRadar className="w-3 h-3" />
            <span>Inteligência de mercado</span>
          </span>
          <h1 className={`text-xl font-black uppercase italic tracking-tighter ${textColor}`}>RADAR PRO</h1>
      </header>

      <div className={`flex p-1 rounded-2xl border transition-colors duration-500 ${isStealthMode ? 'bg-[#121212] border-white/5' : 'bg-slate-200 border-slate-200'}`}>
        <button 
          onClick={() => setIsStealthMode(false)}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center space-x-2 transition-all ${!isStealthMode ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500'}`}
        >
           <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
           <span>Modo Dia</span>
        </button>
        <button 
          onClick={() => setIsStealthMode(true)}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all rounded-xl ${isStealthMode ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500'}`}
        >
           <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
           <span>Modo Noite</span>
        </button>
      </div>

      <div className={`rounded-2xl p-4 border space-y-4 transition-colors duration-500 ${cardBg}`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={`text-[8px] font-bold uppercase tracking-widest ml-1 ${secondaryTextColor}`}>ESTADO</label>
            <div className="relative">
              <select 
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className={`w-full border rounded-xl px-3 py-3 text-[10px] font-black uppercase appearance-none focus:outline-none ${isStealthMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              >
                {Object.keys(brazilData).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className={`text-[8px] font-bold uppercase tracking-widest ml-1 ${secondaryTextColor}`}>CIDADE</label>
            <div className="relative">
              <select 
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); handleScan(); }}
                className={`w-full border rounded-xl px-3 py-3 text-[10px] font-black uppercase appearance-none focus:outline-none ${isStealthMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              >
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        {isScanning ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
             <div className={`w-16 h-16 rounded-full border-4 border-t-[#00f5d4] animate-spin ${isStealthMode ? 'border-white/5' : 'border-slate-100'}`}></div>
             <div className="text-center">
                <h3 className={`text-xs font-black uppercase tracking-widest animate-pulse ${isStealthMode ? 'text-[#00f5d4]' : 'text-blue-600'}`}>SCANNING {selectedCity.toUpperCase()}...</h3>
                <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${secondaryTextColor}`}>Sincronizando com satélites táticos</p>
             </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
             <div className={`border rounded-2xl p-4 flex items-center justify-between ${isStealthMode ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center space-x-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isStealthMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                      <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                   </div>
                   <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isStealthMode ? 'text-gray-300' : 'text-slate-600'}`}>DEMANDA EM {selectedCity.toUpperCase()}</span>
                        <span className="text-[8px] bg-red-500 px-1 rounded-sm text-white font-black italic">LIVE</span>
                      </div>
                      <h4 className={`text-xl font-black italic ${isStealthMode ? 'text-white' : 'text-slate-900'}`}>Alta</h4>
                   </div>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex items-center space-x-2 px-1">
                   <IconFuel className={`w-3 h-3 ${isStealthMode ? 'text-[#00f5d4]' : 'text-blue-600'}`} />
                   <span className={`text-[9px] font-black uppercase tracking-widest ${secondaryTextColor}`}>POSTOS DE COMBUSTÍVEL PRÓXIMOS</span>
                </div>
                <div className="space-y-2">
                   {currentTacticalInfo.fuelStations.map((station, idx) => (
                     <FuelItem key={idx} {...station} isStealthMode={isStealthMode} />
                   ))}
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex items-center space-x-2 px-1">
                   <svg className="w-3 h-3 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 20h20M2 14h20M2 8h20" /></svg>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${secondaryTextColor}`}>EVENTOS DE ALTA DEMANDA</span>
                </div>
                <div className="space-y-2">
                   {currentTacticalInfo.events.map((event, idx) => (
                     <EventItem key={idx} {...event} isStealthMode={isStealthMode} />
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FuelItem = ({ name, distance, price, type, isStealthMode }: { name: string, distance: string, price: string, type: string, isStealthMode: boolean }) => (
  <div className={`border rounded-xl p-3 flex justify-between items-center ${isStealthMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
     <div>
        <h5 className={`text-[11px] font-black italic ${isStealthMode ? 'text-white' : 'text-slate-900'}`}>{name}</h5>
        <p className="text-[9px] text-gray-500 font-bold uppercase">{distance}</p>
     </div>
     <div className="text-right">
        <p className={`text-sm font-black italic ${isStealthMode ? 'text-[#00f5d4]' : 'text-blue-600'}`}>R$ {price}</p>
        <p className="text-[8px] font-bold text-gray-600 uppercase italic">{type}</p>
     </div>
  </div>
);

const EventItem = ({ name, location, demand, isStealthMode }: { name: string, location: string, demand: string, isStealthMode: boolean }) => (
  <div className={`border rounded-xl p-3 flex justify-between items-center ${isStealthMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
     <div>
        <h5 className={`text-[11px] font-black italic ${isStealthMode ? 'text-white' : 'text-slate-900'}`}>{name}</h5>
        <p className="text-[9px] text-gray-500 font-bold uppercase">{location}</p>
     </div>
     <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${demand === 'Alta' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>{demand}</span>
  </div>
);

export default Radar;
