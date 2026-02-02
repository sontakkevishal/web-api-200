// not going to do this but test those things directly with vitest.
// I'll add some in tonight for reference.

import { describe, it, expect } from 'vitest';
import { padSeconds, padMinutes, padHours } from './padding';

describe('padSeconds', () => {
  it('should return the correct number of seconds', () => {
    expect(padSeconds(61000)).toBe(1);
    expect(padSeconds(120000)).toBe(0);
  });
});

describe('padMinutes', () => {
  it('should return the correct number of minutes', () => {
    expect(padMinutes(61000)).toBe(1);
    expect(padMinutes(3600000)).toBe(0);
  });
});

describe('padHours', () => {
  it('should return the correct number of hours', () => {
    expect(padHours(3600000)).toBe(1);
    expect(padHours(7200000)).toBe(2);
  });
});
