import { IsNotEmpty, IsString, IsEnum, IsBoolean } from 'class-validator';
import { JOB_NAMES } from '../../constants';

export class UpdateScheduleDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Object.values(JOB_NAMES))
  jobName: string;

  @IsBoolean()
  isActive?: boolean;

  @IsString()
  cronExpression?: string;

  @IsString()
  description?: string;
}

export class DeleteScheduleDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Object.values(JOB_NAMES), {
    message: `jobName must be one of: ${Object.values(JOB_NAMES).join(', ')}`,
  })
  jobName: string;
}

export interface JobSchedule {
  id: string;
  jobName: string;
  cronExpression: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
