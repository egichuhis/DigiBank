// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';

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

  async registerUser(userData: Partial<UserEntity>): Promise<string> {
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
}
