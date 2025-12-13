export const JOB_NAMES = {
  SYNC_MAHASISWA: 'sync-mahasiswa',
  SYNC_DOSEN: 'sync-dosen',
  SYNC_AKADEMIK: 'sync-akademik',

  // Aggregation
  AGGREGATE_GUEST_DATA: 'aggregate-guest-data',
  AGGREGATE_AKADEMIK_DATA: 'aggregate-akademik-data',
  AGGREGATE_KEMAHASISWAAN_DATA: 'aggregate-kemahasiswaan-data',

  // Full
  FULL_SYNC_AND_AGGREGATE: 'full-sync-and-aggregate',
};

// Helper untuk mengubah object ke array opsi dropdown
export const JOB_NAME_OPTIONS = Object.values(JOB_NAMES).map((name) => ({
  label: name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()), // Format Title Case
  value: name,
}));
