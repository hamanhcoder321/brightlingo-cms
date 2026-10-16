# BrightLingo CMS - Hệ thống Quản trị & Vận hành

Hệ thống CMS Quản trị Vận hành cho nền tảng học tiếng Anh BrightLingo / WowUp, được xây dựng bằng **Vue.js 3 (Composition API)**, **Vite**, **TypeScript**, **Tailwind CSS**, và **Pinia**, tuân thủ kiến trúc chuẩn từ dự án mẫu `wedtech-cms` và đặc tả nghiệp vụ BA MVP 1.0 (`wowup-ba-spec`).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API với `<script setup lang="ts">`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/) & [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/) với Navigation Guards kiểm soát quyền đăng nhập
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide Vue Next](https://lucide.dev/), Reka UI Primitives & shadcn-vue design system
- **API Client**: [Axios](https://axios-http.com/) với Auth Interceptors & Token Injections
- **i18n**: [Vue I18n](https://vue-i18n.intlify.dev/)

---

## 📁 Cấu trúc thư mục (Directory Structure)

```
lingo-cms/
├── public/                 # Static assets
├── src/
│   ├── app/                # Cốt lõi ứng dụng (Core)
│   │   ├── layouts/        # Layout chính (MainLayout, AuthLayout)
│   │   ├── router/         # Vue Router & Navigation Guards
│   │   ├── store/          # Pinia root store configuration
│   │   └── i18n.ts         # Cấu hình đa ngôn ngữ
│   ├── assets/             # Hình ảnh, icons, SVGs
│   ├── locales/            # Từ điển ngôn ngữ (vi.json)
│   ├── styles/             # Tailwind CSS & Theme variables (main.css)
│   ├── shared/             # Tầng dùng chung (Cross-cutting concern)
│   │   ├── api/            # Generic API callers
│   │   ├── components/     # UI Design System (Button, Dialog, Table, Toast, etc.)
│   │   ├── constants/      # Storage keys, route names, enum statuses
│   │   ├── services/       # Axios instance & interceptors
│   │   ├── types/          # Common pagination, responses, base entities
│   │   └── utils/          # Currency format, date format, cookie helpers
│   └── modules/            # Domain Modules theo tài liệu BA
│       ├── auth/           # Đăng nhập Admin & kiểm soát phiên
│       ├── dashboard/      # Thống kê doanh thu, đơn hàng, leads
│       ├── courses/        # Quản lý Khóa học, Danh mục & Resource Link bảo mật
│       ├── orders/         # Quản lý Đơn hàng & Modal gửi lại tài liệu qua email
│       ├── coupons/        # Quản lý Mã giảm giá (theo % hoặc số tiền cố định)
│       ├── leads/          # Quản lý Khách hàng đăng ký tư vấn 30 phút
│       ├── email-templates/# Cấu hình mẫu email & cảnh báo an toàn placeholder
│       ├── settings/       # Cấu hình Hotline, Thương hiệu & Tài khoản VietQR
│       └── audit-logs/     # Nhật ký ghi nhận các hành động nhạy cảm
├── .env.example            # Mẫu biến môi trường
├── index.html              # HTML entry point
├── package.json            # Dependencies & Scripts
├── tailwind.config.js      # Cấu hình màu sắc & biến Tailwind
├── tsconfig.json           # Cấu hình TypeScript & Path Aliases
└── vite.config.ts          # Cấu hình Vite & Server Port 3001
```

---

## 📋 Nghiệp vụ Trọng yếu (Business Rules)

| Quy tắc | Mô tả trong CMS | Module đảm nhiệm |
| :--- | :--- | :--- |
| **BR-01** | Slug khóa học duy nhất, cấm trùng với route hệ thống (`admin`, `api`, `checkout`, `payment`...). | `modules/courses` |
| **BR-02** | Link tài liệu chính thức (`resource_link`) chỉ lưu trữ và biên tập trong CMS, không bao giờ lộ ra Public API. | `modules/courses` |
| **BR-05** | Nút **"Gửi lại tài liệu" (Resend Email)** chỉ active khi trạng thái đơn hàng là `Paid`. Vô hiệu hóa khi `Pending` hoặc `Cancelled`. | `modules/orders` |
| **BR-06** | Thao tác Gửi lại tài liệu bắt buộc phải qua Popup Xác nhận, gọi API backend và ghi Audit Log. | `modules/orders` + `modules/audit-logs` |
| **BR-10** | Dữ liệu nghiệp vụ dùng Xóa mềm (Soft Delete); tuyệt đối không xóa cứng (hard delete) đơn hàng và giao dịch thanh toán. | Toàn hệ thống |
| **BR-11** | Biên tập Email Template cảnh báo an toàn màu đỏ nếu thiếu placeholder `{{resource_link}}`. | `modules/email-templates` |
| **BR-15** | Admin sửa link tài nguyên của khóa học không ảnh hưởng đến đơn hàng cũ đã gửi; phải ghi nhận vào Audit Log. | `modules/audit-logs` |

---

## 🚀 Hướng dẫn Cài đặt & Chạy ứng dụng

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Thiết lập môi trường (.env):
File `.env` đã được cấu hình trỏ về backend `lingo-api`:
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME="BrightLingo CMS"
VITE_APP_ENV=development
```

### 3. Chạy môi trường Development:
```bash
npm run dev
```
Hệ thống sẽ chạy tại địa chỉ: **`http://localhost:3001`** (được tách biệt với cổng 3000 của `lingo-frontend`).

### 4. Kiểm tra Type-check & Build:
```bash
npm run type-check
npm run build
```
