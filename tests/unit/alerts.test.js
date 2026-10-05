import { describe, it, expect } from 'vitest';
import { activeAlerts, untilLabel } from '../../frontend/src/utils/alerts';

const NOW = new Date('2026-10-05T03:00:00Z');

describe('activeAlerts', () => {
  it('drops official alerts whose expiresAt has passed', () => {
    const alerts = [
      { id: 'a', expiresAt: '2026-10-05T02:40:00Z' },
      { id: 'b', expiresAt: '2026-10-05T04:00:00Z' },
      { id: 'c' },
    ];
    expect(activeAlerts(alerts, NOW).map((a) => a.id)).toEqual(['b', 'c']);
  });

  it('drops alerts with an unreadable expiry', () => {
    expect(activeAlerts([{ id: 'x', expiresAt: 'soon' }], NOW)).toEqual([]);
  });

  it('returns an empty list for missing input', () => {
    expect(activeAlerts(undefined, NOW)).toEqual([]);
  });
});

describe('untilLabel', () => {
  it('formats the end time in IST', () => {
    expect(untilLabel('2026-10-05T04:00:00Z')).toBe('until 9:30 AM IST');
  });

  it('is empty without an expiry', () => {
    expect(untilLabel(undefined)).toBe('');
    expect(untilLabel('soon')).toBe('');
  });
});
