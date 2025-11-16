import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { EtlModule } from './etl/etl.module';
import { JobsModule } from './jobs/jobs.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ApiModule, DatabaseModule, EtlModule, JobsModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
