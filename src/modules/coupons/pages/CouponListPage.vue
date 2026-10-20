<template>
  <div class="p-6 md:p-8 pb-14 flex flex-col gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="m-0 font-serif font-bold text-[32px] text-[#1D2A2E] leading-tight">
          Mã giảm giá
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px] mt-0.5">
          Tạo và quản lý các chương trình ưu đãi, kiểm soát giới hạn lượt dùng và mức giảm giá khóa học.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="openCreateModal"
          class="h-[46px] px-5 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[15px] inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Thêm mã giảm giá</span>
        </button>
      </div>
    </div>

    <!-- Coupons Table -->
    <div class="bg-white border border-[#E5E0D7] rounded-[16px] overflow-x-auto shadow-xs">
      <table class="w-full min-w-[800px] border-collapse text-[15px]">
        <thead>
          <tr class="text-[#4C5A60] border-b border-[#E5E0D7] bg-[#FAF7F2]">
            <th class="py-3 px-4 font-semibold text-left">Mã Coupon</th>
            <th class="py-3 px-3 font-semibold text-left">Loại giảm</th>
            <th class="py-3 px-3 font-semibold text-left">Mức giảm</th>
            <th class="py-3 px-3 font-semibold text-left">Lượt dùng</th>
            <th class="py-3 px-3 font-semibold text-left">Trạng thái</th>
            <th class="py-3 px-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="coupons.length === 0" class="text-center">
            <td colspan="6" class="py-12 text-[#8C989C]">Chưa có mã giảm giá nào.</td>
          </tr>
          <tr
            v-else
            v-for="coupon in coupons"
            :key="coupon.id"
            class="border-b border-[#EFEBE4] hover:bg-[#FAF7F2]/60 transition-colors"
          >
            <td class="py-3.5 px-4 font-mono font-bold text-[#0B6E6E] text-[15px]">
              {{ coupon.code }}
            </td>
            <td class="py-3.5 px-3">
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#EAE6DE] text-[#1D2A2E]">
                {{ coupon.discount_type === 'Percentage' ? 'Phần trăm (%)' : 'Số tiền cố định' }}
              </span>
            </td>
            <td class="py-3.5 px-3 font-bold text-[#1D2A2E]">
              {{ coupon.discount_type === 'Percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value) }}
            </td>
            <td class="py-3.5 px-3 text-[#4C5A60]">
              <span class="font-bold text-[#1D2A2E]">{{ coupon.used_count }}</span>
              <span class="text-[#8C989C]"> / {{ coupon.usage_limit || '∞' }}</span>
            </td>
            <td class="py-3.5 px-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-[12px] font-semibold inline-block',
                  coupon.is_active
                    ? 'bg-[#E4F3EA] text-[#155C35]'
                    : 'bg-[#ECE7DE] text-[#78888D]'
                ]"
              >
                {{ coupon.is_active ? 'Đang kích hoạt' : 'Tạm dừng' }}
              </span>
            </td>
            <td class="py-3.5 px-4 text-right">
              <button
                @click="openEditModal(coupon)"
                type="button"
                class="p-1.5 text-[#0B6E6E] hover:bg-[#E6F2F0] rounded-[6px] transition-colors cursor-pointer"
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
