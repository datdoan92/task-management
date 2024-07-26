import {
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/entities/user.entity';
import { TaskRepository } from '../task.repository';

export enum TaskStatus {
  DRAFT,
  PENDING,
  IN_PROGRESS,
  DONE,
  CANCELLED,
}

@Entity({ repository: () => TaskRepository, tableName: 'tasks' })
export class Task {
  [EntityRepositoryType]?: TaskRepository;

  @ApiProperty()
  @PrimaryKey()
  id!: number;

  @ApiProperty()
  @Property()
  title: string;

  @ApiProperty()
  @Property()
  desc: string;

  @ApiProperty()
  @Enum({ items: () => TaskStatus, default: TaskStatus.DRAFT })
  status: TaskStatus;

  @ApiProperty()
  @Property({ type: 'timestamp' })
  deadline: Date;

  @ManyToOne({ nullable: true })
  assignee?: User;

  @ApiProperty()
  @Property({ type: 'boolean', default: false })
  isDeleted: boolean;

  @ApiProperty()
  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt: Date;

  @ApiProperty()
  @Property({
    type: 'timestamp',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}
