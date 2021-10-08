/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Field, Float, InputType } from 'type-graphql';
import { productStatus } from '../entities/enum/product_status';
import { registerEnumType } from 'type-graphql';

registerEnumType(productStatus, {
  name: 'productStatus', // this one is mandatory
});

@InputType()
export class AddProductPayload {
  @Field((type) => String)
  @IsNotEmpty()
  product_link: string;

  @Field((type) => Float)
  @IsNotEmpty()
  @IsPositive()
  desired_price: number;

  @Field((type) => String)
  @IsNotEmpty()
  userId: number;
}
