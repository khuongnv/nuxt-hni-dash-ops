# HNI Dashboard Operations

Dashboard nội bộ được xây dựng với Nuxt 3 và shadcn-vue cho việc quản lý và giám sát hoạt động hệ thống.

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
- **Color Mode**: @nuxtjs/color-mode

## 📦 Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd nuxtjs-hni-dash-ops
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy development server:
```bash
npm run dev
```

4. Mở trình duyệt tại `http://localhost:3000`

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
│   ├── dashboard.vue         # Trang dashboard
│   ├── users.vue            # Quản lý người dùng
│   ├── reports.vue          # Báo cáo & thống kê
│   ├── settings.vue         # Cài đặt hệ thống
│   └── index.vue            # Trang chủ (redirect)
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

## 📝 Mock Data

Project hiện tại sử dụng mock data cho:
- Danh sách người dùng
- Báo cáo và thống kê
- Hoạt động gần đây
- Các chỉ số dashboard

## 🚀 Deployment

1. Build project:
```bash
npm run build
```

2. Deploy thư mục `.output` lên hosting service

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- Email: admin@hni.com
- Project Link: [https://github.com/your-username/nuxtjs-hni-dash-ops](https://github.com/your-username/nuxtjs-hni-dash-ops)
