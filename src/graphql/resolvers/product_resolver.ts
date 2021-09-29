import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Product } from '../entities/product';
import { ContextType } from '../types/ContextType';
import { AddProductPayload } from '../types/AddProductPayload';
import { ApolloError } from 'apollo-server-errors';
import { scrapeProduct } from '../../utils/scrapeProduct';

dotenv.config();
//non-null-assertion
const tokensecret: string = process.env.TOKEN_SECRET!;

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
    const { db, req } = ctx;

    //Scrape product info via the link
    const product_info = await scrapeProduct(input.product_link);

    // Get userId from token
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1];
    // it is authorized, should have the valid token
    const { email }: any = jwt.verify(token as string, tokensecret);
    const [user] = await db('user_info').where('email', email);
    const userId = user.id;
    const existingProduct = await db('product').where({
      user_id: userId,
      product_name: product_info.product_name,
    });
    if (existingProduct.length) {
      throw new ApolloError(
        `This product has been added: ${product_info.product_name}`
      );
    }

    try {
      const [product] = await db('product')
        .insert({ ...product_info, ...input, user_id: userId })
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
