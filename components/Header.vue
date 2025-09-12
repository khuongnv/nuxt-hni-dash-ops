<template>
  <header class="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
    <div class="flex h-16 items-center justify-between px-6">
      <!-- Left side -->
      <div class="flex items-center space-x-4">
        <!-- Mobile menu button -->
        <Button
          variant="ghost"
          size="sm"
          class="lg:hidden"
          @click="$emit('toggle-sidebar')"
        >
          <Menu class="h-5 w-5" />
        </Button>
        
        <!-- Page title -->
        <h1 class="text-xl font-semibold text-foreground">{{ title }}</h1>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Theme toggle -->
        <Button
          variant="ghost"
          size="sm"
          @click="toggleColorMode"
        >
          <component :is="isDark ? Sun : Moon" class="h-5 w-5" />
        </Button>

        <!-- User menu -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="relative h-8 w-8 rounded-full">
              <Avatar class="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56" align="end" force-mount>
            <DropdownMenuLabel class="font-normal">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">Admin User</p>
                <p class="text-xs leading-none text-muted-foreground">
                  admin@hni.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User class="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings class="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut class="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { 
  Menu, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-vue-next'

interface Props {
  title: string
  collapsed: boolean
}

defineProps<Props>()
defineEmits<{
  'toggle-sidebar': []
}>()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Toggle color mode
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
