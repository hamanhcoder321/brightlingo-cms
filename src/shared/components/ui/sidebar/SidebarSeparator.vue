<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <Separator
    data-sidebar="separator"
    :class="cn('mx-0 w-full bg-sidebar-border h-[1px]', props.class)"
  >
    <slot />
  </Separator>
</template>
