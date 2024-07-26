import { defineConfig } from '@mikro-orm/postgresql';

import configFactory from './config/configuration';

const { dbOpts } = configFactory();
export default defineConfig(dbOpts);
