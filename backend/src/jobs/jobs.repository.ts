import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../database/drizzle/drizzle.provider';
import * as schema from '../database/drizzle/schema';
import { JobSchedule } from './dto/schedule-job.dto';

@Injectable()
export class JobsRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private db: NodePgDatabase<typeof schema>,
  ) {}

  async findAllSchedules() {
    return await this.db.select().from(schema.jobSchedules);
  }

  async findScheduleByName(jobName: string) {
    return await this.db.query.jobSchedules.findFirst({
      where: eq(schema.jobSchedules.jobName, jobName),
    });
  }

  async upsertSchedule(
    jobName: string,
    isActive: boolean = true,
    cronExpression?: string,
    description?: string,
  ): Promise<JobSchedule> {
    let result: JobSchedule[];

    if (!cronExpression) {
      result = await this.db
        .update(schema.jobSchedules)
        .set({
          jobName,
          cronExpression,
          isActive,
          description,
          updatedAt: new Date(),
        })
        .where(eq(schema.jobSchedules.jobName, jobName))
        .returning();
    } else {
      result = await this.db
        .insert(schema.jobSchedules)
        .values({
          jobName,
          cronExpression,
          isActive,
          description,
        })
        .onConflictDoUpdate({
          target: schema.jobSchedules.jobName,
          set: {
            cronExpression,
            isActive,
            description,
            updatedAt: new Date(),
          },
        })
        .returning();
    }

    return result[0];
  }

  async deleteSchedule(jobName: string) {
    return await this.db
      .delete(schema.jobSchedules)
      .where(eq(schema.jobSchedules.jobName, jobName));
  }
}
