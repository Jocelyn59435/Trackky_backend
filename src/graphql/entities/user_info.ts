/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType({ description: 'type definition for user_info' })
export class User_info {
  @Field((type) => ID)
  id!: string;
  @Field((type) => String)
  email!: string;
  // not expose password field
  password!: string;
  @Field()
  created_at: Date;
  @Field()
  updated_at: Date;
}
