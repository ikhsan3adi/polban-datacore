import { Module } from '@nestjs/common';
import { EtlService } from './etl.service';
import { EtlController } from './etl.controller';
import { DataHubModule } from './datahub/datahub.module';

@Module({
  controllers: [EtlController],
  providers: [EtlService],
  imports: [DataHubModule],
})
export class EtlModule {}
