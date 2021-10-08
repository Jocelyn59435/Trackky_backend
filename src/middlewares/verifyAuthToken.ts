/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AuthChecker } from 'type-graphql';
import { ContextType } from '../graphql/types/ContextType';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticationError } from 'apollo-server-errors';

dotenv.config();
//non-null-assertion
const tokensecret: string = process.env.TOKEN_SECRET!;

export const authChecker: AuthChecker<ContextType> = async ({ context }) => {
  const { db, req } = context;
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    throw new AuthenticationError('Invalid request. ' + authorizationHeader);
  }
  const token = authorizationHeader.split(' ')[1];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = jwt.verify(token, tokensecret);
  const [user] = await db('user_info').where('email', data.email);
  if (!user) {
    throw new AuthenticationError('User not found.');
  }
  return true;
};
