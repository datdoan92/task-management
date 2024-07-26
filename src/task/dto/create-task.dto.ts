import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the Task',
    example: 'Task Title',
  })
  @IsNotEmpty()
  readonly title!: string;

  @ApiProperty({
    description: 'The description of the Task',
    example: 'Task Description',
  })
  @IsNotEmpty()
  readonly desc!: string;

  @ApiProperty({
    description: 'The deadline of the Task',
    example: '2021-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsNotEmpty()
  readonly deadline!: Date;
}
