<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
    
    <!-- Main Content -->
    <div class="lg:pl-64" :class="{ 'lg:pl-16': sidebarCollapsed }">
      <!-- Header -->
      <Header 
        :title="pageTitle" 
        :collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />
      
      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Sidebar state
const sidebarCollapsed = ref(false)

// Page title from route
const route = useRoute()
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    'dashboard': 'Dashboard',
    'users': 'Quản lý người dùng',
    'reports': 'Báo cáo & Thống kê',
    'settings': 'Cài đặt hệ thống'
  }
  return titles[route.name as string] || 'Dashboard'
})

// Toggle sidebar
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Responsive sidebar handling
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      sidebarCollapsed.value = true
    }
  }
  
  handleResize()
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>
