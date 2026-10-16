<script lang="ts" setup>
import type { DateValue } from "reka-ui";

import { useI18n } from "@shared/hooks";

import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";

const { t } = useI18n();

const props = defineProps<{
  selectedDate: DateValue;
  updateMonth: (date: DateValue, month: number) => void;
  monthKeys: string[];
}>();
const currentMonth = new Date().getMonth();
</script>

<template>
  <Select
    :model-value="props.selectedDate.month ?? new Date().getMonth()"
    @update:model-value="
      (m: any) => props.updateMonth(props.selectedDate, m + 1)
    "
  >
    <SelectTrigger class="max-h-7 max-w-24">
      {{
        t(
          `attendance.months.${props.monthKeys[(props.selectedDate.month ?? currentMonth + 1) - 1]}`
        )
      }}
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="(label, index) in props.monthKeys"
        :key="index"
        :value="index"
      >
        {{ t(`attendance.months.${label}`) }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
