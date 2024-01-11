// user.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.interface';

@Controller('/register')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async registerUser(
    @Body() userData: Partial<User>,
  ): Promise<{ message: string; accountNumber: string }> {
    try {
      // Register the user
      const accountNumber = await this.userService.registerUser(userData);

      return {
        message:
          'User registered successfully! Your Account Number is your National ID Number',
        accountNumber,
      };
    } catch (error) {
      return { message: error.message, accountNumber: null };
    }
  }
}
