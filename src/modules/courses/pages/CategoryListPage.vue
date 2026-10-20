<template>
  <div class="p-6 md:p-8 pb-14 flex flex-col gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="m-0 font-serif font-bold text-[32px] text-[#1D2A2E] leading-tight">
          Danh mục Khóa học
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px] mt-0.5">
          Quản lý các nhóm danh mục phân loại khóa học.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="showAddModal = true"
          class="h-[46px] px-5 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[15px] inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>+ Thêm danh mục mới</span>
        </button>
      </div>
    </div>

    <!-- Category Table -->
    <div class="bg-white border border-[#E5E0D7] rounded-[16px] overflow-x-auto shadow-xs">
      <table class="w-full min-w-[700px] border-collapse text-[15px]">
        <thead>
          <tr class="text-[#4C5A60] border-b border-[#E5E0D7] bg-[#FAF7F2]">
            <th class="py-3 px-4 font-semibold text-left">Tên danh mục</th>
            <th class="py-3 px-3 font-semibold text-left">Đường dẫn (Slug)</th>
            <th class="py-3 px-3 font-semibold text-left">Mô tả</th>
            <th class="py-3 px-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="categories.length === 0" class="text-center">
            <td colspan="4" class="py-12 text-[#8C989C]">Chưa có danh mục nào.</td>
          </tr>
          <tr
            v-else
            v-for="cat in categories"
            :key="cat.id"
            class="border-b border-[#EFEBE4] hover:bg-[#FAF7F2]/60 transition-colors"
          >
            <td class="py-3.5 px-4 font-bold text-[#1D2A2E]">{{ cat.name }}</td>
            <td class="py-3.5 px-3 font-mono text-[#0B6E6E]">/{{ cat.slug }}</td>
            <td class="py-3.5 px-3 text-[#4C5A60]">{{ cat.description || '—' }}</td>
            <td class="py-3.5 px-4 text-right">
              <button
                type="button"
                class="text-[13.5px] font-semibold text-[#0B6E6E] hover:underline cursor-pointer"
              >
                Chỉnh sửa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { courseApi } from "../api/course.api";
import type { CourseCategory } from "../types/course.types";

const categories = ref<CourseCategory[]>([]);
const showAddModal = ref(false);

onMounted(async () => {
  try {
    categories.value = await courseApi.getCategories();
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }
});
</script>
