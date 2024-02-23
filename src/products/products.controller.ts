import { Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { HasRole } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { User } from 'src/user/entities/user.entity';
import { ProductSummary } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HasRole(Role.Seller)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Request() req: Request & { user: User }, @Body() data: CreateProductDto) {
    const { username } = req.user;
    const { id } = await this.productsService.create(username, data);

    return { id };
  }

  @Get()
  findAll(): Promise<ProductSummary[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductSummary> {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @HasRole(Role.Seller)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Request() req: Request & { user: User }, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const { username } = req.user;
    return this.productsService.update(username, +id, updateProductDto);
  }

  @Delete(':id')
  @HasRole(Role.Seller)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Request() req: Request & { user: User }, @Param('id') id: string) {
    const { username } = req.user;
    return this.productsService.remove(username, +id);
  }
}
