<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="w-12 h-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xl shadow-md">
          BL
        </div>
        <h1 class="text-2xl font-bold text-slate-800">BrightLingo CMS</h1>
        <p class="text-xs text-slate-500">Đăng nhập tài khoản Quản trị viên để tiếp tục</p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2"
      >
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-700">Email quản trị</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="admin@brightlingo.vn"
            class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-700">Mật khẩu</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <span v-if="isLoading">Đang xác thực...</span>
          <span v-else>Đăng nhập CMS</span>
        </button>
      </form>

      <!-- Note for internal admin only per BA spec -->
      <div class="pt-4 border-t border-slate-100 text-center">
        <p class="text-[11px] text-slate-400">
          Chỉ dành cho Quản trị viên nội bộ. Tài khoản do hệ thống cấp trực tiếp (không tự đăng ký).
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth.store";
import { getErrorMessage } from "@shared/utils";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: "admin@brightlingo.vn",
  password: "",
});

const isLoading = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });
    router.push("/dashboard");
  } catch (err: any) {
    errorMessage.value = getErrorMessage(err, "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
  } finally {
    isLoading.value = false;
  }
}
</script>
