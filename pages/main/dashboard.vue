<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Page Header -->
    <PageHeader 
      title="Dashboard"
    />

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      <Card v-for="stat in stats" :key="stat.title">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ stat.title }}
          </CardTitle>
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <p class="text-xs text-muted-foreground">
            <span :class="stat.change >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ stat.change >= 0 ? '+' : '' }}{{ stat.change }}%
            </span>
            so với tháng trước
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-10">
      <!-- Revenue Chart -->
      <Card class="col-span-4 xl:col-span-7">
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
        </CardHeader>
        <CardContent class="pl-2">
          <div class="h-80 xl:h-96">
            <!-- Simple Chart -->
            <div class="h-full w-full relative">
              <svg width="100%" height="100%" class="w-full h-full">
                <!-- Grid lines -->
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <!-- Chart area -->
                <g transform="translate(40, 40)">
                  <!-- Y-axis labels -->
                  <text x="-10" y="0" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">65M</text>
                  <text x="-10" y="50" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">50M</text>
                  <text x="-10" y="100" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">35M</text>
                  <text x="-10" y="150" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">20M</text>
                  <text x="-10" y="200" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">0M</text>
                  
                  <!-- X-axis labels -->
                  <text x="0" y="220" text-anchor="middle" class="text-xs fill-gray-500">T1</text>
                  <text x="50" y="220" text-anchor="middle" class="text-xs fill-gray-500">T3</text>
                  <text x="100" y="220" text-anchor="middle" class="text-xs fill-gray-500">T5</text>
                  <text x="150" y="220" text-anchor="middle" class="text-xs fill-gray-500">T7</text>
                  <text x="200" y="220" text-anchor="middle" class="text-xs fill-gray-500">T9</text>
                  <text x="250" y="220" text-anchor="middle" class="text-xs fill-gray-500">T11</text>
                  
                  <!-- Chart line -->
                  <polyline
                    points="0,200 50,180 100,120 150,80 200,40 250,60"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  
                  <!-- Chart area fill -->
                  <polygon
                    points="0,200 0,200 50,180 100,120 150,80 200,40 250,60 250,200"
                    fill="url(#gradient)"
                    opacity="0.1"
                  />
                  
                  <!-- Data points -->
                  <circle cx="0" cy="200" r="6" fill="#3b82f6" stroke="#fff" stroke-width="2" class="hover:r-8 transition-all duration-200 cursor-pointer" />
                  <circle cx="50" cy="180" r="6" fill="#3b82f6" stroke="#fff" stroke-width="2" class="hover:r-8 transition-all duration-200 cursor-pointer" />
                  <circle cx="100" cy="120" r="6" fill="#3b82f6" stroke="#fff" stroke-width="2" class="hover:r-8 transition-all duration-200 cursor-pointer" />
                  <circle cx="150" cy="80" r="6" fill="#3b82f6" stroke="#fff" stroke-width="2" class="hover:r-8 transition-all duration-200 cursor-pointer" />
                  <circle cx="200" cy="40" r="6" fill="#3b82f6" stroke="#fff" stroke-width="2" class="hover:r-8 transition-all duration-200 cursor-pointer" />
                  <circle cx="250" cy="60" r="6" fill="#3b82f6" stroke="#fff" stroke-width="2" class="hover:r-8 transition-all duration-200 cursor-pointer" />
                </g>
                
                <!-- Gradient definition -->
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
                  </linearGradient>
                </defs>
              </svg>
              
              <!-- Chart title -->
              <div class="absolute top-4 left-4 text-sm font-medium text-gray-700">
                Doanh thu theo tháng (triệu VNĐ)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card class="col-span-3 xl:col-span-3">
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Activity Chart -->
          <div class="h-32 mb-4">
            <!-- Simple Bar Chart -->
            <div class="h-full w-full relative">
              <svg width="100%" height="100%" class="w-full h-full">
                <!-- Chart area -->
                <g transform="translate(30, 20)">
                  <!-- Y-axis labels -->
                  <text x="-10" y="0" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">25</text>
                  <text x="-10" y="20" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">20</text>
                  <text x="-10" y="40" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">15</text>
                  <text x="-10" y="60" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">10</text>
                  <text x="-10" y="80" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">5</text>
                  <text x="-10" y="100" text-anchor="end" dominant-baseline="middle" class="text-xs fill-gray-500">0</text>
                  
                  <!-- X-axis labels -->
                  <text x="20" y="120" text-anchor="middle" class="text-xs fill-gray-500">T2</text>
                  <text x="50" y="120" text-anchor="middle" class="text-xs fill-gray-500">T3</text>
                  <text x="80" y="120" text-anchor="middle" class="text-xs fill-gray-500">T4</text>
                  <text x="110" y="120" text-anchor="middle" class="text-xs fill-gray-500">T5</text>
                  <text x="140" y="120" text-anchor="middle" class="text-xs fill-gray-500">T6</text>
                  <text x="170" y="120" text-anchor="middle" class="text-xs fill-gray-500">T7</text>
                  <text x="200" y="120" text-anchor="middle" class="text-xs fill-gray-500">CN</text>
                  
                  <!-- Bars -->
                  <rect x="10" y="52" width="20" height="48" fill="#3b82f6" rx="2" class="hover:fill-blue-600 transition-colors duration-200 cursor-pointer" />
                  <rect x="40" y="20" width="20" height="80" fill="#3b82f6" rx="2" class="hover:fill-blue-600 transition-colors duration-200 cursor-pointer" />
                  <rect x="70" y="84" width="20" height="16" fill="#3b82f6" rx="2" class="hover:fill-blue-600 transition-colors duration-200 cursor-pointer" />
                  <rect x="100" y="40" width="20" height="60" fill="#3b82f6" rx="2" class="hover:fill-blue-600 transition-colors duration-200 cursor-pointer" />
                  <rect x="130" y="12" width="20" height="88" fill="#3b82f6" rx="2" class="hover:fill-blue-600 transition-colors duration-200 cursor-pointer" />
                  <rect x="160" y="28" width="20" height="72" fill="#3b82f6" rx="2" class="hover:fill-blue-600 transition-colors duration-200 cursor-pointer" />
                  <rect x="190" y="0" width="20" height="100" fill="#3b82f6" rx="2" class="hover:fill-blue-600 transition-colors duration-200 cursor-pointer" />
                </g>
              </svg>
              
              <!-- Chart title -->
              <div class="absolute top-2 left-2 text-xs font-medium text-gray-700">
                Hoạt động theo tuần
              </div>
            </div>
          </div>
          
          <!-- Activity List -->
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-4">
              <div class="h-2 w-2 bg-primary rounded-full" />
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium leading-none">{{ activity.title }}</p>
                <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
              </div>
              <div class="text-xs text-muted-foreground">{{ activity.time }}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <Button variant="outline" class="h-20 flex flex-col items-center justify-center space-y-2">
            <Users class="h-6 w-6" />
            <span>Thêm người dùng</span>
          </Button>
          <Button variant="outline" class="h-20 flex flex-col items-center justify-center space-y-2">
            <BarChart3 class="h-6 w-6" />
            <span>Tạo báo cáo</span>
          </Button>
          <Button variant="outline" class="h-20 flex flex-col items-center justify-center space-y-2">
            <Settings class="h-6 w-6" />
            <span>Cài đặt hệ thống</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Activity,
  BarChart3,
  Settings
} from 'lucide-vue-next'

// Import UI components explicitly
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Button from '~/components/ui/Button.vue'


// Set page title
useHead({
  title: 'Dashboard - HNI Operations'
})

// Mock data for stats
const stats = [
  {
    title: 'Tổng người dùng',
    value: '2,350',
    change: 20.1,
    icon: Users
  },
  {
    title: 'Người dùng mới',
    value: '180',
    change: 5.2,
    icon: UserPlus
  },
  {
    title: 'Doanh thu',
    value: '45,231,000',
    change: -2.3,
    icon: DollarSign
  },
  {
    title: 'Hoạt động',
    value: '12,234',
    change: 19.0,
    icon: Activity
  }
]

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    title: 'Người dùng mới đăng ký',
    description: 'john.doe@example.com đã tạo tài khoản',
    time: '2 phút trước'
  },
  {
    id: 2,
    title: 'Báo cáo được tạo',
    description: 'Báo cáo tháng 12/2024 đã được tạo',
    time: '1 giờ trước'
  },
  {
    id: 3,
    title: 'Cập nhật hệ thống',
    description: 'Phiên bản 2.1.0 đã được triển khai',
    time: '3 giờ trước'
  },
  {
    id: 4,
    title: 'Backup dữ liệu',
    description: 'Backup tự động đã hoàn thành',
    time: '6 giờ trước'
  }
]


</script>
