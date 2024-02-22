import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Username is too short' })
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password is too short' })
    password: string;

    @IsString()
    @IsEnum(['buyer', 'seller'], { message: 'Role must be either buyer or seller' })
    role: string;
}
