import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema.js';
import { Model } from 'mongoose';
import { RequestWithUser } from '../types.js';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const token = request.get('Authorization')?.trim();

    if (!token) {
      throw new UnauthorizedException('No token provided!');
    }

    const user = await this.userModel.findOne({ token });

    if (!user) {
      throw new UnauthorizedException('Unauthorized: Invalid token!');
    }

    request.user = user;
    return true;
  }
}