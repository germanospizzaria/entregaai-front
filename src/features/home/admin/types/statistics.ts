export interface DeliveryStatistics {
  // Estatísticas gerais
  totalRuns: number;
  totalOrders: number;
  totalDeliveries: number;
  averageDeliveryTime: number; // em minutos

  // Estatísticas por período
  todayStats: DayStatistics;
  weekStats: PeriodStatistics;
  monthStats: PeriodStatistics;

  // Performance dos entregadores
  driverPerformance: DriverPerformance[];

  // Estatísticas por horário
  hourlyStats: HourlyStatistics[];

  // Estatísticas por status
  statusDistribution: StatusDistribution;

  // Métricas de eficiência
  efficiency: EfficiencyMetrics;
}

export interface DayStatistics {
  date: string;
  totalRuns: number;
  totalOrders: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  averageDeliveryTime: number;
  revenue?: number;
}

export interface PeriodStatistics {
  period: string;
  totalRuns: number;
  totalOrders: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
  dailyBreakdown: DayStatistics[];
}

export interface DriverPerformance {
  driverId: number;
  driverName: string;
  totalRuns: number;
  totalDeliveries: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  efficiency: number; // percentual
  status: "ATIVO" | "INATIVO";
}

export interface HourlyStatistics {
  hour: number;
  totalOrders: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
}

export interface StatusDistribution {
  pending: number;
  inRoute: number;
  completed: number;
  cancelled?: number;
}

export interface EfficiencyMetrics {
  onTimeDeliveryRate: number; // percentual
  averageOrdersPerRun: number;
  averageDistancePerRun: number; // em km
  fuelEfficiency?: number;
  customerSatisfaction?: number;
}

export interface StatisticsFilters {
  startDate?: string;
  endDate?: string;
  driverId?: number;
  period?: "today" | "week" | "month" | "custom";
}
