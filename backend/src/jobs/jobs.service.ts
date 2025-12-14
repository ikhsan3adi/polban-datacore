import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateJobDto } from './dto/create-job.dto';
import { QUEUE_CONSTANTS, JOB_NAMES } from '../constants';
import { DeleteScheduleDto, UpdateScheduleDto } from './dto/schedule-job.dto';
import { JobsRepository } from './jobs.repository';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue(QUEUE_CONSTANTS.ETL_QUEUE) private etlQueue: Queue,
    private readonly jobsRepository: JobsRepository,
  ) {}

  async onModuleInit() {
    await this.initDefaultSchedules();
  }

  // Trigger Manual
  async addJobToQueue(dto: CreateJobDto) {
    const job = await this.etlQueue.add(dto.jobName, {
      jobName: dto.jobName,
      triggeredBy: 'manual',
    });
    return {
      message: `Job queued.`,
      queueId: job.id,
      timestamp: new Date(job.timestamp),
    };
  }

  // Get List of Available Jobs
  getAvailableJobs() {
    return { data: Object.values(JOB_NAMES) };
  }

  // Schedules
  async updateSchedule(dto: UpdateScheduleDto) {
    const schedule = await this.jobsRepository.upsertSchedule(
      dto.jobName,
      dto.isActive,
      dto.cronExpression,
      dto.description,
    );

    if (!dto.isActive) {
      await this.removeBullMqSchedule(dto.jobName);

      return {
        message: `Schedule for ${dto.jobName} deactivated`,
      };
    }

    await this.syncBullMqSchedule(dto.jobName, schedule.cronExpression);

    return {
      message: `Schedule for ${dto.jobName} updated to '${schedule.cronExpression}'`,
    };
  }

  async getSchedules() {
    return { data: await this.jobsRepository.findAllSchedules() };
  }

  async deleteSchedule(dto: DeleteScheduleDto) {
    await this.jobsRepository.deleteSchedule(dto.jobName);

    await this.removeBullMqSchedule(dto.jobName);

    return { message: `Schedule for ${dto.jobName} deleted` };
  }

  // Helpers

  private async initDefaultSchedules() {
    const existing = await this.jobsRepository.findScheduleByName(
      JOB_NAMES.FULL_SYNC_AND_AGGREGATE,
    );

    if (!existing) {
      this.logger.log('Initializing default schedule: Daily at 00:00');
      await this.updateSchedule({
        jobName: JOB_NAMES.FULL_SYNC_AND_AGGREGATE,
        isActive: true,
        cronExpression: '0 0 * * *',
        description: 'Daily Full Sync & Aggregate at 00:00',
      });
    } else {
      if (existing.isActive) {
        await this.syncBullMqSchedule(
          existing.jobName,
          existing.cronExpression,
        );
      }
    }
  }

  private async syncBullMqSchedule(jobName: string, cron: string) {
    await this.removeBullMqSchedule(jobName);

    await this.etlQueue.add(
      jobName,
      { jobName, triggeredBy: 'cron' },
      {
        repeat: { pattern: cron },
        jobId: `schedule:${jobName}`,
      },
    );

    this.logger.log(`Synced schedule for ${jobName}: ${cron}`);
  }

  private async removeBullMqSchedule(jobName: string) {
    const repeatableJobs = await this.etlQueue.getJobSchedulers();
    const oldJobs = repeatableJobs.filter((j) => j.name === jobName);

    for (const job of oldJobs) {
      await this.etlQueue.removeJobScheduler(job.key);
    }

    this.logger.log(`Schedule removed for ${jobName}`);
  }
}
