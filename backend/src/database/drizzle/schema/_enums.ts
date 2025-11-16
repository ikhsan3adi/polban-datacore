import { pgEnum } from 'drizzle-orm/pg-core';

export const jenisKelaminEnum = pgEnum('jenis_kelamin_enum', ['L', 'P']);

export const agamaEnum = pgEnum('agama_enum', [
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Buddha',
  'Khonghucu',
  'Lainnya',
]);
