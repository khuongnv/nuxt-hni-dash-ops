<template>
  <aside 
    class="fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center justify-center border-b border-border">
      <!-- Empty logo space -->
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-6 space-y-1 transition-all duration-300" :class="collapsed ? 'px-2' : 'px-4'">
      <MenuItem
        v-for="item in filteredNavigationItems"
        :key="item.name"
        :item="item"
        :level="0"
        :collapsed="collapsed"
        :open-submenus="openSubmenus"
        :toggle-submenu="toggleSubmenu"
        :is-active="isActive"
        :is-submenu-active="isSubmenuActive"
      />
    </nav>

    <!-- Footer -->
    <div class="border-t border-border p-4 mt-auto">
      <div v-if="!collapsed" class="text-center space-y-2">
        <!-- App Name -->
        <div class="text-xs font-medium text-foreground">
          HniDashOps
        </div>
        
        <!-- Version -->
        <div class="text-xs text-muted-foreground">
          v{{ appVersion }}
        </div>
        
        <!-- Build Date -->
        <div class="text-xs text-muted-foreground">
          {{ buildDate }}
        </div>
        
        <!-- Copyright -->
        <div class="text-xs text-muted-foreground">
          © 2025 khuongnv
        </div>
      </div>
      
      <!-- Collapsed Footer -->
      <div v-else class="flex justify-center">
        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="text-xs font-bold text-primary">H</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from 'lucide-vue-next'
import MenuItem from '~/components/ui/MenuItem.vue'
import { useAuth } from '~/composables/useAuth'

// Props
const props = defineProps<{
  collapsed: boolean
}>()

// Route
const route = useRoute()

// Auth
const { isAuthenticated, isInitialized } = useAuth()

// Use icons composable
const { iconMap, getIconComponent } = useIcons()

// App version and build info
const appVersion = ref('1.0.0')
const buildDate = ref('')

// Navigation items - sử dụng dữ liệu từ API Supabase
const navigationItems = ref([])

// Filter navigation items based on authentication
const filteredNavigationItems = computed(() => {
  if (!isInitialized.value) {
    return []
  }
  
  if (!isAuthenticated.value) {
    // Show only public menu items for non-authenticated users
    return navigationItems.value.filter(item => {
      return item.href === '/main/dashboard' || 
             item.href === '/main/about' ||
             item.name === 'Dashboard' ||
             item.name === 'About'
    })
  }
  
  // Show all menu items for authenticated users
  return navigationItems.value
})

// Load menus from API
const loadMenus = async () => {
  try {
    const response = await $fetch('/api/menus')
    
    if (response.success && response.data) {
      // Transform API data to navigation format
      const menus = response.data.filter((menu: any) => menu.is_active)
      
      // Build navigation tree
      // Hiển thị tất cả menu (kể cả path sai) vì đã có xử lý 404.vue
      const buildNavigationTree = (menus: any[], parentId: number | null = null): any[] => {
        const filtered = menus
          .filter(menu => menu.parent_id === parentId)
          .filter(menu => !menu.href || menu.href === '#' || menu.href.startsWith('/')) // Include parent menus or any valid path
          .sort((a, b) => a.order - b.order)
        
        
        return filtered.map(menu => ({
          name: menu.name,
          href: menu.href === '#' ? '#' : (menu.href || '#'), // Use '#' for parent menus or empty href
          icon: getIconComponent(menu.icon),
          children: buildNavigationTree(menus, menu.id)
        }))
      }
      
      navigationItems.value = buildNavigationTree(menus)
    }
  } catch (error) {
    console.error('Error loading menus:', error)
    // Fallback to static data if API fails
    navigationItems.value = [
      {
        name: 'Dashboard',
        href: '/main/dashboard',
        icon: getIconComponent('LayoutDashboard')
      },
      {
        name: 'Người dùng',
        href: '/admin/users',
        icon: getIconComponent('Users')
      },
      {
        name: 'Quản lý Menu',
        href: '/admin/menus',
        icon: getIconComponent('Menu')
      },
      {
        name: 'Hệ thống',
        href: '/system/settings',
        icon: getIconComponent('Settings')
      }
    ]
  }
}

// Submenu state - sẽ được cập nhật động
const openSubmenus = ref([])

// Toggle submenu
const toggleSubmenu = (name: string) => {
  const index = openSubmenus.value.indexOf(name)
  if (index > -1) {
    openSubmenus.value.splice(index, 1)
  } else {
    openSubmenus.value.push(name)
  }
}

// Check if route is active
const isActive = (href: string) => {
  return route.path === href
}

// Check if any submenu item is active
const isSubmenuActive = (children: any[]) => {
  return children.some(child => {
    if (child.children) {
      return isSubmenuActive(child.children) || isActive(child.href)
    }
    return isActive(child.href)
  })
}

// Load menus on component mount and when route changes
onMounted(() => {
  loadMenus()
  
  // Set build date
  buildDate.value = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  // Listen for storage events to refresh menus when data changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'menus-updated') {
      loadMenus()
    }
  })
})

// Watch for route changes to reload menus
watch(() => route.path, () => {
  loadMenus()
}, { immediate: false })

// Expose refresh method for external use
const refreshMenus = () => {
  loadMenus()
}

// Provide refresh method to child components
provide('refreshSidebar', refreshMenus)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>