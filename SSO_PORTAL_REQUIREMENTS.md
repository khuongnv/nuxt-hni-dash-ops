# SSO Portal Project Requirements

## Architecture
- **Frontend**: Nuxt.js for SSO portal interface
- **Backend**: Separate .NET Core service for authentication and token management
- **Database**: Oracle (existing system)

## Core Features
- Login interface (username/password)
- Application dashboard showing list of available systems/apps
- User profile (read-only, basic info)
- Logout functionality

## NOT needed
- User management (CRUD users)
- Admin panel
- Permission management
- User registration

## Backend APIs needed (4 endpoints)
```
POST /api/auth/login          # Đăng nhập
POST /api/auth/logout         # Đăng xuất
GET  /api/auth/validate       # Validate token
GET  /api/applications        # Lấy danh sách apps
```

## APIs không cần (bỏ qua)
- GET /api/user/profile        # Không quản lý user
- PUT /api/user/password       # Không quản lý user
- GET /api/user/sessions       # Không quản lý user

## UI Focus
- Application cards grid layout
- Search functionality
- Categories for apps
- Clean, modern interface
- One-click app access

## Next Steps
- User will build backend first
- Then continue discussion for frontend implementation with Nuxt.js

## Notes
- Simple and focused on core functionality
- No complex user management
- Integration with existing .NET Core SSO system
- Oracle database integration
