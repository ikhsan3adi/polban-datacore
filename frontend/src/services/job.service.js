import api from './api';

export default {
  runJob(jobName) {
    return api.post('/jobs/run', { jobName });
  }
};
