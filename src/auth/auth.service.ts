import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(idNumber: string, password: string): Promise<any> {
    const user = await this.userService.findOneWithIdNumber(idNumber);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { idNumber: user.idNumber, sub: user.id };
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
