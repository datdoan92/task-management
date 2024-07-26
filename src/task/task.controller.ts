import { Request } from 'express';
import { SortByPipe } from 'src/shared/pipes/sort-by.pipe';
import { UserId } from 'src/user/decorators/user-id.decorator';

import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { Task, TaskStatus } from './entities/task.entity';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiTags('Task')
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskSrv: TaskService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  async findOne(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.taskSrv.findByIdOrFail(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks assigned to the user' })
  @ApiQuery({
    name: 'offset',
    required: false,
    schema: { default: 0, type: 'number' },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { default: 10, type: 'number' },
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatus,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    isArray: true,
    schema: {
      type: 'string',
      items: { type: 'string' },
    },
    description: 'Sort by field name. Prefix with - for descending order',
  })
  @ApiOkResponse({ type: Task, isArray: true })
  async findAll(
    @Req() req: Request,
    @UserId() userId: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('status') status?: TaskStatus,
    @Query('sortBy', new SortByPipe(['createdAt', 'deadline']))
    sortBy?: [keyof Task, 'asc' | 'desc'][],
  ) {
    const [tasks, total] = await this.taskSrv.findAll({
      assignee: userId,
      isDeleted: false,
      offset,
      limit,
      status,
      sortBy,
    });

    req.res?.setHeader('X-Total-Count', total.toString());
    return tasks;
  }
}
