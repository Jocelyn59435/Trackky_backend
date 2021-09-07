import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Product } from '../entities/product';
import { ContextType } from '../types/ContextType';
import { AddProductPayload } from '../types/AddProductPayload';
import { ApolloError } from 'apollo-server-errors';

@Resolver()
export class Product_Resolver {
  @Query(() => Product)
  @Authorized()
  async getProductById(
    @Arg('id') id: string,
    @Ctx() ctx: ContextType
  ): Promise<Product> {
    const { db } = ctx;
    const [product] = await db('product').where('id', id).columns('*');
    return product;
  }

  @Mutation(() => Product)
  @Authorized()
  async addProduct(
    @Arg('input') input: AddProductPayload,
    @Ctx() ctx: ContextType
  ): Promise<Product> {
    const { db } = ctx;
    const existingProduct = await db('product').where({
      user_id: input.user_id,
      product_name: input.product_name,
    });
    if (existingProduct.length) {
      throw new ApolloError(
        `This product has been added: ${input.product_name}`
      );
    }
    try {
      const [product] = await db('product')
        .insert({ ...input })
        .returning('*');
      return product;
    } catch (e) {
      throw new ApolloError(e.message);
    }
  }

  @Mutation(() => Int)
  @Authorized()
  async deleteProduct(
    @Arg('id') id: string,
    @Arg('user_id') user_id: string,
    @Ctx() ctx: ContextType
  ): Promise<number> {
    const { db } = ctx;

    try {
      const [product] = await db('product').where({
        id: id,
        user_id: user_id,
      });
      if (!product) {
        throw new ApolloError('Product not found.');
      }
      return await db('product')
        .where({
          id: id,
          user_id: user_id,
        })
        .del();
    } catch (e) {
      throw new ApolloError(e.message);
    }
  }
}
