import { IsInt, IsPositive } from "class-validator";

export class BuyDto {
    @IsInt()
    productId: number;

    @IsInt()
    @IsPositive()
    quantity: number;
}
