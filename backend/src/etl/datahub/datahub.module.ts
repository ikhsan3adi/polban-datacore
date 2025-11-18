import { Module } from '@nestjs/common';
import { DatahubService } from './datahub.service';
import { DatahubController } from './datahub.controller';

@Module({
  controllers: [DatahubController],
  providers: [DatahubService],
})
export class DataHubModule {}
