import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KemahasiswaanService } from './kemahasiswaan.service';
import { KemahasiswaanTotalArrayDto } from './dto/kemahasiswaan-total-array.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../constants/roles.constants';
import { Roles } from '../../common/decorators/roles.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v1/mahasiswa')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.DATACORE_ADMIN, UserRole.DATAVIEW_INTERNAL)
@ApiTags('Kemahasiswaan')
export class KemahasiswaanController {
  constructor(private readonly kemahasiswaanService: KemahasiswaanService) {}

  @Get('gender')
  async getGender(
    @Query('prodi') prodi?: string,
    @Query('kelas') kelas?: string,
    @Query('angkatan') angkatan?: number,
  ): Promise<KemahasiswaanTotalArrayDto> {
    if (prodi) {
      return this.kemahasiswaanService.getGenderData();
    }
    if (kelas) {
      return this.kemahasiswaanService.getGenderData();
    }
    if (angkatan) {
      return this.kemahasiswaanService.getGenderData(angkatan);
    }
    return this.kemahasiswaanService.getGenderData();
  }

  @Get('agama')
  async getAgama(
    @Query('prodi') prodi?: string,
    @Query('kelas') kelas?: string,
    @Query('angkatan') angkatan?: number,
  ): Promise<KemahasiswaanTotalArrayDto> {
    if (prodi) {
      return this.kemahasiswaanService.getAgamaData();
    }
    if (kelas) {
      return this.kemahasiswaanService.getAgamaData();
    }
    if (angkatan) {
      return this.kemahasiswaanService.getAgamaData(angkatan);
    }
    return this.kemahasiswaanService.getAgamaData();
  }

  @Get('jenis-slta')
  async getJenisSlta(
    @Query('prodi') prodi?: string,
    @Query('kelas') kelas?: string,
    @Query('angkatan') angkatan?: number,
  ): Promise<KemahasiswaanTotalArrayDto> {
    if (prodi) {
      return this.kemahasiswaanService.getJenisSltaData();
    }
    if (kelas) {
      return this.kemahasiswaanService.getJenisSltaData();
    }
    if (angkatan) {
      return this.kemahasiswaanService.getJenisSltaData(angkatan);
    }
    return this.kemahasiswaanService.getJenisSltaData();
  }

  @Get('jumlah-mahasiswa')
  async getJumlahMahasiswa(
    @Query('prodi') prodi?: string,
    @Query('angkatan') angkatan?: number,
  ): Promise<KemahasiswaanTotalArrayDto> {
    if (prodi) {
      return this.kemahasiswaanService.getJumlahMahasiswaData();
    }
    if (angkatan) {
      return this.kemahasiswaanService.getJumlahMahasiswaData(angkatan);
    }
    return this.kemahasiswaanService.getJumlahMahasiswaData();
  }
}
