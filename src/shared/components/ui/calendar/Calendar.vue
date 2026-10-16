<script lang="ts" setup>
import type { CalendarRootEmits, CalendarRootProps, DateValue } from "reka-ui";
import { CalendarRoot, useForwardPropsEmits } from "reka-ui";

import type { HTMLAttributes } from "vue";

import { reactiveOmit } from "@vueuse/core";

import { useI18n } from "@shared/hooks";

import { cn } from "@/shared/utils";

import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNextButton,
  CalendarPrevButton,
  CalendarSelectMonth,
  CalendarSelectYear,
  LayoutTypes,
} from ".";

const { t } = useI18n();

const props = defineProps<
  CalendarRootProps & { class?: HTMLAttributes["class"]; layout?: LayoutTypes }
>();

const emits = defineEmits<CalendarRootEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const monthKeys = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const CURRENT_YEAR = new Date().getFullYear();

const years = Array.from(
  { length: CURRENT_YEAR - 1950 + 1 },
  (_, i) => 1950 + i
);

function updateYear(date: DateValue, year: number) {
  emits("update:modelValue", date.set({ year }));
}

function updateMonth(date: DateValue, month: number) {
  emits("update:modelValue", date.set({ month }));
}
</script>

<template>
  <CalendarRoot
    v-slot="{ grid, weekDays, date }"
    :class="cn('p-3', props.class)"
    v-bind="forwarded"
  >
    <CalendarHeader>
      <CalendarPrevButton />
      <slot>
        <template v-if="layout === 'month-and-year'">
          <div class="flex gap-2 px-2 items-center">
            <CalendarSelectMonth
              :selected-date="date"
              :update-month="updateMonth"
              :month-keys="monthKeys"
            />
            <CalendarSelectYear
              :selected-date="date"
              :update-year="updateYear"
              :years="years"
              :current-year="CURRENT_YEAR"
            />
          </div>
        </template>
        <template v-else-if="layout === 'month-only'">
          <CalendarSelectMonth
            :selected-date="date"
            :update-month="updateMonth"
            :month-keys="monthKeys"
          />
          <p class="font-medium">
            {{ CURRENT_YEAR }}
          </p>
        </template>
        <template v-else-if="layout === 'year-only'">
          <p class="font-medium">
            {{
              t(
                `attendance.months.${monthKeys[(date.month ?? new Date().getMonth() + 1) - 1]}`
              )
            }}
          </p>
          <CalendarSelectYear
            :selected-date="date"
            :update-year="updateYear"
            :years="years"
            :current-year="CURRENT_YEAR"
          />
        </template>
        <template v-else>
          <CalendarHeading />
        </template>
      </slot>
      <CalendarNextButton />
    </CalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="mt-2 w-full"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <CalendarCellTrigger :day="weekDate" :month="month.value" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
