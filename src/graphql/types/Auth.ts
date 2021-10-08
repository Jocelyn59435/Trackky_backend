/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class SignUpPayload {
  @Field((type) => String)
  @IsNotEmpty()
  @MaxLength(15)
  first_name: string;

  @Field((type) => String)
  @IsNotEmpty()
  @MaxLength(15)
  last_name: string;

  @Field((type) => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

@InputType()
export class SignInPayload {
  @Field((type) => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
