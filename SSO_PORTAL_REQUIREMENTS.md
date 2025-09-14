# SSO Portal Project Requirements

## Architecture
- **Frontend**: Nuxt.js for SSO portal interface
- **Backend**: Separate .NET Core service for authentication and token management
- **Cache**: Redis for token storage (5-minute TTL)
- **Database**: Oracle (existing system for user data)

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

## Technology Stack
- **Frontend**: Nuxt.js 3
- **Backend**: .NET Core 6+
- **Cache**: Redis (for session storage with 2-hour TTL)
- **Database**: Oracle (for user data)
- **Session Management**: HttpOnly cookies for security
- **Session Lifecycle**: Login → Set HttpOnly cookie → Store session in Redis → Auto-expire after 2 hours

## Next Steps
- User will build backend first
- Then continue discussion for frontend implementation with Nuxt.js

## Security & Session Management
- **HttpOnly Cookies**: Secure session management, XSS protection
- **Redis Sessions**: 2-hour session storage with auto-expiration
- **No localStorage**: Avoid client-side security risks
- **Automatic Cookie Handling**: Browser automatically sends cookies
- **Server-side Validation**: All session validation on backend

## Notes
- Simple and focused on core functionality
- No complex user management
- HttpOnly cookies for maximum security
- Redis for fast session validation and auto-expiration
- Integration with existing .NET Core SSO system
- Oracle database for user data only
