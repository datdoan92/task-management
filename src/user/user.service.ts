import { RegisterDto } from 'src/auth/dto';
import { hashPassword } from 'src/helpers/bcrypt';

import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { User, UserStatus } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
  ) {}

  async findOne(where: FilterQuery<User>) {
    return this.userRepo.findOne(where);
  }

  async create(data: RegisterDto) {
    const { email, password } = data;
    const userByEmail = await this.userRepo.findByEmail(email);
    if (userByEmail) {
      throw new BadRequestException('The email is already taken');
    }

    const hashedPassword = await hashPassword(password);
    const userEn = this.userRepo.create({ ...data, password: hashedPassword });
    await this.em.persistAndFlush(userEn);
  }

  async findByIdOrFail(id: number) {
    const user = await this.userRepo.findOne({ id, status: UserStatus.ACTIVE });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    return user;
  }
}
