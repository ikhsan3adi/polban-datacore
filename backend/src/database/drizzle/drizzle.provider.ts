import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

export const drizzleProvider: FactoryProvider<NodePgDatabase<typeof schema>> = {
  provide: DRIZZLE_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');

    const pool = new Pool({
      connectionString: connectionString,
      ssl: false,
    });

    return drizzle(pool, { schema });
  },
};
