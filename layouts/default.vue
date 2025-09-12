<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <Sidebar :collapsed="sidebarCollapsed" />
    
    <!-- Main Content -->
    <div 
      class="transition-all duration-300 ease-in-out" 
      :class="{
        'lg:pl-16': sidebarCollapsed,
        'lg:pl-64': !sidebarCollapsed
      }"
    >
      <!-- Header -->
      <Header 
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


// Toggle sidebar
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Responsive sidebar handling
let handleResize: (() => void) | null = null

onMounted(() => {
  if (process.client) {
    handleResize = () => {
      // On mobile, always collapse sidebar
      if (window.innerWidth < 1024) {
        sidebarCollapsed.value = true
      } else {
        // On desktop, keep current state or default to expanded
        if (sidebarCollapsed.value === undefined) {
          sidebarCollapsed.value = false
        }
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (process.client && handleResize) {
    window.removeEventListener('resize', handleResize)
  }
})
</script>
