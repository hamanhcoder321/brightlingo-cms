<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-[16px] shadow-xs border border-[#E5E0D7] p-8 flex flex-col gap-6">
      <!-- Header -->
      <div class="text-center flex flex-col items-center gap-2">
        <div class="w-12 h-12 bg-[#0B6E6E] rounded-[12px] mx-auto flex items-center justify-center text-white shadow-xs">
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true" class="shrink-0">
            <path
              d="M15 6h24a11 11 0 0 1 11 11v10a11 11 0 0 1-11 11H24l-9 8v-8.6A11 11 0 0 1 4 27V17A11 11 0 0 1 15 6z"
              fill="#FFFFFF"
            ></path>
            <path
              d="M37 28h13a9 9 0 0 1 9 9v6a9 9 0 0 1-6 8.5V58l-7.5-5.5H37a9 9 0 0 1-9-9v-6.5a9 9 0 0 1 9-9z"
              fill="#E8873A"
              stroke="#0B6E6E"
              stroke-width="3"
            ></path>
          </svg>
        </div>
        <h1 class="m-0 font-serif font-bold text-[28px] text-[#1D2A2E] leading-tight">EngNest CMS</h1>
        <p class="m-0 text-[14px] text-[#4C5A60]">Đăng nhập tài khoản Quản trị viên để tiếp tục</p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="p-3.5 rounded-[10px] bg-[#FDF0E3] border border-[#F3C49B] text-[13px] text-[#8A3F12] flex items-center gap-2"
      >
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-[14px] font-medium text-[#1D2A2E]">Email quản trị</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="admin@brightlingo.vn"
            class="h-11 px-3.5 rounded-[10px] border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] text-[15px] outline-none text-[#1D2A2E] transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[14px] font-medium text-[#1D2A2E]">Mật khẩu</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="h-11 px-3.5 rounded-[10px] border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] text-[15px] outline-none text-[#1D2A2E] transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="h-11 mt-2 w-full bg-[#0B6E6E] hover:bg-[#08585A] disabled:opacity-50 text-white text-[15px] font-semibold rounded-[10px] shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
          <span>{{ isLoading ? 'Đang xác thực...' : 'Đăng nhập CMS' }}</span>
        </button>
      </form>

      <!-- Note for internal admin only per BA spec -->
      <div class="pt-4 border-t border-[#EFEBE4] text-center">
        <p class="m-0 text-[12px] text-[#4C5A60]">
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
