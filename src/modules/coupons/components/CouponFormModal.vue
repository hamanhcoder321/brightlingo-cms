<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
  >
    <div
      class="bg-white rounded-[20px] shadow-2xl border border-[#E5E0D7] max-w-2xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]"
    >
      <!-- Header -->
      <div class="px-6 py-4.5 border-b border-[#EFEBE4] flex items-center justify-between bg-[#FAF7F2]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-[12px] bg-[#0B6E6E]/10 text-[#0B6E6E] flex items-center justify-center shrink-0">
            <Ticket class="w-5 h-5" />
          </div>
          <div>
            <h3 class="m-0 font-serif font-bold text-[19px] text-[#1D2A2E]">
              {{ isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới' }}
            </h3>
            <p class="m-0 text-[#78888D] text-[13px] mt-0.5">
              Thiết lập phạm vi áp dụng toàn khóa hoặc từng khóa, kiểm soát chiết khấu và trạng thái đóng/bật.
            </p>
          </div>
        </div>
        <button
          @click="emit('close')"
          type="button"
          class="p-2 text-[#78888D] hover:text-[#1D2A2E] hover:bg-[#EAE6DE]/60 rounded-[10px] transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto flex-1 flex flex-col gap-5 text-[14px]">
        <!-- Mã Coupon & Ghi chú -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E] flex items-center justify-between">
              <span>Mã giảm giá (Code) <span class="text-rose-500">*</span></span>
              <span class="text-[11px] font-normal text-[#78888D]">Tự động viết hoa</span>
            </label>
            <input
              v-model="form.code"
              type="text"
              required
              maxlength="50"
              placeholder="VD: ENGNEST20, FLASH50K"
              @input="onCodeInput"
              class="h-[44px] px-3.5 rounded-[10px] border border-[#D5DCDE] bg-white text-[#1D2A2E] font-mono font-bold uppercase tracking-wide focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E]">
              Tên chương trình / Ghi chú nội bộ
            </label>
            <input
              v-model="form.note"
              type="text"
              placeholder="VD: Khai giảng tháng 11, Tri ân học viên..."
              class="h-[44px] px-3.5 rounded-[10px] border border-[#D5DCDE] bg-white text-[#1D2A2E] focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        <!-- 2. PHẠM VI ÁP DỤNG (Mã quản lý 1 nơi: Toàn khóa hoặc từng khóa) -->
        <div class="flex flex-col gap-2.5 p-4 rounded-[14px] bg-[#FAF7F2] border border-[#E5E0D7]">
          <label class="font-semibold text-[#1D2A2E] flex items-center gap-2">
            <Layers class="w-4 h-4 text-[#0B6E6E]" />
            <span>Phạm vi áp dụng <span class="text-rose-500">*</span></span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Option: Toàn bộ khóa học -->
            <label
              :class="[
                'flex items-start gap-3 p-3.5 rounded-[12px] border cursor-pointer transition-all',
                form.scope === 'ALL'
                  ? 'border-[#0B6E6E] bg-white ring-2 ring-[#0B6E6E]/15 shadow-xs'
                  : 'border-[#E5E0D7] bg-white/60 hover:bg-white'
              ]"
            >
              <input
                type="radio"
                name="scope"
                value="ALL"
                v-model="form.scope"
                class="mt-1 text-[#0B6E6E] focus:ring-[#0B6E6E]"
              />
              <div class="flex flex-col">
                <span class="font-semibold text-[#1D2A2E]">Áp dụng toàn khóa</span>
                <span class="text-[12px] text-[#78888D] mt-0.5">
                  Mã có hiệu lực cho tất cả các khóa học trên hệ thống
                </span>
              </div>
            </label>

            <!-- Option: Từng khóa học cụ thể -->
            <label
              :class="[
                'flex items-start gap-3 p-3.5 rounded-[12px] border cursor-pointer transition-all',
                form.scope === 'SPECIFIC'
                  ? 'border-[#0B6E6E] bg-white ring-2 ring-[#0B6E6E]/15 shadow-xs'
                  : 'border-[#E5E0D7] bg-white/60 hover:bg-white'
              ]"
            >
              <input
                type="radio"
                name="scope"
                value="SPECIFIC"
                v-model="form.scope"
                class="mt-1 text-[#0B6E6E] focus:ring-[#0B6E6E]"
              />
              <div class="flex flex-col">
                <span class="font-semibold text-[#1D2A2E]">Từng khóa học cụ thể</span>
                <span class="text-[12px] text-[#78888D] mt-0.5">
                  Chỉ áp dụng cho một hoặc một số khóa học được chỉ định
                </span>
              </div>
            </label>
          </div>

          <!-- Danh sách chọn khóa học khi chọn SPECIFIC -->
          <div v-if="form.scope === 'SPECIFIC'" class="mt-2 flex flex-col gap-2 pt-2 border-t border-[#E5E0D7]">
            <div class="flex items-center justify-between text-[12px]">
              <span class="text-[#4C5A60] font-medium">
                Chọn các khóa học áp dụng (<span class="font-bold text-[#0B6E6E]">{{ selectedCourseIds.length }}</span> khóa):
              </span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="selectAllCourses"
                  class="text-[#0B6E6E] hover:underline cursor-pointer font-medium"
                >
                  Chọn tất cả
                </button>
                <span class="text-[#D5DCDE]">|</span>
                <button
                  type="button"
                  @click="deselectAllCourses"
                  class="text-[#78888D] hover:underline cursor-pointer font-medium"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>

            <!-- Danh sách khóa học dạng cuộn -->
            <div class="max-h-48 overflow-y-auto bg-white border border-[#D5DCDE] rounded-[10px] p-2 flex flex-col gap-1">
              <div v-if="coursesList.length === 0" class="text-center py-4 text-[#78888D] text-[13px]">
                Đang tải danh sách khóa học...
              </div>
              <label
                v-else
                v-for="course in coursesList"
                :key="course.id"
                class="flex items-center justify-between p-2 rounded-[8px] hover:bg-[#FAF7F2] cursor-pointer transition-colors"
              >
                <div class="flex items-center gap-2.5 overflow-hidden">
                  <input
                    type="checkbox"
                    :value="course.id"
                    v-model="selectedCourseIds"
                    class="rounded text-[#0B6E6E] focus:ring-[#0B6E6E] w-4 h-4"
                  />
                  <span class="text-[13px] font-medium text-[#1D2A2E] truncate" :title="course.title">
                    {{ course.title }}
                  </span>
                </div>
                <span class="text-[12px] font-bold text-[#0B6E6E] shrink-0 pl-2">
                  {{ formatCurrency(course.price) }}
                </span>
              </label>
            </div>
            <p v-if="selectedCourseIds.length === 0" class="m-0 text-rose-500 text-[12px]">
              ⚠️ Vui lòng chọn ít nhất 1 khóa học áp dụng.
            </p>
          </div>
        </div>

        <!-- 3. LOẠI GIẢM GIÁ & MỨC GIẢM -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E]">
              Loại chiết khấu <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.type"
              class="h-[44px] px-3 rounded-[10px] border border-[#D5DCDE] bg-white text-[#1D2A2E] font-medium focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all cursor-pointer"
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Số tiền cố định (VNĐ)</option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E]">
              {{ form.type === 'PERCENT' ? 'Mức giảm (%)' : 'Số tiền giảm (VNĐ)' }}
              <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.value"
                type="number"
                required
                :min="1"
                :max="form.type === 'PERCENT' ? 100 : undefined"
                placeholder="VD: 20"
                class="w-full h-[44px] pl-3.5 pr-12 rounded-[10px] border border-[#D5DCDE] bg-white text-[#1D2A2E] font-bold text-[15px] focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all"
              />
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78888D] font-bold text-[13px]">
                {{ form.type === 'PERCENT' ? '%' : 'đ' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Mức giảm tối đa (nếu là PERCENT) & Đơn hàng tối thiểu -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E] flex items-center justify-between">
              <span>Giảm tối đa (VNĐ)</span>
              <span class="text-[11px] font-normal text-[#78888D]">Dành cho %</span>
            </label>
            <input
              v-model.number="form.maxDiscountAmount"
              type="number"
              min="0"
              :disabled="form.type !== 'PERCENT'"
              placeholder="Để trống = Không giới hạn"
              :class="[
                'h-[44px] px-3.5 rounded-[10px] border border-[#D5DCDE] focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all',
                form.type !== 'PERCENT' ? 'bg-[#FAF7F2] text-[#AEB8BB] cursor-not-allowed' : 'bg-white text-[#1D2A2E]'
              ]"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E]">
              Đơn hàng tối thiểu (VNĐ)
            </label>
            <input
              v-model.number="form.minOrderAmount"
              type="number"
              min="0"
              placeholder="0 = Không yêu cầu"
              class="h-[44px] px-3.5 rounded-[10px] border border-[#D5DCDE] bg-white text-[#1D2A2E] focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        <!-- Giới hạn lượt dùng & Thời hạn hiệu lực -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E]">
              Tổng lượt dùng tối đa
            </label>
            <input
              v-model.number="form.usageLimit"
              type="number"
              min="1"
              placeholder="Trống = Vô hạn"
              class="h-[44px] px-3.5 rounded-[10px] border border-[#D5DCDE] bg-white text-[#1D2A2E] focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E]">
              Bắt đầu từ ngày
            </label>
            <input
              v-model="form.startDate"
              type="date"
              class="h-[44px] px-3 rounded-[10px] border border-[#D5DCDE] bg-white text-[#1D2A2E] focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all cursor-pointer"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="font-semibold text-[#1D2A2E]">
              Hết hạn vào ngày
            </label>
            <input
              v-model="form.endDate"
              type="date"
              class="h-[44px] px-3 rounded-[10px] border border-[#D5DCDE] bg-white text-[#1D2A2E] focus:border-[#0B6E6E] focus:ring-2 focus:ring-[#0B6E6E]/15 focus:outline-hidden transition-all cursor-pointer"
            />
          </div>
        </div>

        <!-- 4. TRẠNG THÁI ĐÓNG, BẬT -->
        <div class="p-4 rounded-[14px] border border-[#E5E0D7] bg-[#FAF7F2] flex items-center justify-between">
          <div class="flex flex-col">
            <span class="font-semibold text-[#1D2A2E] flex items-center gap-2">
              <span
                :class="[
                  'w-2.5 h-2.5 rounded-full',
                  form.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                ]"
              ></span>
              <span>Trạng thái: {{ form.status === 'ACTIVE' ? 'Đang bật (Kích hoạt)' : 'Đang đóng (Tạm dừng)' }}</span>
            </span>
            <span class="text-[12px] text-[#78888D] mt-0.5">
              {{ form.status === 'ACTIVE'
                ? 'Mã sẵn sàng áp dụng ngay khi học viên đặt hàng.'
                : 'Mã đang tạm dừng, học viên không thể áp dụng khi thanh toán.'
              }}
            </span>
          </div>

          <!-- Switch toggle component -->
          <button
            type="button"
            @click="form.status = form.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'"
            :class="[
              'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
              form.status === 'ACTIVE' ? 'bg-[#0B6E6E]' : 'bg-[#D5DCDE]'
            ]"
            role="switch"
            :aria-checked="form.status === 'ACTIVE'"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                form.status === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <!-- Error Banner -->
        <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-[10px] text-rose-700 text-[13px] flex items-center gap-2">
          <span>⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#EFEBE4]">
          <button
            type="button"
            @click="emit('close')"
            class="h-[44px] px-5 rounded-[10px] border border-[#D5DCDE] hover:bg-[#FAF7F2] font-semibold text-[#4C5A60] transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || (form.scope === 'SPECIFIC' && selectedCourseIds.length === 0)"
            class="h-[44px] px-6 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ isSubmitting ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Tạo mã giảm giá') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { Ticket, X, Layers } from "lucide-vue-next";
import { formatCurrency } from "@shared/utils";
import { couponApi } from "../api/coupon.api";
import type { Coupon, CreateCouponDto, CouponScope, CouponStatus } from "../types/coupon.types";

const props = defineProps<{
  isOpen: boolean;
  coupon?: Coupon | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const isEdit = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const coursesList = ref<Array<{ id: string; title: string; price: number; slug: string }>>([]);
const selectedCourseIds = ref<string[]>([]);

const form = reactive<{
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  scope: CouponScope;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  status: CouponStatus;
  note?: string;
}>({
  code: "",
  type: "PERCENT",
  value: 10,
  minOrderAmount: undefined,
  maxDiscountAmount: undefined,
  scope: "ALL",
  startDate: undefined,
  endDate: undefined,
  usageLimit: undefined,
  status: "ACTIVE",
  note: "",
});

function onCodeInput(inputEvent: Event) {
  const inputElement = inputEvent.target as HTMLInputElement;
  form.code = inputElement.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function selectAllCourses() {
  selectedCourseIds.value = coursesList.value.map((courseItem) => courseItem.id);
}

function deselectAllCourses() {
  selectedCourseIds.value = [];
}

async function loadCourses() {
  try {
    const fetchedCourses = await couponApi.getCoursesForSelect();
    coursesList.value = fetchedCourses;
  } catch (loadError) {
    console.error("Failed to load courses for coupon modal:", loadError);
  }
}

watch(
  () => props.isOpen,
  (isModalCurrentlyOpen) => {
    if (isModalCurrentlyOpen && coursesList.value.length === 0) {
      loadCourses();
    }
  },
);

watch(
  () => props.coupon,
  (incomingCouponData) => {
    errorMessage.value = "";
    if (incomingCouponData) {
      isEdit.value = true;
      form.code = incomingCouponData.code;
      form.type = (incomingCouponData.type ||
        (incomingCouponData.discount_type === "Fixed" ? "FIXED" : "PERCENT")) as
        | "PERCENT"
        | "FIXED";
      form.value = Number(
        incomingCouponData.value ?? incomingCouponData.discount_value ?? 10
      );
      form.minOrderAmount = incomingCouponData.min_order_amount
        ? Number(incomingCouponData.min_order_amount)
        : undefined;
      form.maxDiscountAmount = incomingCouponData.max_discount_amount
        ? Number(incomingCouponData.max_discount_amount)
        : undefined;
      form.scope = incomingCouponData.scope || "ALL";
      form.usageLimit = incomingCouponData.usage_limit
        ? Number(incomingCouponData.usage_limit)
        : undefined;
      form.status = (incomingCouponData.status ||
        (incomingCouponData.is_active === false ? "INACTIVE" : "ACTIVE")) as CouponStatus;
      form.note = incomingCouponData.note || "";
      form.startDate = incomingCouponData.start_date
        ? incomingCouponData.start_date.substring(0, 10)
        : undefined;
      form.endDate = incomingCouponData.end_date
        ? incomingCouponData.end_date.substring(0, 10)
        : undefined;

      if (incomingCouponData.courses && Array.isArray(incomingCouponData.courses)) {
        selectedCourseIds.value = incomingCouponData.courses.map((courseItem: any) => courseItem.id);
      } else {
        selectedCourseIds.value = [];
      }
    } else {
      isEdit.value = false;
      form.code = "";
      form.type = "PERCENT";
      form.value = 10;
      form.minOrderAmount = undefined;
      form.maxDiscountAmount = undefined;
      form.scope = "ALL";
      form.startDate = undefined;
      form.endDate = undefined;
      form.usageLimit = undefined;
      form.status = "ACTIVE";
      form.note = "";
      selectedCourseIds.value = [];
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  errorMessage.value = "";

  if (!form.code.trim()) {
    errorMessage.value = "Vui lòng nhập mã giảm giá.";
    return;
  }

  if (form.type === "PERCENT" && (form.value <= 0 || form.value > 100)) {
    errorMessage.value = "Mức giảm phần trăm phải từ 1% đến 100%.";
    return;
  }

  if (form.scope === "SPECIFIC" && selectedCourseIds.value.length === 0) {
    errorMessage.value = "Vui lòng chọn ít nhất 1 khóa học áp dụng.";
    return;
  }

  isSubmitting.value = true;
  try {
    const couponPayload: CreateCouponDto = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: form.value,
      minOrderAmount: form.minOrderAmount || undefined,
      maxDiscountAmount: form.maxDiscountAmount || undefined,
      scope: form.scope,
      courseIds: form.scope === "SPECIFIC" ? selectedCourseIds.value : [],
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      endDate: form.endDate ? new Date(form.endDate + "T23:59:59").toISOString() : undefined,
      usageLimit: form.usageLimit || undefined,
      status: form.status,
      note: form.note?.trim() || undefined,
    };

    if (isEdit.value && props.coupon) {
      await couponApi.updateCoupon(props.coupon.id, couponPayload);
    } else {
      await couponApi.createCoupon(couponPayload);
    }

    emit("success");
    emit("close");
  } catch (submitError: any) {
    console.error("Failed to save coupon:", submitError);
    errorMessage.value =
      submitError.response?.data?.message ||
      submitError.message ||
      "Không thể lưu mã giảm giá. Vui lòng kiểm tra lại!";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  loadCourses();
});
</script>
