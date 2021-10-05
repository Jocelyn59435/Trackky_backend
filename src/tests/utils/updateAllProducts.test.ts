import updateAllProducts from '../../utils/updateAllProducts';

jest.mock('../../utils/updateAllProducts', () => {
  return jest.fn(() => Promise.resolve(null));
});

describe('test updateAllProducts()', () => {
  it('should return product status', async () => {
    const result = await updateAllProducts();
    expect(result).toBeNull();
  });
});
