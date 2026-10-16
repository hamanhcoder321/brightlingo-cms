<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Chỉnh sửa Email Template</h2>
        <p class="text-xs text-slate-500 mt-0.5">{{ template?.title }}</p>
      </div>

      <router-link
        to="/email-templates"
        class="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        ← Quay lại danh sách
      </router-link>
    </div>

    <!-- BR-11 Safe Placeholder Warning -->
    <div
      v-if="!hasResourceLinkPlaceholder"
      class="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1 shadow-sm"
    >
      <div class="font-bold flex items-center gap-1.5 text-sm text-red-800">
        ⚠️ Cảnh báo an toàn BR-11: Thiếu biến link tài nguyên!
      </div>
      <p>
        Nội dung email hiện tại <strong>chưa chứa</strong> placeholder <code v-pre class="font-mono bg-red-100 text-red-900 px-1 py-0.5 rounded font-bold">{{resource_link}}</code>.
        Nếu không có biến này, hệ thống sẽ <strong>không thể gửi link tài nguyên</strong> cho học viên sau khi họ thanh toán thành công!
      </p>
    </div>

    <!-- Template Form -->
    <form @submit.prevent="handleSave" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-700">Tiêu đề thư (Subject) *</label>
        <input
          v-model="form.subject"
          type="text"
          required
          class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold text-slate-700">Nội dung thư (HTML) *</label>
          <div v-pre class="text-[11px] text-slate-500 space-x-1">
            <span>Biến khả dụng:</span>
            <span class="font-mono bg-slate-100 px-1 rounded text-indigo-600">{{customer_name}}</span>
            <span class="font-mono bg-slate-100 px-1 rounded text-indigo-600">{{course_title}}</span>
            <span class="font-mono bg-slate-100 px-1 rounded text-indigo-600">{{resource_link}}</span>
          </div>
        </div>
        <textarea
          v-model="form.body_html"
          rows="12"
          required
          class="w-full p-3 font-mono text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        ></textarea>
      </div>

      <!-- Action Footer -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
        <!-- Test Email Section -->
        <div class="flex items-center gap-2">
          <input
            v-model="testEmail"
            type="email"
            placeholder="Nhập email để gửi test..."
            class="px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none w-56"
          />
          <button
            type="button"
            :disabled="isSendingTest || !testEmail"
            @click="handleSendTest"
            class="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {{ isSendingTest ? 'Đang gửi...' : 'Gửi thử nghiệm' }}
          </button>
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
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
  template.value = await emailTemplateApi.getTemplateById(templateId.value);
  if (template.value) {
    form.subject = template.value.subject;
    form.body_html = template.value.body_html;
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
