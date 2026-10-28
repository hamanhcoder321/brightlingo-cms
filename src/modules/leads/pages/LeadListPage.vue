<template>
  <div class="p-4 sm:p-6 md:p-8 pb-14 flex flex-col gap-4 sm:gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Page Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="m-0 font-serif font-bold text-2xl sm:text-[32px] text-[#1D2A2E] leading-tight">
          Yêu cầu tư vấn
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px] mt-0.5">
          Danh sách khách hàng để lại thông tin tư vấn khóa học trong 30 phút.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="fetchLeads"
          :disabled="isLoading"
          class="h-[46px] px-4 rounded-[10px] border-[1.5px] border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#4C5A60] hover:text-[#1D2A2E] cursor-pointer flex items-center gap-2 transition-colors shadow-xs font-semibold text-[15px]"
          title="Tải lại danh sách"
        >
          <RotateCcw :class="['w-4 h-4', isLoading && 'animate-spin text-[#0B6E6E]']" />
          <span>Làm mới</span>
        </button>
      </div>
    </div>

    <!-- Filter & Search Toolbar (Giống giao diện Khóa học) -->
    <div class="flex flex-wrap gap-3 items-center">
      <!-- Search Input -->
      <label class="flex-1 min-w-0 w-full relative flex items-center">
        <span class="absolute left-3.5 flex text-[#4C5A60]" aria-hidden="true">
          <Search class="w-[18px] h-[18px]" />
        </span>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="search"
          aria-label="Tìm yêu cầu tư vấn"
          placeholder="Tìm theo tên, SĐT, email hoặc tên khóa học…"
          class="w-full h-[46px] box-border border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] pl-[42px] pr-9 text-[15px] bg-white text-[#1D2A2E] placeholder:text-[#8C989C] focus:outline-none transition-colors"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          type="button"
          class="absolute right-3 text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
          title="Xóa tìm kiếm"
        >
          ✕
        </button>
      </label>

      <!-- Status Filter Tabs (Giống tabs trạng thái Khóa học) -->
      <div
        role="group"
        aria-label="Lọc trạng thái"
        class="flex gap-1.5 bg-white border border-[#E5E0D7] rounded-[12px] p-1 shadow-xs overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none shrink-0"
      >
        <button
          type="button"
          @click="setStatusFilter('')"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors',
            statusFilter === ''
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Tất cả ({{ stats.total }})
        </button>

        <button
          type="button"
          @click="setStatusFilter('New')"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors flex items-center gap-1.5',
            statusFilter === 'New'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          <span>Mới ({{ stats.new }})</span>
          <span v-if="stats.new > 0" class="w-2 h-2 rounded-full bg-[#E8873A]"></span>
        </button>

        <button
          type="button"
          @click="setStatusFilter('Contacted')"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors',
            statusFilter === 'Contacted'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Đã liên hệ ({{ stats.contacted }})
        </button>

        <button
          type="button"
          @click="setStatusFilter('Completed')"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors',
            statusFilter === 'Completed'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Hoàn tất ({{ stats.completed }})
        </button>
      </div>
    </div>

    <!-- Table Container (Chuẩn phong cách EngNest / Khóa học) -->
    <div class="bg-white border border-[#E5E0D7] rounded-[16px] overflow-x-auto shadow-xs">
      <table class="w-full min-w-[960px] border-collapse text-[15px]">
        <thead>
          <tr class="text-[#4C5A60] border-b border-[#E5E0D7] bg-[#FAF7F2]">
            <th class="py-3 px-4 font-semibold text-left">Khách hàng</th>
            <th class="py-3 px-3 font-semibold text-left">Số điện thoại</th>
            <th class="py-3 px-3 font-semibold text-left">Khóa học quan tâm</th>
            <th class="py-3 px-3 font-semibold text-left">Nguồn đầu vào</th>
            <th class="py-3 px-3 font-semibold text-left">Trạng thái</th>
            <th class="py-3 px-3 font-semibold text-left">Ghi chú</th>
            <th class="py-3 px-3 font-semibold text-left">Thời gian</th>
            <th class="py-3 px-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <!-- Loading State -->
          <template v-if="isLoading">
            <tr
              v-for="i in 4"
              :key="'skeleton-' + i"
              class="border-b border-[#EFEBE4] animate-pulse"
            >
              <td class="p-3.5 px-4">
                <div class="space-y-1.5">
                  <div class="h-4 bg-[#ECE7DE] rounded w-32"></div>
                  <div class="h-3 bg-[#ECE7DE] rounded w-44"></div>
                </div>
              </td>
              <td class="p-3.5 px-3">
                <div class="h-4 bg-[#ECE7DE] rounded w-28"></div>
              </td>
              <td class="p-3.5 px-3">
                <div class="h-4 bg-[#ECE7DE] rounded w-40"></div>
              </td>
              <td class="p-3.5 px-3">
                <div class="h-5 bg-[#ECE7DE] rounded-full w-20"></div>
              </td>
              <td class="p-3.5 px-3">
                <div class="h-8 bg-[#ECE7DE] rounded w-28"></div>
              </td>
              <td class="p-3.5 px-3">
                <div class="h-4 bg-[#ECE7DE] rounded w-32"></div>
              </td>
              <td class="p-3.5 px-3">
                <div class="h-4 bg-[#ECE7DE] rounded w-24"></div>
              </td>
              <td class="p-3.5 px-4 text-right">
                <div class="h-7 w-7 bg-[#ECE7DE] rounded ml-auto"></div>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else-if="leads.length === 0" class="text-center">
            <td colspan="8" class="py-12 text-[#8C989C]">
              Không tìm thấy yêu cầu tư vấn nào phù hợp.
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-else
            v-for="lead in leads"
            :key="lead.id"
            class="border-b border-[#EFEBE4] hover:bg-[#FAF7F2]/60 transition-colors"
          >
            <!-- Khách hàng -->
            <td class="py-3.5 px-4">
              <div class="font-bold text-[#1D2A2E] leading-snug">{{ lead.full_name }}</div>
              <div v-if="lead.email" class="text-[13px] text-[#4C5A60] mt-0.5">{{ lead.email }}</div>
            </td>

            <!-- Số điện thoại -->
            <td class="py-3.5 px-3 font-mono font-medium text-[#1D2A2E]">
              <a
                :href="`tel:${lead.phone}`"
                class="hover:text-[#0B6E6E] hover:underline"
                title="Bấm để gọi"
              >
                {{ lead.phone }}
              </a>
            </td>

            <!-- Khóa học quan tâm -->
            <td class="py-3.5 px-3 font-medium text-[#1D2A2E] max-w-[240px]">
              <div class="truncate" :title="lead.course_title || lead.course_name">
                {{ lead.course_title || lead.course_name || 'Tư vấn lộ trình học' }}
              </div>
            </td>

            <!-- Nguồn đầu vào -->
            <td class="py-3.5 px-3">
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#EAE6DE] text-[#1D2A2E]">
                {{ formatLeadSource(lead.utm_source) }}
              </span>
              <div v-if="lead.utm_campaign" class="text-[11px] text-[#78888D] font-mono mt-0.5">
                {{ lead.utm_campaign }}
              </div>
            </td>

            <!-- Trạng thái xử lý -->
            <td class="py-3.5 px-3">
              <select
                :value="lead.status"
                @change="handleStatusChange(lead, ($event.target as HTMLSelectElement).value as LeadStatus)"
                class="h-[34px] px-2.5 rounded-[8px] border border-[#D8D2C7] bg-white text-[13.5px] font-medium text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E] cursor-pointer"
              >
                <option value="New">Mới</option>
                <option value="Contacted">Đã liên hệ</option>
                <option value="Completed">Hoàn tất</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </td>

            <!-- Ghi chú -->
            <td class="py-3.5 px-3 max-w-[220px]">
              <button
                @click="openNoteModal(lead)"
                type="button"
                class="text-left text-[13.5px] transition-colors truncate block w-full cursor-pointer group"
                :title="lead.notes || lead.message || 'Bấm để thêm ghi chú'"
              >
                <span v-if="lead.notes" class="text-[#1D2A2E] group-hover:text-[#0B6E6E] group-hover:underline">
                  {{ lead.notes }}
                </span>
                <span v-else-if="lead.message" class="text-[#4C5A60] italic group-hover:text-[#0B6E6E]">
                  "{{ lead.message }}"
                </span>
                <span v-else class="text-[#A1ADB1] group-hover:text-[#0B6E6E]">
                  — <span class="text-[12px] opacity-0 group-hover:opacity-100 transition-opacity ml-1">+ Ghi chú</span>
                </span>
              </button>
            </td>

            <!-- Thời gian -->
            <td class="py-3.5 px-3 text-[13.5px] text-[#78888D] whitespace-nowrap">
              {{ formatDateTime(lead.created_at) }}
            </td>

            <!-- Thao tác -->
            <td class="py-3.5 px-4 text-right">
              <button
                @click="handleDelete(lead)"
                type="button"
                class="p-1.5 text-[#8C989C] hover:text-red-600 hover:bg-[#FAF7F2] rounded-[6px] transition-colors cursor-pointer"
                title="Xóa yêu cầu"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Simple Note Modal -->
    <div
      v-if="editingLead"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div class="bg-white rounded-[16px] border border-[#E5E0D7] shadow-xl max-w-md w-full p-6 space-y-4 text-[#1D2A2E]">
        <div class="flex items-center justify-between pb-3 border-b border-[#E5E0D7]">
          <div>
            <h3 class="m-0 font-serif font-bold text-[20px] text-[#1D2A2E]">
              Ghi chú tư vấn
            </h3>
            <p class="m-0 text-[13px] text-[#4C5A60] mt-0.5">
              {{ editingLead.full_name }} — {{ editingLead.phone }}
            </p>
          </div>
          <button
            @click="editingLead = null"
            class="text-[#8C989C] hover:text-[#1D2A2E] text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <!-- Lời nhắn từ khách nếu có -->
        <div v-if="editingLead.message" class="p-3 bg-[#FAF7F2] rounded-[10px] border border-[#E5E0D7] text-[13px]">
          <span class="font-semibold text-[#1D2A2E]">Ghi chú / Lời nhắn từ khách:</span>
          <p class="m-0 text-[#4C5A60] mt-1 italic leading-relaxed">"{{ editingLead.message }}"</p>
        </div>

        <div>
          <label class="block text-[13px] font-semibold text-[#4C5A60] mb-1.5">
            Ghi chú trao đổi & kết quả tư vấn:
          </label>
          <textarea
            v-model="leadNoteText"
            rows="3"
            placeholder="VD: Đã gọi lần 1 lúc 10h, hẹn chiều thứ Sáu gọi lại chốt lộ trình..."
            class="w-full p-3 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] text-[14px] bg-white text-[#1D2A2E] focus:outline-none transition-colors"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button
            @click="editingLead = null"
            class="h-10 px-4 rounded-[10px] text-[14px] font-semibold text-[#4C5A60] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            @click="saveNote"
            :disabled="isSavingNote"
            class="h-10 px-5 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[14px] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {{ isSavingNote ? 'Đang lưu...' : 'Lưu ghi chú' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import { RotateCcw, Search, Trash2 } from "lucide-vue-next";
import { formatDateTime } from "@shared/utils/date.utils";
import { leadApi, type LeadStats } from "../api/lead.api";
import type { ConsultationLead, LeadStatus } from "../types/lead.types";

const toast = inject<any>("toast", {
  success: (m: string) => console.log(m),
  error: (m: string) => console.error(m),
});

const leads = ref<ConsultationLead[]>([]);
const isLoading = ref(false);
const searchQuery = ref("");

function formatLeadSource(src?: string | null): string {
  if (!src) return 'Trang chủ';
  const s = src.toLowerCase().trim();
  if (s.includes('vercel.com') || s.includes('vercel.app') || s.includes('localhost')) {
    return 'Trang chủ';
  }
  return src;
}

const statusFilter = ref("");

// Stats State (Hiển thị ngay trên các Tabs lọc)
const stats = ref<LeadStats>({
  total: 0,
  new: 0,
  contacted: 0,
  completed: 0,
});

// Note Modal State
const editingLead = ref<ConsultationLead | null>(null);
const leadNoteText = ref("");
const isSavingNote = ref(false);

let searchTimer: ReturnType<typeof setTimeout> | null = null;
function handleSearch() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    fetchLeads();
  }, 350);
}

function clearSearch() {
  searchQuery.value = "";
  fetchLeads();
}

function setStatusFilter(val: string) {
  statusFilter.value = val;
  fetchLeads();
}

async function fetchLeads() {
  isLoading.value = true;
  try {
    const params: { status?: string; search?: string } = {};
    if (statusFilter.value) params.status = statusFilter.value;
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim();

    const res = await leadApi.getLeads(params);
    leads.value = res.items;
    if (res.stats) {
      stats.value = res.stats;
    }
  } catch (err: any) {
    console.error("Failed to load leads", err);
    toast.error("Không thể tải danh sách: " + (err.message || "Lỗi kết nối"));
  } finally {
    isLoading.value = false;
  }
}

async function handleStatusChange(lead: ConsultationLead, newStatus: LeadStatus) {
  const prev = lead.status;
  lead.status = newStatus;
  try {
    await leadApi.updateLeadStatus(lead.id, newStatus);
    toast.success("Đã cập nhật trạng thái");
    fetchLeads();
  } catch (err: any) {
    lead.status = prev;
    toast.error("Lỗi khi cập nhật trạng thái");
  }
}

function openNoteModal(lead: ConsultationLead) {
  editingLead.value = lead;
  leadNoteText.value = lead.notes || "";
}

async function saveNote() {
  if (!editingLead.value) return;
  isSavingNote.value = true;
  try {
    await leadApi.updateLeadStatus(
      editingLead.value.id,
      editingLead.value.status,
      leadNoteText.value.trim(),
    );
    editingLead.value.notes = leadNoteText.value.trim();
    toast.success("Đã lưu ghi chú");
    editingLead.value = null;
  } catch (err: any) {
    toast.error("Lỗi khi lưu ghi chú");
  } finally {
    isSavingNote.value = false;
  }
}

async function handleDelete(lead: ConsultationLead) {
  if (!confirm(`Xác nhận xóa yêu cầu tư vấn của "${lead.full_name}"?`)) return;
  try {
    await leadApi.deleteLead(lead.id);
    leads.value = leads.value.filter((l) => l.id !== lead.id);
    toast.success("Đã xóa");
    fetchLeads();
  } catch (err: any) {
    toast.error("Không thể xóa");
  }
}

onMounted(() => {
  fetchLeads();
});
</script>
