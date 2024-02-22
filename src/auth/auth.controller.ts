import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";

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
}

export interface LoginDto {
    username: string;
    password: string;
}
