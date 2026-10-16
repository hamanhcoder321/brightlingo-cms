<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Nhật ký Hoạt động (Audit Logs)</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Ghi nhận toàn bộ thao tác nhạy cảm: gửi lại email, đổi link tài nguyên bí mật, sửa giá, v.v. (BR-06, BR-15).
        </p>
      </div>

      <button
        @click="fetchLogs"
        class="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        Làm mới
      </button>
    </div>

    <!-- Audit Logs Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
          <tr>
            <th class="py-3 px-4">Hành động</th>
            <th class="py-3 px-4">Đối tượng</th>
            <th class="py-3 px-4">Người thực hiện</th>
            <th class="py-3 px-4">Chi tiết thao tác</th>
            <th class="py-3 px-4">Thời gian</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="logs.length === 0" class="text-center">
            <td colspan="5" class="py-8 text-slate-400">Chưa có nhật ký nào.</td>
          </tr>
          <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/70">
            <td class="py-3 px-4 font-mono font-bold text-indigo-700">
              <span class="px-2 py-0.5 rounded text-[10px] bg-indigo-50 border border-indigo-200">
                {{ log.action }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span class="font-semibold text-slate-800">{{ log.entity_type }}</span>
              <span class="text-slate-400 font-mono ml-1">#{{ log.entity_id }}</span>
            </td>
            <td class="py-3 px-4">
              <div class="font-medium text-slate-800">{{ log.actor_name }}</div>
              <div class="text-[10px] text-slate-400 font-mono">{{ log.actor_email }}</div>
            </td>
            <td class="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-[300px] truncate" :title="JSON.stringify(log.metadata)">
              {{ log.metadata ? JSON.stringify(log.metadata) : '-' }}
            </td>
            <td class="py-3 px-4 text-slate-500">
              {{ formatDateTime(log.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
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

async function fetchLogs() {
  try {
    const res = await auditLogApi.getLogs();
    logs.value = res.items;
  } catch (err) {
    console.error("Failed to load audit logs", err);
  }
}

onMounted(() => {
  fetchLogs();
});
</script>
