<template>
  <div>
    <NuxtLink to="/dashboard">
      <Button class="w-full h-20 text-lg">
        <LayoutDashboard class="mr-2 h-6 w-6" />
        Chuyển đến Dashboard
      </Button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard } from 'lucide-vue-next'

// Import UI components explicitly
import Button from '~/components/ui/Button.vue'

// Redirect to dashboard
await navigateTo('/dashboard')
</script>
