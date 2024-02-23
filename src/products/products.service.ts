import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductSummary } from './entities/product.entity';
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

  async findAll(): Promise<ProductSummary[]> {
    const products = await this.productRepository.find();

    return products.map(product => {
      return {
        name: product.name,
        amountAvailable: product.amountAvailable,
        cost: product.cost,
        seller: { name: product.seller.username }
      }
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  private async validateSellerOwnsProduct(username: string, id: number): Promise<void> {
    // find seller by username
    const seller = await this.userRepository.findOne({ where: { username } });

    if (!seller) {
      throw new HttpException('User not found', 404);
    }

    console.log(`Checking if seller ${seller.username} has product with id ${id}`)
    const product = await this.productRepository.findOne({ where: { id, seller } });

    if (!product) {
      throw new HttpException('Product not found', 404);
    }
  }

  async update(username: string, id: number, updateProductDto: UpdateProductDto) {
    await this.validateSellerOwnsProduct(username, id);

    return this.productRepository.update({ id }, updateProductDto);
  }

  async remove(username: string, id: number) {
    await this.validateSellerOwnsProduct(username, id);

    return this.productRepository.delete({ id });
  }

  updateAvailability(id: number, amountAvailable: number) {
    return this.productRepository.update({ id }, { amountAvailable });
  }

}
