import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput) {
    const newUser = new User();
    newUser.username = createUserInput.username;
    newUser.password = createUserInput.password;
    this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(username: string) {
    const result = await this.usersRepository.find({
      relations: { emergencyContacts: true, partner: true },
      where: {
        username: username,
      },
    });
    return result[0];
  }

  async update(username: string, updateUserInput: UpdateUserInput) {
    await this.usersRepository.update({ username: username }, updateUserInput);
    return await this.usersRepository.findOneBy({ username });
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
