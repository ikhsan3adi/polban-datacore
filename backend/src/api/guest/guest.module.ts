import { Module } from '@nestjs/common';
import { GuestRepository } from './guest.repository';

@Module({
  providers: [GuestRepository],
})
export class GuestModule {}
