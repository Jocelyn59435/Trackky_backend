import scrapeProduct from '../../utils/scrapeProduct';

jest.mock('../../utils/scrapeProduct', () => {
  return jest.fn(() =>
    Promise.resolve({
      product_name: 'Hylo Forte 2mg Eye Drops 10mL',
      product_link:
        'https://www.chemistwarehouse.com.au/buy/72528/hylo-forte-2mg-eye-drops-10ml',
      product_image_src:
        'https://static.chemistwarehouse.com.au/ams/media/pi/72528/F2D_200.jpg',
      platform: 'Chemist Warehouse',
      status: 'active',
      original_price: 29.49,
      current_price: 29.49,
    })
  );
});

describe('test scrapeProduct()', () => {
  it('should return ProductInfo', async () => {
    const scrapeResult = await scrapeProduct(
      'https://www.chemistwarehouse.com.au/buy/72528/hylo-forte-2mg-eye-drops-10ml'
    );
    expect(scrapeResult).toStrictEqual({
      product_name: 'Hylo Forte 2mg Eye Drops 10mL',
      product_link:
        'https://www.chemistwarehouse.com.au/buy/72528/hylo-forte-2mg-eye-drops-10ml',
      product_image_src:
        'https://static.chemistwarehouse.com.au/ams/media/pi/72528/F2D_200.jpg',
      platform: 'Chemist Warehouse',
      status: 'active',
      original_price: 29.49,
      current_price: 29.49,
    });
  });
});
