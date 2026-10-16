<script lang="ts" setup>
import { DateValue } from "reka-ui";

import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";

const props = defineProps<{
  selectedDate: DateValue;
  updateYear: (date: DateValue, years: number) => void;
  currentYear: number;
  years: number[];
}>();
</script>

<template>
  <Select
    :model-value="props.selectedDate.year ?? props.currentYear"
    @update:model-value="
      (y) => typeof y === 'number' && updateYear(props.selectedDate, y)
    "
  >
    <SelectTrigger class="max-h-7 max-w-20">
      {{ selectedDate.year ?? currentYear }}
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="y in years" :key="y" :value="y">
        {{ y }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
