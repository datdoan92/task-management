import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import configFactory from './config/configuration';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configFactory] }),
    MikroOrmModule.forRoot(),
    AuthModule,
    TaskModule,
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
