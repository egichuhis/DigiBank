import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { UserService } from 'src/user/services/user.service';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with username(National ID) and Password' })
  @ApiBody({
    schema: {
      type: 'object',
    },
    examples: {
      example1: {
        value: {
          username: '12121212',
          password: 'edwin@123',
        },
      },
      example2: {
        value: {
          username: '13131313',
          password: 'penina@123',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User Registration' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        value: {
          name: 'Edwin Gichuhi',
          nationalIdNumber: '12121212',
          email: 'edwin@example.com',
          password: 'edwin@123',
        },
      },
      example2: {
        value: {
          name: 'Penina Wahu',
          nationalIdNumber: '13131313',
          email: 'penina@example.com',
          password: 'penina@123',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({
    schema: {
      type: 'object',
    },
    examples: {
      example: {
        value: {
          refreshToken: 'your_refresh_token_here',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'JWT token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
