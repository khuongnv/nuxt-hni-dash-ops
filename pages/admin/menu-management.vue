<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <PageHeader title="Quản lý Menu hệ thống">
      <template #actions>
        <Button @click="openCreateModal" class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Thêm menu mới
        </Button>
      </template>
    </PageHeader>

    <!-- Search and Filters -->
    <Card>
      <CardContent class="p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                v-model="searchQuery"
                placeholder="Tìm kiếm menu..."
                class="pl-10"
                @input="handleSearch"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <Select v-model="statusFilter" @update:model-value="handleFilter">
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="levelFilter" @update:model-value="handleFilter">
              <SelectTrigger class="w-32">
                <SelectValue placeholder="Cấp độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="1">Cấp 1</SelectItem>
                <SelectItem value="2">Cấp 2</SelectItem>
                <SelectItem value="3">Cấp 3</SelectItem>
                <SelectItem value="4">Cấp 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Menu Table -->
    <Card>
      <CardHeader>
        <CardTitle>Danh sách Menu</CardTitle>
        <CardDescription>
          Tổng cộng {{ filteredMenus.length }} menu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-12">#</TableHead>
                <TableHead>Tên menu</TableHead>
                <TableHead>Đường dẫn</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead class="w-20">Cấp độ</TableHead>
                <TableHead class="w-20">Thứ tự</TableHead>
                <TableHead class="w-24">Trạng thái</TableHead>
                <TableHead class="w-32">Ngày tạo</TableHead>
                <TableHead class="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="menu in paginatedMenus" :key="menu.id">
                <TableCell class="font-medium">{{ menu.id }}</TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <div 
                      v-for="i in menu.level - 1" 
                      :key="i" 
                      class="w-4 h-4 border-l-2 border-muted-foreground/30"
                    ></div>
                    <span>{{ menu.name }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code class="text-xs bg-muted px-1 rounded">{{ menu.href }}</code>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <component :is="getIconComponent(menu.icon)" class="w-4 h-4" />
                    <span class="text-xs text-muted-foreground">{{ menu.icon }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Cấp {{ menu.level }}</Badge>
                </TableCell>
                <TableCell>{{ menu.order }}</TableCell>
                <TableCell>
                  <Badge :variant="menu.isActive ? 'default' : 'secondary'">
                    {{ menu.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                  </Badge>
                </TableCell>
                <TableCell class="text-sm text-muted-foreground">
                  {{ formatDate(menu.createdAt) }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="openEditModal(menu)"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="confirmDelete(menu)"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6">
          <div class="text-sm text-muted-foreground">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredMenus.length) }} 
            trong tổng số {{ filteredMenus.length }} menu
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage = 1"
            >
              Đầu
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Trước
            </Button>
            <span class="px-3 py-1 text-sm">
              Trang {{ currentPage }} / {{ totalPages }}
            </span>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Sau
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
            >
              Cuối
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card class="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle>{{ isEditing ? 'Chỉnh sửa Menu' : 'Thêm Menu Mới' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="saveMenu" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="name">Tên menu *</Label>
                <Input
                  id="name"
                  v-model="form.name"
                  placeholder="Nhập tên menu"
                  required
                />
              </div>
              <div>
                <Label for="href">Đường dẫn *</Label>
                <Input
                  id="href"
                  v-model="form.href"
                  placeholder="/path"
                  required
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="icon">Icon</Label>
                <Select v-model="form.icon">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LayoutDashboard">LayoutDashboard</SelectItem>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="BarChart3">BarChart3</SelectItem>
                    <SelectItem value="Settings">Settings</SelectItem>
                    <SelectItem value="Menu">Menu</SelectItem>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Plus">Plus</SelectItem>
                    <SelectItem value="Edit">Edit</SelectItem>
                    <SelectItem value="Trash2">Trash2</SelectItem>
                    <SelectItem value="Search">Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="order">Thứ tự</Label>
                <Input
                  id="order"
                  v-model.number="form.order"
                  type="number"
                  min="1"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="level">Cấp độ</Label>
                <Select v-model="form.level">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="1">Cấp 1</SelectItem>
                    <SelectItem :value="2">Cấp 2</SelectItem>
                    <SelectItem :value="3">Cấp 3</SelectItem>
                    <SelectItem :value="4">Cấp 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="parentId">Menu cha</Label>
                <Select v-model="form.parentId">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn menu cha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="null">Không có</SelectItem>
                    <SelectItem 
                      v-for="parent in parentMenus" 
                      :key="parent.id" 
                      :value="parent.id"
                    >
                      {{ parent.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <input
                id="isActive"
                v-model="form.isActive"
                type="checkbox"
                class="rounded"
              />
              <Label for="isActive">Menu hoạt động</Label>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" @click="closeModal">
                Hủy
              </Button>
              <Button type="submit">
                {{ isEditing ? 'Cập nhật' : 'Tạo mới' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card class="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Xác nhận xóa</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bạn có chắc chắn muốn xóa menu <strong>{{ menuToDelete?.name }}</strong>?</p>
          <div class="flex justify-end gap-2 mt-4">
            <Button variant="outline" @click="showDeleteModal = false">
              Hủy
            </Button>
            <Button variant="destructive" @click="deleteMenu">
              Xóa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Menu,
  Info
} from 'lucide-vue-next'

// Import UI components
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Input from '~/components/ui/Input.vue'
import Label from '~/components/ui/Label.vue'
import Select from '~/components/ui/Select.vue'
import SelectContent from '~/components/ui/SelectContent.vue'
import SelectItem from '~/components/ui/SelectItem.vue'
import SelectTrigger from '~/components/ui/SelectTrigger.vue'
import SelectValue from '~/components/ui/SelectValue.vue'
import Table from '~/components/ui/Table.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableCell from '~/components/ui/TableCell.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableRow from '~/components/ui/TableRow.vue'
import Badge from '~/components/ui/Badge.vue'

// Set page title
useHead({
  title: 'Quản lý Menu - HNI Dashboard'
})

// Data
const menus = ref<any[]>([])
const searchQuery = ref('')
const statusFilter = ref('all')
const levelFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal states
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const menuToDelete = ref<any>(null)

// Form data
const form = ref({
  id: null,
  name: '',
  href: '',
  icon: 'Menu',
  order: 1,
  isActive: true,
  parentId: null,
  level: 1
})

// Computed
const filteredMenus = computed(() => {
  let filtered = menus.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(menu => 
      menu.name.toLowerCase().includes(query) ||
      menu.href.toLowerCase().includes(query) ||
      menu.icon.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    const isActive = statusFilter.value === 'active'
    filtered = filtered.filter(menu => menu.isActive === isActive)
  }

  // Level filter
  if (levelFilter.value !== 'all') {
    const level = parseInt(levelFilter.value)
    filtered = filtered.filter(menu => menu.level === level)
  }

  return filtered.sort((a, b) => a.order - b.order)
})

const paginatedMenus = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMenus.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredMenus.value.length / itemsPerPage.value)
})

const parentMenus = computed(() => {
  return menus.value.filter(menu => menu.level < 4)
})

// Methods
const loadMenus = async () => {
  try {
    const response = await $fetch('/menus.json')
    menus.value = response
    console.log('Loaded menus:', response)
  } catch (error) {
    console.error('Error loading menus:', error)
    // Fallback data if file not found
    menus.value = [
      {
        id: 1,
        name: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
        order: 1,
        isActive: true,
        parentId: null,
        level: 1,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z"
      },
      {
        id: 2,
        name: "Quản lý người dùng",
        href: "/users",
        icon: "Users",
        order: 2,
        isActive: true,
        parentId: null,
        level: 1,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z"
      },
      {
        id: 3,
        name: "Báo cáo & Thống kê",
        href: "/reports",
        icon: "BarChart3",
        order: 3,
        isActive: true,
        parentId: null,
        level: 1,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z"
      },
      {
        id: 4,
        name: "Cài đặt hệ thống",
        href: "/settings",
        icon: "Settings",
        order: 4,
        isActive: true,
        parentId: null,
        level: 1,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z"
      },
      {
        id: 5,
        name: "Quản lý Menu",
        href: "/menu-management",
        icon: "Menu",
        order: 5,
        isActive: true,
        parentId: null,
        level: 1,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z"
      },
      {
        id: 6,
        name: "Giới thiệu",
        href: "/about",
        icon: "Info",
        order: 6,
        isActive: true,
        parentId: null,
        level: 1,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z"
      }
    ]
  }
}

const saveMenu = async () => {
  try {
    if (isEditing.value) {
      // Update existing menu
      const index = menus.value.findIndex(m => m.id === form.value.id)
      if (index !== -1) {
        menus.value[index] = {
          ...form.value,
          updatedAt: new Date().toISOString()
        }
      }
    } else {
      // Create new menu
      const newMenu = {
        ...form.value,
        id: Math.max(...menus.value.map(m => m.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      menus.value.push(newMenu)
    }
    
    await saveMenusToFile()
    closeModal()
    resetForm()
  } catch (error) {
    console.error('Error saving menu:', error)
  }
}

const deleteMenu = async () => {
  try {
    const index = menus.value.findIndex(m => m.id === menuToDelete.value.id)
    if (index !== -1) {
      menus.value.splice(index, 1)
      await saveMenusToFile()
    }
    showDeleteModal.value = false
    menuToDelete.value = null
  } catch (error) {
    console.error('Error deleting menu:', error)
  }
}

const saveMenusToFile = async () => {
  try {
    // Save to localStorage for persistence
    localStorage.setItem('menus', JSON.stringify(menus.value))
    console.log('Menus saved to localStorage:', menus.value)
    
    // In a real app, this would be an API call to save to server
    // For demo purposes, we'll also update the public JSON file
    // Note: This won't work in production, need API endpoint
  } catch (error) {
    console.error('Error saving menus:', error)
  }
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (menu: any) => {
  isEditing.value = true
  form.value = { ...menu }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    href: '',
    icon: 'Menu',
    order: 1,
    isActive: true,
    parentId: null,
    level: 1
  }
}

const confirmDelete = (menu: any) => {
  menuToDelete.value = menu
  showDeleteModal.value = true
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getIconComponent = (iconName: string) => {
  const icons: any = {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    Menu,
    Info,
    Plus,
    Edit,
    Trash2,
    Search
  }
  return icons[iconName] || Menu
}

// Lifecycle
onMounted(() => {
  loadMenus()
})
</script>
