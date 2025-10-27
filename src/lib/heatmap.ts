export type Severity = 'low' | 'medium' | 'high';

export interface ResourceAllocation {
  role: string;
  monthIndex: number;
  hours: number;
}

export interface HeatmapCell {
  monthIndex: number;
  hours: number;
  severity: Severity;
}

export interface HeatmapRow {
  role: string;
  totalHours: number;
  cells: HeatmapCell[];
}

export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTHS_IN_YEAR = MONTH_LABELS.length;

export function calculateSeverity(hours: number): Severity {
  if (hours >= 140) {
    return 'high';
  }
  if (hours >= 80) {
    return 'medium';
  }
  return 'low';
}

export function generateHeatmap(resources: ResourceAllocation[]): HeatmapRow[] {
  const grouped = new Map<string, HeatmapRow>();

  for (const resource of resources) {
    if (resource.monthIndex < 0 || resource.monthIndex >= MONTHS_IN_YEAR) {
      throw new RangeError(`Month index ${resource.monthIndex} is out of bounds`);
    }

    const existing = grouped.get(resource.role);
    const baseRow: HeatmapRow =
      existing ?? {
        role: resource.role,
        totalHours: 0,
        cells: Array.from({ length: MONTHS_IN_YEAR }, (_, monthIndex) => ({
          monthIndex,
          hours: 0,
          severity: 'low' as Severity,
        })),
      };

    const targetCell = baseRow.cells[resource.monthIndex];
    targetCell.hours += resource.hours;
    targetCell.severity = calculateSeverity(targetCell.hours);
    baseRow.totalHours += resource.hours;

    grouped.set(resource.role, baseRow);
  }

  return Array.from(grouped.values())
    .map((row) => ({
      ...row,
      cells: row.cells.map((cell) => ({
        ...cell,
        severity: calculateSeverity(cell.hours),
      })),
    }))
    .sort((a, b) => a.role.localeCompare(b.role));
}
