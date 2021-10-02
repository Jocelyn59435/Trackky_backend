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
import { Product, CheckProductPriceResponse } from '../entities/product';
import { ContextType } from '../types/ContextType';
import { AddProductPayload } from '../types/AddProductPayload';
import { ApolloError } from 'apollo-server-errors';
import { scrapeProduct } from '../../utils/scrapeProduct';
import { isValidUrl } from '../../utils/checkUrl';

dotenv.config();
//non-null-assertion
const tokensecret: string = process.env.TOKEN_SECRET!;

@Resolver()
export class Product_Resolver {
  @Query(() => [Product])
  @Authorized()
  async getProductByUserId(
    @Arg('userId') userId: number,
    @Ctx() ctx: ContextType
  ): Promise<Product[]> {
    const { db } = ctx;
    const product = await db('product').where('id', userId).columns('*');
    return product;
  }

  @Query(() => CheckProductPriceResponse)
  @Authorized()
  async checkProductPriceByUrl(
    @Arg('url') url: string,
    @Ctx() ctx: ContextType
  ): Promise<CheckProductPriceResponse> {
    let product_info: any = {};

    try {
      product_info = await scrapeProduct(url);
    } catch (e) {
      throw new ApolloError(`Failed to fetch price: ${e.message}`);
    }
    //Scrape product info via the link

    return {
      product_name: product_info.product_name as string,
      product_image_src: product_info.product_image_src as string,
      product_link: url,
      original_price: product_info.original_price as number,
    };
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
