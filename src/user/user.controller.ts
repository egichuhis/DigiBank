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

  // @UseGuards(JwtGuard)
  // @Get(':id/comments')
  // getUserComment(@Param('id') id: string) {
  //   return this.commentService.findUserComments(id);
  // }

  @Get(':id/balance')
  async checkBalance(@Param('id') id: string) {
    const userId = Number(id);

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { balance: user.balance };
  }

  @Post(':id/deposit')
  async deposit(@Param('id') id: string, @Body() body: { amount: number }) {
    const userId = Number(id);

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.balance += body.amount;

    await this.userService.save(user);

    return { balance: user.balance };
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Body() body: { amount: number }) {
    const userId = Number(id);

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.balance < body.amount) {
      throw new NotFoundException('Insufficient funds');
    }

    user.balance -= body.amount;

    await this.userService.save(user);

    return { balance: user.balance };
  }
}
