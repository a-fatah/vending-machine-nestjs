import { Injectable, NotAcceptableException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { User } from "src/user/entities/user.entity";
import { LoginDto } from "./auth.controller";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userService.findByUsername(username);

        if (!user) {
            throw new NotAcceptableException('Invalid username or password');
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password);
        
        if (isPasswordMatching) {
            return user;
        }

        return null;
    }

    async login(user: LoginDto) {
        const { username, password } = user;
        const userFound = await this.validateUser(username, password);

        const payload = { username, role: userFound.role, sub: username };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}