import { Module } from '@nestjs/common';
import { drizzleProvider } from './drizzle.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DrizzleModule {}
