<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Danh mục Khóa học</h2>
        <p class="text-xs text-slate-500 mt-0.5">Quản lý các nhóm danh mục phân loại khóa học.</p>
      </div>

      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
      >
        + Thêm danh mục mới
      </button>
    </div>

    <!-- Category Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
          <tr>
            <th class="py-3 px-4">Tên danh mục</th>
            <th class="py-3 px-4">Slug</th>
            <th class="py-3 px-4">Mô tả</th>
            <th class="py-3 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="categories.length === 0" class="text-center">
            <td colspan="4" class="py-8 text-slate-400">Chưa có danh mục nào.</td>
          </tr>
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-slate-50/70">
            <td class="py-3 px-4 font-bold text-slate-800">{{ cat.name }}</td>
            <td class="py-3 px-4 font-mono text-slate-500">/{{ cat.slug }}</td>
            <td class="py-3 px-4 text-slate-500">{{ cat.description || '-' }}</td>
            <td class="py-3 px-4 text-right">
              <button class="text-xs text-indigo-600 hover:underline">Sửa</button>
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
  categories.value = await courseApi.getCategories();
});
</script>
