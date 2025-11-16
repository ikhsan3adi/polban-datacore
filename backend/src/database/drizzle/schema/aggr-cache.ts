import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

// tabel untuk menyimpan hasil agregat JSON untuk API
export const aggrCache = pgTable('aggr_cache', {
  // key akan menjadi string unik, cth 'guest:gender'
  cacheKey: text('cache_key').primaryKey(),

  // menyimpan payload JSON
  data: jsonb('data').notNull(),

  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow(),
});
