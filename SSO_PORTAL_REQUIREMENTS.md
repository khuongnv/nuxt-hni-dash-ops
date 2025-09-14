# Yêu Cầu Dự Án SSO Portal

## Kiến Trúc Hệ Thống
- **Frontend**: Nuxt.js cho giao diện SSO portal
- **Backend**: Dịch vụ .NET Core riêng biệt cho xác thực và quản lý session
- **Cache**: Redis để lưu trữ session (thời hạn 2 giờ)
- **Database**: Oracle (hệ thống hiện có cho dữ liệu người dùng)

## Tính Năng Chính
- Giao diện đăng nhập (tên đăng nhập/mật khẩu)
- Bảng điều khiển ứng dụng hiển thị danh sách hệ thống/apps
- Hồ sơ người dùng (chỉ đọc, thông tin cơ bản)
- Chức năng đăng xuất

## Không Cần Thiết
- Quản lý người dùng (CRUD users)
- Bảng quản trị
- Quản lý quyền hạn
- Đăng ký người dùng

## API Backend Cần Thiết (4 endpoints)
```
POST /api/auth/login          # Đăng nhập
POST /api/auth/logout         # Đăng xuất
GET  /api/auth/validate       # Xác thực session
GET  /api/applications        # Lấy danh sách ứng dụng
```

## API Không Cần (bỏ qua)
- GET /api/user/profile        # Không quản lý user
- PUT /api/user/password       # Không quản lý user
- GET /api/user/sessions       # Không quản lý user

## Tập Trung Giao Diện
- Bố cục lưới thẻ ứng dụng
- Chức năng tìm kiếm
- Phân loại ứng dụng
- Giao diện sạch, hiện đại
- Truy cập ứng dụng một click

## Công Nghệ Sử Dụng
- **Frontend**: Nuxt.js 3
- **Backend**: .NET Core 6+
- **Cache**: Redis (lưu trữ session với thời hạn 2 giờ)
- **Database**: Oracle (cho dữ liệu người dùng)
- **Quản Lý Session**: HttpOnly cookies để bảo mật
- **Vòng Đời Session**: Đăng nhập → Set HttpOnly cookie → Lưu session vào Redis → Tự động hết hạn sau 2 giờ

## Bước Tiếp Theo
- Người dùng sẽ xây dựng backend trước
- Sau đó tiếp tục thảo luận để triển khai frontend với Nuxt.js

## Bảo Mật & Quản Lý Session
- **HttpOnly Cookies**: Quản lý session an toàn, bảo vệ khỏi XSS
- **Redis Sessions**: Lưu trữ session 2 giờ với tự động hết hạn
- **Không localStorage**: Tránh rủi ro bảo mật phía client
- **Xử Lý Cookie Tự Động**: Trình duyệt tự động gửi cookies
- **Xác Thực Phía Server**: Tất cả xác thực session trên backend

## Ghi Chú
- Đơn giản và tập trung vào chức năng cốt lõi
- Không có quản lý người dùng phức tạp
- HttpOnly cookies để bảo mật tối đa
- Redis để xác thực session nhanh và tự động hết hạn
- Tích hợp với hệ thống SSO .NET Core hiện có
- Database Oracle chỉ cho dữ liệu người dùng
