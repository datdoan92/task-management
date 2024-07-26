import { UserModule } from 'src/user/user.module';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AdminTaskController } from './admin-task.controller';
import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController, AdminTaskController],
  providers: [TaskService],
  exports: [TaskService],
  imports: [MikroOrmModule.forFeature({ entities: [Task] }), UserModule],
})
export class TaskModule {}
