import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { User_info } from '../entities/user_info';
import { ContextType } from '../types/ContextType';

@Resolver()
export class User_info_Resolver {
  @Query(() => User_info)
  @Authorized()
  async getUserInfo(
    @Arg('email') email: string,
    @Ctx() ctx: ContextType
  ): Promise<User_info> {
    const { db } = ctx;
    const [user_info] = await db('user_info')
      .where('email', email)
      .columns('*');
    return user_info;
  }
}
