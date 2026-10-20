<template>
  <div class="p-6 md:p-8 pb-14 flex flex-col gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="m-0 font-serif font-bold text-[32px] text-[#1D2A2E] leading-tight">
          Chỉnh sửa Mẫu Email
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px] mt-0.5">
          {{ template?.title || 'Cấu hình mẫu thư bàn giao tài liệu tự động' }}
        </p>
      </div>

      <router-link
        to="/email-templates"
        class="h-[46px] px-4 rounded-[10px] border-[1.5px] border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#4C5A60] hover:text-[#1D2A2E] font-semibold text-[15px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
      >
        <span>← Quay lại danh sách</span>
      </router-link>
    </div>

    <!-- BR-11 Safe Placeholder Warning -->
    <div
      v-if="!hasResourceLinkPlaceholder"
      class="p-4 rounded-[12px] bg-[#FEF3EB] border border-[#FAD7B8] text-[14px] text-[#B25E09] space-y-1 shadow-xs"
    >
      <div class="font-bold flex items-center gap-1.5 text-[15px] text-[#9A4E08]">
        ⚠️ Cảnh báo an toàn BR-11: Thiếu biến link tài nguyên!
      </div>
      <p class="m-0 leading-relaxed">
        Nội dung email hiện tại <strong>chưa chứa</strong> placeholder <code v-pre class="font-mono bg-[#F9E2D0] text-[#7A3E06] px-1.5 py-0.5 rounded font-bold">{{resource_link}}</code>.
        Nếu không có biến này, hệ thống sẽ <strong>không thể gửi link tài liệu</strong> cho học viên sau khi họ thanh toán thành công!
      </p>
    </div>

    <!-- Template Form -->
    <form @submit.prevent="handleSave" class="bg-white p-6 rounded-[16px] border border-[#E5E0D7] shadow-xs space-y-5">
      <div class="space-y-1.5">
        <label class="block text-[14px] font-semibold text-[#1D2A2E]">Tiêu đề thư (Subject) *</label>
        <input
          v-model="form.subject"
          type="text"
          required
          class="w-full h-[46px] px-3.5 rounded-[10px] border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] text-[15px] bg-white text-[#1D2A2E] focus:outline-none transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <label class="text-[14px] font-semibold text-[#1D2A2E]">Nội dung thư (HTML) *</label>
          <div v-pre class="text-[13px] text-[#78888D] flex items-center gap-1.5 flex-wrap">
            <span>Biến khả dụng:</span>
            <span class="font-mono bg-[#EAE6DE] px-1.5 py-0.5 rounded text-[#0B6E6E] font-medium">{{customer_name}}</span>
            <span class="font-mono bg-[#EAE6DE] px-1.5 py-0.5 rounded text-[#0B6E6E] font-medium">{{course_title}}</span>
            <span class="font-mono bg-[#EAE6DE] px-1.5 py-0.5 rounded text-[#0B6E6E] font-medium">{{resource_link}}</span>
          </div>
        </div>
        <textarea
          v-model="form.body_html"
          rows="14"
          required
          class="w-full p-4 font-mono text-[14px] rounded-[10px] border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] bg-white text-[#1D2A2E] focus:outline-none transition-colors leading-relaxed"
        ></textarea>
      </div>

      <!-- Action Footer -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#EFEBE4]">
        <!-- Test Email Section -->
        <div class="flex items-center gap-2">
          <input
            v-model="testEmail"
            type="email"
            placeholder="Nhập email để gửi test..."
            class="h-[42px] px-3.5 rounded-[10px] border border-[#D8D2C7] focus:border-[#0B6E6E] text-[14px] bg-white text-[#1D2A2E] focus:outline-none w-64 transition-colors"
          />
          <button
            type="button"
            :disabled="isSendingTest || !testEmail"
            @click="handleSendTest"
            class="h-[42px] px-4 rounded-[10px] border border-[#0B6E6E] bg-white text-[#0B6E6E] hover:bg-[#E6F2F0] text-[14px] font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {{ isSendingTest ? 'Đang gửi...' : 'Gửi thử nghiệm' }}
          </button>
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="h-[46px] px-6 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[15px] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {{ isSaving ? 'Đang lưu...' : 'Lưu mẫu thư' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { emailTemplateApi } from "../api/email-template.api";
import type { EmailTemplate } from "../types/email-template.types";

const route = useRoute();
const templateId = computed(() => route.params.id as string);

const template = ref<EmailTemplate | null>(null);
const form = reactive({
  subject: "",
  body_html: "",
});

const testEmail = ref("");
const isSendingTest = ref(false);
const isSaving = ref(false);

const hasResourceLinkPlaceholder = computed(() => {
  return form.body_html.includes("{{resource_link}}");
});

onMounted(async () => {
  try {
    template.value = await emailTemplateApi.getTemplateById(templateId.value);
    if (template.value) {
      form.subject = template.value.subject;
      form.body_html = template.value.body_html;
    }
  } catch (err) {
    console.error("Failed to load template", err);
  }
});

async function handleSave() {
  isSaving.value = true;
  try {
    await emailTemplateApi.updateTemplate(templateId.value, form);
    alert("Cập nhật Email Template thành công!");
  } catch (err) {
    console.error("Failed to save template", err);
  } finally {
    isSaving.value = false;
  }
}

async function handleSendTest() {
  if (!testEmail.value) return;
  isSendingTest.value = true;
  try {
    await emailTemplateApi.sendTestEmail(templateId.value, testEmail.value);
    alert(`Đã gửi email test tới ${testEmail.value}`);
  } catch (err) {
    console.error("Failed to send test email", err);
    alert("Lỗi khi gửi email test!");
  } finally {
    isSendingTest.value = false;
  }
}
</script>
