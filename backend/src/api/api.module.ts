import { Module } from '@nestjs/common';
import { GuestModule } from './guest/guest.module';
import { AkademikModule } from './akademik/akademik.module';
import { KemahasiswaanModule } from './kemahasiswaan/kemahasiswaan.module';

@Module({
  imports: [GuestModule, AkademikModule, KemahasiswaanModule],
  exports: [GuestModule, AkademikModule, KemahasiswaanModule],
})
export class ApiModule {}
