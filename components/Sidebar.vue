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
import { ref } from 'vue'
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

// Navigation items - sử dụng dữ liệu tĩnh với menu phân tầng
const navigationItems = ref([
  {
    name: 'Dashboard',
    href: '/main/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Quản lý người dùng',
    href: '/admin/users',
    icon: Users,
    children: [
      {
        name: 'Danh sách người dùng',
        href: '/admin/users/list',
        icon: Users
      },
      {
        name: 'Thêm người dùng',
        href: '/admin/users/add',
        icon: Plus
      },
      {
        name: 'Phân quyền',
        href: '/admin/users/roles',
        icon: Settings,
        children: [
          {
            name: 'Quản trị viên',
            href: '/admin/users/roles/admin',
            icon: Shield
          },
          {
            name: 'Người dùng thường',
            href: '/admin/users/roles/user',
            icon: Users
          }
        ]
      }
    ]
  },
  {
    name: 'Báo cáo & Thống kê',
    href: '/system/reports',
    icon: BarChart3,
    children: [
      {
        name: 'Báo cáo doanh thu',
        href: '/system/reports/revenue',
        icon: BarChart3
      },
      {
        name: 'Báo cáo người dùng',
        href: '/system/reports/users',
        icon: Users
      }
    ]
  },
  {
    name: 'Cài đặt hệ thống',
    href: '/system/settings',
    icon: Settings,
    children: [
      {
        name: 'Cấu hình chung',
        href: '/system/settings/general',
        icon: Settings
      },
      {
        name: 'Bảo mật',
        href: '/system/settings/security',
        icon: Shield,
        children: [
          {
            name: 'Mật khẩu',
            href: '/system/settings/security/password',
            icon: Key
          },
          {
            name: 'Xác thực 2FA',
            href: '/system/settings/security/2fa',
            icon: Lock
          }
        ]
      }
    ]
  },
  {
    name: 'Quản lý Menu hệ thống',
    href: '/admin/menu-management',
    icon: Menu
  },
  {
    name: 'Giới thiệu',
    href: '/main/about',
    icon: Info
  }
])

// Submenu state - mặc định mở tất cả menu tầng 1 có children
const openSubmenus = ref([
  'Quản lý người dùng',
  'Báo cáo & Thống kê', 
  'Cài đặt hệ thống'
])

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