import {
  pgTable,
  text,
  integer,
  timestamp,
  date,
  doublePrecision,
  index,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { agamaEnum, jenisKelaminEnum } from './_enums';

export const factMahasiswa = pgTable(
  'fact_mahasiswa',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    // id asli dari DataHub
    datahubMahasiswaId: text('datahub_mahasiswa_id').unique().notNull(),

    // kolom data utama (dimensi)
    angkatan: integer('angkatan'),
    jenisKelamin: jenisKelaminEnum('jenis_kelamin'),
    agama: agamaEnum('agama'),
    tglLahir: date('tgl_lahir'),

    // kolom denormalisasi data teks
    namaSlta: text('nama_slta'),
    namaJalurDaftar: text('nama_jalur_daftar'),
    namaWilayah: text('nama_wilayah'),
    namaProvinsi: text('nama_provinsi'),

    datahubProvinsiId: text('datahub_provinsi_id'),
    datahubWilayahId: text('datahub_wilayah_id'),

    // kolom denormalisasi data geo
    provinsiLat: doublePrecision('provinsi_lat'),
    provinsiLng: doublePrecision('provinsi_lng'),
    wilayahLat: doublePrecision('wilayah_lat'),
    wilayahLng: doublePrecision('wilayah_lng'),

    // metadata ETL
    datahubUpdatedAt: timestamp('datahub_updated_at', {
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  // indexing
  (table) => [
    // index untuk GROUP BY
    index('fact_mhs_angkatan_idx').on(table.angkatan),
    index('fact_mhs_jenis_kelamin_idx').on(table.jenisKelamin),
    index('fact_mhs_agama_idx').on(table.agama),
    index('fact_mhs_provinsi_id_idx').on(table.datahubProvinsiId),
    index('fact_mhs_wilayah_id_idx').on(table.datahubWilayahId),
    index('fact_mhs_provinsi_idx').on(table.namaProvinsi),
    index('fact_mhs_wilayah_idx').on(table.namaWilayah),
    index('fact_mhs_slta_idx').on(table.namaSlta),
    index('fact_mhs_jalur_idx').on(table.namaJalurDaftar),

    // index untuk WHERE
    index('fact_mhs_updated_at_idx').on(table.datahubUpdatedAt),
  ],
);
