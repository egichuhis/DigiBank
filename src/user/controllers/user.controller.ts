// user.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserEntity } from '../models/user.entity';

@Controller('api/register')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async registerUser(
    @Body() userData: Partial<UserEntity>,
  ): Promise<{ message: string; accountNumber: string }> {
    try {
      // Register the user
      const accountNumber = await this.userService.registerUser(userData);

      return { message: 'User registered successfully', accountNumber };
    } catch (error) {
      return { message: error.message, accountNumber: null };
    }
  }
}
