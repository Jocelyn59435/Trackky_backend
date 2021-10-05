import { CheckDate } from '../../utils/checkDate';

describe('test CheckDate()', () => {
  it('should return false for expired time', () => {
    expect(CheckDate(Date.now() - 3 * 3600 * 1000, 2)).toBe(false);
  });
  it('should return true for valid time', () => {
    expect(CheckDate(Date.now() - 1 * 3600 * 1000, 2)).toBe(true);
  });
});
