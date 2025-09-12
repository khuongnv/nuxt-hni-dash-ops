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
        <!-- Menu item with submenu -->
        <div v-if="item.children && item.children.length > 0">
          <button
            @click="toggleSubmenu(item.name)"
            class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 relative group"
            :class="[
              collapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2 space-x-3',
              isActive(item.href)
                ? 'bg-primary text-primary-foreground'
                : isSubmenuActive(item.children)
                  ? 'bg-accent/50 text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            ]"
          >
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            <Transition name="fade" mode="out-in">
              <span v-if="!collapsed" class="whitespace-nowrap flex-1 text-left">{{ item.name }}</span>
            </Transition>
            <Transition name="fade" mode="out-in">
              <ChevronDown 
                v-if="!collapsed" 
                class="h-4 w-4 transition-transform duration-200"
                :class="{ 'rotate-180': openSubmenus.includes(item.name) }"
              />
            </Transition>
            
            <!-- Tooltip for collapsed state -->
            <div 
              v-if="collapsed" 
              class="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
            >
              {{ item.name }}
              <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-popover"></div>
            </div>
          </button>
          
          <!-- Submenu Level 2 -->
          <Transition name="slide-down">
            <div v-if="!collapsed && openSubmenus.includes(item.name)" class="ml-6 mt-1 space-y-1">
              <template v-for="subItem in item.children" :key="subItem.name">
                <!-- Submenu with children (Level 3) -->
                <div v-if="subItem.children && subItem.children.length > 0">
                  <button
                    @click="toggleSubmenu(subItem.name)"
                    class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2"
                    :class="[
                      isActive(subItem.href)
                        ? 'bg-primary/20 text-primary'
                        : isSubmenuActive(subItem.children)
                          ? 'bg-accent/30 text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    ]"
                  >
                    <component :is="subItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                    <span class="whitespace-nowrap flex-1 text-left">{{ subItem.name }}</span>
                    <ChevronDown 
                      class="h-3 w-3 transition-transform duration-200"
                      :class="{ 'rotate-180': openSubmenus.includes(subItem.name) }"
                    />
                  </button>
                  
                  <!-- Submenu Level 3 -->
                  <Transition name="slide-down">
                    <div v-if="openSubmenus.includes(subItem.name)" class="ml-6 mt-1 space-y-1">
                      <template v-for="subSubItem in subItem.children" :key="subSubItem.name">
                        <!-- Submenu with children (Level 4) -->
                        <div v-if="subSubItem.children && subSubItem.children.length > 0">
                          <button
                            @click="toggleSubmenu(subSubItem.name)"
                            class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2"
                            :class="[
                              isActive(subSubItem.href)
                                ? 'bg-primary/20 text-primary'
                                : isSubmenuActive(subSubItem.children)
                                  ? 'bg-accent/30 text-accent-foreground'
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            ]"
                          >
                            <component :is="subSubItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                            <span class="whitespace-nowrap flex-1 text-left">{{ subSubItem.name }}</span>
                            <ChevronDown 
                              class="h-3 w-3 transition-transform duration-200"
                              :class="{ 'rotate-180': openSubmenus.includes(subSubItem.name) }"
                            />
                          </button>
                          
                          <!-- Submenu Level 4 -->
                          <Transition name="slide-down">
                            <div v-if="openSubmenus.includes(subSubItem.name)" class="ml-6 mt-1 space-y-1">
                              <NuxtLink
                                v-for="subSubSubItem in subSubItem.children"
                                :key="subSubSubItem.name"
                                :to="subSubSubItem.href"
                                class="flex items-center rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2"
                                :class="[
                                  isActive(subSubSubItem.href)
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                ]"
                              >
                                <component :is="subSubSubItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                                <span class="whitespace-nowrap">{{ subSubSubItem.name }}</span>
                              </NuxtLink>
                            </div>
                          </Transition>
                        </div>
                        
                        <!-- Regular Level 3 item -->
                        <NuxtLink
                          v-else
                          :to="subSubItem.href"
                          class="flex items-center rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2"
                          :class="[
                            isActive(subSubItem.href)
                              ? 'bg-primary/20 text-primary'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          ]"
                        >
                          <component :is="subSubItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                          <span class="whitespace-nowrap">{{ subSubItem.name }}</span>
                        </NuxtLink>
                      </template>
                    </div>
                  </Transition>
                </div>
                
                <!-- Regular Level 2 item -->
                <NuxtLink
                  v-else
                  :to="subItem.href"
                  class="flex items-center rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2"
                  :class="[
                    isActive(subItem.href)
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  ]"
                >
                  <component :is="subItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                  <span class="whitespace-nowrap">{{ subItem.name }}</span>
                </NuxtLink>
              </template>
            </div>
          </Transition>
          
          <!-- Collapsed submenu icons -->
          <div v-if="collapsed && openSubmenus.includes(item.name)" class="mt-1 space-y-1">
            <template v-for="subItem in item.children" :key="subItem.name">
              <NuxtLink
                :to="subItem.href"
                class="flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 px-2 py-2 relative group"
                :class="[
                  isActive(subItem.href)
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                ]"
              >
                <component :is="subItem.icon" class="h-4 w-4 flex-shrink-0" />
                
                <!-- Tooltip for submenu items -->
                <div 
                  class="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
                >
                  {{ subItem.name }}
                  <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-popover"></div>
                </div>
              </NuxtLink>
            </template>
          </div>
        </div>
        
        <!-- Regular menu item -->
        <NuxtLink
          v-else
          :to="item.href"
          class="flex items-center rounded-lg text-sm font-medium transition-all duration-200 relative group"
          :class="[
            collapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2 space-x-3',
            isActive(item.href)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <Transition name="fade" mode="out-in">
            <span v-if="!collapsed" class="whitespace-nowrap">{{ item.name }}</span>
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
  ChevronDown,
  UserCheck,
  UserX,
  FileText,
  TrendingUp,
  Database,
  Shield,
  Bell,
  Building,
  UserPlus,
  UserMinus,
  BarChart,
  PieChart,
  Activity,
  HardDrive,
  Lock,
  BellRing,
  Cog,
  Key,
  AlertCircle,
  Info
} from 'lucide-vue-next'

interface Props {
  collapsed: boolean
}

defineProps<Props>()

const route = useRoute()

// Submenu state - mặc định mở cấp 2
const openSubmenus = ref<string[]>(['Quản lý', 'Báo cáo', 'Hệ thống'])

// Navigation items with 4 levels
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Quản lý',
    href: '#',
    icon: Users,
    children: [
      {
        name: 'Người dùng',
        href: '/users',
        icon: Users,
        children: [
          {
            name: 'Danh sách',
            href: '/users/list',
            icon: UserCheck
          },
          {
            name: 'Thêm mới',
            href: '/users/add',
            icon: UserPlus
          },
          {
            name: 'Vô hiệu hóa',
            href: '/users/disabled',
            icon: UserMinus
          }
        ]
      },
      {
        name: 'Tổ chức',
        href: '#',
        icon: Building,
        children: [
          {
            name: 'Phòng ban',
            href: '/departments',
            icon: Building
          },
          {
            name: 'Chức vụ',
            href: '/positions',
            icon: UserCheck
          }
        ]
      },
      {
        name: 'Phân quyền',
        href: '/permissions',
        icon: Shield
      }
    ]
  },
  {
    name: 'Báo cáo',
    href: '#',
    icon: BarChart3,
    children: [
      {
        name: 'Báo cáo tổng quan',
        href: '/reports',
        icon: FileText,
        children: [
          {
            name: 'Hàng ngày',
            href: '/reports/daily',
            icon: BarChart
          },
          {
            name: 'Hàng tuần',
            href: '/reports/weekly',
            icon: PieChart
          },
          {
            name: 'Hàng tháng',
            href: '/reports/monthly',
            icon: Activity
          }
        ]
      },
      {
        name: 'Thống kê',
        href: '/statistics',
        icon: TrendingUp
      },
      {
        name: 'Dữ liệu',
        href: '#',
        icon: Database,
        children: [
          {
            name: 'Xuất dữ liệu',
            href: '/data/export',
            icon: HardDrive
          },
          {
            name: 'Nhập dữ liệu',
            href: '/data/import',
            icon: Database
          }
        ]
      }
    ]
  },
  {
    name: 'Hệ thống',
    href: '#',
    icon: Settings,
    children: [
      {
        name: 'Cài đặt',
        href: '/settings',
        icon: Settings,
        children: [
          {
            name: 'Cài đặt chung',
            href: '/settings/general',
            icon: Cog
          },
          {
            name: 'Cài đặt nâng cao',
            href: '/settings/advanced',
            icon: Settings
          }
        ]
      },
      {
        name: 'Bảo mật',
        href: '#',
        icon: Shield,
        children: [
          {
            name: 'Mật khẩu',
            href: '/security/password',
            icon: Key
          },
          {
            name: 'Xác thực',
            href: '/security/auth',
            icon: Lock
          },
          {
            name: 'Cảnh báo',
            href: '/security/alerts',
            icon: AlertCircle
          }
        ]
      },
      {
        name: 'Thông báo',
        href: '/notifications',
        icon: Bell
      }
    ]
  },
  {
    name: 'Giới thiệu',
    href: '/about',
    icon: Info
  }
]

// Toggle submenu
const toggleSubmenu = (menuName: string) => {
  const index = openSubmenus.value.indexOf(menuName)
  if (index > -1) {
    openSubmenus.value.splice(index, 1)
  } else {
    openSubmenus.value.push(menuName)
  }
}

// Check if route is active
const isActive = (href: string) => {
  return route.path === href
}

// Check if submenu is active
const isSubmenuActive = (children: any[]) => {
  return children.some(child => isActive(child.href))
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
  transform-origin: top;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: scaleY(0);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: scaleY(1);
}
</style>
