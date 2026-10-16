<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child :data-name="dataName">
      <Button
        variant="outline"
        :class="
          cn(
            'w-full justify-start text-left font-normal focus:ring-1 focus:ring-ring',
            !modelValue && 'text-muted-foreground',
            props.class
          )
        "
        :disabled="disabled"
      >
        <Clock class="mr-2 h-4 w-4" />
        <span>{{ displayValue }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-3" align="start">
      <div class="flex items-center gap-2">
        <!-- Hours -->
        <div class="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8"
            type="button"
            @click="incrementHour"
          >
            <ChevronUp class="h-4 w-4" />
          </Button>
          <Input
            v-model="hourInput"
            class="w-14 text-center"
            maxlength="2"
            @input="onHourInput"
            @blur="validateHour"
            @keydown.up.prevent="incrementHour"
            @keydown.down.prevent="decrementHour"
          />
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8"
            type="button"
            @click="decrementHour"
          >
            <ChevronDown class="h-4 w-4" />
          </Button>
        </div>

        <span class="text-xl font-semibold">:</span>

        <!-- Minutes -->
        <div class="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8"
            type="button"
            @click="incrementMinute"
          >
            <ChevronUp class="h-4 w-4" />
          </Button>
          <Input
            v-model="minuteInput"
            class="w-14 text-center"
            maxlength="2"
            @input="onMinuteInput"
            @blur="validateMinute"
            @keydown.up.prevent="incrementMinute"
            @keydown.down.prevent="decrementMinute"
          />
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8"
            type="button"
            @click="decrementMinute"
          >
            <ChevronDown class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronUp, Clock } from "lucide-vue-next";

import { computed, ref, watch } from "vue";
import type { HTMLAttributes } from "vue";

import { cn } from "@/shared/utils";

import Button from "../button/Button.vue";
import Input from "../input/Input.vue";
import Popover from "../popover/Popover.vue";
import PopoverContent from "../popover/PopoverContent.vue";
import PopoverTrigger from "../popover/PopoverTrigger.vue";

const props = defineProps<{
  dataName?: string;
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isOpen = ref(false);
const hourInput = ref("00");
const minuteInput = ref("00");

const displayValue = computed(() => {
  if (!props.modelValue) {
    return props.placeholder || "HH:MM";
  }
  return props.modelValue;
});

// Parse modelValue to hour and minute
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      const [h, m] = value.split(":");
      hourInput.value = h?.padStart(2, "0") || "00";
      minuteInput.value = m?.padStart(2, "0") || "00";
    }
  },
  { immediate: true }
);

const updateValue = () => {
  const h = hourInput.value.padStart(2, "0");
  const m = minuteInput.value.padStart(2, "0");
  emit("update:modelValue", `${h}:${m}`);
};

const onHourInput = () => {
  // Only allow digits
  const cleaned = String(hourInput.value).replace(/\D/g, "");
  hourInput.value = cleaned;
};

const onMinuteInput = () => {
  // Only allow digits
  const cleaned = String(minuteInput.value).replace(/\D/g, "");
  minuteInput.value = cleaned;
};

const validateHour = () => {
  let h = parseInt(hourInput.value) || 0;
  if (h < 0) h = 0;
  if (h > 23) h = 23;
  hourInput.value = h.toString().padStart(2, "0");
  updateValue();
};

const validateMinute = () => {
  let m = parseInt(minuteInput.value) || 0;
  if (m < 0) m = 0;
  if (m > 59) m = 59;
  minuteInput.value = m.toString().padStart(2, "0");
  updateValue();
};

const incrementHour = () => {
  let h = parseInt(hourInput.value) || 0;
  h = (h + 1) % 24;
  hourInput.value = h.toString().padStart(2, "0");
  updateValue();
};

const decrementHour = () => {
  let h = parseInt(hourInput.value) || 0;
  h = h === 0 ? 23 : h - 1;
  hourInput.value = h.toString().padStart(2, "0");
  updateValue();
};

const incrementMinute = () => {
  let m = parseInt(minuteInput.value) || 0;
  m = (m + 1) % 60;
  minuteInput.value = m.toString().padStart(2, "0");
  updateValue();
};

const decrementMinute = () => {
  let m = parseInt(minuteInput.value) || 0;
  m = m === 0 ? 59 : m - 1;
  minuteInput.value = m.toString().padStart(2, "0");
  updateValue();
};
</script>
