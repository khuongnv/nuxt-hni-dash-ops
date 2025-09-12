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
      <template v-for="item in navigationItems" :key="item.name">
        <NuxtLink
          :to="item.href"
          class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 relative group"
          :class="[
            collapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2 space-x-3',
            isActive(item.href)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <Transition name="fade" mode="out-in">
            <span v-if="!collapsed" class="whitespace-nowrap flex-1 text-left">{{ item.name }}</span>
          </Transition>
          
          <!-- Tooltip for collapsed state -->
          <div 
            v-if="collapsed" 
            class="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
          >
            {{ item.name }}
            <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-popover"></div>
          </div>
        </NuxtLink>
      </template>
    </nav>

  </aside>
</template>

<script setup lang="ts">
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Info
} from 'lucide-vue-next'

interface Props {
  collapsed: boolean
}

defineProps<Props>()

const route = useRoute()

// Navigation items - chỉ giữ lại các trang thực tế có sẵn
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Quản lý người dùng',
    href: '/users',
    icon: Users
  },
  {
    name: 'Báo cáo & Thống kê',
    href: '/reports',
    icon: BarChart3
  },
  {
    name: 'Cài đặt hệ thống',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Giới thiệu',
    href: '/about',
    icon: Info
  }
]

// Check if route is active
const isActive = (href: string) => {
  return route.path === href
}
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
</style>