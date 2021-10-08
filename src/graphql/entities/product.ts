/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType, ID, Float } from 'type-graphql';
import { productStatus } from './enum/product_status';
import { registerEnumType } from 'type-graphql';

registerEnumType(productStatus, {
  name: 'productStatus', // this one is mandatory
});

@ObjectType({ description: 'type definition for product' })
export class Product {
  @Field((type) => ID)
  id!: string;
  @Field((type) => String)
  product_name!: string;
  @Field((type) => String)
  product_image_src!: string;
  @Field((type) => String)
  product_link!: string;
  @Field((type) => String)
  platform!: string;
  @Field((type) => productStatus)
  status!: productStatus;
  @Field((type) => String)
  user_id!: string;
  @Field((type) => Float)
  original_price!: number;
  @Field((type) => Float)
  current_price: number;
  @Field((type) => Float)
  desired_price!: number;
  @Field()
  price_update_time: number;
  @Field()
  email_sent_time: number;
  @Field()
  created_at: Date;
  @Field()
  updated_at: Date;
}

@ObjectType()
export class CheckProductPriceResponse {
  @Field((type) => String)
  product_name: string;

  @Field((type) => String)
  product_link: string;

  @Field((type) => String)
  product_image_src: string;

  @Field((type) => Float)
  original_price!: number;
}
