import { comparePasswords } from 'src/helpers/bcrypt';
import { UserStatus } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import {
  Body,
  Controller,
  HttpException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authSrv: AuthService,
    private readonly userSrv: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 400,
    description: 'The email is already taken',
    schema: { example: { message: 'The email is already taken' } },
  })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  async register(@Body() body: RegisterDto) {
    await this.userSrv.create(body);
    return { message: 'Registration successful' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 401,
    description: 'Email or password is incorrect',
    schema: { example: { message: 'Email or password is incorrect' } },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: { example: { token: 'string' } },
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;
    const foundUser = await this.userSrv.findOne({
      email,
      status: UserStatus.ACTIVE,
    });
    const message = 'Email or password is incorrect';
    if (!foundUser) {
      throw new HttpException({ message }, 401);
    }

    const isPasswordMatch = await comparePasswords(
      password,
      foundUser.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException({ message }, 401);
    }

    const token = await this.authSrv.generateJWT(foundUser);
    return { token };
  }
}
