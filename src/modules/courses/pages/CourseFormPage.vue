<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">{{ isEdit ? 'Chỉnh sửa Khóa học' : 'Tạo Khóa học / Tài liệu Mới' }}</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Cấu hình thông tin cơ bản, nội dung và đường dẫn tài liệu bí mật.
        </p>
      </div>

      <router-link
        to="/courses"
        class="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        ← Quay lại danh sách
      </router-link>
    </div>

    <!-- Main Form Card -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Thông tin cơ bản</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700">Tên khóa học / Tài liệu *</label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="VD: 1000 Từ Vựng Giao Tiếp Chuyên Sâu"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700">Slug (Đường dẫn tĩnh) *</label>
            <input
              v-model="form.slug"
              type="text"
              required
              placeholder="1000-tu-vung-giao-tiep"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p v-if="isSystemSlug" class="text-[10px] text-red-600 font-medium">
              ⚠️ Cảnh báo BR-01: Slug không được trùng với các route hệ thống (admin, api, checkout, payment...)
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700">Phân loại *</label>
            <select
              v-model="form.type"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Course">Khóa học (Course)</option>
              <option value="Document">Tài liệu (Document)</option>
              <option value="Combo">Combo</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700">Giá bán (VNĐ) *</label>
            <input
              v-model.number="form.price"
              type="number"
              required
              min="0"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700">Giá gốc (VNĐ, tùy chọn)</label>
            <input
              v-model.number="form.original_price"
              type="number"
              min="0"
              placeholder="Hiển thị gạch ngang"
              class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- Secure Resource Link (BR-02) -->
        <div class="p-4 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-2">
          <div class="flex items-center gap-2 text-indigo-900">
            <span class="text-xs font-bold">Link tài nguyên chính thức (Resource Link) *</span>
            <span class="px-2 py-0.5 rounded text-[10px] bg-indigo-200 text-indigo-800 font-semibold">Bảo mật CMS</span>
          </div>
          <input
            v-model="form.resource_link"
            type="url"
            required
            placeholder="https://drive.google.com/drive/folders/... hoặc https://notion.so/..."
            class="w-full px-3 py-2 rounded-lg border border-indigo-200 text-xs font-mono bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p class="text-[11px] text-indigo-700">
            💡 Theo quy tắc BR-02 & BR-15: Link này được lưu trữ an toàn trong CMS, chỉ gửi tự động cho học viên sau khi trạng thái đơn chuyển sang <strong>PAID</strong>.
          </p>
        </div>

        <!-- Status -->
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-700">Trạng thái phát hành *</label>
          <div class="flex items-center gap-4 text-xs">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" v-model="form.status" value="Published" class="text-indigo-600" />
              <span>Mở bán (Published)</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" v-model="form.status" value="Draft" class="text-indigo-600" />
              <span>Bản nháp (Draft)</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" v-model="form.status" value="Hidden" class="text-indigo-600" />
              <span>Ẩn (Hidden)</span>
            </label>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-700">Mô tả ngắn</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Mô tả tóm tắt nội dung tài liệu..."
            class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3">
        <router-link
          to="/courses"
          class="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Hủy bỏ
        </router-link>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
        >
          {{ isSubmitting ? 'Đang lưu...' : (isEdit ? 'Cập nhật khóa học' : 'Lưu khóa học') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { courseApi } from "../api/course.api";
import type { CourseType, CourseStatus } from "../types/course.types";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id && route.params.id !== "create");
const courseId = computed(() => route.params.id as string);

const isSubmitting = ref(false);

const form = reactive({
  title: "",
  slug: "",
  type: "Course" as CourseType,
  price: 20000,
  original_price: undefined as number | undefined,
  resource_link: "",
  status: "Published" as CourseStatus,
  description: "",
});

const systemReservedRoutes = ["admin", "api", "checkout", "payment", "policies", "auth", "login"];
const isSystemSlug = computed(() => {
  return systemReservedRoutes.includes(form.slug.trim().toLowerCase());
});

onMounted(async () => {
  if (isEdit.value) {
    try {
      const data = await courseApi.getCourseById(courseId.value);
      Object.assign(form, {
        title: data.title,
        slug: data.slug,
        type: data.type,
        price: data.price,
        original_price: data.original_price,
        resource_link: data.resource_link || "",
        status: data.status,
        description: data.description || "",
      });
    } catch (err) {
      console.error("Failed to load course details", err);
    }
  }
});

async function handleSubmit() {
  if (isSystemSlug.value) {
    alert("Slug trùng với route hệ thống! Vui lòng chọn slug khác.");
    return;
  }

  isSubmitting.value = true;
  try {
    if (isEdit.value) {
      await courseApi.updateCourse(courseId.value, form);
    } else {
      await courseApi.createCourse(form);
    }
    router.push("/courses");
  } catch (err) {
    console.error("Failed to save course", err);
    alert("Lỗi khi lưu khóa học. Vui lòng thử lại!");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
