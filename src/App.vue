<template>
  <div id="app" class="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
    <ToastContainer :toasts="toasts" @dismiss="removeToast">
      <router-view />
    </ToastContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from "vue";
import ToastContainer from "@shared/components/ToastContainer.vue";
import { useAuthStore } from "@modules/auth/store/auth.store";

interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
  duration: number;
}

const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;

const addToast = (message: string, type: Toast["type"] = "info", duration: number = 3000) => {
  const id = `toast-${toastIdCounter++}`;
  toasts.value.push({ id, message, type, duration });
};

const removeToast = (id: string) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
};

const toast = {
  success: (message: string, duration: number = 3000) => addToast(message, "success", duration),
  error: (message: string, duration: number = 5000) => addToast(message, "error", duration),
  info: (message: string, duration: number = 3000) => addToast(message, "info", duration),
  warning: (message: string, duration: number = 4000) => addToast(message, "warning", duration),
};

provide("toast", toast);

// Initialize auth from token/localStorage
const authStore = useAuthStore();
onMounted(() => {
  authStore.initAuth();
});
</script>
