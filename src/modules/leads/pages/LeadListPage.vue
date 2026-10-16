<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Tư vấn & Leads Khách hàng</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Quản lý danh sách khách hàng để lại thông tin tư vấn 30 phút, hỗ trợ chốt sale và đo lường nguồn marketing.
        </p>
      </div>

      <button
        @click="fetchLeads"
        class="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        Làm mới
      </button>
    </div>

    <!-- Leads Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4">Họ và tên</th>
              <th class="py-3 px-4">Số điện thoại / Email</th>
              <th class="py-3 px-4">Khóa học quan tâm</th>
              <th class="py-3 px-4">Nguồn Marketing (First-Touch)</th>
              <th class="py-3 px-4">Trạng thái xử lý</th>
              <th class="py-3 px-4">Thời gian</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="leads.length === 0" class="text-center">
              <td colspan="6" class="py-8 text-slate-400">Chưa có lead nào.</td>
            </tr>
            <tr v-for="lead in leads" :key="lead.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4 font-bold text-slate-900">
                {{ lead.full_name }}
              </td>
              <td class="py-3 px-4">
                <div class="font-mono font-semibold text-slate-800">{{ lead.phone }}</div>
                <div class="text-[11px] text-slate-500">{{ lead.email || 'Không có email' }}</div>
              </td>
              <td class="py-3 px-4 text-slate-700 font-medium">
                {{ lead.course_title || 'Tư vấn tổng quát' }}
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                  {{ lead.utm_source || 'organic' }}
                </span>
                <span v-if="lead.utm_campaign" class="text-[10px] text-slate-400 block font-mono">
                  {{ lead.utm_campaign }}
                </span>
              </td>
              <td class="py-3 px-4">
                <select
                  :value="lead.status"
                  @change="handleStatusChange(lead, ($event.target as HTMLSelectElement).value as LeadStatus)"
                  class="px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="New">Mới (Chưa gọi)</option>
                  <option value="Contacted">Đã liên hệ</option>
                  <option value="Completed">Hoàn tất / Đã chốt</option>
                </select>
              </td>
              <td class="py-3 px-4 text-slate-500">
                {{ formatDateTime(lead.created_at) }}
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
import { leadApi } from "../api/lead.api";
import type { ConsultationLead, LeadStatus } from "../types/lead.types";

const leads = ref<ConsultationLead[]>([]);

async function fetchLeads() {
  try {
    const res = await leadApi.getLeads();
    leads.value = res.items;
  } catch (err) {
    console.error("Failed to load leads", err);
  }
}

async function handleStatusChange(lead: ConsultationLead, newStatus: LeadStatus) {
  try {
    await leadApi.updateLeadStatus(lead.id, newStatus);
    lead.status = newStatus;
  } catch (err) {
    console.error("Failed to update lead status", err);
  }
}

onMounted(() => {
  fetchLeads();
});
</script>
