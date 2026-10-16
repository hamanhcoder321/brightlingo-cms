<template>
  <div class="space-y-6">
    <!-- Top Welcome Banner -->
    <div class="bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold">Chào mừng trở lại, Quản trị viên BrightLingo! 👋</h2>
        <p class="text-xs text-indigo-150 mt-1 text-slate-100">
          Hệ thống ghi nhận trạng thái đơn hàng VietQR tự động qua Webhook BankNoti và kiểm soát giao tài nguyên.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <router-link
          to="/courses/create"
          class="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs rounded-lg transition-colors shadow-sm"
        >
          + Thêm khóa học mới
        </router-link>
        <router-link
          to="/orders"
          class="px-4 py-2 bg-indigo-800/80 hover:bg-indigo-900 text-white font-semibold text-xs rounded-lg transition-colors"
        >
          Xem đơn hàng
        </router-link>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1 -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Doanh thu xác nhận</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <div>
          <div class="text-2xl font-bold text-slate-900">{{ formatCurrency(stats.totalRevenue) }}</div>
          <div class="text-[11px] text-emerald-600 font-medium mt-0.5">Tự động đối soát BankNoti</div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Đơn hàng đã thanh toán</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShoppingCart class="w-4 h-4" />
          </div>
        </div>
        <div>
          <div class="text-2xl font-bold text-slate-900">{{ stats.paidOrders }} / {{ stats.totalOrders }}</div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">{{ stats.pendingOrders }} đơn đang chờ thanh toán</div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Leads tư vấn mới</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users class="w-4 h-4" />
          </div>
        </div>
        <div>
          <div class="text-2xl font-bold text-slate-900">{{ stats.newLeads }}</div>
          <div class="text-[11px] text-amber-600 font-medium mt-0.5">Tổng số: {{ stats.totalLeads }} lead đăng ký</div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Khóa học & Tài liệu</span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen class="w-4 h-4" />
          </div>
        </div>
        <div>
          <div class="text-2xl font-bold text-slate-900">{{ stats.totalCourses }}</div>
          <div class="text-[11px] text-blue-600 font-medium mt-0.5">Bảo vệ link an toàn tuyệt đối</div>
        </div>
      </div>
    </div>

    <!-- Quick Shortcuts & System Status -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Navigation Cards -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-800">Truy cập nhanh nghiệp vụ</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <router-link
            to="/orders"
            class="p-4 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all flex items-start gap-3"
          >
            <div class="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Mail class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Quản lý Đơn & Gửi lại Email</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Xem chi tiết người mua, mã giao dịch và Resend tài liệu.</p>
            </div>
          </router-link>

          <router-link
            to="/courses"
            class="p-4 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all flex items-start gap-3"
          >
            <div class="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Danh sách Khóa học & Tài liệu</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Cập nhật giá, link Google Drive bí mật và bài viết SEO.</p>
            </div>
          </router-link>

          <router-link
            to="/coupons"
            class="p-4 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all flex items-start gap-3"
          >
            <div class="p-2 rounded-lg bg-pink-50 text-pink-600">
              <Ticket class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Cấu hình Mã giảm giá</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Tạo coupon % hoặc số tiền cố định, giới hạn lượt dùng.</p>
            </div>
          </router-link>

          <router-link
            to="/leads"
            class="p-4 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all flex items-start gap-3"
          >
            <div class="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Users class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Xử lý Lead tư vấn 30p</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Cập nhật trạng thái: Mới ➔ Đã liên hệ ➔ Hoàn tất.</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Business Rules Reminder Box -->
      <div class="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Quy tắc Vận hành Trọng yếu</h3>
        <ul class="text-xs text-slate-600 space-y-2">
          <li class="flex items-start gap-2">
            <span class="text-indigo-600 font-bold shrink-0">•</span>
            <span><strong>BR-02:</strong> Link tài liệu chính thức (`resource_link`) chỉ xem qua CMS, không lộ Public API.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-indigo-600 font-bold shrink-0">•</span>
            <span><strong>BR-05/06:</strong> Nút Gửi lại email chỉ bật khi đơn `Paid`, bắt buộc qua popup xác nhận.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-indigo-600 font-bold shrink-0">•</span>
            <span><strong>BR-10:</strong> Tuyệt đối không xóa vật lý (hard delete) đơn hàng và giao dịch thanh toán.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-indigo-600 font-bold shrink-0">•</span>
            <span><strong>BR-11:</strong> Email template bắt buộc giữ nguyên placeholder <code v-pre class="text-indigo-600 bg-indigo-50 px-1 rounded">{{resource_link}}</code>.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  DollarSign,
  ShoppingCart,
  Users,
  BookOpen,
  Mail,
  Ticket,
} from "lucide-vue-next";
import { formatCurrency } from "@shared/utils";
import { dashboardApi } from "../api/dashboard.api";
import type { DashboardStats } from "../types/dashboard.types";

const stats = ref<DashboardStats>({
  totalRevenue: 0,
  totalOrders: 0,
  paidOrders: 0,
  pendingOrders: 0,
  totalLeads: 0,
  newLeads: 0,
  totalCourses: 0,
});

onMounted(async () => {
  stats.value = await dashboardApi.getSummary();
});
</script>
