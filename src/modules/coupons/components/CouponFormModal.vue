<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="text-sm font-bold text-slate-900">
          {{ isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới' }}
        </h3>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-3 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-slate-700">Mã coupon (Tự động viết hoa) *</label>
          <input
            v-model="form.code"
            type="text"
            required
            placeholder="VD: GIAM20K"
            @input="form.code = form.code.toUpperCase()"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Loại giảm *</label>
            <select
              v-model="form.discount_type"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Percentage">Phần trăm (%)</option>
              <option value="Fixed">Số tiền cố định (VNĐ)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Giá trị giảm *</label>
            <input
              v-model.number="form.discount_value"
              type="number"
              required
              min="1"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-slate-700">Giới hạn số lượt dùng (Tùy chọn)</label>
          <input
            v-model.number="form.usage_limit"
            type="number"
            min="1"
            placeholder="Để trống nếu không giới hạn"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div class="flex items-center gap-2 pt-2">
          <input type="checkbox" id="coupon_active" v-model="form.is_active" class="rounded text-indigo-600" />
          <label for="coupon_active" class="font-medium text-slate-700 cursor-pointer">Kích hoạt sử dụng ngay</label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {{ isSubmitting ? 'Đang lưu...' : 'Lưu coupon' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { Coupon, CreateCouponDto, DiscountType } from "../types/coupon.types";
import { couponApi } from "../api/coupon.api";

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

const form = reactive<CreateCouponDto>({
  code: "",
  discount_type: "Percentage" as DiscountType,
  discount_value: 10,
  usage_limit: undefined,
  is_active: true,
});

watch(
  () => props.coupon,
  (val) => {
    if (val) {
      isEdit.value = true;
      form.code = val.code;
      form.discount_type = val.discount_type;
      form.discount_value = val.discount_value;
      form.usage_limit = val.usage_limit;
      form.is_active = val.is_active;
    } else {
      isEdit.value = false;
      form.code = "";
      form.discount_type = "Percentage";
      form.discount_value = 10;
      form.usage_limit = undefined;
      form.is_active = true;
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    if (isEdit.value && props.coupon) {
      await couponApi.updateCoupon(props.coupon.id, form);
    } else {
      await couponApi.createCoupon(form);
    }
    emit("success");
    emit("close");
  } catch (err) {
    console.error("Failed to save coupon", err);
    alert("Không thể lưu mã giảm giá. Vui lòng kiểm tra lại mã code có bị trùng không!");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
