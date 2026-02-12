
export enum AppTab {
  COCKPIT = 'cockpit',
  CONQUISTAS = 'conquistas',
  HISTORICO = 'historico',
  RADAR = 'radar',
  CONFIG = 'config'
}

export interface OperationalStats {
  lucroDia: number;
  evolucao: number;
  eficiencia: 'Alta' | 'Media' | 'Baixa';
  reaisPorHora: number;
  operacao: string;
}

export interface TacticalGoal {
  id: string;
  label: string;
  current: number;
  target: number;
  color: string;
}

export interface ReserveCell extends TacticalGoal {
  iconType: 'car' | 'card' | 'home' | 'piggy';
  percentage: number; // Porcentagem de distribuição do lucro
}

export interface MaintenanceProtocol {
  id: string;
  title: string;
  subtitle: string;
  current: number;
  total: number;
  icon: string;
}

export interface EarningEntry {
  id: string;
  date: string;
  amount: number;
  duration: string;
  efficiency: 'Alta' | 'Media' | 'Baixa';
  operation: string;
}
