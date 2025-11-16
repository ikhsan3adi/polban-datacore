import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const jobStatusEnum = pgEnum('job_status', [
  'pending',
  'running',
  'success',
  'failed',
]);

export const jobTriggerEnum = pgEnum('job_trigger', ['cron', 'manual']);

export const etlJobLog = pgTable('etl_job_log', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),

  jobName: text('job_name').notNull(),
  status: jobStatusEnum('status').notNull().default('pending'),
  triggeredBy: jobTriggerEnum('triggered_by').notNull(),

  startTime: timestamp('start_time', { withTimezone: true })
    .defaultNow()
    .notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  logMessage: text('log_message'),
});
