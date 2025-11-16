import { Module } from '@nestjs/common';
import { EtlService } from './etl.service';
import { EtlController } from './etl.controller';
import { DatahubModule } from './datahub/datahub.module';

@Module({
  controllers: [EtlController],
  providers: [EtlService],
  imports: [DatahubModule],
})
export class EtlModule {}
