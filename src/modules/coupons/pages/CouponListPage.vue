<template>
  <div class="p-4 md:p-8 pb-16 flex flex-col gap-6 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="m-0 font-serif font-bold text-[28px] md:text-[32px] text-[#1D2A2E] leading-tight">
            Mã giảm giá
          </h1>
          <span class="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#0B6E6E]/10 text-[#0B6E6E]">
            {{ totalCoupons }} mã
          </span>
        </div>
        <p class="m-0 text-[#78888D] text-[14px] mt-1">
          Quản lý tập trung mã khuyến mãi, thiết lập áp dụng cho toàn khóa hoặc từng khóa, kiểm soát trạng thái đóng/bật.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="openCreateModal"
          class="h-[46px] px-5 rounded-[12px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[14px] inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Thêm mã giảm giá</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <div class="p-4 rounded-[16px] bg-white border border-[#E5E0D7] shadow-2xs flex flex-col gap-1">
        <span class="text-[12px] font-medium text-[#78888D]">Tổng số mã</span>
        <span class="font-serif font-bold text-[24px] text-[#1D2A2E]">{{ totalCoupons }}</span>
      </div>

      <div class="p-4 rounded-[16px] bg-white border border-[#E5E0D7] shadow-2xs flex flex-col gap-1">
        <span class="text-[12px] font-medium text-emerald-600 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Đang bật (Hoạt động)
        </span>
        <span class="font-serif font-bold text-[24px] text-emerald-700">{{ activeCouponsCount }}</span>
      </div>

      <div class="p-4 rounded-[16px] bg-white border border-[#E5E0D7] shadow-2xs flex flex-col gap-1">
        <span class="text-[12px] font-medium text-slate-500 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-slate-400"></span>
          Đang đóng (Tạm dừng)
        </span>
        <span class="font-serif font-bold text-[24px] text-slate-700">{{ inactiveCouponsCount }}</span>
      </div>

      <div class="p-4 rounded-[16px] bg-white border border-[#E5E0D7] shadow-2xs flex flex-col gap-1">
        <span class="text-[12px] font-medium text-[#0B6E6E]">Tổng lượt đã dùng</span>
        <span class="font-serif font-bold text-[24px] text-[#0B6E6E]">{{ totalUsedCount }}</span>
      </div>
    </div>

    <!-- Toolbar: Search & Filters -->
    <div class="p-4 rounded-[16px] bg-white border border-[#E5E0D7] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div class="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <Search class="w-4 h-4 text-[#78888D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Tìm theo mã coupon, ghi chú..."
            class="w-full h-[40px] pl-9 pr-3.5 rounded-[10px] border border-[#D5DCDE] bg-white text-[13px] text-[#1D2A2E] placeholder-[#AEB8BB] focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all"
          />
        </div>

        <!-- Filter Status -->
        <select
          v-model="statusFilter"
          @change="fetchCoupons"
          class="h-[40px] px-3 rounded-[10px] border border-[#D5DCDE] bg-white text-[13px] font-medium text-[#1D2A2E] focus:border-[#0B6E6E] focus:outline-hidden cursor-pointer"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang bật (Hoạt động)</option>
          <option value="INACTIVE">Đang đóng (Tạm dừng)</option>
        </select>

        <!-- Filter Scope -->
        <select
          v-model="scopeFilter"
          @change="fetchCoupons"
          class="h-[40px] px-3 rounded-[10px] border border-[#D5DCDE] bg-white text-[13px] font-medium text-[#1D2A2E] focus:border-[#0B6E6E] focus:outline-hidden cursor-pointer"
        >
          <option value="ALL">Tất cả phạm vi</option>
          <option value="TOAN_KHOA">Áp dụng toàn khóa</option>
          <option value="SPECIFIC">Khóa học cụ thể</option>
        </select>
      </div>

      <button
        type="button"
        @click="fetchCoupons"
        :disabled="isLoading"
        class="h-[40px] px-3.5 rounded-[10px] border border-[#D5DCDE] hover:bg-[#FAF7F2] text-[#4C5A60] text-[13px] font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
      >
        <RefreshCw :class="['w-3.5 h-3.5', isLoading && 'animate-spin']" />
        <span>Làm mới</span>
      </button>
    </div>

    <!-- Coupons Table -->
    <div class="bg-white border border-[#E5E0D7] rounded-[18px] overflow-hidden shadow-2xs">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px] border-collapse text-[14px]">
          <thead>
            <tr class="text-[#4C5A60] border-b border-[#E5E0D7] bg-[#FAF7F2]">
              <th class="py-3.5 px-5 font-semibold text-left">Mã giảm giá</th>
              <th class="py-3.5 px-4 font-semibold text-left">Mức chiết khấu</th>
              <th class="py-3.5 px-4 font-semibold text-left">Phạm vi áp dụng</th>
              <th class="py-3.5 px-4 font-semibold text-left">Lượt sử dụng</th>
              <th class="py-3.5 px-4 font-semibold text-left">Thời hạn</th>
              <th class="py-3.5 px-4 font-semibold text-center">Trạng thái (Đóng/Bật)</th>
              <th class="py-3.5 px-5 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="py-16 text-center text-[#78888D]">
                <div class="flex flex-col items-center justify-center gap-2">
                  <div class="w-6 h-6 border-2 border-[#0B6E6E]/30 border-t-[#0B6E6E] rounded-full animate-spin"></div>
                  <span>Đang tải danh sách mã giảm giá...</span>
                </div>
              </td>
            </tr>

            <tr v-else-if="coupons.length === 0">
              <td colspan="7" class="py-16 text-center text-[#78888D]">
                <div class="flex flex-col items-center justify-center gap-2">
                  <Ticket class="w-10 h-10 text-[#D5DCDE]" />
                  <p class="m-0 font-semibold text-[#1D2A2E]">Chưa tìm thấy mã giảm giá nào</p>
                  <p class="m-0 text-[13px] text-[#78888D]">
                    Hãy tạo mã giảm giá đầu tiên để áp dụng cho các khóa học của bạn.
                  </p>
                  <button
                    type="button"
                    @click="openCreateModal"
                    class="mt-2 px-4 py-2 rounded-[10px] bg-[#0B6E6E] text-white text-[13px] font-semibold hover:bg-[#08585A] transition-colors cursor-pointer"
                  >
                    + Tạo mã mới
                  </button>
                </div>
              </td>
            </tr>

            <tr
              v-else
              v-for="coupon in coupons"
              :key="coupon.id"
              class="border-b border-[#EFEBE4] hover:bg-[#FAF7F2]/60 transition-colors"
            >
              <!-- 1. Mã Coupon -->
              <td class="py-4 px-5">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-[#0B6E6E] text-[15px] px-2.5 py-1 rounded-[8px] bg-[#0B6E6E]/8 border border-[#0B6E6E]/15 tracking-wide">
                      {{ coupon.code }}
                    </span>
                    <button
                      type="button"
                      @click="copyCode(coupon.code)"
                      class="p-1 text-[#78888D] hover:text-[#0B6E6E] hover:bg-[#EAE6DE]/50 rounded-[6px] transition-colors cursor-pointer"
                      title="Sao chép mã"
                    >
                      <Copy class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span v-if="coupon.note" class="text-[12px] text-[#78888D] line-clamp-1" :title="coupon.note">
                    {{ coupon.note }}
                  </span>
                </div>
              </td>

              <!-- 2. Mức chiết khấu -->
              <td class="py-4 px-4">
                <div class="flex flex-col">
                  <span class="font-bold text-[#1D2A2E] text-[15px]">
                    {{ getDiscountDisplay(coupon) }}
                  </span>
                  <span v-if="coupon.max_discount_amount && isPercentType(coupon)" class="text-[11px] text-[#78888D]">
                    Tối đa {{ formatCurrency(coupon.max_discount_amount) }}
                  </span>
                  <span v-if="coupon.min_order_amount" class="text-[11px] text-[#78888D]">
                    Đơn từ {{ formatCurrency(coupon.min_order_amount) }}
                  </span>
                </div>
              </td>

              <!-- 3. Phạm vi áp dụng (Quản lý 1 nơi) -->
              <td class="py-4 px-4">
                <div v-if="coupon.scope === 'ALL'" class="flex items-center gap-1.5">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#E4F3EA] text-[#155C35]">
                    <Layers class="w-3.5 h-3.5" />
                    Toàn bộ khóa học
                  </span>
                </div>

                <div v-else class="flex flex-col gap-1 items-start">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFF3E8] text-[#C25E00]">
                    <BookOpen class="w-3.5 h-3.5" />
                    Từng khóa ({{ coupon.courses?.length || 0 }} khóa)
                  </span>

                  <!-- Danh sách tên khóa học rút gọn -->
                  <div
                    v-if="coupon.courses && coupon.courses.length > 0"
                    class="text-[11px] text-[#78888D] max-w-[220px] truncate"
                    :title="coupon.courses.map((c: any) => c.title).join(', ')"
                  >
                    {{ coupon.courses.map((c: any) => c.title).join(', ') }}
                  </div>
                </div>
              </td>

              <!-- 4. Lượt sử dụng -->
              <td class="py-4 px-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-1 text-[13px]">
                    <span class="font-bold text-[#1D2A2E]">{{ coupon.usage_count || 0 }}</span>
                    <span class="text-[#78888D]">/ {{ coupon.usage_limit ? coupon.usage_limit : '∞' }}</span>
                  </div>
                  <!-- Progress bar if limit exists -->
                  <div v-if="coupon.usage_limit" class="w-24 h-1.5 bg-[#EAE6DE] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-[#0B6E6E] rounded-full transition-all"
                      :style="{ width: `${Math.min(100, Math.round(((coupon.usage_count || 0) / coupon.usage_limit) * 100))}%` }"
                    ></div>
                  </div>
                </div>
              </td>

              <!-- 5. Thời hạn -->
              <td class="py-4 px-4">
                <div class="flex flex-col text-[12px]">
                  <span v-if="coupon.end_date" :class="isExpired(coupon.end_date) ? 'text-rose-600 font-semibold' : 'text-[#1D2A2E]'">
                    {{ formatDate(coupon.end_date) }}
                    <span v-if="isExpired(coupon.end_date)" class="ml-1 text-[11px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">Hết hạn</span>
                  </span>
                  <span v-else class="text-[#78888D]">Vô thời hạn</span>

                  <span v-if="coupon.start_date" class="text-[11px] text-[#78888D]">
                    Từ: {{ formatDate(coupon.start_date) }}
                  </span>
                </div>
              </td>

              <!-- 6. Trạng thái (Đóng, Bật) với Interactive Switch Toggle -->
              <td class="py-4 px-4 text-center">
                <div class="inline-flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    @click="toggleStatus(coupon)"
                    :disabled="togglingId === coupon.id"
                    :class="[
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50',
                      isActiveStatus(coupon) ? 'bg-[#0B6E6E]' : 'bg-[#D5DCDE]'
                    ]"
                    role="switch"
                    :aria-checked="isActiveStatus(coupon)"
                    :title="isActiveStatus(coupon) ? 'Bấm để Đóng mã' : 'Bấm để Bật mã'"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                        isActiveStatus(coupon) ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    />
                  </button>

                  <span
                    :class="[
                      'text-[11px] font-bold px-2 py-0.5 rounded-full leading-none',
                      isActiveStatus(coupon)
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    ]"
                  >
                    {{ isActiveStatus(coupon) ? 'Đang bật' : 'Đã đóng' }}
                  </span>
                </div>
              </td>

              <!-- 7. Thao tác -->
              <td class="py-4 px-5 text-right">
                <div class="inline-flex items-center gap-1.5">
                  <button
                    @click="openEditModal(coupon)"
                    type="button"
                    class="p-2 text-[#0B6E6E] hover:bg-[#E6F2F0] rounded-[8px] transition-colors cursor-pointer"
                    title="Chỉnh sửa mã"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    @click="confirmDelete(coupon)"
                    type="button"
                    class="p-2 text-rose-500 hover:bg-rose-50 rounded-[8px] transition-colors cursor-pointer"
                    title="Xóa mã"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Thêm / Sửa) -->
    <CouponFormModal
      :is-open="isModalOpen"
      :coupon="selectedCoupon"
      @close="isModalOpen = false"
      @success="onModalSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deletingCoupon"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div class="bg-white rounded-[20px] shadow-2xl border border-[#E5E0D7] max-w-sm w-full p-6 flex flex-col gap-4">
        <div class="w-12 h-12 rounded-[14px] bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Trash2 class="w-6 h-6" />
        </div>

        <div class="text-center flex flex-col gap-1">
          <h3 class="m-0 font-serif font-bold text-[18px] text-[#1D2A2E]">
            Xóa mã giảm giá?
          </h3>
          <p class="m-0 text-[#78888D] text-[13px] leading-relaxed">
            Bạn có chắc chắn muốn xóa mã <strong class="text-[#0B6E6E] font-mono">{{ deletingCoupon.code }}</strong>? Mã này sẽ bị ẩn và không thể áp dụng khi thanh toán.
          </p>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            @click="deletingCoupon = null"
            class="flex-1 h-[42px] rounded-[10px] border border-[#D5DCDE] hover:bg-[#FAF7F2] font-semibold text-[#4C5A60] text-[13px] transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            @click="executeDelete"
            :disabled="isDeleting"
            class="flex-1 h-[42px] rounded-[10px] bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[13px] transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ isDeleting ? 'Đang xóa...' : 'Xác nhận xóa' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from "vue";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  Search,
  RefreshCw,
  Ticket,
  Layers,
  BookOpen,
} from "lucide-vue-next";
import { formatCurrency } from "@shared/utils";
import { couponApi } from "../api/coupon.api";
import type { Coupon } from "../types/coupon.types";
import CouponFormModal from "../components/CouponFormModal.vue";

const toast = inject<any>("toast", {
  success: (msg: string) => alert(msg),
  error: (msg: string) => alert(msg),
});

const coupons = ref<Coupon[]>([]);
const totalCoupons = ref(0);
const isLoading = ref(false);
const searchQuery = ref("");
const statusFilter = ref("ALL");
const scopeFilter = ref("ALL");

const isModalOpen = ref(false);
const selectedCoupon = ref<Coupon | null>(null);
const deletingCoupon = ref<Coupon | null>(null);
const isDeleting = ref(false);
const togglingId = ref<string | null>(null);

let debounceSearchTimer: ReturnType<typeof setTimeout> | null = null;

// Thống kê nhanh
const activeCouponsCount = computed(() => {
  return coupons.value.filter((singleCoupon) => isActiveStatus(singleCoupon)).length;
});

const inactiveCouponsCount = computed(() => {
  return coupons.value.filter((singleCoupon) => !isActiveStatus(singleCoupon)).length;
});

const totalUsedCount = computed(() => {
  return coupons.value.reduce(
    (accumulatedTotal, singleCoupon) => accumulatedTotal + (singleCoupon.usage_count || 0),
    0
  );
});

function isActiveStatus(coupon: Coupon): boolean {
  if (coupon.status) {
    return coupon.status === "ACTIVE";
  }
  return coupon.is_active !== false;
}

function isPercentType(coupon: Coupon): boolean {
  return coupon.type === "PERCENT" || coupon.discount_type === "Percentage";
}

function getDiscountDisplay(coupon: Coupon): string {
  const isPercent = isPercentType(coupon);
  const discountNumericalValue = coupon.value ?? coupon.discount_value ?? 0;
  return isPercent ? `${discountNumericalValue}%` : formatCurrency(discountNumericalValue);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const parsedDate = new Date(dateStr);
    return parsedDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isExpired(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    return new Date(dateStr).getTime() < Date.now();
  } catch {
    return false;
  }
}

async function copyCode(couponCodeToCopy: string) {
  try {
    await navigator.clipboard.writeText(couponCodeToCopy);
    toast.success(`Đã sao chép mã: ${couponCodeToCopy}`);
  } catch {
    toast.success(`Mã coupon: ${couponCodeToCopy}`);
  }
}

async function fetchCoupons() {
  isLoading.value = true;
  try {
    const couponQueryParams: Record<string, any> = {};
    if (searchQuery.value.trim()) {
      couponQueryParams.search = searchQuery.value.trim();
    }
    if (statusFilter.value !== "ALL") {
      couponQueryParams.status = statusFilter.value;
    }
    if (scopeFilter.value === "TOAN_KHOA") {
      couponQueryParams.scope = "ALL";
    } else if (scopeFilter.value === "SPECIFIC") {
      couponQueryParams.scope = "SPECIFIC";
    }

    const couponListApiResponse = await couponApi.getCoupons(couponQueryParams);
    coupons.value = couponListApiResponse.items;
    totalCoupons.value = couponListApiResponse.total;
  } catch (error: any) {
    console.error("Failed to load coupons:", error);
    toast.error("Không thể tải danh sách mã giảm giá");
  } finally {
    isLoading.value = false;
  }
}

function onSearchInput() {
  if (debounceSearchTimer) {
    clearTimeout(debounceSearchTimer);
  }
  debounceSearchTimer = setTimeout(() => {
    fetchCoupons();
  }, 350);
}

function openCreateModal() {
  selectedCoupon.value = null;
  isModalOpen.value = true;
}

function openEditModal(couponToEdit: Coupon) {
  selectedCoupon.value = couponToEdit;
  isModalOpen.value = true;
}

function onModalSuccess() {
  toast.success(
    selectedCoupon.value
      ? "Cập nhật mã giảm giá thành công!"
      : "Tạo mã giảm giá mới thành công!"
  );
  fetchCoupons();
}

async function toggleStatus(coupon: Coupon) {
  togglingId.value = coupon.id;
  try {
    const toggleStatusResponse = await couponApi.toggleCouponStatus(coupon.id);
    coupon.status = toggleStatusResponse.status as any;
    coupon.is_active = toggleStatusResponse.status === "ACTIVE";
    toast.success(toggleStatusResponse.message || "Đã cập nhật trạng thái");
  } catch (error: any) {
    console.error("Failed to toggle coupon status:", error);
    toast.error("Không thể chuyển đổi trạng thái");
  } finally {
    togglingId.value = null;
  }
}

function confirmDelete(coupon: Coupon) {
  deletingCoupon.value = coupon;
}

async function executeDelete() {
  if (!deletingCoupon.value) return;
  isDeleting.value = true;
  try {
    await couponApi.deleteCoupon(deletingCoupon.value.id);
    toast.success(`Đã xóa mã ${deletingCoupon.value.code}`);
    deletingCoupon.value = null;
    fetchCoupons();
  } catch (error: any) {
    console.error("Failed to delete coupon:", error);
    toast.error("Không thể xóa mã giảm giá");
  } finally {
    isDeleting.value = false;
  }
}

onMounted(() => {
  fetchCoupons();
});
</script>
