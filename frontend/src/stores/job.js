import { defineStore } from 'pinia';
import jobService from '@/services/job.service';

export const useJobStore = defineStore('job', {
  state: () => ({
    loading: false,
    error: null,
    success: null,
  }),
  actions: {
    async triggerJob(jobName) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        await jobService.runJob(jobName);
        this.success = 'Job berhasil dijadwalkan';
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal menjalankan job';
      } finally {
        this.loading = false;
      }
    },
  },
});
