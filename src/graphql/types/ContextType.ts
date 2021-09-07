import { Request, Response } from 'express';
import Knex from 'knex';

export type ContextType = {
  req: Request;
  res: Response;
  db: Knex;
};
