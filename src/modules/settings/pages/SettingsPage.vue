<template>
  <div class="space-y-6 max-w-4xl">
    <div>
      <h2 class="text-xl font-bold text-slate-900">Cài đặt Hệ thống & Thanh toán</h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Cấu hình thông tin thương hiệu và tài khoản nhận thanh toán tự động VietQR.
      </p>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- General Branding Card -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Thông tin Liên hệ & Thương hiệu</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Tên nền tảng</label>
            <input
              v-model="form.site_name"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Hotline hỗ trợ</label>
            <input
              v-model="form.hotline"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Email chăm sóc khách hàng</label>
            <input
              v-model="form.support_email"
              type="email"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- VietQR Bank Account Card -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Tài khoản Ngân hàng nhận VietQR</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Ngân hàng (Mã chuẩn Napas)</label>
            <input
              v-model="form.vietqr_bank_code"
              type="text"
              placeholder="MB, VCB, TCB..."
              class="w-full px-3 py-2 rounded-lg border border-slate-200 uppercase font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Số tài khoản</label>
            <input
              v-model="form.vietqr_account_number"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Tên chủ tài khoản</label>
            <input
              v-model="form.vietqr_account_name"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="isSaving"
          class="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
        >
          {{ isSaving ? 'Đang lưu...' : 'Lưu cấu hình' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { settingsApi } from "../api/settings.api";
import type { SystemSettings } from "../types/settings.types";

const form = reactive<SystemSettings>({
  site_name: "",
  hotline: "",
  support_email: "",
  vietqr_bank_code: "",
  vietqr_account_number: "",
  vietqr_account_name: "",
});

const isSaving = ref(false);

onMounted(async () => {
  const data = await settingsApi.getSettings();
  Object.assign(form, data);
});

async function handleSave() {
  isSaving.value = true;
  try {
    await settingsApi.updateSettings(form);
    alert("Cập nhật cài đặt thành công!");
  } catch (err) {
    console.error("Failed to save settings", err);
  } finally {
    isSaving.value = false;
  }
}
</script>
