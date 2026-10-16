<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Quản lý Mã giảm giá (Coupons)</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Tạo và quản lý các chương trình ưu đãi, kiểm soát giới hạn lượt dùng và mức giảm.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
      >
        <Plus class="w-4 h-4" />
        Thêm coupon mới
      </button>
    </div>

    <!-- Coupons Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
          <tr>
            <th class="py-3 px-4">Mã Coupon</th>
            <th class="py-3 px-4">Loại giảm</th>
            <th class="py-3 px-4">Mức giảm</th>
            <th class="py-3 px-4">Lượt dùng</th>
            <th class="py-3 px-4">Trạng thái</th>
            <th class="py-3 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="coupons.length === 0" class="text-center">
            <td colspan="6" class="py-8 text-slate-400">Chưa có mã giảm giá nào.</td>
          </tr>
          <tr v-for="coupon in coupons" :key="coupon.id" class="hover:bg-slate-50/70 transition-colors">
            <td class="py-3 px-4 font-mono font-bold text-indigo-700 text-sm">
              {{ coupon.code }}
            </td>
            <td class="py-3 px-4">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                {{ coupon.discount_type === 'Percentage' ? 'Phần trăm (%)' : 'Số tiền cố định' }}
              </span>
            </td>
            <td class="py-3 px-4 font-bold text-slate-900">
              {{ coupon.discount_type === 'Percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value) }}
            </td>
            <td class="py-3 px-4 text-slate-600">
              <span class="font-bold text-slate-800">{{ coupon.used_count }}</span>
              <span class="text-slate-400"> / {{ coupon.usage_limit || '∞' }}</span>
            </td>
            <td class="py-3 px-4">
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block',
                  coupon.is_active
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                ]"
              >
                {{ coupon.is_active ? 'Đang kích hoạt' : 'Tạm dừng' }}
              </span>
            </td>
            <td class="py-3 px-4 text-right space-x-1">
              <button
                @click="openEditModal(coupon)"
                class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                title="Chỉnh sửa"
              >
                <Pencil class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Coupon Modal -->
    <CouponFormModal
      :is-open="isModalOpen"
      :coupon="selectedCoupon"
      @close="isModalOpen = false"
      @success="fetchCoupons"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Plus, Pencil } from "lucide-vue-next";
import { formatCurrency } from "@shared/utils";
import { couponApi } from "../api/coupon.api";
import type { Coupon } from "../types/coupon.types";
import CouponFormModal from "../components/CouponFormModal.vue";

const coupons = ref<Coupon[]>([]);
const isModalOpen = ref(false);
const selectedCoupon = ref<Coupon | null>(null);

async function fetchCoupons() {
  try {
    const res = await couponApi.getCoupons();
    coupons.value = res.items;
  } catch (err) {
    console.error("Failed to load coupons", err);
  }
}

function openCreateModal() {
  selectedCoupon.value = null;
  isModalOpen.value = true;
}

function openEditModal(c: Coupon) {
  selectedCoupon.value = c;
  isModalOpen.value = true;
}

onMounted(() => {
  fetchCoupons();
});
</script>
