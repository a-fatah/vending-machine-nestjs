import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalAuthStrategy } from './local.auth';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: 'f2492216acd2a55d15d0195a0c5f9179f5ebddcf49bcea48e779c326eaa5d57e',
            signOptions: { expiresIn: '60s' }
        })
    ], 
    providers: [AuthService, LocalAuthStrategy],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
