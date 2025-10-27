export type MonthKey = `${number}-${string}`;

export interface RoleMeta {
  id: string;
  name: string;
  practice: string;
  baselineFte: number;
}

export interface MonthlyCapacity {
  month: MonthKey;
  demand: number;
  supply: number;
}

export interface RolePlan {
  role: RoleMeta;
  months: MonthlyCapacity[];
}

export type SeverityLevel = 'surplus' | 'balanced' | 'watch' | 'high' | 'critical';

export interface HeatmapCell {
  roleId: string;
  month: MonthKey;
  demand: number;
  supply: number;
  gap: number;
  severity: SeverityLevel;
}

export interface HeatmapMatrixRow {
  role: RoleMeta;
  cells: HeatmapCell[];
  totalDemand: number;
  totalSupply: number;
  totalGap: number;
}

export interface HeatmapMatrixResult {
  matrix: HeatmapMatrixRow[];
  months: MonthKey[];
  totals: {
    demand: number;
    supply: number;
    gap: number;
  };
}
