import { Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BuyDto } from './dto/buy.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { HasRole } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/buy')
  @HasRole(Role.Buyer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async buy(@Request() req: Request & { user: User }, @Body() buyDto: BuyDto) {

    const { username } = req.user;
    const { product, cost, changeAmount } =  await this.transactionsService.buy(username, buyDto);

    const changeCoins = this.transactionsService.calculateChangeDenominations(changeAmount);

    return {
      productName: product.name,
      moneySpent: cost,
      change: changeCoins
    };

  }

}
