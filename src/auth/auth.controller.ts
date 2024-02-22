import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller()
export class AuthController {
    constructor(private jwtService: JwtService) { }

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req: Request & { user: User }) {
        const { username, role } = req.user;
        
        const accessToken = await this.jwtService.signAsync({ username, role });

        return {
            accessToken
        }
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req: Request & { user: User }) {
        return req.user;
    }
}

export interface LoginDto {
    username: string;
    password: string;
}
