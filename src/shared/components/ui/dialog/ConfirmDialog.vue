<template>
  <Dialog v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2">
        <Button
          type="button"
          variant="outline"
          :disabled="loading"
          @click="onCancel"
        >
          {{ cancelText || t("common.cancel") }}
        </Button>
        <Button
          type="button"
          :variant="variant"
          :disabled="loading"
          @click="onConfirm"
        >
          <span
            v-if="loading"
            class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          {{ confirmText || t("common.confirm") }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useI18n } from "@shared/hooks";

import Button from "../button/Button.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

interface Props {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "default",
  loading: false,
});

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const { t } = useI18n();
const open = defineModel<boolean>("open", { default: false });

const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  open.value = false;
  emit("cancel");
};
</script>
