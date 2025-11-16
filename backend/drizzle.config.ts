import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env' });
}

export default defineConfig({
  dialect: 'postgresql',

  schema: './src/database/drizzle/schema/index.ts',

  out: './drizzle/migrations',

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
