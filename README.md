# HNI Dashboard Operations

Dashboard nội bộ được xây dựng với Nuxt 3 và shadcn-vue cho việc quản lý và giám sát hoạt động hệ thống.

## 🔗 GitHub Repository

**GitHub Repository**: [https://github.com/khuongnv/nuxt-hni-dash-ops](https://github.com/khuongnv/nuxt-hni-dash-ops)

## 🚀 Tính năng

- **Dashboard tổng quan**: Hiển thị các chỉ số quan trọng và biểu đồ
- **Quản lý người dùng**: CRUD operations cho tài khoản người dùng
- **Báo cáo & Thống kê**: Tạo và xem các báo cáo chi tiết
- **Cài đặt hệ thống**: Cấu hình các tham số hệ thống
- **Dark/Light Mode**: Hỗ trợ chuyển đổi theme
- **Responsive Design**: Tối ưu cho desktop và mobile
- **Sidebar có thể thu gọn**: Giao diện linh hoạt

## 🛠️ Công nghệ sử dụng

- **Framework**: Nuxt 3
- **UI Library**: shadcn-vue với Radix Vue
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **TypeScript**: Hỗ trợ đầy đủ
- **Database**: PostgreSQL (Supabase)
- **API**: Supabase REST API
- **Authentication**: Supabase Auth

## 📦 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/khuongnv/nuxt-hni-dash-ops.git
cd nuxt-hni-dash-ops
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình environment variables:
```bash
# Tạo file .env
cp .env.example .env

# Cập nhật thông tin Supabase trong .env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

4. Chạy development server:
```bash
npm run dev
```

5. Mở trình duyệt tại `http://localhost:3000`

## 🏗️ Cấu trúc project

```
nuxtjs-hni-dash-ops/
├── assets/
│   └── css/
│       └── main.css          # Tailwind CSS và custom styles
├── components/
│   ├── ui/                   # shadcn-vue components
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Table.vue
│   │   └── ...
│   ├── Header.vue            # Header component
│   └── Sidebar.vue           # Sidebar component
├── layouts/
│   └── default.vue           # Layout chính
├── pages/
│   ├── main/
│   │   ├── dashboard.vue    # Trang dashboard
│   │   └── about.vue        # Trang giới thiệu
│   ├── admin/
│   │   └── users.vue        # Quản lý người dùng
│   ├── system/
│   │   ├── reports.vue      # Báo cáo & thống kê
│   │   └── settings.vue     # Cài đặt hệ thống
│   └── index.vue            # Trang chủ (redirect)
├── server/
│   └── api/
│       └── menus/           # API endpoints cho menu
├── lib/
│   └── utils.ts             # Utility functions
├── nuxt.config.ts           # Cấu hình Nuxt
├── tailwind.config.js       # Cấu hình Tailwind
└── package.json
```

## 🎨 UI Components

Project sử dụng shadcn-vue với các component đã được tùy chỉnh:

- **Button**: Nút bấm với nhiều variant
- **Card**: Container cho nội dung
- **Table**: Bảng dữ liệu với sorting và filtering
- **Input**: Form input fields
- **Select**: Dropdown selection
- **Badge**: Hiển thị trạng thái
- **Avatar**: Ảnh đại diện người dùng
- **DropdownMenu**: Menu dropdown

## 🌙 Dark Mode

Hỗ trợ chuyển đổi giữa dark mode và light mode:

- Sử dụng `@nuxtjs/color-mode`
- Toggle button trong header
- Lưu preference trong localStorage
- CSS variables cho theme colors

## 📱 Responsive Design

- **Desktop**: Sidebar cố định, có thể thu gọn
- **Tablet**: Sidebar overlay
- **Mobile**: Sidebar drawer, header compact

## 🔧 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## 🗄️ Database & API

### Supabase PostgreSQL
- **Database**: PostgreSQL được host trên Supabase
- **Bảng chính**: `menus` - quản lý menu hệ thống
- **Real-time**: Hỗ trợ real-time subscriptions
- **Row Level Security**: Bảo mật dữ liệu với RLS

### Supabase REST API
- **Auto-generated**: API endpoints được tự động tạo
- **CRUD Operations**: Đầy đủ các thao tác Create, Read, Update, Delete
- **Authentication**: Tích hợp sẵn với Supabase Auth
- **API Endpoints**:
  ```bash
  GET    /api/menus           # Lấy danh sách menu
  POST   /api/menus           # Tạo menu mới
  PUT    /api/menus/[id]      # Cập nhật menu
  DELETE /api/menus/[id]      # Xóa menu
  ```

### Environment Variables
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Cấu hình Vercel Deployment
Khi deploy lên Vercel, cần thêm environment variables trong Vercel Dashboard:

1. Vào **Project Settings** → **Environment Variables**
2. Thêm các biến:
   - `SUPABASE_URL` = https://your-project-id.supabase.co
   - `SUPABASE_ANON_KEY` = your-anon-key-here
3. Redeploy project sau khi thêm environment variables

**Lưu ý**: Không sử dụng service_role key cho client-side, chỉ dùng anon key.

## 🚀 Deployment

1. Build project:
```bash
npm run build
```

2. Deploy thư mục `.output` lên hosting service

## 📄 License

© 2024 KhuongNV. All rights reserved.

## 📞 Liên hệ

- Email: khuongnv@live.com

