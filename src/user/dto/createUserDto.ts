import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  idNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
