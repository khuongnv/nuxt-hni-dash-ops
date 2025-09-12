<template>
  <nav class="flex items-center space-x-2 text-sm text-muted-foreground">
    <NuxtLink 
      to="/dashboard" 
      class="hover:text-foreground transition-colors"
    >
      Trang chủ
    </NuxtLink>
    
    <template v-for="(item, index) in breadcrumbs" :key="item.path">
      <ChevronRight class="h-4 w-4" />
      <NuxtLink 
        v-if="index < breadcrumbs.length - 1"
        :to="item.path" 
        class="hover:text-foreground transition-colors"
      >
        {{ item.name }}
      </NuxtLink>
      <span v-else class="text-foreground font-medium">
        {{ item.name }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

interface BreadcrumbItem {
  name: string
  path: string
}

interface Props {
  items?: BreadcrumbItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

const route = useRoute()

// Generate breadcrumbs based on current route
const breadcrumbs = computed(() => {
  if (props.items.length > 0) {
    return props.items
  }
  
  // Auto-generate breadcrumbs from route
  const pathSegments = route.path.split('/').filter(Boolean)
  const breadcrumbItems: BreadcrumbItem[] = []
  
  // Vietnamese page names mapping
  const pageNames: Record<string, string> = {
    'dashboard': 'Dashboard',
    'users': 'Người dùng',
    'reports': 'Báo cáo',
    'settings': 'Cài đặt'
  }
  
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Use Vietnamese name if available, otherwise convert to readable name
    const name = pageNames[segment] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbItems.push({
      name,
      path: currentPath
    })
  })
  
  return breadcrumbItems
})
</script>
