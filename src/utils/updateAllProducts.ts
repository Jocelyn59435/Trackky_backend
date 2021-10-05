import updateCurrentPrice from './updateCurrentPrice';
import { db } from '../index';

const updateAllProducts = async (): Promise<void> => {
  try {
    const products = await db('product').where('status', 'active');
    if (!products) {
      throw new Error('Failed to fetch products.');
    }
    products.forEach((p) => {
      updateCurrentPrice(p.user_id, p.id, p.product_link, p.desired_price);
    });
  } catch (e) {
    console.log('Errors from updateAllProducts' + e.message);
  }
  console.log('Called.');
};

export default updateAllProducts;
