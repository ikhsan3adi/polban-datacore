<template>
  <div class="dashboard">
    <div class="header">
      <h1>Dashboard DataCore</h1>
      <div class="user-controls">
        <span v-if="authStore.user" class="user-greeting">
          Hi, {{ authStore.user.username || authStore.user.email }}
        </span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </div>

    <div v-if="dashboardStore.loading && !dashboardStore.stats" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>

    <div v-else-if="dashboardStore.error" class="error-state">
      <p>{{ dashboardStore.error }}</p>
      <button @click="dashboardStore.fetchStats()" class="retry-btn">Coba Lagi</button>
    </div>

    <div v-else class="stats-grid">
      <!-- Card 1: Total Mahasiswa -->
      <div class="stat-card">
        <h3>Total Mahasiswa</h3>
        <div class="stat-value">{{ dashboardStore.studentCount ?? '-' }}</div>
        <div class="stat-desc">Data terintegrasi</div>
      </div>

      <!-- Card 2: Status Sinkronisasi -->
      <div class="stat-card">
        <h3>Status Sinkronisasi</h3>
        <div class="status-badge" :class="getStatusClass(dashboardStore.syncStatus)">
          {{ dashboardStore.syncStatus || 'UNKNOWN' }}
        </div>
        <div class="stat-desc">Terakhir: {{ formatRelativeTime(dashboardStore.lastSyncTime) }}</div>
      </div>

      <!-- Card 3: Antrian Job -->
      <div class="stat-card">
        <h3>Antrian Job</h3>
        <div class="stat-value">
          {{ dashboardStore.activeQueue }}
          <span class="sub-value" v-if="dashboardStore.failedQueue > 0">
            ({{ dashboardStore.failedQueue }} Failed)
          </span>
        </div>
        <div class="stat-desc">Active & Waiting</div>
      </div>

      <!-- Card 4: Total Dosen -->
      <div class="stat-card">
        <h3>Total Dosen</h3>
        <div class="stat-value">{{ dashboardStore.lecturerCount ?? '-' }}</div>
        <div class="stat-desc">Data terintegrasi</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useDashboardStore } from '@/stores/dashboard';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const router = useRouter();
let pollingInterval = null;

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const getStatusClass = (status) => {
  if (!status) return 'status-unknown';
  const s = status.toLowerCase();
  if (s === 'success') return 'status-success';
  if (s === 'failed') return 'status-failed';
  if (s === 'pending' || s === 'running') return 'status-pending';
  return 'status-unknown';
};

const formatRelativeTime = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
};

onMounted(() => {
  dashboardStore.fetchStats();
  // Polling setiap 10 detik
  pollingInterval = setInterval(() => {
    dashboardStore.fetchStats();
  }, 10000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-greeting {
  font-weight: 500;
  color: #555;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.sub-value {
  font-size: 14px;
  color: #dc3545;
  font-weight: normal;
  margin-left: 5px;
}

.stat-desc {
  font-size: 12px;
  color: #999;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  width: fit-content;
  margin-bottom: 5px;
}

.status-success {
  background-color: #d4edda;
  color: #155724;
}

.status-failed {
  background-color: #f8d7da;
  color: #721c24;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-unknown {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Loading & Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 50px;
  background: #f9f9f9;
  border-radius: 8px;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b983;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #c82333;
}

/* Info Card Specifics */
.info-card .info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}
</style>
