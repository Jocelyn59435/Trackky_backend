import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import { SignUpPayload, SignInPayload } from '../types/Auth';
import { ContextType } from '../types/ContextType';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ApolloError } from 'apollo-server-express';

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

@ObjectType()
export class UpdatePasswordResponse {
  @Field((type) => String)
  email: string;
}

@ObjectType()
export class UpdatePasswordRequestResponse {
  @Field((type) => String)
  token: string;
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

  @Mutation(() => UpdatePasswordResponse)
  @Authorized()
  async resetPassword(
    @Arg('passwordInput') passwordInput: string,
    @Ctx() ctx: ContextType
  ): Promise<UpdatePasswordResponse> {
    const { db, req } = ctx;
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1];
    // it is authorized, should have the valid token
    const { email }: any = jwt.verify(token as string, tokensecret);
    const hashedPassword = await bcrypt.hash(passwordInput, 10);

    const [updatedAccount] = await db('user_info')
      .where('email', email)
      .update({ password: hashedPassword }, ['email']);

    if (!updatedAccount) {
      throw new ApolloError(`Fail to reset password: ${email}`);
    }
    return { ...updatedAccount };
  }

  @Mutation(() => UpdatePasswordRequestResponse)
  async resetPasswordRequest(
    @Arg('email') email: string,
    @Ctx() ctx: ContextType
  ): Promise<UpdatePasswordRequestResponse> {
    const { db } = ctx;
    const [user] = await db('user_info').where('email', email);
    if (!user) {
      throw new ApolloError(`Invalid email address: ${email}`);
    }
    // Signing a token with 1 hour of expiration:
    const token = jwt.sign({ email: email }, tokensecret, {
      expiresIn: 60 * 60,
    });
    return { token };
  }
}
