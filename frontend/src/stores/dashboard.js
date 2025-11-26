import { defineStore } from 'pinia';
import dashboardService from '@/services/dashboard.service';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        const response = await dashboardService.getStats();
        this.stats = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memuat data statistik.';
        console.error('Error fetching dashboard stats:', err);
      } finally {
        this.loading = false;
      }
    }
  }
});
