/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Product, CheckProductPriceResponse } from '../entities/product';
import { ContextType } from '../types/ContextType';
import { AddProductPayload } from '../types/AddProductPayload';
import { ApolloError } from 'apollo-server-errors';
import scrapeProduct from '../../utils/scrapeProduct';

dotenv.config();
//non-null-assertion
const tokensecret: string = process.env.TOKEN_SECRET!;

@ObjectType()
export class UpdateProductResponse {
  @Field((type) => String)
  id: string;
}

@Resolver()
export class Product_Resolver {
  @Query(() => [Product])
  @Authorized()
  async getProductByUserId(
    @Arg('userId') userId: string,
    @Arg('status') status: string,
    @Ctx() ctx: ContextType
  ): Promise<Product[]> {
    const { db } = ctx;
    const product = await db('product')
      .where({ user_id: userId, status: status })
      .columns('*');
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
    const userIdFromToken = user.id;
    const userIdFromClient = input.userId;
    console.log(
      `userTokenIdtype: ${typeof userIdFromToken}----${userIdFromToken}`
    );
    console.log(
      `userClientIdtype: ${typeof userIdFromClient}----${userIdFromClient}`
    );

    if (userIdFromClient !== userIdFromToken.toString()) {
      throw new ApolloError(`Invalid Request: Wrong identification.`);
    }
    const existingProduct = await db('product').where({
      user_id: userIdFromToken,
      product_name: product_info.product_name,
    });
    if (existingProduct.length) {
      throw new ApolloError(
        `This product has been added: ${product_info.product_name}`
      );
    }
    const { userId, ...restInput } = input;
    try {
      const [product] = await db('product')
        .insert({ ...product_info, ...restInput, user_id: userIdFromToken })
        .returning('*');
      return product;
    } catch (e) {
      throw new ApolloError(e.message);
    }
  }

  @Mutation(() => UpdateProductResponse)
  @Authorized()
  async deleteProduct(
    @Arg('id') id: string,
    @Arg('user_id') user_id: string,
    @Ctx() ctx: ContextType
  ): Promise<UpdateProductResponse> {
    const { db } = ctx;

    try {
      const [product] = await db('product').where({
        id: parseInt(id),
        user_id: parseInt(user_id),
      });
      if (!product) {
        throw new ApolloError('Product not found.');
      }
      const [updatedProduct] = await db('product')
        .where({
          id: id,
          user_id: user_id,
        })
        .del(['id']);
      if (!updatedProduct) {
        throw new ApolloError(`Failed to delete the product.`);
      }
      return { ...updatedProduct };
    } catch (e) {
      throw new ApolloError(e.message);
    }
  }

  @Mutation(() => UpdateProductResponse)
  @Authorized()
  async updateDesiredPrice(
    @Arg('id') id: string,
    @Arg('user_id') user_id: string,
    @Arg('desired_price') desired_price: number,
    @Ctx() ctx: ContextType
  ): Promise<UpdateProductResponse> {
    const { db } = ctx;

    try {
      const [product] = await db('product').where({
        id: id,
        user_id: user_id,
      });
      if (!product) {
        throw new ApolloError('Product not found.');
      }
      const [updatedProduct] = await db('product')
        .where({
          id: id,
          user_id: user_id,
        })
        .update({ desired_price: desired_price }, ['id']);
      if (!updatedProduct) {
        throw new ApolloError(`Failed to udpate deisred price.`);
      }
      return { ...updatedProduct };
    } catch (e) {
      throw new ApolloError(e.message);
    }
  }
}
