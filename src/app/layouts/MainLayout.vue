<template>
  <div class="flex min-h-screen bg-[#F4F1EB] text-[#1D2A2E] font-sans antialiased">
    <!-- Desktop Sidebar -->
    <aside
      class="w-64 shrink-0 bg-[#1D2A2E] text-[#D5DCDE] p-4 flex flex-col justify-between min-h-screen border-r border-[#2C3B40] select-none"
    >
      <div class="flex flex-col gap-6">
        <!-- Logo & Branding -->
        <div class="flex items-center gap-2.5 px-2 pt-2">
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true" class="shrink-0">
            <path
              d="M15 6h24a11 11 0 0 1 11 11v10a11 11 0 0 1-11 11H24l-9 8v-8.6A11 11 0 0 1 4 27V17A11 11 0 0 1 15 6z"
              fill="#FFFFFF"
            ></path>
            <path
              d="M37 28h13a9 9 0 0 1 9 9v6a9 9 0 0 1-6 8.5V58l-7.5-5.5H37a9 9 0 0 1-9-9v-6.5a9 9 0 0 1 9-9z"
              fill="#E8873A"
              stroke="#1D2A2E"
              stroke-width="3"
            ></path>
          </svg>
          <div class="flex flex-col leading-tight">
            <span class="font-serif font-bold text-[21px] text-white tracking-tight">EngNest</span>
            <span class="text-[13px] text-[#AEB8BB]">Quản trị</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav aria-label="Quản trị" class="flex flex-col gap-1 text-[15px] font-medium">
          <!-- Tổng quan -->
          <router-link
            to="/dashboard"
            :class="[
              'flex items-center gap-3 h-[46px] px-3 rounded-[10px] transition-colors',
              isActive('/dashboard')
                ? 'bg-[#0B6E6E] text-white font-semibold'
                : 'text-[#D5DCDE] hover:bg-[#27373C] hover:text-white'
            ]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
              <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>
            </svg>
            <span>Tổng quan</span>
          </router-link>

          <!-- Khóa học -->
          <router-link
            to="/courses"
            :class="[
              'flex items-center gap-3 h-[46px] px-3 rounded-[10px] transition-colors',
              isActive('/courses')
                ? 'bg-[#0B6E6E] text-white font-semibold'
                : 'text-[#D5DCDE] hover:bg-[#27373C] hover:text-white'
            ]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
              <rect x="3" y="5" width="18" height="14" rx="3"></rect>
              <path d="M10 9.5v5l4.5-2.5z"></path>
            </svg>
            <span>Khóa học</span>
          </router-link>

          <!-- Đơn hàng -->
          <router-link
            to="/orders"
            :class="[
              'flex items-center gap-3 h-[46px] px-3 rounded-[10px] transition-colors',
              isActive('/orders')
                ? 'bg-[#0B6E6E] text-white font-semibold'
                : 'text-[#D5DCDE] hover:bg-[#27373C] hover:text-white'
            ]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
              <path d="M6 3h12l2 4H4zM4 7v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 11h6"></path>
            </svg>
            <span>Đơn hàng</span>
          </router-link>

          <!-- Yêu cầu tư vấn -->
          <router-link
            to="/leads"
            :class="[
              'flex items-center justify-between gap-3 h-[46px] px-3 rounded-[10px] transition-colors',
              isActive('/leads')
                ? 'bg-[#0B6E6E] text-white font-semibold'
                : 'text-[#D5DCDE] hover:bg-[#27373C] hover:text-white'
            ]"
          >
            <span class="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"></path>
              </svg>
              <span>Yêu cầu tư vấn</span>
            </span>
            <span v-if="newLeadsCount > 0" class="bg-[#E8873A] text-[#1D2A2E] text-[13px] font-bold px-2 py-0.5 rounded-full leading-none">
              {{ newLeadsCount }}
            </span>
          </router-link>

          <!-- Mã giảm giá (Vô hiệu hóa - Giai đoạn 2) -->
          <div
            title="Tính năng phát triển ở Giai đoạn 2"
            class="flex items-center justify-between gap-3 h-[46px] px-3 rounded-[10px] text-[#AEB8BB] opacity-60 cursor-not-allowed select-none"
          >
            <span class="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
                <path d="M3 12V4h8l10 10-8 8z"></path>
                <circle cx="7.5" cy="8.5" r="1.5"></circle>
              </svg>
              <span>Mã giảm giá</span>
            </span>
            <span class="bg-[#33403F] text-[#D5DCDE] text-[12px] font-bold px-1.5 py-0.5 rounded leading-none">
              GĐ 2
            </span>
          </div>

          <!-- Bài viết (Vô hiệu hóa - Giai đoạn 2) -->
          <div
            title="Tính năng phát triển ở Giai đoạn 2"
            class="flex items-center justify-between gap-3 h-[46px] px-3 rounded-[10px] text-[#AEB8BB] opacity-60 cursor-not-allowed select-none"
          >
            <span class="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
                <path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"></path>
              </svg>
              <span>Bài viết</span>
            </span>
            <span class="bg-[#33403F] text-[#D5DCDE] text-[12px] font-bold px-1.5 py-0.5 rounded leading-none">
              GĐ 2
            </span>
          </div>

          <!-- Divider -->
          <div class="h-[1px] bg-[#33403F] my-2"></div>

          <!-- Ngân hàng & Email (Vô hiệu hóa - Đấu nối tự động PayOS & Resend) -->
          <div
            title="Cấu hình tự động qua cổng PayOS Webhook & Resend"
            class="flex items-center justify-between gap-3 h-[46px] px-3 rounded-[10px] text-[#AEB8BB] opacity-60 cursor-not-allowed select-none"
          >
            <span class="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
                <rect x="3" y="6" width="18" height="13" rx="2"></rect>
                <path d="M3 10h18M7 15h3"></path>
              </svg>
              <span>Ngân hàng & Email</span>
            </span>
          </div>

          <!-- Giao diện & Banner -->
          <router-link
            to="/settings"
            :class="[
              'flex items-center gap-3 h-[46px] px-3 rounded-[10px] transition-colors',
              isActive('/settings') || isActive('/banners')
                ? 'bg-[#0B6E6E] text-white font-semibold'
                : 'text-[#D5DCDE] hover:bg-[#27373C] hover:text-white'
            ]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M3 9h18M9 21V9"></path>
            </svg>
            <span>Giao diện & Banner</span>
          </router-link>

          <!-- SEO & Google -->
          <router-link
            to="/seo"
            :class="[
              'flex items-center gap-3 h-[46px] px-3 rounded-[10px] transition-colors',
              isActive('/seo')
                ? 'bg-[#0B6E6E] text-white font-semibold'
                : 'text-[#D5DCDE] hover:bg-[#27373C] hover:text-white'
            ]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-3.5-3.5"></path>
            </svg>
            <span>SEO & Google</span>
          </router-link>

          <!-- Chính sách & Hỏi đáp / Audit -->
          <router-link
            to="/audit-logs"
            :class="[
              'flex items-center gap-3 h-[46px] px-3 rounded-[10px] transition-colors',
              isActive('/audit-logs')
                ? 'bg-[#0B6E6E] text-white font-semibold'
                : 'text-[#D5DCDE] hover:bg-[#27373C] hover:text-white'
            ]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 3v5h5M9 13h6M9 17h4"></path>
            </svg>
            <span>Nhật ký hoạt động</span>
          </router-link>
        </nav>
      </div>

      <!-- User footer profile -->
      <div class="pt-4 border-t border-[#33403F] mt-6">
        <div class="flex items-center justify-between p-2 rounded-lg bg-[#27373C]/60 text-xs">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-7 h-7 rounded-full bg-[#0B6E6E] text-white font-bold flex items-center justify-center shrink-0">
              AD
            </div>
            <div class="truncate leading-tight">
              <div class="text-[#D5DCDE] font-semibold truncate">{{ adminUser.name || 'Admin User' }}</div>
              <div class="text-[11px] text-[#AEB8BB] truncate">{{ adminUser.email || 'admin@engnest.vn' }}</div>
            </div>
          </div>
          <button
            @click="handleLogout"
            title="Đăng xuất"
            class="p-1.5 text-[#AEB8BB] hover:text-red-400 hover:bg-[#33403F] rounded transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Outlet Area -->
    <main class="flex-1 min-w-0 bg-[#F4F1EB] overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { leadApi } from "@modules/leads/api/lead.api";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const newLeadsCount = ref(0);

const adminUser = computed(() => authStore.user || { name: "Quản trị viên", email: "admin@engnest.vn" });

async function fetchNewLeadsCount() {
  try {
    newLeadsCount.value = await leadApi.getNewCount();
  } catch {
    newLeadsCount.value = 0;
  }
}

watch(
  () => route.path,
  () => {
    fetchNewLeadsCount();
  },
);

onMounted(() => {
  fetchNewLeadsCount();
});

function isActive(path: string): boolean {
  if (path === "/dashboard") {
    return route.path === "/dashboard";
  }
  return route.path.startsWith(path);
}

async function handleLogout() {
  await authStore.logout();
  router.push("/login");
}
</script>
