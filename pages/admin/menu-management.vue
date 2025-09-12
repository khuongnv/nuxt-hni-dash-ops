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
            <select 
              v-model="statusFilter" 
              @change="handleFilter"
              class="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <select 
              v-model="levelFilter" 
              @change="handleFilter"
              class="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">Tất cả</option>
              <option value="1">Cấp 1</option>
              <option value="2">Cấp 2</option>
              <option value="3">Cấp 3</option>
              <option value="4">Cấp 4</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Menu Table -->
    <Card>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Tên menu</TableHead>
              <TableHead>Đường dẫn</TableHead>
              <TableHead>Cấp độ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thứ tự</TableHead>
              <TableHead class="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading">
              <TableCell colspan="8" class="text-center py-8">
                <div class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span class="ml-2">Đang tải...</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-else-if="paginatedMenus.length === 0">
              <TableCell colspan="8" class="text-center py-8 text-muted-foreground">
                Không có menu nào
              </TableCell>
            </TableRow>
            <TableRow v-else v-for="menu in paginatedMenus" :key="menu.id">
              <TableCell class="font-medium">{{ menu.id }}</TableCell>
              <TableCell>
                <component :is="getIconComponent(menu.icon)" class="w-5 h-5" />
              </TableCell>
              <TableCell>{{ menu.name }}</TableCell>
              <TableCell class="font-mono text-sm">{{ menu.href }}</TableCell>
              <TableCell>
                <Badge :variant="menu.level === 1 ? 'default' : 'secondary'">
                  Cấp {{ menu.level }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="menu.isActive ? 'default' : 'destructive'">
                  {{ menu.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                </Badge>
              </TableCell>
              <TableCell>{{ menu.order }}</TableCell>
              <TableCell class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="openEditModal(menu)"
                  >
                    <Edit class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    @click="confirmDelete(menu)"
                    class="text-destructive hover:text-destructive"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Debug: menus={{ menus.length }}, filtered={{ filteredMenus.length }}, paginated={{ paginatedMenus.length }}
        <br>
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredMenus.length) }} 
        trong tổng số {{ filteredMenus.length }} menu
      </div>
      <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="loadMenus"
          >
            Test Load
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            Trước
          </Button>
        <div class="flex items-center gap-1">
          <Button
            v-for="page in visiblePages"
            :key="page"
            variant="outline"
            size="sm"
            @click="goToPage(page)"
            :class="{ 'bg-primary text-primary-foreground': page === currentPage }"
          >
            {{ page }}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          Sau
        </Button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-background rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">
            {{ isEditing ? 'Chỉnh sửa menu' : 'Thêm menu mới' }}
          </h3>
          <form @submit.prevent="saveMenu" class="space-y-4">
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
            
            <div>
              <Label for="icon">Icon *</Label>
              <select 
                id="icon"
                v-model="form.icon"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Chọn icon</option>
                <option value="LayoutDashboard">LayoutDashboard</option>
                <option value="Users">Users</option>
                <option value="BarChart3">BarChart3</option>
                <option value="Settings">Settings</option>
                <option value="Menu">Menu</option>
                <option value="Info">Info</option>
                <option value="Plus">Plus</option>
                <option value="Edit">Edit</option>
                <option value="Trash2">Trash2</option>
                <option value="Search">Search</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="order">Thứ tự</Label>
                <Input
                  id="order"
                  v-model.number="form.order"
                  type="number"
                  min="1"
                />
              </div>
              <div>
                <Label for="level">Cấp độ</Label>
                <select 
                  id="level"
                  v-model.number="form.level"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="1">Cấp 1</option>
                  <option value="2">Cấp 2</option>
                  <option value="3">Cấp 3</option>
                  <option value="4">Cấp 4</option>
                </select>
              </div>
            </div>

            <div>
              <Label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="form.isActive"
                  class="rounded"
                />
                Hoạt động
              </Label>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" @click="closeModal">
                Hủy
              </Button>
              <Button type="submit" :disabled="loading">
                {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-background rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Xác nhận xóa</h3>
          <p class="mb-6">Bạn có chắc chắn muốn xóa menu <strong>"{{ menuToDelete?.name }}"</strong>?</p>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="cancelDelete">
              Hủy
            </Button>
            <Button variant="destructive" @click="deleteMenu" :disabled="loading">
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="fixed top-4 right-4 z-50">
      <div :class="[
        'px-4 py-3 rounded-md shadow-lg flex items-center gap-2',
        toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
        <AlertCircle v-else class="w-5 h-5" />
        <span>{{ toast.message }}</span>
        <Button
          variant="ghost"
          size="sm"
          @click="toast.show = false"
          class="text-white hover:text-white/80 p-0 h-auto"
        >
          <X class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { 
  Plus, Edit, Trash2, Search, CheckCircle, AlertCircle, X,
  LayoutDashboard, Users, BarChart3, Settings, Menu, Info
} from 'lucide-vue-next'

// Import UI components
import PageHeader from '~/components/PageHeader.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'
import Label from '~/components/ui/Label.vue'
import Table from '~/components/ui/Table.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableCell from '~/components/ui/TableCell.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableRow from '~/components/ui/TableRow.vue'
import Badge from '~/components/ui/Badge.vue'

// Types
interface Menu {
  id: number
  name: string
  href: string
  icon: string
  order: number
  isActive: boolean
  parentId: number | null
  level: number
  createdAt: string
  updatedAt: string
}

interface Toast {
  show: boolean
  type: 'success' | 'error'
  message: string
}

// Reactive data
const menus = ref<Menu[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const levelFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const menuToDelete = ref<Menu | null>(null)

const form = reactive({
  id: 0,
  name: '',
  href: '',
  icon: '',
  order: 1,
  isActive: true,
  parentId: null,
  level: 1
})

const toast = reactive<Toast>({
  show: false,
  type: 'success',
  message: ''
})

// Computed properties
const filteredMenus = computed(() => {
  let filtered = menus.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(menu => 
      menu.name.toLowerCase().includes(query) ||
      menu.href.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(menu => {
      if (statusFilter.value === 'active') return menu.isActive
      if (statusFilter.value === 'inactive') return !menu.isActive
      return true
    })
  }

  // Level filter
  if (levelFilter.value !== 'all') {
    filtered = filtered.filter(menu => menu.level === Number(levelFilter.value))
  }

  return filtered.sort((a, b) => a.order - b.order)
})

const totalPages = computed(() => Math.ceil(filteredMenus.value.length / itemsPerPage.value))

const paginatedMenus = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMenus.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Methods

const saveMenu = async () => {
  try {
    loading.value = true
    
    // Validate form
    if (!form.name || !form.href || !form.icon) {
      showToast('error', 'Vui lòng điền đầy đủ thông tin bắt buộc')
      loading.value = false
      return
    }
    
    if (isEditing.value) {
      // Update existing menu
      const response = await $fetch(`/api/menus/${form.id}`, {
        method: 'PUT',
        body: {
          name: form.name,
          href: form.href,
          icon: form.icon,
          order: form.order,
          isActive: form.isActive,
          parentId: form.parentId,
          level: form.level
        }
      })
      
      if (response.success) {
        showToast('success', 'Cập nhật menu thành công')
        await refreshMenus()
        closeModal()
      } else {
        showToast('error', response.message || 'Lỗi khi cập nhật menu')
      }
    } else {
      // Create new menu
      const response = await $fetch('/api/menus', {
        method: 'POST',
        body: {
          name: form.name,
          href: form.href,
          icon: form.icon,
          order: form.order,
          isActive: form.isActive,
          parentId: form.parentId,
          level: form.level
        }
      })
      
      if (response.success) {
        showToast('success', 'Thêm menu mới thành công')
        await refreshMenus()
        closeModal()
      } else {
        showToast('error', response.message || 'Lỗi khi thêm menu mới')
      }
    }
  } catch (error: any) {
    console.error('Error saving menu:', error)
    showToast('error', error.data?.message || 'Có lỗi xảy ra')
  } finally {
    loading.value = false
  }
}

const deleteMenu = async () => {
  if (!menuToDelete.value) return
  
  try {
    loading.value = true
    const response = await $fetch(`/api/menus/${menuToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      showToast('success', 'Xóa menu thành công')
      await refreshMenus()
      cancelDelete()
    } else {
      showToast('error', response.message || 'Lỗi khi xóa menu')
    }
  } catch (error: any) {
    console.error('Error deleting menu:', error)
    showToast('error', error.data?.message || 'Có lỗi xảy ra')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (menu: Menu) => {
  isEditing.value = true
  form.id = menu.id
  form.name = menu.name
  form.href = menu.href
  form.icon = menu.icon
  form.order = menu.order
  form.isActive = menu.isActive
  form.parentId = menu.parentId
  form.level = menu.level
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const confirmDelete = (menu: Menu) => {
  menuToDelete.value = menu
  showDeleteModal.value = true
}

const cancelDelete = () => {
  menuToDelete.value = null
  showDeleteModal.value = false
}

const resetForm = () => {
  form.id = 0
  form.name = ''
  form.href = ''
  form.icon = ''
  form.order = 1
  form.isActive = true
  form.parentId = null
  form.level = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
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
  return iconMap[iconName] || Menu
}

const showToast = (type: 'success' | 'error', message: string) => {
  toast.type = type
  toast.message = message
  toast.show = true
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

// Load menus from API using useFetch
const { data: apiResponse, pending: apiLoading, refresh: refreshMenus } = await useFetch('/api/menus', {
  server: false,
  default: () => ({ success: false, data: [] })
})

// Watch for API response and update menus
watch(apiResponse, (newResponse) => {
  if (newResponse && newResponse.success && newResponse.data) {
    menus.value = newResponse.data
    console.log('Menus loaded from API:', newResponse.data)
  }
}, { immediate: true })

// Watch for loading state
watch(apiLoading, (newLoading) => {
  loading.value = newLoading
})

// Alias for refreshMenus (used in other functions)
const loadMenus = refreshMenus

</script>