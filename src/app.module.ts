import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 's3cr3t',
      username: 'dev',
      database: 'restful-vending-machine',
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity.js'],
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    }
  ],
})
export class AppModule {}
