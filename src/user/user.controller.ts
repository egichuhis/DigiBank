import {
  Body,
  Request,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id/balance')
  async checkBalance(@Param('id') id: string) {
    const userId = Number(id);

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { balance: user.balance };
  }

  @UseGuards(JwtGuard)
  @Post(':id/deposit')
  async deposit(@Param('id') id: string, @Body() body: { amount: number }) {
    const userId = Number(id);

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const depositAmountInShillings = Math.round(body.amount);

    user.balance += depositAmountInShillings;

    await this.userService.save(user);

    return { balance: user.balance };
  }

  @UseGuards(JwtGuard)
  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Body() body: { amount: number }) {
    const userId = Number(id);

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const withdrawalAmountInShillings = Math.round(body.amount);

    if (user.balance < withdrawalAmountInShillings) {
      throw new NotFoundException('Insufficient funds');
    }

    user.balance -= withdrawalAmountInShillings;

    await this.userService.save(user);

    return { balance: user.balance };
  }
}
