import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from './exceptions/user.exceptions';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check if the user already exists
    const { username, password, role } = createUserDto;
    const userExists = await this.findByUsername(username);
    if (userExists) {
      throw new UserAlreadyExistsException(username);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.username = username;
    user.password = hashedPassword
    user.role = role;
    user.deposit = 0;

    return this.userRepository.save(user);
  }


  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async deposit(username: string, amount: number): Promise<User> {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    console.log(`Depositing ${amount} to ${username}...`)

    user.deposit += amount;
    return this.userRepository.save(user);
  }

}
