import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.DRAFT,
  })
  status?: TaskStatus;

  @ApiPropertyOptional()
  assigneeId?: number;
}
