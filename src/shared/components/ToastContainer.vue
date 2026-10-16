<template>
  <div class="toast-provider">
    <slot />
    <div class="toast-fixed-container">
      <TransitionGroup name="toast">
        <CustomToast
          v-for="toastItem in toasts"
          :key="toastItem.id"
          :id="toastItem.id"
          :message="toastItem.message"
          :type="toastItem.type"
          :duration="toastItem.duration"
          @dismiss="handleDismiss"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomToast from './CustomToast.vue';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  duration: number;
}

const emit = defineEmits(['dismiss']);

defineProps<{
  toasts: Toast[];
}>();

const handleDismiss = (id: string) => {
  emit('dismiss', id);
};
</script>

<style scoped>
.toast-provider {
  position: relative;
  min-height: 100vh;
}

.toast-fixed-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none; /* Allow clicking through container but not toasts */
}

.toast-fixed-container > * {
  pointer-events: auto;
}

/* Vue Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Ensure smooth moving of remaining toasts when one is removed */
.toast-move {
  transition: transform 0.3s ease;
}
</style>
