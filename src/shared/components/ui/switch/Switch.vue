<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from "reka-ui";
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from "reka-ui";

import { computed, type HTMLAttributes } from "vue";

import { useVModel } from "@vueuse/core";

import { cn } from "@/shared/utils";

const props = defineProps<
  SwitchRootProps & {
    class?: HTMLAttributes["class"];
    modelValue?: boolean;
  }
>();

const emits = defineEmits<
  SwitchRootEmits & {
    "update:modelValue": [payload: boolean];
  }
>();

const modelValue = useVModel(props, "modelValue", emits, {
  defaultValue: false,
  passive: true,
});

const forwarded = useForwardPropsEmits(
  computed(() => {
    const { class: _, modelValue: __, ...rest } = props;
    return rest;
  }),
  emits
);
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    v-model:model-value="modelValue"
    :class="
      cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        props.class
      )
    "
  >
    <SwitchThumb
      :class="
        cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
        )
      "
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
