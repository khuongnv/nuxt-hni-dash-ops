<template>
  <div class="container mx-auto p-6">
    <PageHeader 
      title="Quản lý Danh mục" 
      description="Quản lý các danh mục sản phẩm và dịch vụ"
    />

    <!-- Filters and Actions -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm theo tên hoặc code..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
          <Search class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <!-- Parent Filter -->
        <select
          v-model="parentFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả danh mục</option>
          <option value="root">Chỉ danh mục gốc</option>
          <option value="child">Chỉ danh mục con</option>
        </select>
      </div>

      <Button @click="openCreateModal" class="flex items-center gap-2">
        <Plus class="h-4 w-4" />
        Thêm danh mục
      </Button>
    </div>

    <!-- Categories Table -->
    <Card>
      <CardHeader>
        <CardTitle>Danh sách danh mục</CardTitle>
        <CardDescription>
          Tổng cộng: {{ filteredCategories.length }} danh mục
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Danh mục cha</TableHead>
                <TableHead>Map ID</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead class="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="loading">
                <TableCell colspan="8" class="text-center py-8">
                  <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span class="ml-2">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-else-if="filteredCategories.length === 0">
                <TableCell colspan="8" class="text-center py-8 text-gray-500">
                  Không có danh mục nào
                </TableCell>
              </TableRow>
              <TableRow v-else v-for="category in filteredCategories" :key="category.id">
                <TableCell class="font-medium">{{ category.id }}</TableCell>
                <TableCell>
                  <Badge variant="outline">{{ category.code }}</Badge>
                </TableCell>
                <TableCell class="font-medium">{{ category.name }}</TableCell>
                <TableCell>
                  <span v-if="category.parent_id" class="text-sm text-gray-600">
                    {{ getParentName(category.parent_id) }}
                  </span>
                  <span v-else class="text-sm text-gray-400">Danh mục gốc</span>
                </TableCell>
                <TableCell>
                  <span v-if="category.map_id" class="text-sm">{{ category.map_id }}</span>
                  <span v-else class="text-sm text-gray-400">-</span>
                </TableCell>
                <TableCell>
                  <span v-if="category.note" class="text-sm text-gray-600 max-w-xs truncate">
                    {{ category.note }}
                  </span>
                  <span v-else class="text-sm text-gray-400">-</span>
                </TableCell>
                <TableCell class="text-sm text-gray-600">
                  {{ formatDate(category.created_at) }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="openEditModal(category)"
                    >
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      @click="confirmDelete(category)"
                      :disabled="hasChildren(category.id)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">
          {{ isEditing ? 'Sửa danh mục' : 'Thêm danh mục mới' }}
        </h3>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Code -->
          <div>
            <Label for="code">Code *</Label>
            <input
              id="code"
              v-model="form.code"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập code danh mục"
            />
          </div>

          <!-- Name -->
          <div>
            <Label for="name">Tên danh mục *</Label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên danh mục"
            />
          </div>

          <!-- Parent Category -->
          <div>
            <Label for="parent_id">Danh mục cha</Label>
            <select
              id="parent_id"
              v-model="form.parent_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn danh mục cha (tùy chọn)</option>
              <option
                v-for="parent in availableParents"
                :key="parent.id"
                :value="parent.id"
              >
                {{ parent.name }} ({{ parent.code }})
              </option>
            </select>
          </div>

          <!-- Map ID -->
          <div>
            <Label for="map_id">Map ID</Label>
            <input
              id="map_id"
              v-model.number="form.map_id"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập Map ID (tùy chọn)"
            />
          </div>

          <!-- Note -->
          <div>
            <Label for="note">Ghi chú</Label>
            <textarea
              id="note"
              v-model="form.note"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập ghi chú (tùy chọn)"
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              @click="closeModal"
              class="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              :disabled="submitting"
              class="flex-1"
            >
              {{ submitting ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Tạo mới') }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeDeleteModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4 text-red-600">Xác nhận xóa</h3>
        <p class="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa danh mục 
          <strong>"{{ categoryToDelete?.name }}"</strong>?
          <br>
          <span class="text-sm text-red-500">Hành động này không thể hoàn tác.</span>
        </p>
        <div class="flex gap-3">
          <Button
            variant="outline"
            @click="closeDeleteModal"
            class="flex-1"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            @click="deleteCategory"
            :disabled="deleting"
            class="flex-1"
          >
            {{ deleting ? 'Đang xóa...' : 'Xóa' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, Edit, Trash2 } from 'lucide-vue-next'
import { useCategories, type Category } from '~/composables/useCategories'

// Meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Composables
const { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory: deleteCategoryApi,
  getParentCategories 
} = useCategories()

// Reactive data
const categories = ref<Category[]>([])
const loading = ref(false)
const searchQuery = ref('')
const parentFilter = ref('all')

// Modal states
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const categoryToDelete = ref<Category | null>(null)

// Form data
const form = ref({
  code: '',
  name: '',
  parent_id: null as number | null,
  map_id: null as number | null,
  note: ''
})

// Computed
const filteredCategories = computed(() => {
  let filtered = categories.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(cat => 
      cat.name.toLowerCase().includes(query) || 
      cat.code.toLowerCase().includes(query)
    )
  }

  // Parent filter
  if (parentFilter.value === 'root') {
    filtered = filtered.filter(cat => !cat.parent_id)
  } else if (parentFilter.value === 'child') {
    filtered = filtered.filter(cat => cat.parent_id)
  }

  return filtered
})

const availableParents = computed(() => {
  if (isEditing.value) {
    // When editing, exclude current category and its children
    return getParentCategories(categories.value, form.value.id)
  }
  return getParentCategories(categories.value)
})

// Methods
const loadCategories = async () => {
  loading.value = true
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    loading.value = false
  }
}

const getParentName = (parentId: number): string => {
  const parent = categories.value.find(cat => cat.id === parentId)
  return parent ? `${parent.name} (${parent.code})` : 'Không xác định'
}

const hasChildren = (categoryId: number): boolean => {
  return categories.value.some(cat => cat.parent_id === categoryId)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    code: '',
    name: '',
    parent_id: null,
    map_id: null,
    note: ''
  }
  showModal.value = true
}

const openEditModal = (category: Category) => {
  isEditing.value = true
  form.value = {
    id: category.id,
    code: category.code,
    name: category.name,
    parent_id: category.parent_id,
    map_id: category.map_id,
    note: category.note || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    code: '',
    name: '',
    parent_id: null,
    map_id: null,
    note: ''
  }
}

const submitForm = async () => {
  if (!form.value.code.trim() || !form.value.name.trim()) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
    return
  }

  submitting.value = true
  try {
    if (isEditing.value) {
      await updateCategory(form.value.id!, {
        code: form.value.code,
        name: form.value.name,
        parent_id: form.value.parent_id,
        map_id: form.value.map_id,
        note: form.value.note || null
      })
    } else {
      await createCategory({
        code: form.value.code,
        name: form.value.name,
        parent_id: form.value.parent_id,
        map_id: form.value.map_id,
        note: form.value.note || null
      })
    }
    
    await loadCategories()
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  categoryToDelete.value = null
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return

  deleting.value = true
  try {
    await deleteCategoryApi(categoryToDelete.value.id)
    await loadCategories()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting category:', error)
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>
