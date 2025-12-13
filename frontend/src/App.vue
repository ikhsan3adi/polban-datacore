<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
</script>

<template>
  <Toaster richColors closeButton position="top-center" />
  <RouterView />
</template>
