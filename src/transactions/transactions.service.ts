import { HttpException, Injectable } from '@nestjs/common';
import { BuyDto } from './dto/buy.dto';
import { UserService } from 'src/user/user.service';
import { ProductsService } from 'src/products/products.service';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {

  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductsService,
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async buy(username: string, buyDto: BuyDto): Promise<Transaction> {
    // check if user exists
    const buyer = await this.userService.findByUsername(username);

    if (!buyer) {
      throw new HttpException('User not found', 404);
    }

    // check if product exists
    const { productId, quantity } = buyDto;
    const product = await this.productService.findOne(productId);

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    // check if amount is available
    const { amountAvailable, cost  } = product;
    if (amountAvailable < quantity) {
      throw new HttpException('Not enough amount available', 409);
    }

    // check if user has enough deposit
    if (buyer.deposit < cost * quantity) {
      throw new HttpException('Not enough deposit', 409);
    }

    // update user deposit
    buyer.deposit -= cost * quantity;
    await this.userService.update(buyer);

    // update product availability
    const newAvailability = amountAvailable - quantity;
    await this.productService.updateAvailability(product.id, newAvailability);

    // create transaction
    const transaction: Transaction = {
      buyer,
      product,
      quantity,
      cost,
      timestamp: new Date(),
      changeAmount: buyer.deposit - cost * quantity
    }

    return this.transactionRepository.save(transaction);
  }

  public calculateChangeDenominations(change: number) {
    const denominations = [100, 50, 20, 10, 5];
    const changeDenominations = new Map<number, number>();
    let remainingChange = change;
    for (let i = 0; i < denominations.length; i++) {
      const denomination = denominations[i];
      const count = Math.floor(remainingChange / denomination);
      if (count > 0) {
        changeDenominations.set(denomination, count);
        remainingChange -= denomination * count;
      }
    }
    return changeDenominations;
  }

}
