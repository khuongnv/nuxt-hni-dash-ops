<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Page Header -->
    <PageHeader 
      title="Quản lý Menu hệ thống"
      description="Quản lý cấu trúc menu và điều hướng của hệ thống"
    />

    <!-- Actions Bar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button @click="openCreateModal" class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Thêm menu mới
        </Button>
        <Button variant="outline" @click="loadMenus" :disabled="loading">
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Làm mới
        </Button>
      </div>
      
      <div class="flex items-center gap-2">
        <Input 
          v-model="searchQuery" 
          placeholder="Tìm kiếm menu..." 
          class="w-64"
        />
      </div>
    </div>

    <!-- Menu Table -->
    <Card>
      <CardHeader>
        <CardTitle>Danh sách Menu</CardTitle>
        <CardDescription>
          Tổng cộng {{ filteredMenus.length }} menu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-12">#</TableHead>
                <TableHead>Tên menu</TableHead>
                <TableHead>Đường dẫn</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Thứ tự</TableHead>
                <TableHead>Cấp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead class="w-32">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="loading">
                <TableCell colspan="8" class="text-center py-8">
                  <div class="flex items-center justify-center gap-2">
                    <RefreshCw class="w-4 h-4 animate-spin" />
                    Đang tải...
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-else-if="filteredMenus.length === 0">
                <TableCell colspan="8" class="text-center py-8 text-muted-foreground">
                  Không có menu nào
                </TableCell>
              </TableRow>
              <TableRow v-else v-for="menu in filteredMenus" :key="menu.id">
                <TableCell class="font-medium">{{ menu.id }}</TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <component 
                      :is="getIconComponent(menu.icon)" 
                      class="w-4 h-4 text-muted-foreground" 
                    />
                    <span :class="{ 'font-medium': menu.level === 1 }">
                      {{ '  '.repeat(menu.level - 1) }}{{ menu.name }}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code class="text-xs bg-muted px-1 rounded">{{ menu.href }}</code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{{ menu.icon }}</Badge>
                </TableCell>
                <TableCell>{{ menu.order }}</TableCell>
                <TableCell>
                  <Badge :variant="menu.level === 1 ? 'default' : 'secondary'">
                    Cấp {{ menu.level }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge :variant="menu.is_active ? 'default' : 'destructive'">
                    {{ menu.is_active ? 'Hoạt động' : 'Tạm dừng' }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-1">
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
                      class="text-destructive hover:text-destructive"
                    >
                      <Trash2 class="w-4 h-4" />
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
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>
      <Card class="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {{ isEditing ? 'Chỉnh sửa Menu' : 'Thêm Menu Mới' }}
          </CardTitle>
          <CardDescription>
            {{ isEditing ? 'Cập nhật thông tin menu' : 'Tạo menu mới cho hệ thống' }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="name">Tên menu *</Label>
                <Input 
                  id="name"
                  v-model="form.name" 
                  placeholder="Nhập tên menu"
                  required
                />
              </div>
              
              <div class="space-y-2">
                <Label for="href">Đường dẫn *</Label>
                <Input 
                  id="href"
                  v-model="form.href" 
                  placeholder="/path/to/page"
                  required
                />
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="icon">Icon</Label>
                <Select v-model="form.icon">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      v-for="icon in availableIcons" 
                      :key="icon" 
                      :value="icon"
                    >
                      <div class="flex items-center gap-2">
                        <component :is="getIconComponent(icon)" class="w-4 h-4" />
                        {{ icon }}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div class="space-y-2">
                <Label for="order">Thứ tự</Label>
                <Input 
                  id="order"
                  v-model.number="form.order" 
                  type="number"
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="parent">Menu cha</Label>
                <Select v-model="form.parent_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn menu cha (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="null">Không có menu cha</SelectItem>
                    <SelectItem 
                      v-for="parent in parentMenus" 
                      :key="parent.id" 
                      :value="parent.id"
                    >
                      {{ '  '.repeat(parent.level - 1) }}{{ parent.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div class="space-y-2">
                <Label for="level">Cấp menu</Label>
                <Input 
                  id="level"
                  v-model.number="form.level" 
                  type="number"
                  min="1"
                  max="4"
                  placeholder="1"
                />
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <input 
                id="is_active"
                v-model="form.is_active" 
                type="checkbox"
                class="rounded"
              />
              <Label for="is_active">Menu hoạt động</Label>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" @click="closeModal">
                Hủy
              </Button>
              <Button type="submit" :disabled="submitting">
                <RefreshCw v-if="submitting" class="w-4 h-4 animate-spin mr-2" />
                {{ isEditing ? 'Cập nhật' : 'Tạo mới' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/50" @click="closeDeleteModal"></div>
      <Card class="relative w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle class="text-destructive">Xác nhận xóa</CardTitle>
          <CardDescription>
            Bạn có chắc chắn muốn xóa menu này không?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <p><strong>Tên:</strong> {{ menuToDelete?.name }}</p>
            <p><strong>Đường dẫn:</strong> {{ menuToDelete?.href }}</p>
            <p class="text-sm text-muted-foreground">
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <Button variant="outline" @click="closeDeleteModal">
              Hủy
            </Button>
            <Button variant="destructive" @click="deleteMenu" :disabled="deleting">
              <RefreshCw v-if="deleting" class="w-4 h-4 animate-spin mr-2" />
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
  RefreshCw, 
  Edit, 
  Trash2,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Menu,
  Info,
  Shield,
  Lock,
  Key,
  FileText,
  Home,
  Search,
  Bell,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Share,
  Copy,
  Link,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  AlertTriangle,
  Info as InfoIcon,
  HelpCircle,
  Eye,
  EyeOff,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Trash,
  Archive,
  Bookmark,
  Tag,
  Folder,
  File,
  FolderOpen,
  Database,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  BatteryLow,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Printer,
  Scanner,
  HardDrive,
  Cpu,
  MemoryStick,
  Mouse,
  Keyboard,
  Headphones,
  Speaker,
  Gamepad2,
  Joystick,
  Tv,
  Radio,
  Watch,
  Thermometer,
  Droplets,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Zap,
  Flame,
  Snowflake,
  Umbrella,
  TreePine,
  TreeDeciduous,
  Flower,
  Leaf,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  Whale,
  Dolphin,
  Shark,
  Octopus,
  Crab,
  Lobster,
  Butterfly,
  Bee,
  Ant,
  Spider,
  Snail,
  Frog,
  Lizard,
  Snake,
  Crocodile,
  Elephant,
  Giraffe,
  Lion,
  Tiger,
  Bear,
  Wolf,
  Fox,
  Deer,
  Horse,
  Cow,
  Pig,
  Sheep,
  Goat,
  Chicken,
  Duck,
  Goose,
  Turkey,
  Penguin,
  Owl,
  Eagle,
  Hawk,
  Parrot,
  Peacock,
  Swan,
  Flamingo,
  Toucan,
  Hummingbird,
  Woodpecker,
  Robin,
  Cardinal,
  BlueJay,
  Crow,
  Raven,
  Magpie,
  Sparrow,
  Canary,
  Finch,
  Goldfinch,
  Wren,
  Chickadee,
  Nuthatch,
  Titmouse,
  Junco,
  Towhee,
  Grosbeak,
  Tanager,
  Warbler,
  Vireo,
  Kinglet,
  Gnatcatcher,
  Wrentit,
  Bushtit,
  Verdin,
  Phainopepla,
  SilkyFlycatcher,
  Waxwing,
  Shrike,
  Vireo,
  Warbler,
  Kinglet,
  Gnatcatcher,
  Wrentit,
  Bushtit,
  Verdin,
  Phainopepla,
  SilkyFlycatcher,
  Waxwing,
  Shrike
} from 'lucide-vue-next'

// Import UI components
import PageHeader from '~/components/PageHeader.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Button from '~/components/ui/Button.vue'
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

// Reactive data
const menus = ref([])
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const menuToDelete = ref(null)

// Form data
const form = ref({
  name: '',
  href: '',
  icon: 'Menu',
  order: 1,
  parent_id: null,
  level: 1,
  is_active: true
})

// Available icons
const availableIcons = [
  'LayoutDashboard', 'Users', 'BarChart3', 'Settings', 'Menu', 'Info',
  'Shield', 'Lock', 'Key', 'FileText', 'Home', 'Search', 'Bell', 'User',
  'Mail', 'Phone', 'Calendar', 'Clock', 'Star', 'Heart', 'ThumbsUp',
  'MessageSquare', 'Image', 'Video', 'Music', 'Download', 'Upload',
  'Share', 'Copy', 'Link', 'ExternalLink', 'Database', 'Server', 'Cloud'
]

// Icon mapping
const iconMap = {
  LayoutDashboard, Users, BarChart3, Settings, Menu, Info, Shield, Lock, Key,
  FileText, Home, Search, Bell, User, Mail, Phone, Calendar, Clock, Star,
  Heart, ThumbsUp, MessageSquare, Image, Video, Music, Download, Upload,
  Share, Copy, Link, ExternalLink, Database, Server, Cloud
}

// Computed properties
const filteredMenus = computed(() => {
  if (!searchQuery.value) return menus.value
  return menus.value.filter(menu => 
    menu.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    menu.href.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const parentMenus = computed(() => {
  return menus.value.filter(menu => menu.level < 4)
})

// Methods
const getIconComponent = (iconName) => {
  return iconMap[iconName] || Menu
}

const loadMenus = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/menus')
    if (response.success) {
      menus.value = response.data || []
    }
  } catch (error) {
    console.error('Error loading menus:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    href: '',
    icon: 'Menu',
    order: 1,
    parent_id: null,
    level: 1,
    is_active: true
  }
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (menu) => {
  isEditing.value = true
  form.value = { ...menu }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const submitForm = async () => {
  try {
    submitting.value = true
    
    if (isEditing.value) {
      // Update existing menu
      const response = await $fetch(`/api/menus/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      
      if (response.success) {
        await loadMenus()
        closeModal()
      }
    } else {
      // Create new menu
      const response = await $fetch('/api/menus', {
        method: 'POST',
        body: form.value
      })
      
      if (response.success) {
        await loadMenus()
        closeModal()
      }
    }
  } catch (error) {
    console.error('Error saving menu:', error)
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (menu) => {
  menuToDelete.value = menu
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  menuToDelete.value = null
}

const deleteMenu = async () => {
  if (!menuToDelete.value) return
  
  try {
    deleting.value = true
    const response = await $fetch(`/api/menus/${menuToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      await loadMenus()
      closeDeleteModal()
    }
  } catch (error) {
    console.error('Error deleting menu:', error)
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadMenus()
})
</script>
