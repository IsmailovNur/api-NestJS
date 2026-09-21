import {
  BadRequestException,
  Body,
  Controller,
  Post, Req,
  UnauthorizedException, UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema.js';
import { Model } from 'mongoose';
import { RegisterUserDto } from './register.user.dto.js';
import { LoginUserDto } from './login.user.dto.js';
import { AuthGuard } from '../middlewares/auth.guard.js';
import type { RequestWithUser } from '../types.js';


@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
  }

  @Post()
  async register(@Body() userDto: RegisterUserDto) {
    const username = userDto?.username?.trim();
    const password = userDto?.password?.trim();

    if (!username) {
      throw new BadRequestException('Username is required!');
    }

    if (!password) {
      throw new BadRequestException('Password is required!');
    }

    const existingUser = await this.userModel.findOne({ username });

    if (existingUser) {
      throw new BadRequestException('Username is already taken!');
    }

    const user = new this.userModel({
      username,
      password,
      role: 'user',
    });

    user.generateToken();

    try {
      return await user.save();
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === 11000) {
        throw new BadRequestException('Username is already taken!');
      }

      throw e;
    }
  }

  @Post('/login')
  async login(@Body() userDto: LoginUserDto) {
    const username = userDto?.username?.trim();
    const password = userDto?.password?.trim();

    if (!username || !password) {
      throw new BadRequestException('Username and password are required!');
    }

    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Incorrect Username or password!');
    }

    const isPasswordCorrect =
      await user.checkPassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect Username or password!');
    }

    user.generateToken();
    await user.save();
    return user;
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException('Unauthenticated!');
    }

    request.user.generateToken();
    await request.user.save();
    return { message: 'Logout successful!' };
  }
}