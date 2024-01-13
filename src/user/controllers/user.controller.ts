import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('balance')
  @ApiOperation({ summary: 'Check bank balance' })
  @ApiResponse({
    status: 200,
    description: 'Bank balance retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async checkBalance(@Request() req) {
    const user = await this.userService.findOne(req.user.id);

    if (!user) {
      throw new Error('User not found');
    }

    return { balance: user.balance };
  }

  @UseGuards(JwtGuard)
  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money to the bank account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 100 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Deposit successful' })
  async deposit(@Request() req, @Body('amount') amount: number) {
    const user = await this.userService.findOne(req.user.id);

    if (!user) {
      throw new Error('User not found');
    }

    user.balance += amount;
    await this.userService.updateBalance(user.id, { balance: user.balance });

    return { message: 'Deposit successful', balance: user.balance };
  }

  @UseGuards(JwtGuard)
  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from the bank account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 50 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Insufficient funds' })
  async withdraw(@Request() req, @Body('amount') amount: number) {
    const user = await this.userService.findOne(req.user.id);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.balance < amount) {
      throw new Error('Insufficient funds');
    }

    user.balance -= amount;
    await this.userService.updateBalance(user.id, { balance: user.balance });

    return { message: 'Withdrawal successful', balance: user.balance };
  }
}
