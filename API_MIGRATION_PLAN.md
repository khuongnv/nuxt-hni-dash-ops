# 🔄 API Migration Plan - HniDashOps

## 📋 Tổng Quan Migration

**Backend mới**: `https://localhost:64706/swagger`  
**Frontend hiện tại**: Nuxt.js với Supabase API  
**Mục tiêu**: Thay thế hoàn toàn API cũ bằng .NET Core 9 Backend

---

## 🔍 Phân Tích API Hiện Tại

### **1. 📊 API Endpoints Đang Sử Dụng**

#### **Authentication Flow (Giữ nguyên + Backend validation):**
```yaml
Current Flow:
  1. Username/Password hoặc SSO → Supabase/Mock validation
  2. Lưu user vào localStorage
  
New Flow:
  1. Username/Password hoặc SSO → Supabase/Mock validation (GIỮ NGUYÊN)
  2. Sau khi đăng nhập thành công → Gọi backend để lấy token
  3. Lưu user + backend token vào localStorage

Backend Endpoints:
  POST   https://localhost:64706/api/auth/validate    # Validate user và trả về token
  POST   https://localhost:64706/api/auth/refresh     # Refresh token
  POST   https://localhost:64706/api/auth/logout      # Logout và invalidate token
```

#### **Menu Management APIs:**
```yaml
Current (Supabase):
  GET    /api/menus           # Lấy danh sách menu
  POST   /api/menus           # Tạo menu mới  
  GET    /api/menus/[id]      # Lấy menu theo ID
  PUT    /api/menus/[id]      # Cập nhật menu
  DELETE /api/menus/[id]      # Xóa menu

New (.NET Core + Bearer Token):
  GET    https://localhost:64706/api/menus            # + Authorization: Bearer {token}
  POST   https://localhost:64706/api/menus            # + Authorization: Bearer {token}
  GET    https://localhost:64706/api/menus/{id}       # + Authorization: Bearer {token}
  PUT    https://localhost:64706/api/menus/{id}       # + Authorization: Bearer {token}
  DELETE https://localhost:64706/api/menus/{id}       # + Authorization: Bearer {token}
```

#### **System Notifications APIs:**
```yaml
Current (Supabase):
  GET    /api/system-notifications           # Lấy danh sách thông báo
  POST   /api/system-notifications           # Tạo thông báo mới
  GET    /api/system-notifications/[id]      # Lấy thông báo theo ID
  PUT    /api/system-notifications/[id]      # Cập nhật thông báo
  DELETE /api/system-notifications/[id]      # Xóa thông báo

New (.NET Core + Bearer Token):
  GET    https://localhost:64706/api/system-notifications            # + Authorization: Bearer {token}
  POST   https://localhost:64706/api/system-notifications            # + Authorization: Bearer {token}
  GET    https://localhost:64706/api/system-notifications/{id}       # + Authorization: Bearer {token}
  PUT    https://localhost:64706/api/system-notifications/{id}       # + Authorization: Bearer {token}
  DELETE https://localhost:64706/api/system-notifications/{id}       # + Authorization: Bearer {token}
```

#### **User Management APIs:**
```yaml
Current (Mock):
  GET    /api/users           # Lấy danh sách users
  POST   /api/users           # Tạo user mới
  GET    /api/users/[id]      # Lấy user theo ID
  PUT    /api/users/[id]      # Cập nhật user
  DELETE /api/users/[id]      # Xóa user

New (.NET Core + Bearer Token):
  GET    https://localhost:64706/api/users            # + Authorization: Bearer {token}
  POST   https://localhost:64706/api/users            # + Authorization: Bearer {token}
  GET    https://localhost:64706/api/users/{id}       # + Authorization: Bearer {token}
  PUT    https://localhost:64706/api/users/{id}       # + Authorization: Bearer {token}
  DELETE https://localhost:64706/api/users/{id}       # + Authorization: Bearer {token}
```

### **2. 📁 Files Cần Cập Nhật**

#### **Composables:**
```yaml
✅ useAuth.ts                 # Authentication logic
✅ useMenus.ts               # Menu management
✅ useSystemNotifications.ts # System notifications
✅ useUsers.ts               # User management
✅ useDepartments.ts         # Department management
✅ useCategories.ts          # Category management
```

#### **Server API Routes:**
```yaml
✅ server/api/menus/index.get.ts
✅ server/api/menus/[id].get.ts
✅ server/api/menus/[id].put.ts
✅ server/api/menus/[id].delete.ts
✅ server/api/menus/index.post.ts
```

#### **Pages:**
```yaml
✅ pages/admin/menus.vue      # Menu management page
✅ pages/admin/users.vue      # User management page
✅ pages/main/dashboard.vue   # Dashboard
```

---

## 🚀 Kế Hoạch Migration

### **Phase 1: Cấu Hình Environment (1 ngày)**

#### **Step 1: Tạo Environment Variables**
```env
# .env
BACKEND_API_URL=https://localhost:64706
BACKEND_API_TIMEOUT=30000
```

#### **Step 2: Cập nhật nuxt.config.ts**
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      backendApiUrl: process.env.BACKEND_API_URL || 'https://localhost:64706'
    }
  }
})
```

#### **Step 3: Tạo API Client**
```typescript
// composables/useApiClient.ts
export const useApiClient = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.backendApiUrl
  
  const apiClient = $fetch.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  return { apiClient }
}
```

### **Phase 2: Migration Authentication (1 ngày)**

#### **Step 1: Cập nhật useAuth.ts - Giữ nguyên flow hiện tại**
```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const { apiClient } = useApiClient()
  
  // Giữ nguyên flow login hiện tại (username/password hoặc SSO)
  const login = async (username: string, password: string) => {
    // 1. Xác thực với hệ thống hiện tại (Supabase hoặc SSO)
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password }
    })
    
    if (response.success && response.user) {
      // 2. Sau khi đăng nhập thành công, gọi backend để lấy token
      const backendResponse = await apiClient('/api/auth/validate', {
        method: 'POST',
        body: { 
          user: response.user,
          authType: 'username' // hoặc 'sso'
        }
      })
      
      if (backendResponse.success) {
        // 3. Lưu user + backend token
        const userWithToken = {
          ...response.user,
          backendToken: backendResponse.data.token,
          tokenExpiry: backendResponse.data.expiry
        }
        
        user.value = userWithToken
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(userWithToken))
        }
        return true
      }
    }
    return false
  }
  
  // ... other methods
}
```

#### **Step 2: Cập nhật useSSO.ts - Thêm backend validation**
```typescript
// composables/useSSO.ts
export const useSSO = () => {
  const { apiClient } = useApiClient()
  
  // Giữ nguyên flow SSO hiện tại
  const validateSSOToken = async (tokenkey: string) => {
    // 1. Validate với SSO server (giữ nguyên)
    const ssoResult = await validateSSOTokenOriginal(tokenkey)
    
    if (ssoResult.success && ssoResult.user) {
      // 2. Sau khi SSO thành công, gọi backend để lấy token
      const backendResponse = await apiClient('/api/auth/validate', {
        method: 'POST',
        body: { 
          user: ssoResult.user,
          authType: 'sso',
          ssoToken: tokenkey
        }
      })
      
      if (backendResponse.success) {
        // 3. Lưu user + backend token
        const userWithToken = {
          ...ssoResult.user,
          backendToken: backendResponse.data.token,
          tokenExpiry: backendResponse.data.expiry,
          ssoTokenKey: tokenkey
        }
        
        return {
          ...ssoResult,
          user: userWithToken
        }
      }
    }
    
    return ssoResult
  }
  
  // ... other methods
}
```

#### **Step 3: Test Authentication Flow**
```bash
# Test username/password flow
curl -X POST https://localhost:64706/api/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"user":{"id":1,"username":"admin"},"authType":"username"}'

# Test SSO flow  
curl -X POST https://localhost:64706/api/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"user":{"id":1,"username":"khuongnv"},"authType":"sso","ssoToken":"test-token"}'
```

### **Phase 3: Migration Menu APIs (1 ngày)**

#### **Step 1: Cập nhật useMenus.ts - Sử dụng backend token**
```typescript
// composables/useMenus.ts
export const useMenus = () => {
  const { apiClient } = useApiClient()
  const { getCurrentUser } = useAuth()
  
  // Helper function để lấy backend token
  const getBackendToken = () => {
    const user = getCurrentUser()
    return user?.backendToken || null
  }
  
  const getMenus = async () => {
    const token = getBackendToken()
    if (!token) {
      throw new Error('Backend token not found. Please login again.')
    }
    
    const response = await apiClient('/api/menus', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data || []
  }
  
  const createMenu = async (menuData: any) => {
    const token = getBackendToken()
    if (!token) {
      throw new Error('Backend token not found. Please login again.')
    }
    
    const response = await apiClient('/api/menus', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: menuData
    })
    return response.data
  }
  
  // ... other methods với token
}
```

#### **Step 2: Cập nhật Menu Management Page**
```vue
<!-- pages/admin/menus.vue -->
<script setup>
const { getMenus, createMenu, updateMenu, deleteMenu } = useMenus()

// Load menus from new API
const loadMenus = async () => {
  try {
    menus.value = await getMenus()
  } catch (error) {
    console.error('Error loading menus:', error)
  }
}
</script>
```

### **Phase 4: Migration System Notifications (1 ngày)**

#### **Step 1: Cập nhật useSystemNotifications.ts - Sử dụng backend token**
```typescript
// composables/useSystemNotifications.ts
export const useSystemNotifications = () => {
  const { apiClient } = useApiClient()
  const { getCurrentUser } = useAuth()
  
  // Helper function để lấy backend token
  const getBackendToken = () => {
    const user = getCurrentUser()
    return user?.backendToken || null
  }
  
  const getNotifications = async () => {
    const token = getBackendToken()
    if (!token) {
      throw new Error('Backend token not found. Please login again.')
    }
    
    const response = await apiClient('/api/system-notifications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data || []
  }
  
  const createNotification = async (notificationData: any) => {
    const token = getBackendToken()
    if (!token) {
      throw new Error('Backend token not found. Please login again.')
    }
    
    const response = await apiClient('/api/system-notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: notificationData
    })
    return response.data
  }
  
  // ... other methods với token
}
```

### **Phase 5: Migration User Management (1 ngày)**

#### **Step 1: Cập nhật useUsers.ts - Sử dụng backend token**
```typescript
// composables/useUsers.ts
export const useUsers = () => {
  const { apiClient } = useApiClient()
  const { getCurrentUser } = useAuth()
  
  // Helper function để lấy backend token
  const getBackendToken = () => {
    const user = getCurrentUser()
    return user?.backendToken || null
  }
  
  const getUsers = async () => {
    const token = getBackendToken()
    if (!token) {
      throw new Error('Backend token not found. Please login again.')
    }
    
    const response = await apiClient('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data || []
  }
  
  const createUser = async (userData: any) => {
    const token = getBackendToken()
    if (!token) {
      throw new Error('Backend token not found. Please login again.')
    }
    
    const response = await apiClient('/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: userData
    })
    return response.data
  }
  
  // ... other methods với token
}
```

### **Phase 6: Testing & Validation (2 ngày)**

#### **Step 1: Unit Testing**
```typescript
// tests/api.test.ts
describe('API Migration', () => {
  test('Menu API endpoints', async () => {
    const { getMenus } = useMenus()
    const menus = await getMenus()
    expect(menus).toBeDefined()
  })
  
  test('Authentication API', async () => {
    const { login } = useAuth()
    const result = await login('admin', 'admin123')
    expect(result).toBe(true)
  })
})
```

#### **Step 2: Integration Testing**
```bash
# Test all endpoints
npm run test:api
npm run test:integration
```

#### **Step 3: E2E Testing**
```bash
# Test complete user flows
npm run test:e2e
```

---

## 🔧 Implementation Steps

### **Step 1: Backup Current Implementation**
```bash
# Tạo backup branch
git checkout -b backup-before-migration
git add .
git commit -m "Backup before API migration"
git push origin backup-before-migration

# Quay về main branch
git checkout main
```

### **Step 2: Tạo Migration Branch**
```bash
# Tạo migration branch
git checkout -b feature/api-migration
```

### **Step 3: Cập nhật Environment**
```bash
# Thêm environment variables
echo "BACKEND_API_URL=https://localhost:64706" >> .env
echo "BACKEND_API_TIMEOUT=30000" >> .env
```

### **Step 4: Cập nhật API Client**
```typescript
// Tạo file composables/useApiClient.ts
// Copy nội dung từ Phase 1
```

### **Step 5: Migration từng Module**
```bash
# Migration theo thứ tự:
# 1. Authentication
# 2. Menu Management  
# 3. System Notifications
# 4. User Management
# 5. Departments & Categories
```

### **Step 6: Testing**
```bash
# Test từng module
npm run test:auth
npm run test:menus
npm run test:notifications
npm run test:users
```

### **Step 7: Deploy & Monitor**
```bash
# Deploy lên staging
npm run build
npm run preview

# Test trên staging
# Deploy lên production
```

---

## 📊 Migration Checklist

### **Pre-Migration:**
```yaml
✅ Backup current implementation
✅ Create migration branch
✅ Setup environment variables
✅ Create API client
✅ Test backend endpoints
```

### **Migration:**
```yaml
✅ Migrate Authentication APIs
✅ Migrate Menu Management APIs
✅ Migrate System Notifications APIs
✅ Migrate User Management APIs
✅ Migrate Departments & Categories APIs
```

### **Post-Migration:**
```yaml
✅ Unit testing
✅ Integration testing
✅ E2E testing
✅ Performance testing
✅ Security testing
✅ Deploy to staging
✅ Deploy to production
✅ Monitor & fix issues
```

---

## 🚨 Risk Management

### **High Risk:**
```yaml
⚠️ Authentication flow changes
⚠️ Data format differences
⚠️ Error handling changes
⚠️ Performance impact
```

### **Medium Risk:**
```yaml
⚠️ API response format changes
⚠️ Caching strategy changes
⚠️ Real-time features
```

### **Low Risk:**
```yaml
⚠️ UI component updates
⚠️ Styling changes
⚠️ Documentation updates
```

---

## 📈 Success Metrics

### **Technical Metrics:**
```yaml
✅ API response time < 500ms
✅ Error rate < 1%
✅ Uptime > 99.9%
✅ Test coverage > 80%
```

### **Business Metrics:**
```yaml
✅ User login success rate > 95%
✅ Menu loading time < 2s
✅ Notification delivery rate > 98%
✅ User satisfaction > 4.5/5
```

---

## 🎯 Timeline

```yaml
Day 1: Environment setup + Authentication flow (giữ nguyên + backend validation)
Day 2: Menu Management migration (với Bearer token)
Day 3: System Notifications migration (với Bearer token)
Day 4: User Management migration (với Bearer token)
Day 5: Testing & validation
Day 6: Deploy & monitor
```

**Total: 6 ngày**

## 🔑 Key Changes Summary

### **Authentication Flow:**
```yaml
✅ Giữ nguyên: Username/Password và SSO login
✅ Thêm mới: Backend token validation sau khi đăng nhập
✅ Lưu trữ: User + Backend token trong localStorage
✅ Sử dụng: Bearer token cho tất cả API calls
```

### **API Calls:**
```yaml
✅ Tất cả API calls đều có Authorization header
✅ Token được lấy từ user session
✅ Auto-refresh token khi cần thiết
✅ Error handling khi token hết hạn
```

---

## 🔄 Rollback Plan

### **Nếu có vấn đề:**
```bash
# Rollback về backup branch
git checkout backup-before-migration
git push origin main --force

# Hoặc rollback từng module
git checkout backup-before-migration -- composables/useAuth.ts
git checkout backup-before-migration -- composables/useMenus.ts
```

---

*Kế hoạch migration này đảm bảo chuyển đổi an toàn từ Supabase API sang .NET Core 9 Backend với minimal downtime và risk.*
