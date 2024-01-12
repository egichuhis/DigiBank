import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/services/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, UserService, JwtService],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class AuthModule {}
