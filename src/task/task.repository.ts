import { EntityRepository } from '@mikro-orm/postgresql';
import { Task } from './entities/task.entity';

export class TaskRepository extends EntityRepository<Task> {}
