<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :class="cn(
          'w-full justify-between font-normal',
          props.class,
          props.multiSelect && Array.isArray(selectedValue) && selectedValue.length > 0 ? 'h-auto py-2' : ''
        )"
      >
        <template v-if="props.multiSelect && Array.isArray(selectedValue) && selectedValue.length > 0">
          <div class="flex flex-1 flex-wrap items-center gap-1">
            <Badge
              v-for="val in selectedBadges"
              :key="val"
              variant="secondary"
              class="bg-black text-white hover:bg-black/80 gap-1"
            >
              {{ items.find(item => item.value === val)?.label }}
              <X class="w-3 h-3 cursor-pointer" @click.stop="handleSelect(val)" />
            </Badge>
            <span v-if="remainingSelectedCount > 0" class="text-xs text-muted-foreground">
              +{{ remainingSelectedCount }} more
            </span>
          </div>
          <Button
            v-if="selectedValue.length > 0"
            variant="ghost"
            size="sm"
            class="h-auto p-1 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
            @click.stop="handleClearAll"
          >
            Clear all
          </Button>
        </template>
        <template v-else-if="!props.multiSelect && selectedValue">
          {{ displayValue }}
        </template>
        <template v-else>
          {{ placeholder }}
        </template>
        <ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[--radix-popover-trigger-width] p-0">
      <Input
        v-model="search"
        :placeholder="searchPlaceholder"
        class="h-9 w-full border-none focus-visible:ring-0"
      />
      <ul class="max-h-60 overflow-y-auto">
        <li
          v-for="item in filteredItems"
          :key="item.value"
          class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-between"
          @click="handleSelect(item.value)"
        >
          <div class="flex items-center">
            <Check
              :class="cn(
                'mr-2 h-4 w-4',
                props.multiSelect
                  ? (Array.isArray(selectedValue) && selectedValue.includes(item.value) ? 'opacity-100' : 'opacity-0')
                  : (selectedValue === item.value ? 'opacity-100' : 'opacity-0')
              )"
            />
            {{ item.label }}
          </div>
          <div @click.stop>
            <slot name="item-actions" :item="item"></slot>
          </div>
        </li>
        <li v-if="filteredItems.length === 0" class="py-2 px-3 text-sm text-muted-foreground">
          Không tìm thấy kết quả.
        </li>
      </ul>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Check, ChevronDown, X } from 'lucide-vue-next';

import { cn } from '@/shared/utils';
import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';

interface Item {
  label: string;
  value: string;
}

interface Props {
  modelValue?: string | string[];
  items: Item[];
  placeholder?: string;
  searchPlaceholder?: string;
  class?: string;
  multiSelect?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an item',
  searchPlaceholder: 'Search items...',
  multiSelect: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | undefined): void;
  (e: 'search', value: string): void;
  (e: 'edit-item', value: string): void;
  (e: 'delete-item', value: string): void;
}>();

const open = ref(false);
const search = ref('');

watch(search, (val) => {
  emit('search', val);
});

const selectedValue = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue;
  }
  return props.multiSelect ? [] : '';
});

const currentSelectedValues = computed<string[]>(() => {
  if (props.multiSelect && Array.isArray(selectedValue.value)) {
    return selectedValue.value;
  }
  return [];
});

const displayValue = computed(() => {
  if (props.multiSelect) {
    return ''; // Handled by badges in template
  }
  return props.items.find(item => item.value === selectedValue.value)?.label;
});

const filteredItems = computed(() => {
  if (!search.value) {
    return props.items;
  }
  return props.items.filter(item =>
    item.label.toLowerCase().includes(search.value.toLowerCase())
  );
});

const handleSelect = (value: string) => {
  if (props.multiSelect) {
    const currentSelection = Array.isArray(selectedValue.value) ? [...selectedValue.value] : [];
    const index = currentSelection.indexOf(value);
    if (index > -1) {
      currentSelection.splice(index, 1); // Remove if already selected
    } else {
      currentSelection.push(value); // Add if not selected
    }
    emit('update:modelValue', currentSelection);
  } else {
    emit('update:modelValue', value);
    open.value = false;
  }
  search.value = ''; // Clear search after selection
};

const maxBadges = 2; // Define how many badges to show

const selectedBadges = computed(() => {
  return currentSelectedValues.value.slice(0, maxBadges);
});

const remainingSelectedCount = computed(() => {
  return currentSelectedValues.value.length - maxBadges;
});

const handleClearAll = () => {
  emit('update:modelValue', []);
};
</script>
