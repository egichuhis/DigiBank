import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  nationalIdNumber: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
