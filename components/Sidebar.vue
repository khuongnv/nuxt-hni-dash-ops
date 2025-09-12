<template>
  <aside 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-all duration-300 lg:translate-x-0"
    :class="{
      '-translate-x-full': collapsed && window.innerWidth < 1024,
      'w-16': collapsed && window.innerWidth >= 1024
    }"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center px-6 border-b border-border">
      <div class="flex items-center space-x-3">
        <div class="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <span class="text-primary-foreground font-bold text-sm">HNI</span>
        </div>
        <Transition name="fade" mode="out-in">
          <h1 v-if="!collapsed" class="text-lg font-semibold text-foreground">
            Dashboard
          </h1>
        </Transition>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <template v-for="item in navigationItems" :key="item.name">
        <NuxtLink
          :to="item.href"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            isActive(item.href) 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <Transition name="fade" mode="out-in">
            <span v-if="!collapsed">{{ item.name }}</span>
          </Transition>
        </NuxtLink>
      </template>
    </nav>

    <!-- Toggle Button -->
    <div class="p-4 border-t border-border">
      <Button
        variant="ghost"
        size="sm"
        class="w-full justify-start"
        @click="$emit('toggle')"
      >
        <component :is="collapsed ? ChevronRight : ChevronLeft" class="h-4 w-4" />
        <Transition name="fade" mode="out-in">
          <span v-if="!collapsed" class="ml-2">Thu gọn</span>
        </Transition>
      </Button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

interface Props {
  collapsed: boolean
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()

const route = useRoute()

// Navigation items
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Người dùng',
    href: '/users',
    icon: Users
  },
  {
    name: 'Báo cáo',
    href: '/reports',
    icon: BarChart3
  },
  {
    name: 'Cài đặt',
    href: '/settings',
    icon: Settings
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
