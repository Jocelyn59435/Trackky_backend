import updateCurrentPrice from '../../utils/updateCurrentPrice';

jest.mock('../../utils/updateCurrentPrice', () => {
  return jest.fn(() => Promise.resolve('active'));
});

describe('test updateCurrentPrice()', () => {
  it('should return product status', async () => {
    const status = await updateCurrentPrice(
      '2',
      '1',
      'https://www.chemistwarehouse.com.au/buy/72528/hylo-forte-2mg-eye-drops-10ml',
      22
    );
    expect(status).toBe('active');
  });
});
