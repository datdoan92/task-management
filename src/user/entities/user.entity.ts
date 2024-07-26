import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/postgresql';

import { UserRepository } from '../user.repository';
import { Task } from '../../task/entities/task.entity';

export enum UserStatus {
  INACTIVE,
  ACTIVE,
  DELETED,
}

export enum UserRole {
  USER,
  ADMIN,
}

@Entity({ repository: () => UserRepository, tableName: 'users' })
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  id!: number;

  @Enum({ items: () => UserStatus, default: UserStatus.ACTIVE })
  status?: UserStatus = UserStatus.ACTIVE;

  @Unique({ name: 'idx_users_email' })
  @Property({ hidden: true })
  email: string;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role?: UserRole = UserRole.USER;

  @Property({ hidden: true })
  password: string;

  @OneToMany(() => Task, (task) => task.assignee, { hidden: true })
  tasks = new Collection<Task>(this);

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
