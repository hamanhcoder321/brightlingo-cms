<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Quản lý Đơn hàng</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Theo dõi lịch sử đơn hàng, đối soát giao dịch VietQR và hỗ trợ gửi lại tài liệu cho học viên.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="fetchOrders"
          class="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          Làm mới
        </button>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm theo mã đơn, tên, email hoặc SĐT khách hàng..."
          class="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="statusFilter"
          class="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Paid">Đã thanh toán (Paid)</option>
          <option value="Pending">Chờ thanh toán (Pending)</option>
          <option value="Cancelled">Đã hủy (Cancelled)</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4">Mã đơn hàng</th>
              <th class="py-3 px-4">Khách hàng</th>
              <th class="py-3 px-4">Khóa học</th>
              <th class="py-3 px-4">Tổng thanh toán</th>
              <th class="py-3 px-4">Trạng thái</th>
              <th class="py-3 px-4">Thời gian</th>
              <th class="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="isLoading" class="text-center">
              <td colspan="7" class="py-8 text-slate-400">Đang tải danh sách đơn hàng...</td>
            </tr>
            <tr v-else-if="filteredOrders.length === 0" class="text-center">
              <td colspan="7" class="py-8 text-slate-400">Không tìm thấy đơn hàng nào.</td>
            </tr>
            <tr
              v-else
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="py-3 px-4 font-mono font-bold text-slate-900">
                {{ order.order_code }}
              </td>
              <td class="py-3 px-4">
                <div class="font-semibold text-slate-800">{{ order.customer_name }}</div>
                <div class="text-[11px] text-slate-500">{{ order.customer_email }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ order.customer_phone }}</div>
              </td>
              <td class="py-3 px-4">
                <div class="font-medium text-slate-800 max-w-[200px] truncate" :title="order.course_title">
                  {{ order.course_title }}
                </div>
                <div v-if="order.coupon_code" class="text-[10px] text-pink-600 font-semibold">
                  Mã: {{ order.coupon_code }} (-{{ formatCurrency(order.discount_amount) }})
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900">{{ formatCurrency(order.final_amount) }}</div>
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block',
                    order.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : order.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  ]"
                >
                  {{ order.status === 'Paid' ? 'Đã thanh toán' : (order.status === 'Pending' ? 'Chờ thanh toán' : 'Đã hủy') }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-500">
                {{ formatDateTime(order.created_at) }}
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <!-- BR-05: Resend button active ONLY when status is Paid -->
                <button
                  :disabled="order.status !== 'Paid'"
                  @click="openResendModal(order)"
                  :class="[
                    'px-2.5 py-1 rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1',
                    order.status === 'Paid'
                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  ]"
                  :title="order.status === 'Paid' ? 'Gửi lại tài liệu qua Email' : 'Chỉ gửi lại khi đơn hàng ĐÃ THANH TOÁN (BR-05)'"
                >
                  <Send class="w-3 h-3" />
                  Gửi lại
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
import { ref, computed, onMounted } from "vue";
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

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const matchSearch =
      !searchQuery.value ||
      o.order_code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.customer_phone.includes(searchQuery.value);
    const matchStatus = !statusFilter.value || o.status === statusFilter.value;
    return matchSearch && matchStatus;
  });
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
