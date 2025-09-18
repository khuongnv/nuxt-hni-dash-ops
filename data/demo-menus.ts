export interface Menu {
  id: number
  name: string
  path: string
  icon: string
  parent_id: number | null
  order: number
  is_active: boolean
  is_public: boolean
  created_at: string
  updated_at: string
}

export const demoMenus: Menu[] = [
  // Menu chính
  {
    id: 1,
    name: 'Trang chủ',
    path: '/',
    icon: 'home',
    parent_id: null,
    order: 1,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Dashboard',
    path: '/main/dashboard',
    icon: 'dashboard',
    parent_id: null,
    order: 2,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Báo cáo',
    path: '/system/reports',
    icon: 'chart-bar',
    parent_id: null,
    order: 3,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Cài đặt',
    path: '/system/settings',
    icon: 'cog',
    parent_id: null,
    order: 4,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Quản trị',
    path: '/admin',
    icon: 'shield-check',
    parent_id: null,
    order: 5,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    name: 'Giới thiệu',
    path: '/main/about',
    icon: 'information-circle',
    parent_id: null,
    order: 6,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Sub-menu Báo cáo
  {
    id: 7,
    name: 'Báo cáo doanh thu',
    path: '/system/reports/revenue',
    icon: 'currency-dollar',
    parent_id: 3,
    order: 1,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 8,
    name: 'Báo cáo người dùng',
    path: '/system/reports/users',
    icon: 'users',
    parent_id: 3,
    order: 2,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Sub-menu Cài đặt
  {
    id: 9,
    name: 'Cài đặt chung',
    path: '/system/settings/general',
    icon: 'cog-6-tooth',
    parent_id: 4,
    order: 1,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 10,
    name: 'Bảo mật',
    path: '/system/settings/security',
    icon: 'shield-exclamation',
    parent_id: 4,
    order: 2,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Sub-menu Bảo mật
  {
    id: 11,
    name: 'Mật khẩu',
    path: '/system/settings/security/password',
    icon: 'key',
    parent_id: 10,
    order: 1,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 12,
    name: 'Xác thực 2FA',
    path: '/system/settings/security/2fa',
    icon: 'device-phone-mobile',
    parent_id: 10,
    order: 2,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Sub-menu Quản trị
  {
    id: 13,
    name: 'Quản lý người dùng',
    path: '/admin/users',
    icon: 'user-group',
    parent_id: 5,
    order: 1,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 14,
    name: 'Quản lý phòng ban',
    path: '/admin/departments',
    icon: 'building-office',
    parent_id: 5,
    order: 2,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 15,
    name: 'Quản lý danh mục',
    path: '/admin/categories',
    icon: 'tag',
    parent_id: 5,
    order: 3,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 16,
    name: 'Quản lý menu',
    path: '/admin/menus',
    icon: 'bars-3',
    parent_id: 5,
    order: 4,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 17,
    name: 'Thông báo hệ thống',
    path: '/admin/system-notifications',
    icon: 'bell',
    parent_id: 5,
    order: 5,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 18,
    name: 'Git Log',
    path: '/admin/git-log',
    icon: 'code-bracket',
    parent_id: 5,
    order: 6,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Menu bổ sung
  {
    id: 19,
    name: 'Hỗ trợ',
    path: '/support',
    icon: 'lifebuoy',
    parent_id: null,
    order: 7,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 20,
    name: 'Liên hệ',
    path: '/contact',
    icon: 'envelope',
    parent_id: null,
    order: 8,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 21,
    name: 'Tài liệu',
    path: '/docs',
    icon: 'document-text',
    parent_id: null,
    order: 9,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 22,
    name: 'API',
    path: '/api-docs',
    icon: 'code-bracket',
    parent_id: null,
    order: 10,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 23,
    name: 'Thống kê',
    path: '/analytics',
    icon: 'chart-pie',
    parent_id: null,
    order: 11,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 24,
    name: 'Lịch sử',
    path: '/history',
    icon: 'clock',
    parent_id: null,
    order: 12,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 25,
    name: 'Backup',
    path: '/backup',
    icon: 'archive-box',
    parent_id: null,
    order: 13,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 26,
    name: 'Logs',
    path: '/logs',
    icon: 'document-duplicate',
    parent_id: null,
    order: 14,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 27,
    name: 'Monitoring',
    path: '/monitoring',
    icon: 'eye',
    parent_id: null,
    order: 15,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 28,
    name: 'Performance',
    path: '/performance',
    icon: 'bolt',
    parent_id: null,
    order: 16,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 29,
    name: 'Security',
    path: '/security',
    icon: 'shield-check',
    parent_id: null,
    order: 17,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 30,
    name: 'Help Center',
    path: '/help',
    icon: 'question-mark-circle',
    parent_id: null,
    order: 18,
    is_active: true,
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]
