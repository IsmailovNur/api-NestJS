import { Request } from 'express';
import { UserDocument } from './schemas/user.schema.js';

export type Role = 'admin' | 'user';

export interface RequestWithUser extends Request {
  user?: UserDocument;
}