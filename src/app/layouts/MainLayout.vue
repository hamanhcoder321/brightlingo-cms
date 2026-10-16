<template>
  <div class="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
      <!-- Brand Logo -->
      <div class="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
        <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          BL
        </div>
        <div>
          <h1 class="text-base font-bold text-slate-800 leading-tight">BrightLingo</h1>
          <p class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hệ thống Quản trị</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <!-- Main Section -->
        <div>
          <div class="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Vận hành kinh doanh
          </div>
          <nav class="space-y-1">
            <router-link
              v-for="item in primaryNav"
              :key="item.path"
              :to="item.path"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4 shrink-0" />
              <span>{{ item.title }}</span>
            </router-link>
          </nav>
        </div>

        <!-- System Section -->
        <div>
          <div class="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Cấu hình & Nhật ký
          </div>
          <nav class="space-y-1">
            <router-link
              v-for="item in secondaryNav"
              :key="item.path"
              :to="item.path"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4 shrink-0" />
              <span>{{ item.title }}</span>
            </router-link>
          </nav>
        </div>
      </div>

      <!-- User footer in sidebar -->
      <div class="p-3 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
              AD
            </div>
            <div class="truncate">
              <p class="text-xs font-semibold text-slate-800 truncate">{{ adminUser.name || 'Admin User' }}</p>
              <p class="text-[10px] text-slate-400 truncate">{{ adminUser.email || 'admin@brightlingo.vn' }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            title="Đăng xuất"
            class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-4">
          <h2 class="text-lg font-bold text-slate-800">
            {{ currentTitle }}
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Hệ thống ổn định
          </span>
          <button
            @click="handleLogout"
            class="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <LogOut class="w-3.5 h-3.5" />
            Đăng xuất
          </button>
        </div>
      </header>

      <!-- Router Content Outlet -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  ShoppingCart,
  Ticket,
  Users,
  Mail,
  Settings,
  History,
  LogOut,
} from "lucide-vue-next";
import { useAuthStore } from "@modules/auth/store/auth.store";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const adminUser = computed(() => authStore.user || { name: "Quản trị viên", email: "admin@brightlingo.vn" });

const primaryNav = [
  { title: "Tổng quan", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Khóa học & Tài liệu", icon: BookOpen, path: "/courses" },
  { title: "Danh mục khóa học", icon: FolderTree, path: "/courses/categories" },
  { title: "Đơn hàng", icon: ShoppingCart, path: "/orders" },
  { title: "Mã giảm giá", icon: Ticket, path: "/coupons" },
  { title: "Tư vấn & Leads", icon: Users, path: "/leads" },
];

const secondaryNav = [
  { title: "Email Templates", icon: Mail, path: "/email-templates" },
  { title: "Cài đặt hệ thống", icon: Settings, path: "/settings" },
  { title: "Nhật ký hoạt động", icon: History, path: "/audit-logs" },
];

const currentTitle = computed(() => {
  return (route.meta?.title as string) || "BrightLingo CMS";
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
