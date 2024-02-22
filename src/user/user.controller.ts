import { Controller, Request, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DepositDto } from './dto/deposit.dto';
import { HasRole } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }

  @Post('/deposit')
  @HasRole(Role.Buyer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  async deposit(@Request() req: Request & { user: User }, @Body() depositDto: DepositDto) {
    const { user } = req;
    const { amount } = depositDto;
    await this.userService.deposit(user.username, amount);
  }

}
