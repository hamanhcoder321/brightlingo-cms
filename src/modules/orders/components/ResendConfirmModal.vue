<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
      <div class="flex items-start gap-3">
        <div class="p-2.5 rounded-full bg-amber-50 text-amber-600 shrink-0">
          <MailWarning class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-900">Xác nhận gửi lại tài liệu qua Email</h3>
          <p class="text-xs text-slate-500 mt-1">
            Theo quy tắc <strong>BR-06</strong>: Hành động gửi lại tài nguyên này sẽ được ghi vào <strong>Audit Log</strong> và tăng bộ đếm lượt gửi lại.
          </p>
        </div>
      </div>

      <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
        <div class="flex justify-between">
          <span class="text-slate-500">Mã đơn hàng:</span>
          <span class="font-mono font-bold text-slate-800">{{ order?.order_code }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Khách nhận:</span>
          <span class="font-medium text-slate-800">{{ order?.customer_name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Email giao tài liệu:</span>
          <span class="font-semibold text-indigo-600">{{ order?.customer_email }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Số lần đã gửi trước đó:</span>
          <span class="font-bold text-slate-700">{{ order?.resend_count || 0 }} lần</span>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          :disabled="isSubmitting"
          @click="emit('close')"
          class="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          :disabled="isSubmitting"
          @click="handleConfirm"
          class="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
        >
          <span v-if="isSubmitting">Đang gửi...</span>
          <span v-else>Xác nhận gửi lại email</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MailWarning } from "lucide-vue-next";
import type { Order } from "../types/order.types";
import { orderApi } from "../api/order.api";

const props = defineProps<{
  isOpen: boolean;
  order: Order | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const isSubmitting = ref(false);

async function handleConfirm() {
  if (!props.order) return;
  isSubmitting.value = true;
  try {
    await orderApi.resendEmail(props.order.id);
    emit("success");
    emit("close");
  } catch (err) {
    console.error("Failed to resend email", err);
    alert("Không thể gửi lại email lúc này. Vui lòng kiểm tra lại dịch vụ email!");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
