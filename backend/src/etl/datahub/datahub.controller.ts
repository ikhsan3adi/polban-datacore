import { Controller } from '@nestjs/common';
import { DatahubService } from './datahub.service';

@Controller('datahub')
export class DatahubController {
  constructor(private readonly datahubService: DatahubService) {}
}
