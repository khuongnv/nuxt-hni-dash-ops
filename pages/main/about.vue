<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Page Header -->
    <PageHeader 
      title="Giới thiệu về chương trình"
    />

    <!-- About Content -->
    <div class="space-y-8">
      <!-- Introduction -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Info class="w-5 h-5" />
            Tổng quan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground leading-relaxed">
            Dashboard nội bộ được xây dựng với Nuxt 3 và shadcn-vue cho việc quản lý và giám sát hoạt động hệ thống.
          </p>
        </CardContent>
      </Card>

      <!-- GitHub Repository -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Github class="w-5 h-5" />
            GitHub Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <p class="text-muted-foreground">
              Mã nguồn của dự án được lưu trữ và quản lý trên GitHub:
            </p>
            <div class="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Github class="w-5 h-5 text-muted-foreground" />
              <div>
                <p class="font-medium">Repository</p>
                <a 
                  href="https://github.com/khuongnv/nuxt-hni-dash-ops" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-primary hover:underline text-sm"
                >
                  https://github.com/khuongnv/nuxt-hni-dash-ops
                </a>
              </div>
            </div>
            <div class="text-sm text-muted-foreground space-y-1">
              <p>• Clone repository: <code class="bg-muted px-1 rounded">git clone https://github.com/khuongnv/nuxt-hni-dash-ops.git</code></p>
              <p>• Xem mã nguồn, tạo issues, và đóng góp vào dự án</p>
              <p>• Theo dõi lịch sử commit và các phiên bản</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Features -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Zap class="w-5 h-5" />
            Tính năng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-medium">Dashboard tổng quan</h4>
                  <p class="text-sm text-muted-foreground">Hiển thị các chỉ số quan trọng và biểu đồ</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-medium">Quản lý người dùng</h4>
                  <p class="text-sm text-muted-foreground">CRUD operations cho tài khoản người dùng</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-medium">Báo cáo & Thống kê</h4>
                  <p class="text-sm text-muted-foreground">Tạo và xem các báo cáo chi tiết</p>
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-medium">Cài đặt hệ thống</h4>
                  <p class="text-sm text-muted-foreground">Cấu hình các tham số hệ thống</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-medium">Dark/Light Mode</h4>
                  <p class="text-sm text-muted-foreground">Hỗ trợ chuyển đổi theme</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-medium">Responsive Design</h4>
                  <p class="text-sm text-muted-foreground">Tối ưu cho desktop và mobile</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Technology Stack -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Wrench class="w-5 h-5" />
            Công nghệ sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div class="p-4 border rounded-lg">
              <h4 class="font-semibold mb-2">Framework</h4>
              <p class="text-sm text-muted-foreground">Nuxt 3</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h4 class="font-semibold mb-2">UI Library</h4>
              <p class="text-sm text-muted-foreground">shadcn-vue với Radix Vue</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h4 class="font-semibold mb-2">Styling</h4>
              <p class="text-sm text-muted-foreground">Tailwind CSS</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h4 class="font-semibold mb-2">Icons</h4>
              <p class="text-sm text-muted-foreground">Lucide Vue Next</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h4 class="font-semibold mb-2">Language</h4>
              <p class="text-sm text-muted-foreground">TypeScript</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h4 class="font-semibold mb-2">Color Mode</h4>
              <p class="text-sm text-muted-foreground">@nuxtjs/color-mode</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Project Structure -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <FolderTree class="w-5 h-5" />
            Cấu trúc project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="bg-muted/50 p-4 rounded-lg">
            <pre class="text-sm overflow-x-auto"><code>nuxtjs-hni-dash-ops/
├── assets/css/main.css          # Tailwind CSS và custom styles
├── components/
│   ├── ui/                      # shadcn-vue components
│   ├── Header.vue               # Header component
│   └── Sidebar.vue              # Sidebar component
├── layouts/default.vue          # Layout chính
├── pages/                       # Các trang ứng dụng
├── lib/utils.ts                 # Utility functions
├── nuxt.config.ts               # Cấu hình Nuxt
└── tailwind.config.js           # Cấu hình Tailwind</code></pre>
          </div>
        </CardContent>
      </Card>

      <!-- Menu Structure -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Menu class="w-5 h-5" />
            Cấu trúc menu hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <!-- Menu Overview -->
            <div>
              <h4 class="font-semibold mb-3">Tổng quan menu</h4>
              <p class="text-sm text-muted-foreground mb-4">
                Hệ thống sử dụng cấu trúc menu đa cấp (4 cấp) với sidebar có thể thu gọn và mở rộng.
              </p>
            </div>

            <!-- Menu Levels -->
            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <h4 class="font-semibold">Cấp 1 - Menu chính</h4>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <LayoutDashboard class="w-4 h-4" />
                    <span class="text-sm">Dashboard</span>
                  </div>
                  <div class="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <Users class="w-4 h-4" />
                    <span class="text-sm">Quản lý</span>
                  </div>
                  <div class="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <BarChart3 class="w-4 h-4" />
                    <span class="text-sm">Báo cáo</span>
                  </div>
                  <div class="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <Settings class="w-4 h-4" />
                    <span class="text-sm">Hệ thống</span>
                  </div>
                  <div class="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <Info class="w-4 h-4" />
                    <span class="text-sm">Giới thiệu</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="font-semibold">Cấp 2 - Submenu</h4>
                <div class="space-y-2">
                  <div class="ml-4 p-2 bg-muted/20 rounded">
                    <span class="text-sm">Người dùng</span>
                  </div>
                  <div class="ml-4 p-2 bg-muted/20 rounded">
                    <span class="text-sm">Tổ chức</span>
                  </div>
                  <div class="ml-4 p-2 bg-muted/20 rounded">
                    <span class="text-sm">Phân quyền</span>
                  </div>
                  <div class="ml-4 p-2 bg-muted/20 rounded">
                    <span class="text-sm">Báo cáo tổng quan</span>
                  </div>
                  <div class="ml-4 p-2 bg-muted/20 rounded">
                    <span class="text-sm">Thống kê</span>
                  </div>
                  <div class="ml-4 p-2 bg-muted/20 rounded">
                    <span class="text-sm">Dữ liệu</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Menu Features -->
            <div class="space-y-4">
              <h4 class="font-semibold">Tính năng menu</h4>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <div class="flex items-start gap-2">
                    <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 class="font-medium text-sm">Thu gọn/Mở rộng</h5>
                      <p class="text-xs text-muted-foreground">Sidebar có thể thu gọn để tiết kiệm không gian</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 class="font-medium text-sm">Mặc định mở cấp 2</h5>
                      <p class="text-xs text-muted-foreground">Các menu chính mặc định mở sẵn submenu</p>
                    </div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex items-start gap-2">
                    <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 class="font-medium text-sm">Tooltip khi thu gọn</h5>
                      <p class="text-xs text-muted-foreground">Hiển thị tên menu khi hover vào icon</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 class="font-medium text-sm">Highlight thông minh</h5>
                      <p class="text-xs text-muted-foreground">Chỉ highlight menu đang active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Menu Structure Visual -->
            <div class="space-y-4">
              <h4 class="font-semibold">Cấu trúc menu chi tiết</h4>
              <div class="bg-muted/50 p-4 rounded-lg">
                <pre class="text-xs overflow-x-auto"><code>📊 Dashboard
📋 Giới thiệu
👥 Quản lý
  ├── 👤 Người dùng
  │   ├── ✅ Danh sách
  │   ├── ➕ Thêm mới
  │   └── ➖ Vô hiệu hóa
  ├── 🏢 Tổ chức
  │   ├── 🏢 Phòng ban
  │   └── 👤 Chức vụ
  └── 🛡️ Phân quyền
📈 Báo cáo
  ├── 📄 Báo cáo tổng quan
  │   ├── 📊 Hàng ngày
  │   ├── 🥧 Hàng tuần
  │   └── 📈 Hàng tháng
  ├── 📈 Thống kê
  └── 💾 Dữ liệu
    ├── 💾 Xuất dữ liệu
    └── 📥 Nhập dữ liệu
⚙️ Hệ thống
  ├── ⚙️ Cài đặt
  │   ├── 🔧 Cài đặt chung
  │   └── ⚙️ Cài đặt nâng cao
  ├── 🛡️ Bảo mật
  │   ├── 🔑 Mật khẩu
  │   ├── 🔒 Xác thực
  │   └── ⚠️ Cảnh báo
  └── 🔔 Thông báo</code></pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Contact Info -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Mail class="w-5 h-5" />
            Thông tin liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <Mail class="w-4 h-4 text-muted-foreground" />
              <span class="text-sm">Email: khuongnv@live.com</span>
            </div>
            <div class="flex items-center gap-3">
              <Copyright class="w-4 h-4 text-muted-foreground" />
              <span class="text-sm">© 2024 KhuongNV. All rights reserved.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Info, 
  Zap, 
  Wrench, 
  FolderTree, 
  Mail, 
  Copyright,
  Menu,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Github
} from 'lucide-vue-next'

// Import UI components
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'

// Set page title
useHead({
  title: 'Giới thiệu - HNI Dashboard'
})
</script>
