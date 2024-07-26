import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlOptions } from '@mikro-orm/postgresql/PostgreSqlMikroORM';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import * as dotenv from 'dotenv';
dotenv.config();

export interface Configuration {
  // value of NODE_ENV variable, use by express and other libraries
  // can be `development`, `production`
  nodeEnv: string;
  auth: {
    // Access token lifetime, expressed in seconds
    // or a string describing a time span:
    // [zeit/ms](https://github.com/zeit/ms.js).
    // Eg: 60, "2 days", "10h", "7d"
    accessTokenLifetime: string | number;
    // secret to generate token
    secret: string;
  };
  dbOpts: PostgreSqlOptions;
}

export const configFactory = (): Configuration => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  auth: {
    accessTokenLifetime: '1h',
    secret: process.env.JWT_SECRET || 'tPmdfvPWW6dH4qb733',
  },
  dbOpts: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dbName: process.env.DB_NAME || 'postgres',
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: true,
    highlighter: new SqlHighlighter(),
    metadataProvider: TsMorphMetadataProvider,
    extensions: [Migrator, EntityGenerator],
  },
});

export default configFactory;
