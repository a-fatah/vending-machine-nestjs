import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  
  async create(sellerUsername: string, data: CreateProductDto): Promise<Product> {
    // find seller by username
    const seller = await this.userRepository.findOne({ where: { username: sellerUsername } });

    // check if product exists with the same name
    const productExists = await this.productRepository.findOne({ where: { name: data.name } });

    if (productExists) {
      throw new HttpException('Product with the same name already exists', 409);
    }

    // create product
    const product = new Product();
    product.name = data.name;
    product.amountAvailable = data.amountAvailable;
    product.cost = data.cost;
    product.seller = seller;

    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
