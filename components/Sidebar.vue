<template>
  <aside 
    class="fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out lg:translate-x-0"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center justify-center border-b border-border">
      <!-- Empty logo space -->
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-6 space-y-1 transition-all duration-300" :class="collapsed ? 'px-2' : 'px-4'">
      <MenuItem
        v-for="item in navigationItems"
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
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  Info,
  Plus,
  Shield,
  Lock,
  Key
} from 'lucide-vue-next'
import MenuItem from '~/components/ui/MenuItem.vue'

// Props
const props = defineProps<{
  collapsed: boolean
}>()

// Route
const route = useRoute()

// Navigation items - sử dụng dữ liệu từ API Supabase
const navigationItems = ref([])

// Icon mapping
const iconMap: Record<string, any> = {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Menu,
  Info,
  Plus,
  Shield,
  Lock,
  Key
}

// Load menus from API
const loadMenus = async () => {
  try {
    const response = await $fetch('/api/menus')
    if (response.success && response.data) {
      // Transform API data to navigation format
      const menus = response.data.filter((menu: any) => menu.is_active)
      
      // List of valid routes that have corresponding files
      const validRoutes = [
        '/main/dashboard',
        '/admin/users',
        '/system/settings',
        '/system/reports',
        '/main/about'
      ]
      
      // Build navigation tree
      const buildNavigationTree = (menus: any[], parentId: number | null = null): any[] => {
        return menus
          .filter(menu => menu.parent_id === parentId)
          .filter(menu => validRoutes.includes(menu.href)) // Only include menus with valid routes
          .sort((a, b) => a.order - b.order)
          .map(menu => ({
            name: menu.name,
            href: menu.href,
            icon: iconMap[menu.icon] || Menu,
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
        icon: LayoutDashboard
      },
      {
        name: 'Người dùng',
        href: '/admin/users',
        icon: Users
      },
      {
        name: 'Hệ thống',
        href: '/system/settings',
        icon: Settings
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

// Load menus on component mount
onMounted(() => {
  loadMenus()
})
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