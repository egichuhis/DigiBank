import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { UserService } from 'src/user/services/user.service';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        value: {
          name: 'Mercy Elizabeth',
          idNumber: '12345678',
          email: 'mercy.liz@example.com',
          password: 'password123',
        },
      },
      example2: {
        value: {
          name: 'Paul Kimono',
          idNumber: '12345679',
          email: 'paul.kim@example.com',
          password: 'password124',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
