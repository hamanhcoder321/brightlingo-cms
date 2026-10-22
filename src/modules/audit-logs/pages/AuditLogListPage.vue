<template>
  <div class="p-4 sm:p-6 md:p-8 pb-14 flex flex-col gap-4 sm:gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Top Bar: Title & Refresh -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="m-0 font-serif font-bold text-2xl sm:text-[32px] text-[#1D2A2E] leading-tight">
          Nhật ký Hoạt động (Audit Logs)
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px]">
          Ghi nhận toàn bộ thao tác nhạy cảm: gửi lại email, đổi link tài nguyên bí mật, sửa giá, v.v. (BR-06, BR-15).
        </p>
      </div>

      <button
        @click="fetchLogs"
        :disabled="isLoading"
        class="h-11 px-4 rounded-[10px] border border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#1D2A2E] font-medium text-[15px] flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50"
      >
        <RotateCcw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
        <span>Làm mới</span>
      </button>
    </div>

    <!-- Audit Logs Table Card -->
    <div class="bg-white border border-[#E5E0D7] rounded-[16px] shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] text-left border-collapse text-[15px]">
          <thead>
            <tr class="text-[#4C5A60] bg-[#FAF7F2] border-b border-[#E5E0D7] text-[14px]">
              <th class="py-3.5 px-4 font-semibold">Hành động</th>
              <th class="py-3.5 px-4 font-semibold">Đối tượng</th>
              <th class="py-3.5 px-4 font-semibold">Người thực hiện</th>
              <th class="py-3.5 px-4 font-semibold">Chi tiết thao tác</th>
              <th class="py-3.5 px-4 font-semibold text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#EFEBE4]">
            <tr v-if="isLoading" class="text-center">
              <td colspan="5" class="py-12 text-[#4C5A60]">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#0B6E6E] border-t-transparent mb-2"></div>
                <div>Đang tải dữ liệu nhật ký...</div>
              </td>
            </tr>
            <tr v-else-if="logs.length === 0" class="text-center">
              <td colspan="5" class="py-12 text-[#4C5A60]">Chưa có nhật ký nào.</td>
            </tr>
            <tr v-for="log in logs" :key="log.id" class="hover:bg-[#FAF7F2]/60 transition-colors">
              <td class="py-3.5 px-4">
                <span class="inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-mono font-bold bg-[#E6F2F0] text-[#08585A] border border-[#C9DCD8]">
                  {{ log.action }}
                </span>
              </td>
              <td class="py-3.5 px-4">
                <span class="font-semibold text-[#1D2A2E]">{{ log.entity_type }}</span>
                <span class="text-[#4C5A60] font-mono text-[13px] ml-1.5">#{{ log.entity_id }}</span>
              </td>
              <td class="py-3.5 px-4">
                <div class="font-medium text-[#1D2A2E]">{{ log.actor_name || 'Hệ thống' }}</div>
                <div class="text-[13px] text-[#4C5A60] font-mono">{{ log.actor_email }}</div>
              </td>
              <td class="py-3.5 px-4 font-mono text-[13px] text-[#4C5A60] max-w-[320px] truncate" :title="JSON.stringify(log.metadata)">
                {{ log.metadata ? JSON.stringify(log.metadata) : '-' }}
              </td>
              <td class="py-3.5 px-4 text-[#4C5A60] text-[14px] text-right">
                {{ formatDateTime(log.created_at) }}
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
import { RotateCcw } from "lucide-vue-next";
import { formatDateTime } from "@shared/utils/date.utils";
import { auditLogApi } from "../api/audit-log.api";
import type { AuditLog } from "../types/audit-log.types";

const logs = ref<AuditLog[]>([]);
const isLoading = ref(false);

async function fetchLogs() {
  isLoading.value = true;
  try {
    const res = await auditLogApi.getLogs();
    logs.value = res.items;
  } catch (err) {
    console.error("Failed to load audit logs", err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchLogs();
});
</script>
