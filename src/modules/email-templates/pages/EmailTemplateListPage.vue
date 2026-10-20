<template>
  <div class="p-6 md:p-8 pb-14 flex flex-col gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="m-0 font-serif font-bold text-[32px] text-[#1D2A2E] leading-tight">
          Ngân hàng &amp; Mẫu Email Tự Động
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px] mt-0.5">
          Cấu hình tài khoản nhận thanh toán VietQR và mẫu thư tự động gửi link học liệu sau khi thanh toán.
        </p>
      </div>
      <div>
        <button
          type="button"
          :disabled="savingBank"
          class="h-[46px] px-5 rounded-[10px] border-0 bg-[#0B6E6E] hover:bg-[#08585A] text-white font-bold text-[15px] inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
          @click="saveBankSettings"
        >
          <span
            v-if="savingBank"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          <span>{{ savingBank ? "Đang lưu..." : "Lưu cấu hình Ngân hàng" }}</span>
        </button>
      </div>
    </div>

    <div
      v-if="saveMessage"
      class="p-3.5 px-4 rounded-[12px] bg-[#E4F3EA] border border-[#A4DBC0] text-[#155C35] text-[14px] font-medium"
    >
      {{ saveMessage }}
    </div>

    <!-- VietQR Bank Account Card -->
    <div class="bg-[#FFFEFA] border border-[#E5E0D7] rounded-[16px] p-5 shadow-2xs">
      <div class="mb-4">
        <h2 class="text-base font-bold text-[#1D2A2E]">
          1. Tài khoản nhận thanh toán VietQR
        </h2>
        <p class="text-xs text-[#7A878D] mt-0.5">
          Thông tin dùng để sinh mã QR thanh toán tự động trên trang mua khóa học.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-[#1D2A2E] mb-1.5">
            Ngân hàng thụ hưởng (Mã Bank)
          </label>
          <select
            v-model="bankForm.vietqr_bank_code"
            class="w-full px-3 py-2 rounded-lg border border-[#D8D2C7] bg-white text-sm text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
          >
            <option value="MBBANK">MBBank (Ngân hàng Quân Đội)</option>
            <option value="VCB">Vietcombank</option>
            <option value="TCB">Techcombank</option>
            <option value="ACB">ACB</option>
            <option value="BIDV">BIDV</option>
            <option value="ICB">VietinBank</option>
            <option value="VPB">VPBank</option>
            <option value="TPB">TPBank</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-[#1D2A2E] mb-1.5">
            Số tài khoản nhận tiền
          </label>
          <input
            v-model="bankForm.vietqr_account_number"
            type="text"
            placeholder="0399046519"
            class="w-full px-3 py-2 rounded-lg border border-[#D8D2C7] bg-white text-sm font-mono font-bold text-[#0B6E6E] focus:outline-none focus:border-[#0B6E6E]"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[#1D2A2E] mb-1.5">
            Tên chủ tài khoản (Không dấu)
          </label>
          <input
            v-model="bankForm.vietqr_account_name"
            type="text"
            placeholder="HA VAN MANH"
            class="w-full px-3 py-2 rounded-lg border border-[#D8D2C7] bg-white text-sm uppercase font-semibold text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
          />
        </div>
      </div>
    </div>

    <!-- Email Templates Table Card -->
    <div class="bg-[#FFFEFA] border border-[#E5E0D7] rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-[#E5E0D7]">
        <h2 class="text-base font-bold text-[#1D2A2E]">
          2. Mẫu Email tự động
        </h2>
        <p class="text-xs text-[#7A878D] mt-0.5">
          Các mẫu thư gửi tự động khi học viên hoàn tất thanh toán hoặc đăng ký nhận tài liệu.
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr class="text-[#7A878D] border-b border-[#E5E0D7] bg-[#FAF7F2] text-xs uppercase tracking-wider">
              <th class="py-3 px-4 font-bold text-left">Tên Template</th>
              <th class="py-3 px-3 font-bold text-left">Mã Key</th>
              <th class="py-3 px-3 font-bold text-left">Tiêu đề (Subject)</th>
              <th class="py-3 px-3 font-bold text-left">Trạng thái</th>
              <th class="py-3 px-4 font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#EFEBE4]">
            <tr
              v-for="tpl in templates"
              :key="tpl.id"
              class="hover:bg-[#FAF7F2]/60 transition-colors"
            >
              <td class="py-3.5 px-4 font-bold text-[#1D2A2E]">{{ tpl.title }}</td>
              <td class="py-3.5 px-3 font-mono text-[#0B6E6E] text-xs">{{ tpl.template_key }}</td>
              <td class="py-3.5 px-3 text-[#4C5A60] max-w-[280px] truncate">{{ tpl.subject }}</td>
              <td class="py-3.5 px-3">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E5F5EC] text-[#1F7A4C]">
                  Đang sử dụng
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <router-link
                  :to="`/email-templates/${tpl.id}`"
                  class="h-8 px-3 rounded-lg border border-[#0B6E6E] bg-white text-[#0B6E6E] hover:bg-[#E3F1EF] font-semibold text-xs inline-flex items-center transition-colors"
                >
                  Chỉnh sửa mẫu thư
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { emailTemplateApi } from "../api/email-template.api";
import type { EmailTemplate } from "../types/email-template.types";
import { settingsApi } from "@modules/settings/api/settings.api";

const templates = ref<EmailTemplate[]>([]);
const savingBank = ref(false);
const saveMessage = ref("");
const bankForm = ref({
  vietqr_bank_code: "MBBANK",
  vietqr_account_number: "0399046519",
  vietqr_account_name: "HA VAN MANH",
});

const saveBankSettings = async () => {
  savingBank.value = true;
  try {
    await settingsApi.updateSettings(bankForm.value);
    saveMessage.value = "Đã lưu cấu hình tài khoản ngân hàng VietQR thành công!";
    setTimeout(() => {
      saveMessage.value = "";
    }, 3500);
  } catch (err) {
    console.error("Failed to save bank settings", err);
  } finally {
    savingBank.value = false;
  }
};

onMounted(async () => {
  try {
    const [tpls, settings] = await Promise.all([
      emailTemplateApi.getTemplates(),
      settingsApi.getSettings(),
    ]);
    templates.value = tpls;
    bankForm.value = {
      vietqr_bank_code: settings.vietqr_bank_code || "MBBANK",
      vietqr_account_number: settings.vietqr_account_number || "0399046519",
      vietqr_account_name: settings.vietqr_account_name || "HA VAN MANH",
    };
  } catch (err) {
    console.error("Failed to fetch email templates / bank settings", err);
  }
});
</script>
