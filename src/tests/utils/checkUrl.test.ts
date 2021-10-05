import { isValidUrl } from '../../utils/checkUrl';

describe('test isValidUrl()', () => {
  it('should return false for invalid url', () => {
    expect(isValidUrl('wwwww.jocelyn')).toBe(false);
  });
  it('should return true for valid url', () => {
    expect(
      isValidUrl(
        'https://www.chemistwarehouse.com.au/buy/72528/hylo-forte-2mg-eye-drops-10ml'
      )
    ).toBe(true);
  });
});
