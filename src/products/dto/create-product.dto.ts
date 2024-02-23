import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsInt()
    amountAvailable: number;

    @IsInt()
    cost: number;
}
