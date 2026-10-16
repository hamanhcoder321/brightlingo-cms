<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Quản lý Email Templates</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Cấu hình mẫu thư tự động gửi tài liệu sau khi thanh toán VietQR thành công.
        </p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
          <tr>
            <th class="py-3 px-4">Tên Template</th>
            <th class="py-3 px-4">Mã Key</th>
            <th class="py-3 px-4">Tiêu đề (Subject)</th>
            <th class="py-3 px-4">Trạng thái</th>
            <th class="py-3 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="tpl in templates" :key="tpl.id" class="hover:bg-slate-50/70">
            <td class="py-3 px-4 font-bold text-slate-900">{{ tpl.title }}</td>
            <td class="py-3 px-4 font-mono text-indigo-600">{{ tpl.template_key }}</td>
            <td class="py-3 px-4 text-slate-600 max-w-[280px] truncate">{{ tpl.subject }}</td>
            <td class="py-3 px-4">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đang sử dụng
              </span>
            </td>
            <td class="py-3 px-4 text-right">
              <router-link
                :to="`/email-templates/${tpl.id}`"
                class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-indigo-600 font-semibold"
              >
                Chỉnh sửa mẫu thư
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { emailTemplateApi } from "../api/email-template.api";
import type { EmailTemplate } from "../types/email-template.types";

const templates = ref<EmailTemplate[]>([]);

onMounted(async () => {
  templates.value = await emailTemplateApi.getTemplates();
});
</script>
