import { describe, expect, it } from 'vitest';
import {
  MONTH_LABELS,
  calculateSeverity,
  generateHeatmap,
  type ResourceAllocation,
} from '../lib/heatmap';

describe('heatmap utilities', () => {
  it('categorises severity bands based on hours', () => {
    expect(calculateSeverity(0)).toBe('low');
    expect(calculateSeverity(90)).toBe('medium');
    expect(calculateSeverity(200)).toBe('high');
  });

  it('creates a 12 month grid for each unique role', () => {
    const allocations: ResourceAllocation[] = [
      { role: 'Epic Analyst', monthIndex: 0, hours: 80 },
      { role: 'Epic Analyst', monthIndex: 1, hours: 40 },
      { role: 'Nurse Trainer', monthIndex: 0, hours: 160 },
    ];

    const heatmap = generateHeatmap(allocations);

    expect(heatmap).toHaveLength(2);
    const analystRow = heatmap.find((row) => row.role === 'Epic Analyst');
    expect(analystRow?.cells).toHaveLength(MONTH_LABELS.length);
    expect(analystRow?.cells[0]).toMatchObject({ hours: 80, severity: 'medium' });
    expect(analystRow?.cells[1]).toMatchObject({ hours: 40, severity: 'low' });

    const trainerRow = heatmap.find((row) => row.role === 'Nurse Trainer');
    expect(trainerRow?.cells[0]).toMatchObject({ hours: 160, severity: 'high' });
    expect(trainerRow?.totalHours).toBe(160);
  });

  it('guards against invalid month indexes', () => {
    expect(() =>
      generateHeatmap([
        { role: 'Bad Data', monthIndex: -1, hours: 10 },
      ]),
    ).toThrowError('Month index -1 is out of bounds');
  });
});
