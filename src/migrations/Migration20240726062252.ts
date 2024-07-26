import { Migration } from '@mikro-orm/migrations';

export class Migration20240726062252 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" serial primary key, "status" smallint null default 1, "email" varchar(255) not null, "role" smallint null default 0, "password" varchar(255) not null, "created_at" timestamptz null);');
    this.addSql('alter table "users" add constraint "idx_users_email" unique ("email");');

    this.addSql('create table "tasks" ("id" serial primary key, "title" varchar(255) not null, "desc" varchar(255) not null, "status" smallint not null default 0, "deadline" timestamptz not null, "assignee_id" int null, "is_deleted" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null);');

    this.addSql('alter table "tasks" add constraint "tasks_assignee_id_foreign" foreign key ("assignee_id") references "users" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tasks" drop constraint "tasks_assignee_id_foreign";');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "tasks" cascade;');
  }

}
