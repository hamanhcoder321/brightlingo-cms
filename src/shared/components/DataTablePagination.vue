<script setup lang="ts">
import { AcceptableValue } from "reka-ui";

import Button from "@shared/components/ui/button/Button.vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@shared/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";

interface Props {
  total: number;
  pageSize: number;
  pageIndex: number;
  siblingCount?: number;
}

withDefaults(defineProps<Props>(), {
  siblingCount: 1,
});

const emit = defineEmits<{
  (e: "update:pageIndex", value: number): void;
  (e: "update:pageSize", value: number): void;
}>();

function handleLimitChange(newLimit: AcceptableValue) {
  emit("update:pageSize", newLimit as number);
  emit("update:pageIndex", 0);
}

function goToPage(page: number) {
  emit("update:pageIndex", page - 1);
}
</script>

<template>
  <div class="grid grid-cols-3 items-center gap-4 px-2">
    <!-- Left column: Limit selector -->
    <div class="flex items-center gap-2">
      <Select :model-value="pageSize" @update:model-value="handleLimitChange">
        <SelectTrigger class="w-[100px] h-8">
          <SelectValue :placeholder="String(pageSize)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="10"> 10 </SelectItem>
          <SelectItem :value="20"> 20 </SelectItem>
          <SelectItem :value="50"> 50 </SelectItem>
          <SelectItem :value="100"> 100 </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Middle column: Navigation (Page numbers only) -->
    <div class="flex justify-center">
      <Pagination
        v-slot="{ page }"
        :total="total"
        :items-per-page="pageSize"
        :sibling-count="siblingCount"
        show-edges
        :default-page="pageIndex + 1"
      >
        <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
          <template v-for="(item, index) in items">
            <PaginationItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-10 h-10 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
                @click="goToPage(item.value)"
              >
                {{ item.value }}
              </Button>
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
        </PaginationContent>
      </Pagination>
    </div>

    <!-- Right column: Empty for balance -->
    <div />
  </div>
</template>
