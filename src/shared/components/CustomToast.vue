<template>
  <div
    :class="['custom-toast', typeClass]"
    @click="dismiss"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // success, error, warning, info
  duration: { type: Number, default: 2000 }, // ms
  id: { type: String, required: true },
});

const emit = defineEmits(['dismiss']);

let timeout: ReturnType<typeof setTimeout>;

const typeClass = computed(() => `custom-toast--${props.type}`);

const dismiss = () => {
  clearTimeout(timeout);
  emit('dismiss', props.id);
};

onMounted(() => {
  if (props.duration > 0) {
    timeout = setTimeout(() => {
      dismiss();
    }, props.duration);
  }
});

onUnmounted(() => {
  clearTimeout(timeout);
});
</script>

<style scoped>
.custom-toast {
  padding: 12px 20px;
  margin-bottom: 8px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  word-break: break-word;
  pointer-events: auto;
}

.custom-toast--info {
  background-color: #3b82f6; /* Blue 500 */
}

.custom-toast--success {
  background-color: #10b981; /* Emerald 500 */
}

.custom-toast--error {
  background-color: #ef4444; /* Red 500 */
}

.custom-toast--warning {
  background-color: #f59e0b; /* Amber 500 */
  color: white;
}
</style>
