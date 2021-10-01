import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { SignUpPayload, SignInPayload } from '../types/Auth';
import { ContextType } from '../types/ContextType';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ApolloError } from 'apollo-server-express';
import randomString from 'randomstring';
import { CheckDate } from '../../utils/checkDate';

dotenv.config();
//non-null-assertion
const tokensecret: string = process.env.TOKEN_SECRET!;

@ObjectType()
export class AuthResponse {
  @Field((type) => String)
  token: string;

  @Field((type) => String)
  first_name: string;

  @Field((type) => String)
  last_name: string;

  @Field((type) => String)
  email: string;

  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class ResetPasswordResponse {
  @Field((type) => String)
  email: string;

  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class ResetPasswordRequestResponse {
  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class CheckSecureCodeResponse {
  @Field((type) => Boolean)
  isValidCode: boolean;
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
    const token = jwt.sign({ email: input.email, id: user.id }, tokensecret);
    return {
      token,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
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

    const token = jwt.sign({ email: input.email, id: user.id }, tokensecret);
    return {
      token,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
    };
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Arg('passwordInput') passwordInput: string,
    @Arg('reset_password_secure_code') reset_password_secure_code: string,
    @Ctx() ctx: ContextType
  ): Promise<ResetPasswordResponse> {
    const { db } = ctx;
    const [user] = await db('user_info').where(
      'reset_password_secure_code',
      reset_password_secure_code
    );
    const isValidCode: boolean = CheckDate(
      parseInt(user.secure_code_update_time),
      2
    );
    if (!isValidCode) {
      throw new ApolloError(`Expired secure code.`);
    }
    if (!user) {
      throw new ApolloError(`Invalid secure code.`);
    }
    const hashedPassword = await bcrypt.hash(passwordInput, 10);
    const [updatedAccount] = await db('user_info')
      .where('reset_password_secure_code', reset_password_secure_code)
      .update({ password: hashedPassword }, ['email', 'id']);

    if (!updatedAccount) {
      throw new ApolloError(`Fail to reset password.`);
    }
    return { ...updatedAccount };
  }

  @Mutation(() => ResetPasswordRequestResponse)
  async resetPasswordRequest(
    @Arg('email') email: string,
    @Ctx() ctx: ContextType
  ): Promise<ResetPasswordRequestResponse> {
    const { db } = ctx;
    const [user] = await db('user_info').where('email', email);
    if (!user) {
      throw new ApolloError(`Invalid email address: ${email}`);
    }
    const reset_password_secure_code = randomString.generate();
    console.log(reset_password_secure_code);
    const [updatedAccount] = await db('user_info').where('email', email).update(
      {
        reset_password_secure_code: reset_password_secure_code,
        secure_code_update_time: Date.now(),
      },
      ['email', 'id', 'reset_password_secure_code']
    );
    console.log(reset_password_secure_code);
    if (!updatedAccount) {
      throw new ApolloError(`Failed to generate secure code: ${email}`);
    }
    return {
      id: user.id,
    };
  }

  @Query(() => CheckSecureCodeResponse)
  async checkSecureCode(
    @Arg('reset_password_secure_code') reset_password_secure_code: string,
    @Ctx() ctx: ContextType
  ): Promise<CheckSecureCodeResponse> {
    const { db } = ctx;
    const [user] = await db('user_info').where(
      'reset_password_secure_code',
      reset_password_secure_code
    );
    if (!user) {
      throw new ApolloError(`Invalid secure code.`);
    }
    const isValidCode: boolean = CheckDate(
      parseInt(user.secure_code_update_time),
      2
    );
    if (!isValidCode) {
      throw new ApolloError(`Expired secure code.`);
    }
    return { isValidCode, email: user.email };
  }
}
