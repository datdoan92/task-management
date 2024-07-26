import { PaginationQuery } from 'src/shared/types/pagination-query';

import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Task, TaskStatus } from './entities/task.entity';
import { TaskRepository } from './task.repository';

interface TaskQuery extends PaginationQuery {
  assignee?: number;
  isDeleted?: boolean;
  status?: TaskStatus;
  sortBy?: [keyof Task, 'asc' | 'desc'][];
}

@Injectable()
export class TaskService {
  constructor(
    private readonly em: EntityManager,
    private readonly taskRepo: TaskRepository,
  ) {}

  async findByIdOrFail(id: number) {
    const task = await this.taskRepo.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async create(task: Task) {
    await this.em.persistAndFlush(task);
    return this.findByIdOrFail(task.id);
  }

  async update(id: number, task: Task) {
    const existingTask = await this.findByIdOrFail(id);
    await this.em.persistAndFlush(this.em.assign(existingTask, task));
    return this.findByIdOrFail(id);
  }

  async findAll(query: TaskQuery) {
    const qb = this.taskRepo.createQueryBuilder('t');
    qb.limit(query.limit);
    qb.offset(query.offset);

    if (query.assignee) {
      qb.andWhere({ assignee: query.assignee });
    }

    if ('isDeleted' in query) {
      qb.andWhere({ isDeleted: query.isDeleted });
    }

    if (query.status) {
      qb.andWhere({ status: query.status });
    }

    if (query.sortBy) {
      query.sortBy.forEach(([field, order]) => {
        qb.orderBy({ [field]: order });
      });
    }

    return qb.getResultAndCount();
  }
}
