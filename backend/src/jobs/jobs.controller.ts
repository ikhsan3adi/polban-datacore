import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { DeleteScheduleDto, UpdateScheduleDto } from './dto/schedule-job.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../constants';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('jobs')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.DATACORE_ADMIN)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getAvailableJobs() {
    return this.jobsService.getAvailableJobs();
  }

  @Roles(
    UserRole.DATACORE_ADMIN,
    UserRole.DATAHUB_ADMIN,
    UserRole.DATAHUB_PARTICIPANT,
  )
  @Post('run')
  async runJob(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.addJobToQueue(createJobDto);
  }

  @Put('schedules')
  async updateSchedule(@Body() dto: UpdateScheduleDto) {
    return this.jobsService.updateSchedule(dto);
  }

  @Get('schedules')
  async getSchedules() {
    return this.jobsService.getSchedules();
  }

  @Delete('schedules')
  async deleteSchedule(@Body() dto: DeleteScheduleDto) {
    return this.jobsService.deleteSchedule(dto);
  }
}
