import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { SignUpPayload, SignInPayload } from '../types/Auth';
import { ContextType } from '../types/ContextType';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ApolloError } from 'apollo-server-express';
import { EmailAddress } from '@sendgrid/helpers/classes';

dotenv.config();
//non-null-assertion
const tokensecret: string = process.env.TOKEN_SECRET!;

@ObjectType()
export class AuthResponse {
  @Field((type) => String)
  token: string;

  @Field((type) => String)
  firstName: string;

  @Field((type) => String)
  lastName: string;

  @Field((type) => String)
  email: string;
}

@Resolver()
export class Auth_Resolver {
  @Mutation(() => AuthResponse)
  async signUp(
    @Arg('input') input: SignUpPayload,
    @Ctx() ctx: ContextType
  ): Promise<AuthResponse> {
    const { db } = ctx;
    //use bcrypt to hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const email = input.email.toLowerCase();
    //validate user input
    const existingEmail = await db('user_info').where('email', email);
    if (existingEmail.length) {
      throw new ApolloError(`This email address has been registered: ${email}`);
    }
    // insert data to database
    const [user] = await db('user_info')
      .insert({ ...input, password: hashedPassword })
      .returning('*');
    const token = jwt.sign({ email: input.email }, tokensecret);
    return {
      token,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @Mutation(() => AuthResponse)
  async signIn(
    @Arg('input') input: SignInPayload,
    @Ctx() ctx: ContextType
  ): Promise<AuthResponse> {
    const { db } = ctx;
    const [user] = await db('user_info').where('email', input.email);

    if (!user) {
      throw new ApolloError(`Invalid email address: ${input.email}`);
    }

    const isValidPassword = bcrypt.compareSync(input.password, user.password);

    if (!isValidPassword) {
      throw new ApolloError(`Invalid credentials.`);
    }

    const token = jwt.sign({ email: input.email }, tokensecret);
    return {
      token,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @Mutation(() => String)
  async resetPassword(
    @Arg('email') email: string,
    @Arg('passwordInput') passwordInput: string,
    @Ctx() ctx: ContextType
  ): Promise<string> {
    const { db } = ctx;
    const [{ updatedAccount }] = await db('user_info')
      .where('email', email)
      .update({ password: passwordInput }, ['email']);

    if (!updatedAccount) {
      throw new ApolloError(`Invalid email address: ${email}`);
    }
    return updatedAccount;
  }
}
