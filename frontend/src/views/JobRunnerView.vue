<template>
  <div class="layout-wrapper">
    <AppSidebar />
    
    <div class="main-content">
      <AppHeader />
      
      <div class="content-body">
        <div class="page-header">
          <h1 class="page-title">Job Runner</h1>
          <p class="page-subtitle">Eksekusi manual proses ETL dan sinkronisasi data.</p>
        </div>

        <div class="job-runner-container">
          <div class="job-card">
            <div class="card-header">
              <h3>Jalankan Job Baru</h3>
            </div>
            
            <div class="card-body">
              <div class="form-group">
                <label for="job-select">Pilih Job</label>
                <select id="job-select" v-model="selectedJob" class="form-select">
                  <option value="" disabled>-- Pilih Job --</option>
                  <option value="full-sync-and-aggregate">Full Sync & Agregasi (Mahasiswa & Akademik)</option>
                  <option value="sync-mahasiswa">Sync Data Mahasiswa Saja</option>
                  <option value="aggregate-guest">Hitung Ulang Cache Guest (Public)</option>
                </select>
              </div>

              <div v-if="jobStore.success" class="alert alert-success">
                {{ jobStore.success }}
              </div>

              <div v-if="jobStore.error" class="alert alert-error">
                {{ jobStore.error }}
              </div>

              <button 
                @click="handleRunJob" 
                :disabled="!selectedJob || jobStore.loading" 
                class="btn-primary"
              >
                {{ jobStore.loading ? 'Processing...' : 'Jalankan Job' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppSidebar from '@/components/Layout/AppSidebar.vue';
import AppHeader from '@/components/Layout/AppHeader.vue';
import { useJobStore } from '@/stores/job';

const jobStore = useJobStore();
const selectedJob = ref('');

const handleRunJob = () => {
  if (selectedJob.value) {
    jobStore.triggerJob(selectedJob.value);
  }
};
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
}

.content-body {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6c757d;
  font-size: 0.95rem;
}

.job-runner-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 50vh;
  padding-top: 2rem;
}

.job-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #2d3748;
  background-color: #fff;
  transition: border-color 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary, #21308f);
  box-shadow: 0 0 0 3px rgba(33, 48, 143, 0.1);
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-primary, #21308f);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1a2675;
}

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.alert-success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
</style>
