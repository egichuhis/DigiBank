// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async isIdNumberUnique(idNumber: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { idNumber: idNumber },
    });
    return !user;
  }

  async registerUser(userData: Partial<User>): Promise<string> {
    // Check if the id_number is unique
    const isUnique = await this.isIdNumberUnique(userData.idNumber);

    if (!isUnique) {
      throw new Error('ID number already exists');
    }

    // Save the user to the database
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);

    // Return the generated account number (using id_number)
    return userData.idNumber;
  }

  async validatePassword(idNumber: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { idNumber: idNumber },
    });
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }

  async findOneWithIdNumber(idNumber: string) {
    return await this.userRepository.findOne({ where: { idNumber: idNumber } });
  }
}
