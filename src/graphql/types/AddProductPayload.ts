import { IsNotEmpty, IsPositive, MinLength } from 'class-validator';
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
  product_name: string;

  @Field((type) => String)
  @IsNotEmpty()
  product_image_src!: string;

  @Field((type) => String)
  @IsNotEmpty()
  platform!: string;

  @Field((type) => productStatus)
  @IsNotEmpty()
  status!: productStatus;

  @Field((type) => String)
  @IsNotEmpty()
  user_id!: string;

  @Field((type) => Float)
  @IsNotEmpty()
  @IsPositive()
  original_price: number;

  @Field((type) => Float)
  @IsNotEmpty()
  @IsPositive()
  current_price: number;

  @Field((type) => Float)
  @IsNotEmpty()
  @IsPositive()
  desired_price: number;

  @Field()
  @IsNotEmpty()
  price_update_time: Date;

  @Field()
  email_sent_time: Date;
}
