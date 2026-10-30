<template>
  <div class="p-4 sm:p-6 md:p-8 pb-14 flex flex-col gap-4 sm:gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="m-0 font-serif font-bold text-2xl sm:text-[32px] text-[#1D2A2E] leading-tight">
          Quản lý Đơn hàng
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px] mt-0.5">
          Theo dõi lịch sử đơn hàng, đối soát giao dịch VietQR và hỗ trợ gửi lại tài liệu cho học viên.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="fetchOrders"
          :disabled="isLoading"
          class="h-[46px] px-4 rounded-[10px] border-[1.5px] border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#4C5A60] hover:text-[#1D2A2E] cursor-pointer flex items-center gap-2 transition-colors shadow-xs font-semibold text-[15px]"
          title="Tải lại danh sách"
        >
          <RotateCcw :class="['w-4 h-4', isLoading && 'animate-spin text-[#0B6E6E]']" />
          <span>Làm mới</span>
        </button>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="flex flex-wrap gap-3 items-center">
      <!-- Search Input -->
      <label class="flex-1 min-w-0 w-full relative flex items-center">
        <span class="absolute left-3.5 flex text-[#4C5A60]" aria-hidden="true">
          <Search class="w-[18px] h-[18px]" />
        </span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Tìm theo mã đơn, tên, email hoặc SĐT khách hàng…"
          class="w-full h-[46px] box-border border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] pl-[42px] pr-9 text-[15px] bg-white text-[#1D2A2E] placeholder:text-[#8C989C] focus:outline-none transition-colors"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          type="button"
          class="absolute right-3 text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
          title="Xóa tìm kiếm"
        >
          ✕
        </button>
      </label>

      <!-- Status Filter Tabs -->
      <div
        role="group"
        aria-label="Lọc trạng thái"
        class="flex gap-1.5 bg-white border border-[#E5E0D7] rounded-[12px] p-1 shadow-xs overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none shrink-0"
      >
        <button
          type="button"
          @click="statusFilter = ''"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors',
            statusFilter === ''
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Tất cả ({{ orders.length }})
        </button>

        <button
          type="button"
          @click="statusFilter = 'Paid'"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors',
            statusFilter === 'Paid'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Đã thanh toán ({{ paidCount }})
        </button>

        <button
          type="button"
          @click="statusFilter = 'Pending'"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors',
            statusFilter === 'Pending'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Chờ thanh toán ({{ pendingCount }})
        </button>

        <button
          type="button"
          @click="statusFilter = 'Expired'"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors',
            statusFilter === 'Expired'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Hết hạn ({{ expiredCount }})
        </button>

        <button
          type="button"
          @click="statusFilter = 'Cancelled'"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[14px] cursor-pointer transition-colors',
            statusFilter === 'Cancelled'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Đã hủy ({{ cancelledCount }})
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white border border-[#E5E0D7] rounded-[16px] overflow-x-auto shadow-xs">
      <table class="w-full min-w-[960px] border-collapse text-[15px]">
        <thead>
          <tr class="text-[#4C5A60] border-b border-[#E5E0D7] bg-[#FAF7F2]">
            <th class="py-3 px-4 font-semibold text-left">Mã đơn hàng</th>
            <th class="py-3 px-3 font-semibold text-left">Khách hàng</th>
            <th class="py-3 px-3 font-semibold text-left">Khóa học</th>
            <th class="py-3 px-3 font-semibold text-left">Tổng thanh toán</th>
            <th class="py-3 px-3 font-semibold text-left">Trạng thái</th>
            <th class="py-3 px-3 font-semibold text-left">Thời gian</th>
            <th class="py-3 px-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading skeleton -->
          <template v-if="isLoading">
            <tr
              v-for="i in 4"
              :key="'skeleton-' + i"
              class="border-b border-[#EFEBE4] animate-pulse"
            >
              <td class="p-3.5 px-4"><div class="h-4 bg-[#ECE7DE] rounded w-24"></div></td>
              <td class="p-3.5 px-3">
                <div class="space-y-1">
                  <div class="h-4 bg-[#ECE7DE] rounded w-32"></div>
                  <div class="h-3 bg-[#ECE7DE] rounded w-44"></div>
                </div>
              </td>
              <td class="p-3.5 px-3"><div class="h-4 bg-[#ECE7DE] rounded w-40"></div></td>
              <td class="p-3.5 px-3"><div class="h-4 bg-[#ECE7DE] rounded w-24"></div></td>
              <td class="p-3.5 px-3"><div class="h-6 bg-[#ECE7DE] rounded-full w-24"></div></td>
              <td class="p-3.5 px-3"><div class="h-4 bg-[#ECE7DE] rounded w-28"></div></td>
              <td class="p-3.5 px-4 text-right"><div class="h-8 bg-[#ECE7DE] rounded w-20 ml-auto"></div></td>
            </tr>
          </template>

          <tr v-else-if="filteredOrders.length === 0" class="text-center">
            <td colspan="7" class="py-12 text-[#8C989C]">Không tìm thấy đơn hàng nào.</td>
          </tr>

          <tr
            v-else
            v-for="order in paginatedOrders"
            :key="order.id"
            class="border-b border-[#EFEBE4] hover:bg-[#FAF7F2]/60 transition-colors"
          >
            <!-- Mã đơn hàng -->
            <td class="py-3.5 px-4 font-mono font-bold text-[#1D2A2E]">
              {{ order.order_code }}
            </td>

            <!-- Khách hàng -->
            <td class="py-3.5 px-3">
              <div class="font-bold text-[#1D2A2E] leading-snug">{{ order.customer_name }}</div>
              <div class="text-[13px] text-[#4C5A60] mt-0.5">{{ order.customer_email }}</div>
              <div class="text-[12px] text-[#78888D] font-mono mt-0.5">{{ order.customer_phone }}</div>
            </td>

            <!-- Khóa học -->
            <td class="py-3.5 px-3">
              <div class="font-medium text-[#1D2A2E] max-w-[220px] truncate" :title="order.course_title">
                {{ order.course_title }}
              </div>
              <div v-if="order.coupon_code" class="text-[12px] text-[#0B6E6E] font-semibold mt-0.5">
                Mã: {{ order.coupon_code }} (-{{ formatCurrency(order.discount_amount) }})
              </div>
            </td>

            <!-- Tổng thanh toán -->
            <td class="py-3.5 px-3">
              <div class="font-bold text-[#1D2A2E] text-[16px]">
                {{ formatCurrency(order.final_amount) }}
              </div>
            </td>

            <!-- Trạng thái -->
            <td class="py-3.5 px-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-[12px] font-semibold inline-block',
                  order.status === 'Paid'
                    ? 'bg-[#E4F3EA] text-[#155C35]'
                    : order.status === 'Pending'
                    ? 'bg-[#FEF3EB] text-[#B25E09]'
                    : order.status === 'Cancelled'
                    ? 'bg-[#FEE2E2] text-[#991B1B]'
                    : 'bg-[#ECE7DE] text-[#4C5A60]'
                ]"
              >
                {{ order.status === 'Paid' ? 'Đã thanh toán' : (order.status === 'Pending' ? 'Chờ thanh toán' : (order.status === 'Expired' ? 'Hết hạn' : 'Đã hủy')) }}
              </span>
            </td>

            <!-- Thời gian -->
            <td class="py-3.5 px-3 text-[13.5px] text-[#78888D] whitespace-nowrap">
              {{ formatDateTime(order.created_at) }}
            </td>

            <!-- Thao tác -->
            <td class="py-3.5 px-4 text-right">
              <!-- BR-05: Resend button active ONLY when status is Paid -->
              <button
                type="button"
                :disabled="order.status !== 'Paid'"
                @click="openResendModal(order)"
                :class="[
                  'h-8 px-3 rounded-[8px] font-semibold text-[13px] inline-flex items-center gap-1.5 transition-colors',
                  order.status === 'Paid'
                    ? 'border border-[#0B6E6E] bg-white text-[#0B6E6E] hover:bg-[#E6F2F0] cursor-pointer'
                    : 'border border-[#D8D2C7] bg-[#FAF7F2] text-[#8C989C] cursor-not-allowed opacity-60'
                ]"
                :title="order.status === 'Paid' ? 'Gửi lại tài liệu qua Email' : 'Chỉ gửi lại khi đơn hàng ĐÃ THANH TOÁN (BR-05)'"
              >
                <Send class="w-3.5 h-3.5" />
                <span>Gửi lại</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls (M4) -->
    <div
      v-if="filteredOrders.length > 0"
      class="flex flex-wrap items-center justify-between gap-4 py-3 px-1 border-t border-[#E5E0D7] text-[14px] text-[#4C5A60]"
    >
      <div>
        Hiển thị <span class="font-semibold text-[#1D2A2E]">{{ (currentPage - 1) * pageSize + 1 }}</span> –
        <span class="font-semibold text-[#1D2A2E]">{{ Math.min(currentPage * pageSize, filteredOrders.length) }}</span>
        trên tổng số <span class="font-semibold text-[#1D2A2E]">{{ filteredOrders.length }}</span> đơn hàng
      </div>

      <div class="flex items-center gap-1.5">
        <button
          type="button"
          :disabled="currentPage <= 1"
          @click="currentPage--"
          class="h-9 px-3 rounded-lg border border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#1D2A2E] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          ← Trang trước
        </button>

        <span class="px-2 font-medium text-[#1D2A2E]">
          Trang {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          type="button"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
          class="h-9 px-3 rounded-lg border border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#1D2A2E] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Trang sau →
        </button>
      </div>
    </div>

    <!-- Resend Email Confirmation Modal (BR-06) -->
    <ResendConfirmModal
      :is-open="isModalOpen"
      :order="selectedOrder"
      @close="isModalOpen = false"
      @success="handleResendSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Search, RotateCcw, Send } from "lucide-vue-next";
import { formatCurrency } from "@shared/utils";
import { formatDateTime } from "@shared/utils/date.utils";
import { orderApi } from "../api/order.api";
import type { Order } from "../types/order.types";
import ResendConfirmModal from "../components/ResendConfirmModal.vue";

const orders = ref<Order[]>([]);
const isLoading = ref(false);
const searchQuery = ref("");
const statusFilter = ref("");

const isModalOpen = ref(false);
const selectedOrder = ref<Order | null>(null);

const paidCount = computed(() => orders.value.filter((o) => o.status === "Paid").length);
const pendingCount = computed(() => orders.value.filter((o) => o.status === "Pending").length);
const cancelledCount = computed(() => orders.value.filter((o) => o.status === "Cancelled").length);
const expiredCount = computed(() => orders.value.filter((o) => o.status === "Expired").length);

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const matchSearch =
      !searchQuery.value ||
      (o.order_code || "").toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (o.customer_name || "").toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (o.customer_email || "").toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (o.customer_phone || "").includes(searchQuery.value);
    const matchStatus = !statusFilter.value || o.status === statusFilter.value;
    return matchSearch && matchStatus;
  });
});

const currentPage = ref(1);
const pageSize = ref(10);

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / pageSize.value) || 1;
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredOrders.value.slice(start, start + pageSize.value);
});

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

async function fetchOrders() {
  isLoading.value = true;
  try {
    const res = await orderApi.getOrders();
    orders.value = res.items;
  } catch (err) {
    console.error("Failed to fetch orders", err);
  } finally {
    isLoading.value = false;
  }
}

function openResendModal(order: Order) {
  selectedOrder.value = order;
  isModalOpen.value = true;
}

function handleResendSuccess() {
  alert("Gửi lại email thành công! Đã ghi log hệ thống.");
  fetchOrders();
}

onMounted(() => {
  fetchOrders();
});
</script>
