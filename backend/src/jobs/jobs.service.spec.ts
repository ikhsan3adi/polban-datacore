import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { JobsRepository } from './jobs.repository';
import { getQueueToken } from '@nestjs/bullmq';
import { QUEUE_CONSTANTS, JOB_NAMES } from '../constants';
import { CreateJobDto } from './dto/create-job.dto';
import { DeleteScheduleDto, UpdateScheduleDto } from './dto/schedule-job.dto';

describe('JobsService', () => {
  let service: JobsService;
  let repository: JobsRepository;
  let queue: any;

  const mockQueue = {
    add: jest.fn(),
    getJobSchedulers: jest.fn(),
    removeJobScheduler: jest.fn(),
  };

  const mockJobsRepository = {
    findAllSchedules: jest.fn(),
    findScheduleByName: jest.fn(),
    upsertSchedule: jest.fn(),
    deleteSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: JobsRepository, useValue: mockJobsRepository },
        {
          provide: getQueueToken(QUEUE_CONSTANTS.ETL_QUEUE),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    repository = module.get<JobsRepository>(JobsRepository);
    queue = module.get(getQueueToken(QUEUE_CONSTANTS.ETL_QUEUE));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize default schedule if not exists', async () => {
      mockJobsRepository.findScheduleByName.mockResolvedValue(null);
      mockJobsRepository.upsertSchedule.mockResolvedValue({
        cronExpression: '0 0 * * *',
      });
      mockQueue.getJobSchedulers.mockResolvedValue([]);
      mockQueue.add.mockResolvedValue({ id: 'job-1' });

      await service.onModuleInit();

      expect(repository.findScheduleByName).toHaveBeenCalledWith(
        JOB_NAMES.FULL_SYNC_AND_AGGREGATE,
      );
      // upsertSchedule logic called inside updateSchedule
      expect(repository.upsertSchedule).toHaveBeenCalledWith(
        JOB_NAMES.FULL_SYNC_AND_AGGREGATE,
        true,
        '0 0 * * *',
        expect.any(String),
      );
      expect(queue.add).toHaveBeenCalled(); // Sync BullMQ
    });

    it('should sync existing active schedule from DB', async () => {
      mockJobsRepository.findScheduleByName.mockResolvedValue({
        jobName: JOB_NAMES.FULL_SYNC_AND_AGGREGATE,
        cronExpression: '0 12 * * *',
        isActive: true,
      });
      mockQueue.getJobSchedulers.mockResolvedValue([]);

      await service.onModuleInit();

      expect(repository.upsertSchedule).not.toHaveBeenCalled(); // No update needed
      expect(queue.add).toHaveBeenCalledWith(
        JOB_NAMES.FULL_SYNC_AND_AGGREGATE,
        expect.anything(),
        expect.objectContaining({ repeat: { pattern: '0 12 * * *' } }),
      );
    });
  });

  describe('addJobToQueue (Manual Trigger)', () => {
    it('should add job to queue with manual trigger', async () => {
      const dto: CreateJobDto = { jobName: JOB_NAMES.SYNC_MAHASISWA };
      const date = new Date();
      mockQueue.add.mockResolvedValue({
        id: '123',
        timestamp: date.getTime(),
      });

      const result = await service.addJobToQueue(dto);

      expect(queue.add).toHaveBeenCalledWith(dto.jobName, {
        jobName: dto.jobName,
        triggeredBy: 'manual',
      });
      expect(result).toEqual({
        message: 'Job queued.',
        queueId: '123',
        timestamp: date,
      });
    });
  });

  describe('updateSchedule', () => {
    it('should update DB and sync BullMQ schedule', async () => {
      const dto: UpdateScheduleDto = {
        jobName: JOB_NAMES.AGGREGATE_GUEST_DATA,
        isActive: true,
        cronExpression: '*/5 * * * *',
        description: 'Every 5 mins',
      };

      // Mock remove old scheduler logic
      mockQueue.getJobSchedulers.mockResolvedValue([
        { name: JOB_NAMES.AGGREGATE_GUEST_DATA, key: 'old-key' },
      ]);

      mockJobsRepository.upsertSchedule.mockResolvedValue(dto);

      await service.updateSchedule(dto);

      // 1. Update DB
      expect(repository.upsertSchedule).toHaveBeenCalledWith(
        dto.jobName,
        dto.isActive,
        dto.cronExpression,
        dto.description,
      );

      // 2. Sync BullMQ (Remove Old -> Add New)
      expect(queue.removeJobScheduler).toHaveBeenCalledWith('old-key');
      expect(queue.add).toHaveBeenCalledWith(
        dto.jobName,
        expect.objectContaining({ triggeredBy: 'cron' }),
        expect.objectContaining({
          repeat: { pattern: dto.cronExpression },
          jobId: `schedule:${dto.jobName}`,
        }),
      );
    });

    it('should update DB and remove/deactivate BullMQ schedule', async () => {
      const dto: UpdateScheduleDto = {
        jobName: JOB_NAMES.AGGREGATE_GUEST_DATA,
        isActive: false,
      };

      // Mock remove old scheduler logic
      mockQueue.getJobSchedulers.mockResolvedValue([
        { name: JOB_NAMES.AGGREGATE_GUEST_DATA, key: 'old-key' },
      ]);

      mockJobsRepository.upsertSchedule.mockResolvedValue(dto);

      await service.updateSchedule(dto);

      // 1. Update DB
      expect(repository.upsertSchedule).toHaveBeenCalledWith(
        dto.jobName,
        dto.isActive,
        undefined,
        undefined,
      );

      // 2. Sync BullMQ (Remove Old -> Not Add New)
      expect(queue.removeJobScheduler).toHaveBeenCalledWith('old-key');
      expect(queue.add).not.toHaveBeenCalled();
    });
  });

  describe('getSchedules', () => {
    it('should return schedules from repository', async () => {
      const mockSchedules = [{ jobName: 'test' }];
      mockJobsRepository.findAllSchedules.mockResolvedValue(mockSchedules);

      const result = await service.getSchedules();

      expect(repository.findAllSchedules).toHaveBeenCalled();
      expect(result).toEqual({ data: mockSchedules });
    });
  });

  describe('deleteSchedule', () => {
    it('should delete & deactivate scheduled job', async () => {
      const dto: DeleteScheduleDto = {
        jobName: JOB_NAMES.AGGREGATE_GUEST_DATA,
      };

      // Mock remove old scheduler logic
      mockQueue.getJobSchedulers.mockResolvedValue([
        { name: JOB_NAMES.AGGREGATE_GUEST_DATA, key: 'old-key' },
      ]);

      await service.deleteSchedule(dto);

      expect(repository.deleteSchedule).toHaveBeenCalledWith(dto.jobName);
      expect(queue.removeJobScheduler).toHaveBeenCalledWith('old-key');
      expect(queue.add).not.toHaveBeenCalled();
    });
  });
});
