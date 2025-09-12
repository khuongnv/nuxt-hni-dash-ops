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
                              <template v-for="subSubSubItem in subSubItem.children" :key="subSubSubItem.name">
                                <NuxtLink
                                  :to="subSubSubItem.href"
                                  class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2"
                                  :class="[
                                    isActive(subSubSubItem.href)
                                      ? 'bg-primary/20 text-primary'
                                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                  ]"
                                >
                                  <component :is="subSubSubItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                                  <span class="whitespace-nowrap flex-1 text-left">{{ subSubSubItem.name }}</span>
                                </NuxtLink>
                              </template>
                            </div>
                          </Transition>
                        </div>
                        <!-- Submenu Level 3 without children -->
                        <div v-else>
                          <NuxtLink
                            :to="subSubItem.href"
                            class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2"
                            :class="[
                              isActive(subSubItem.href)
                                ? 'bg-primary/20 text-primary'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            ]"
                          >
                            <component :is="subSubItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                            <span class="whitespace-nowrap flex-1 text-left">{{ subSubItem.name }}</span>
                          </NuxtLink>
                        </div>
                      </template>
                    </div>
                  </Transition>
                </div>
                <!-- Submenu Level 2 without children -->
                <div v-else>
                  <NuxtLink
                    :to="subItem.href"
                    class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2"
                    :class="[
                      isActive(subItem.href)
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    ]"
                  >
                    <component :is="subItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                    <span class="whitespace-nowrap flex-1 text-left">{{ subItem.name }}</span>
                  </NuxtLink>
                </div>
              </template>
            </div>
          </Transition>
        </div>
        <!-- Menu item without submenu -->
        <div v-else>
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
        </div>
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
  Info,
  Menu,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-vue-next'

interface Props {
  collapsed: boolean
}

defineProps<Props>()

const route = useRoute()

// Submenu state - sẵn sàng cho việc mở rộng
const openSubmenus = ref<string[]>([])

// Navigation items - load từ file JSON
const navigationItems = ref<any[]>([])

// Load menu data from JSON file
const loadMenuData = async () => {
  try {
    const response = await $fetch('/api/menus')
    // Filter only active menus and sort by order
    const activeMenus = response.success ? response.data : response
    const filteredMenus = activeMenus
      .filter((menu: any) => menu.isActive)
      .sort((a: any, b: any) => a.order - b.order)
    
    // Convert to sidebar format
    navigationItems.value = filteredMenus.map((menu: any) => ({
      name: menu.name,
      href: menu.href,
      icon: getIconComponent(menu.icon),
      children: menu.children || []
    }))
  } catch (error) {
    console.error('Error loading menu data:', error)
    // Fallback to static data
    navigationItems.value = [
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
        name: 'Quản lý Menu',
        href: '/menu-management',
        icon: Menu
      },
      {
        name: 'Giới thiệu',
        href: '/about',
        icon: Info
      }
    ]
  }
}

// Get icon component by name
const getIconComponent = (iconName: string) => {
  const icons: any = {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    Menu,
    Info,
    Plus: Plus,
    Edit: Edit,
    Trash2: Trash2,
    Search: Search
  }
  return icons[iconName] || Menu
}

// Toggle submenu - sẵn sàng cho việc mở rộng
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

// Check if submenu is active - sẵn sàng cho việc mở rộng
const isSubmenuActive = (children: any[]) => {
  if (!children) return false
  return children.some(child => isActive(child.href))
}

// Load menu data on component mount
onMounted(() => {
  loadMenuData()
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