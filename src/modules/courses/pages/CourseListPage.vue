<template>
  <div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Quản lý Khóa học & Tài liệu</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Quản lý toàn bộ danh mục sản phẩm, cấu hình link tài nguyên bảo mật và trạng thái mở bán.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link
          to="/courses/create"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Plus class="w-4 h-4" />
          Thêm khóa học mới
        </router-link>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm theo tên khóa học hoặc slug..."
          class="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="statusFilter"
          class="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Published">Đã mở bán (Published)</option>
          <option value="Draft">Bản nháp (Draft)</option>
          <option value="Hidden">Ẩn (Hidden)</option>
        </select>

        <button
          @click="fetchCourses"
          class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Tải lại"
        >
          <RotateCcw class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4">Tên khóa học</th>
              <th class="py-3 px-4">Loại</th>
              <th class="py-3 px-4">Giá bán</th>
              <th class="py-3 px-4">Link tài nguyên (Resource Link)</th>
              <th class="py-3 px-4">Trạng thái</th>
              <th class="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="isLoading" class="text-center">
              <td colspan="6" class="py-8 text-slate-400">Đang tải dữ liệu...</td>
            </tr>
            <tr v-else-if="filteredCourses.length === 0" class="text-center">
              <td colspan="6" class="py-8 text-slate-400">Không tìm thấy khóa học nào.</td>
            </tr>
            <tr
              v-else
              v-for="course in filteredCourses"
              :key="course.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900">{{ course.title }}</div>
                <div class="text-[11px] text-slate-400 font-mono">/{{ course.slug }}</div>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {{ course.type }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="font-semibold text-slate-900">{{ formatCurrency(course.price) }}</div>
                <div v-if="course.original_price" class="text-[10px] text-slate-400 line-through">
                  {{ formatCurrency(course.original_price) }}
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 font-mono text-[11px] text-indigo-600 max-w-[200px] truncate" :title="course.resource_link">
                  <ShieldCheck class="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  {{ course.resource_link ? 'Đã thiết lập' : 'Chưa có link' }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block',
                    course.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : course.status === 'Draft'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  ]"
                >
                  {{ course.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-right space-x-1">
                <router-link
                  :to="`/courses/${course.id}/edit`"
                  class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded inline-block"
                  title="Chỉnh sửa"
                >
                  <Pencil class="w-4 h-4" />
                </router-link>
                <button
                  @click="handleDelete(course.id)"
                  class="p-1.5 text-red-600 hover:bg-red-50 rounded inline-block"
                  title="Xóa mềm"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Plus, Search, RotateCcw, Pencil, Trash2, ShieldCheck } from "lucide-vue-next";
import { formatCurrency } from "@shared/utils";
import { courseApi } from "../api/course.api";
import type { Course } from "../types/course.types";

const courses = ref<Course[]>([]);
const isLoading = ref(false);
const searchQuery = ref("");
const statusFilter = ref("");

const filteredCourses = computed(() => {
  return courses.value.filter((c) => {
    const matchSearch =
      !searchQuery.value ||
      c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = !statusFilter.value || c.status === statusFilter.value;
    return matchSearch && matchStatus;
  });
});

async function fetchCourses() {
  isLoading.value = true;
  try {
    const res = await courseApi.getCourses();
    courses.value = res.items;
  } catch (err) {
    console.error("Failed to fetch courses", err);
  } finally {
    isLoading.value = false;
  }
}

async function handleDelete(id: string) {
  if (confirm("Bạn có chắc chắn muốn xóa khóa học này? (Dữ liệu sẽ được Soft Delete)")) {
    await courseApi.deleteCourse(id);
    await fetchCourses();
  }
}

onMounted(() => {
  fetchCourses();
});
</script>
