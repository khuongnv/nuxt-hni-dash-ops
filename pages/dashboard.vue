<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Dashboard</h2>
      <p class="text-muted-foreground">
        Tổng quan về hoạt động hệ thống
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <!-- Revenue Chart -->
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
        </CardHeader>
        <CardContent class="pl-2">
          <div class="h-80 flex items-center justify-center bg-muted/50 rounded-lg">
            <div class="text-center">
              <BarChart3 class="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p class="text-muted-foreground">Biểu đồ doanh thu</p>
              <p class="text-sm text-muted-foreground">Mock data - Cần tích hợp chart library</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
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
        <div class="grid gap-4 md:grid-cols-3">
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
