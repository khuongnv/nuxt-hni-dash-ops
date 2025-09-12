<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <PageHeader 
      title="Quản lý người dùng"
    >
      <template #actions>
        <Button>
          <UserPlus class="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </template>
    </PageHeader>

    <!-- Filters -->
    <Card>
      <CardHeader>
        <CardTitle>Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-64">
            <Input placeholder="Tìm kiếm người dùng..." />
          </div>
          <Select>
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
              <SelectItem value="user">Người dùng</SelectItem>
              <SelectItem value="moderator">Điều hành viên</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Users Table -->
    <Card>
      <CardHeader>
        <CardTitle>Danh sách người dùng</CardTitle>
        <CardDescription>
          Tổng cộng {{ users.length }} người dùng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead class="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in users" :key="user.id">
                <TableCell class="font-medium">
                  <div class="flex items-center space-x-3">
                    <Avatar class="h-8 w-8">
                      <AvatarImage :src="user.avatar" :alt="user.name" />
                      <AvatarFallback>{{ user.name.charAt(0) }}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div class="font-medium">{{ user.name }}</div>
                      <div class="text-sm text-muted-foreground">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{{ user.email }}</TableCell>
                <TableCell>
                  <Badge :variant="getRoleVariant(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(user.status)">
                    {{ getStatusLabel(user.status) }}
                  </Badge>
                </TableCell>
                <TableCell>{{ new Date(user.createdAt).toLocaleDateString('vi-VN') }}</TableCell>
                <TableCell class="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" class="h-8 w-8 p-0">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye class="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit class="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key class="mr-2 h-4 w-4" />
                        Đặt lại mật khẩu
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-red-600">
                        <Trash2 class="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { 
  UserPlus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Key, 
  Trash2 
} from 'lucide-vue-next'

// Import UI components explicitly
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import Input from '~/components/ui/Input.vue'
import Select from '~/components/ui/Select.vue'
import SelectTrigger from '~/components/ui/SelectTrigger.vue'
import SelectValue from '~/components/ui/SelectValue.vue'
import SelectContent from '~/components/ui/SelectContent.vue'
import SelectItem from '~/components/ui/SelectItem.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'
import Avatar from '~/components/ui/Avatar.vue'
import AvatarImage from '~/components/ui/AvatarImage.vue'
import AvatarFallback from '~/components/ui/AvatarFallback.vue'
import Badge from '~/components/ui/Badge.vue'
import DropdownMenu from '~/components/ui/DropdownMenu.vue'
import DropdownMenuTrigger from '~/components/ui/DropdownMenuTrigger.vue'
import DropdownMenuContent from '~/components/ui/DropdownMenuContent.vue'
import DropdownMenuItem from '~/components/ui/DropdownMenuItem.vue'
import DropdownMenuSeparator from '~/components/ui/DropdownMenuSeparator.vue'

// Set page title
useHead({
  title: 'Quản lý người dùng - HNI Operations'
})

// Mock data for users
const users = [
  {
    id: 'USR001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@hni.com',
    role: 'admin',
    status: 'active',
    avatar: '/placeholder-avatar.svg',
    createdAt: '2024-01-15'
  },
  {
    id: 'USR002',
    name: 'Trần Thị Bình',
    email: 'binh.tran@hni.com',
    role: 'user',
    status: 'active',
    avatar: '/placeholder-avatar.svg',
    createdAt: '2024-01-20'
  },
  {
    id: 'USR003',
    name: 'Lê Văn Cường',
    email: 'cuong.le@hni.com',
    role: 'moderator',
    status: 'inactive',
    avatar: '/placeholder-avatar.svg',
    createdAt: '2024-01-25'
  },
  {
    id: 'USR004',
    name: 'Phạm Thị Dung',
    email: 'dung.pham@hni.com',
    role: 'user',
    status: 'pending',
    avatar: '/placeholder-avatar.svg',
    createdAt: '2024-02-01'
  },
  {
    id: 'USR005',
    name: 'Hoàng Văn Em',
    email: 'em.hoang@hni.com',
    role: 'user',
    status: 'active',
    avatar: '/placeholder-avatar.svg',
    createdAt: '2024-02-05'
  }
]

// Helper functions
const getRoleVariant = (role: string) => {
  const variants: Record<string, string> = {
    admin: 'destructive',
    moderator: 'secondary',
    user: 'default'
  }
  return variants[role] || 'default'
}

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: 'Quản trị viên',
    moderator: 'Điều hành viên',
    user: 'Người dùng'
  }
  return labels[role] || role
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    active: 'default',
    inactive: 'secondary',
    pending: 'outline'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    pending: 'Chờ duyệt'
  }
  return labels[status] || status
}
</script>
