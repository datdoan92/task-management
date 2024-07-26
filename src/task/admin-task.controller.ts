import { Request } from 'express';
import { SortByPipe } from 'src/shared/pipes/sort-by.pipe';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/user/guards/roles.guard';

import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

import { CreateTaskDto, UpdateTaskDto } from './dto';
import { Task, TaskStatus } from './entities/task.entity';
import { TaskService } from './task.service';
import { UserService } from 'src/user/user.service';

@ApiBearerAuth()
@ApiTags('Admin Task')
@Controller('admin/tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles([UserRole.ADMIN])
export class AdminTaskController {
  constructor(
    private readonly taskSrv: TaskService,
    private readonly userSrv: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  @ApiOkResponse({ type: Task })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskSrv.create(new Task(createTaskDto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiOkResponse({ type: Task })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const newTask = new Task(updateTaskDto);
    if (updateTaskDto.assigneeId) {
      const assignee = await this.userSrv.findByIdOrFail(
        updateTaskDto.assigneeId,
      );
      newTask.assignee = assignee;
    }
    return this.taskSrv.update(id, newTask);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  async findOne(@Param('id') id: number) {
    return this.taskSrv.findByIdOrFail(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
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
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
    description: 'Sort by field name. Prefix with - for descending order',
  })
  @ApiOkResponse({ type: Task, isArray: true })
  async findAll(
    @Req() req: Request,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('status') status?: TaskStatus,
    @Query('sortBy', new SortByPipe(['createdAt', 'deadline']))
    sortBy?: [keyof Task, 'asc' | 'desc'][],
  ) {
    const [tasks, total] = await this.taskSrv.findAll({
      isDeleted: false,
      offset,
      limit,
      sortBy,
      status,
    });

    req.res?.setHeader('X-Total-Count', total.toString());
    return tasks;
  }
}
