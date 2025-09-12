<template>
  <div>
    <!-- Menu item with submenu -->
    <div v-if="item.children && item.children.length > 0">
      <button
        @click="toggleSubmenu(item.name)"
        :aria-expanded="openSubmenus.includes(item.name)"
        :aria-controls="`submenu-${item.name}`"
        :aria-label="collapsed ? item.name : undefined"
        class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        :class="[
          collapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2',
          level === 0 ? 'space-x-3' : '',
          isActive(item.href)
            ? level === 0 ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
            : isSubmenuActive(item.children)
              ? level === 0 ? 'bg-accent/50 text-accent-foreground' : 'bg-accent/30 text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        ]"
      >
        <component :is="item.icon" :class="[level === 0 ? 'h-5 w-5' : 'h-4 w-4', 'flex-shrink-0']" />
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
        <Tooltip 
          v-if="collapsed" 
          :content="item.name"
          placement="right"
          :delay="300"
        />
      </button>
      
      <!-- Submenu -->
      <Transition name="slide-down">
        <div 
          v-if="openSubmenus.includes(item.name)" 
          :id="`submenu-${item.name}`"
          role="menu"
          :aria-label="`${item.name} submenu`"
          :class="collapsed ? 'mt-1 space-y-1' : 'ml-6 mt-1 space-y-1'"
        >
          <MenuItem
            v-for="subItem in item.children"
            :key="subItem.name"
            :item="subItem"
            :level="level + 1"
            :collapsed="collapsed"
            :open-submenus="openSubmenus"
            :toggle-submenu="toggleSubmenu"
            :is-active="isActive"
            :is-submenu-active="isSubmenuActive"
          />
        </div>
      </Transition>
    </div>
    
    <!-- Menu item without submenu -->
    <div v-else>
      <NuxtLink
        :to="item.href"
        :aria-label="collapsed ? item.name : undefined"
        :aria-current="isActive(item.href) ? 'page' : undefined"
        class="flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        :class="[
          collapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2',
          level === 0 ? 'space-x-3' : '',
          isActive(item.href)
            ? level === 0 ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        ]"
      >
        <component :is="item.icon" :class="[level === 0 ? 'h-5 w-5' : 'h-4 w-4', 'flex-shrink-0', collapsed ? '' : 'mr-3']" />
        <Transition name="fade" mode="out-in">
          <span v-if="!collapsed" class="whitespace-nowrap flex-1 text-left">{{ item.name }}</span>
        </Transition>
        
        <!-- Tooltip for collapsed state -->
        <Tooltip 
          v-if="collapsed" 
          :content="item.name"
          placement="right"
          :delay="300"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import Tooltip from './Tooltip.vue'

interface MenuItem {
  name: string
  href: string
  icon: any
  children?: MenuItem[]
}

interface Props {
  item: MenuItem
  level?: number
  collapsed: boolean
  openSubmenus: string[]
  toggleSubmenu: (name: string) => void
  isActive: (href: string) => boolean
  isSubmenuActive: (children: MenuItem[]) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})
</script>
