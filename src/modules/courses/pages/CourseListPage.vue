<template>
  <div class="p-4 sm:p-6 md:p-8 pb-14 flex flex-col gap-4 sm:gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Page Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="m-0 font-serif font-bold text-2xl sm:text-[32px] text-[#1D2A2E] leading-tight">
          Khóa học
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px] mt-0.5">
          Chọn 1 khóa “Nổi bật” để hiển thị lớn trên trang chủ.
        </p>
      </div>

      <router-link
        to="/courses/create"
        class="h-[44px] sm:h-[46px] px-4 sm:px-5 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[15px] sm:text-[16px] inline-flex items-center justify-center gap-2 text-decoration-none shadow-sm transition-colors w-full sm:w-auto"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14"></path>
        </svg>
        <span>Thêm khóa học</span>
      </router-link>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="flex flex-wrap gap-3 items-center">
      <!-- Search Input -->
      <label class="flex-1 min-w-0 w-full relative flex items-center">
        <span class="absolute left-3.5 flex text-[#4C5A60]" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-3.5-3.5"></path>
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="search"
          aria-label="Tìm khóa học"
          placeholder="Tìm theo tên hoặc slug…"
          class="w-full h-[46px] box-border border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] pl-[42px] pr-9 text-[15px] bg-white text-[#1D2A2E] placeholder:text-[#8C989C] focus:outline-none transition-colors"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          type="button"
          class="absolute right-3 text-slate-400 hover:text-slate-600 text-sm p-1"
          title="Xóa tìm kiếm"
        >
          ✕
        </button>
      </label>

      <!-- Status Filter Tabs -->
      <div
        role="group"
        aria-label="Lọc trạng thái"
        class="flex gap-1.5 bg-white border border-[#E5E0D7] rounded-[12px] p-1 shadow-sm overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none shrink-0"
      >
        <button
          type="button"
          @click="statusFilter = 'ALL'"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[15px] cursor-pointer transition-colors whitespace-nowrap',
            statusFilter === 'ALL'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Tất cả ({{ courses.length }})
        </button>

        <button
          type="button"
          @click="statusFilter = 'PUBLISHED'"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[15px] cursor-pointer transition-colors whitespace-nowrap',
            statusFilter === 'PUBLISHED'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Đang bán ({{ publishedCount }})
        </button>

        <button
          type="button"
          @click="statusFilter = 'DRAFT'"
          :class="[
            'h-[38px] px-3.5 rounded-[8px] border-0 font-sans font-semibold text-[15px] cursor-pointer transition-colors whitespace-nowrap',
            statusFilter === 'DRAFT'
              ? 'bg-[#E6F2F0] text-[#08585A]'
              : 'bg-transparent text-[#4C5A60] hover:text-[#1D2A2E]'
          ]"
        >
          Nháp ({{ draftCount }})
        </button>
      </div>

      <!-- Refresh Button -->
      <button
        type="button"
        @click="fetchCourses"
        class="h-[46px] px-3 rounded-[10px] border-[1.5px] border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#4C5A60] hover:text-[#1D2A2E] cursor-pointer flex items-center justify-center transition-colors shadow-sm"
        title="Tải lại dữ liệu từ lingo-api"
      >
        <svg
          :class="['w-5 h-5', isLoading ? 'animate-spin text-[#0B6E6E]' : '']"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
          <path d="M16 21h5v-5"></path>
        </svg>
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-[#E5E0D7] rounded-[16px] overflow-x-auto shadow-sm">
      <table class="w-full min-w-[920px] border-collapse text-[15px]">
        <thead>
          <tr class="color-[#4C5A60] text-[#4C5A60] border-b border-[#E5E0D7] bg-[#FAF7F2]">
            <th class="py-3 px-4 font-semibold text-left">Khóa học</th>
            <th class="py-3 px-2 font-semibold text-right">Giá bán</th>
            <th class="py-3 px-2 font-semibold text-left">Trạng thái</th>
            <th class="py-3 px-2 font-semibold text-center">Nổi bật</th>
            <th class="py-3 px-2 font-semibold text-right">Đã bán</th>
            <th class="py-3 px-2 font-semibold text-right">Doanh thu</th>
            <th class="py-3 px-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <!-- Loading State -->
          <template v-if="isLoading">
            <tr
              v-for="i in 5"
              :key="'skeleton-' + i"
              class="border-b border-[#EFEBE4] animate-pulse"
            >
              <td class="p-3.5 px-4">
                <div class="flex gap-3.5 items-center">
                  <div class="w-[72px] h-[48px] rounded-lg bg-[#ECE7DE] shrink-0"></div>
                  <div class="space-y-2 flex-1">
                    <div class="h-4 bg-[#ECE7DE] rounded w-3/4"></div>
                    <div class="h-3 bg-[#ECE7DE] rounded w-1/2"></div>
                  </div>
                </div>
              </td>
              <td class="p-3.5 px-2 text-right">
                <div class="h-4 bg-[#ECE7DE] rounded w-16 ml-auto"></div>
              </td>
              <td class="p-3.5 px-2">
                <div class="h-6 bg-[#ECE7DE] rounded-full w-20"></div>
              </td>
              <td class="p-3.5 px-2 text-center">
                <div class="w-10 h-10 bg-[#ECE7DE] rounded-[10px] mx-auto"></div>
              </td>
              <td class="p-3.5 px-2 text-right">
                <div class="h-4 bg-[#ECE7DE] rounded w-8 ml-auto"></div>
              </td>
              <td class="p-3.5 px-2 text-right">
                <div class="h-4 bg-[#ECE7DE] rounded w-24 ml-auto"></div>
              </td>
              <td class="p-3.5 px-4 text-right">
                <div class="h-9 bg-[#ECE7DE] rounded-lg w-44 ml-auto"></div>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else-if="filteredCourses.length === 0">
            <td colspan="7" class="py-14 text-center text-[#4C5A60]">
              <div class="max-w-sm mx-auto flex flex-col items-center gap-2">
                <svg
                  class="w-12 h-12 text-[#9AA4A8]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p class="font-semibold text-[16px] text-[#1D2A2E] mt-1">
                  Không tìm thấy khóa học nào
                </p>
                <p class="text-sm text-[#4C5A60]">
                  {{ searchQuery ? `Không có khóa học nào khớp với từ khóa "${searchQuery}"` : 'Chưa có khóa học nào trong mục này.' }}
                </p>
                <button
                  v-if="searchQuery || statusFilter !== 'ALL'"
                  @click="resetFilters"
                  class="mt-2 px-4 py-2 text-sm font-semibold text-[#0B6E6E] bg-[#E6F2F0] hover:bg-[#D5EAE7] rounded-lg transition-colors cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-else
            v-for="(course, index) in filteredCourses"
            :key="course.id"
            class="border-b border-[#EFEBE4] hover:bg-[#FAF9F6]/80 transition-colors"
          >
            <!-- Khóa học: Thumbnail + Name + Slug -->
            <td class="py-3.5 px-4">
              <div class="flex gap-3.5 items-center">
                <!-- Thumbnail with pastel tint fallback -->
                <div
                  v-if="course.thumbnail || course.image"
                  class="w-[72px] h-[48px] rounded-lg shrink-0 overflow-hidden border border-[#EFEBE4] bg-[#F4F1EB]"
                >
                  <img
                    :src="course.thumbnail || course.image"
                    :alt="course.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    @error="onImageError($event, index)"
                  />
                </div>
                <div
                  v-else
                  :style="{ background: getPastelColor(index) }"
                  class="w-[72px] h-[48px] rounded-lg shrink-0 flex items-center justify-center text-[11px] font-semibold text-[#4C5A60] select-none"
                >
                  [ẢNH]
                </div>

                <!-- Info -->
                <div class="min-w-0">
                  <div class="font-semibold text-[16px] text-[#1D2A2E] line-clamp-1 leading-snug">
                    {{ course.title || course.name }}
                  </div>
                  <div class="text-[13px] text-[#4C5A60] truncate font-sans">
                    engnest.vn/khoa-hoc/{{ course.slug }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Giá bán -->
            <td class="py-3.5 px-2 text-right font-semibold tabular-nums text-[15px] text-[#1D2A2E]">
              {{ formatVND(course.price) }}
            </td>

            <!-- Trạng thái -->
            <td class="py-3.5 px-2">
              <span
                :style="
                  isLive(course)
                    ? 'display: inline-block; font-size: 13px; font-weight: 600; padding: 3px 10px; border-radius: 99px; background: #E4F3EA; color: #155C35;'
                    : 'display: inline-block; font-size: 13px; font-weight: 600; padding: 3px 10px; border-radius: 99px; background: #ECE7DE; color: #4C5A60;'
                "
              >
                {{ isLive(course) ? 'Đang bán' : 'Nháp' }}
              </span>
            </td>

            <!-- Nổi bật -->
            <td class="py-3.5 px-2 text-center">
              <button
                type="button"
                :aria-label="isFeatured(course.id) ? 'Đang là khóa nổi bật' : 'Đặt làm khóa nổi bật'"
                :aria-pressed="isFeatured(course.id) ? 'true' : 'false'"
                @click="toggleFeatured(course)"
                :class="[
                  'w-10 h-10 rounded-[10px] border-[1.5px] cursor-pointer inline-flex items-center justify-center transition-all',
                  isFeatured(course.id)
                    ? 'border-[#E8873A] bg-[#FFF8F0] shadow-sm'
                    : 'border-[#E5E0D7] bg-white hover:border-[#C9DCD8] hover:bg-[#FAF7F2]'
                ]"
                :title="isFeatured(course.id) ? 'Đang là khóa nổi bật (Hiển thị lớn trên trang chủ)' : 'Bấm để đặt làm khóa nổi bật'"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  :fill="isFeatured(course.id) ? '#E8873A' : 'none'"
                  :stroke="isFeatured(course.id) ? '#B4531A' : '#9AA4A8'"
                  stroke-width="2"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"
                  ></path>
                </svg>
              </button>
            </td>

            <!-- Đã bán -->
            <td class="py-3.5 px-2 text-right tabular-nums text-[15px] text-[#1D2A2E]">
              {{ course.buyersCount || 0 }}
            </td>

            <!-- Doanh thu -->
            <td class="py-3.5 px-2 text-right tabular-nums font-semibold text-[15px] text-[#1D2A2E]">
              {{ formatVND(course.realRevenue !== undefined ? course.realRevenue : (course.price || 0) * (course.buyersCount || 0)) }}
            </td>

            <!-- Thao tác -->
            <td class="py-3.5 px-4 text-right">
              <div class="flex justify-end gap-2 items-center">
                <!-- Sửa -->
                <router-link
                  :to="`/courses/${course.id}/edit`"
                  style="
                    height: 38px;
                    padding: 0 14px;
                    border-radius: 8px;
                    border: 1.5px solid #C9DCD8;
                    color: #0B6E6E;
                    font-weight: 600;
                    font-size: 14px;
                    display: inline-flex;
                    align-items: center;
                    text-decoration: none;
                    box-sizing: border-box;
                  "
                  class="hover:bg-[#E6F2F0] transition-colors"
                >
                  Sửa
                </router-link>

                <!-- Xem trang -->
                <a
                  :href="getCoursePublicUrl(course.slug)"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="
                    height: 38px;
                    padding: 0 14px;
                    border-radius: 8px;
                    border: 1.5px solid #E5E0D7;
                    color: #1D2A2E;
                    font-weight: 600;
                    font-size: 14px;
                    display: inline-flex;
                    align-items: center;
                    text-decoration: none;
                    box-sizing: border-box;
                  "
                  class="hover:bg-[#FAF7F2] transition-colors"
                >
                  Xem trang
                </a>

                <!-- Chép link -->
                <button
                  type="button"
                  @click="copyLink(course)"
                  style="
                    height: 38px;
                    padding: 0 14px;
                    border-radius: 8px;
                    border: 1.5px solid #E5E0D7;
                    background: #FFFFFF;
                    color: #1D2A2E;
                    font-family: inherit;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                  "
                  class="hover:bg-[#FAF7F2] transition-colors"
                >
                  Chép link
                </button>

                <!-- Xóa -->
                <button
                  type="button"
                  @click="handleDeleteCourse(course)"
                  title="Xóa khóa học (Không xóa danh mục)"
                  style="
                    height: 38px;
                    width: 38px;
                    border-radius: 8px;
                    border: 1.5px solid #FECDCA;
                    background: #FEF3F2;
                    color: #B42318;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                  "
                  class="hover:bg-red-100 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Toast Notification -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1D2A2E] text-white px-5 py-3.5 rounded-xl shadow-xl border border-[#33403F] text-sm font-medium"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { courseApi } from "../api/course.api";
import type { Course } from "../types/course.types";
import { getFrontendPageUrl } from "@/shared/utils";

const courses = ref<Course[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const statusFilter = ref<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

// Featured course state (synced with PostgreSQL Database)
const featuredId = ref<string>("");

// Toast state
const toastMessage = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = null;
  }, 2600);
}

// Check live status
function isLive(course: Course): boolean {
  if (typeof (course as any).live === "boolean") {
    return (course as any).live;
  }
  const s = String(course.status || "").toUpperCase();
  return s === "PUBLISHED" || s === "ACTIVE" || s === "OPEN";
}

// Compute counts
const publishedCount = computed(() => {
  return courses.value.filter((c) => isLive(c)).length;
});

const draftCount = computed(() => {
  return courses.value.filter((c) => !isLive(c)).length;
});

// Filter courses
const filteredCourses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return courses.value.filter((c) => {
    // Search filter
    const titleMatch = (c.title || c.name || "").toLowerCase().includes(query);
    const slugMatch = (c.slug || "").toLowerCase().includes(query);
    const matchSearch = !query || titleMatch || slugMatch;

    // Status filter
    let matchStatus = true;
    if (statusFilter.value === "PUBLISHED") {
      matchStatus = isLive(c);
    } else if (statusFilter.value === "DRAFT") {
      matchStatus = !isLive(c);
    }

    return matchSearch && matchStatus;
  });
});

// Featured logic: synchronized with Database
function isFeatured(id: string): boolean {
  const c = courses.value.find((item) => item.id === id);
  return Boolean(c?.isFeatured || featuredId.value === id);
}

async function toggleFeatured(course: Course) {
  try {
    const updated = await courseApi.setFeatured(course.id);
    const willBeFeatured = Boolean(updated.isFeatured);

    // Cập nhật trạng thái nổi bật duy nhất trên danh sách
    courses.value = courses.value.map((c) => ({
      ...c,
      isFeatured: c.id === course.id ? willBeFeatured : false,
    }));
    featuredId.value = willBeFeatured ? course.id : "";

    if (willBeFeatured) {
      showToast(`Đã đặt "${course.title || course.name}" làm khóa nổi bật trang chủ!`);
    } else {
      showToast(`Đã bỏ chọn khóa nổi bật.`);
    }
  } catch (err) {
    console.error("Lỗi khi thay đổi khóa nổi bật:", err);
    showToast("Không thể cập nhật khóa nổi bật. Vui lòng thử lại!");
  }
}

// Format VND currency: e.g. 399.000đ
function formatVND(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(val) + "đ";
}

// Public URL for Course page
function getCoursePublicUrl(slug: string): string {
  return getFrontendPageUrl(`/khoa-hoc/${slug}`);
}

// Clipboard copy
async function copyLink(course: Course) {
  const publicUrl = getCoursePublicUrl(course.slug);
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(publicUrl);
    } else {
      // Fallback for non-https / older browsers
      const textarea = document.createElement("textarea");
      textarea.value = publicUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    showToast(`Đã chép link: ${publicUrl}`);
  } catch (err) {
    console.error("Clipboard error:", err);
    showToast(`Không thể tự động sao chép. URL: ${publicUrl}`);
  }
}

// Image fallback palette
const pastelColors = ["#E6F2F0", "#FDF0E3", "#EEEBE4", "#F3E8FF", "#EBF3FF"];
function getPastelColor(index: number): string {
  return pastelColors[index % pastelColors.length] ?? "#E6F2F0";
}

function onImageError(event: Event, index: number) {
  const img = event.target as HTMLImageElement;
  if (img && img.parentElement) {
    img.parentElement.innerHTML = `<div style="background: ${getPastelColor(
      index,
    )}; width: 72px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #4C5A60;">[ẢNH]</div>`;
  }
}

function resetFilters() {
  searchQuery.value = "";
  statusFilter.value = "ALL";
}

// Fetch Courses from API
async function fetchCourses() {
  isLoading.value = true;
  try {
    const res = await courseApi.getCourses();
    courses.value = res.items || [];

    // Đồng bộ trạng thái nổi bật từ Database
    const explicit = courses.value.find((c) => c.isFeatured);
    featuredId.value = explicit ? explicit.id : "";
  } catch (err) {
    console.error("Error fetching courses from API:", err);
  } finally {
    isLoading.value = false;
  }
}

async function handleDeleteCourse(course: Course) {
  const confirmed = confirm(
    `Bạn có chắc chắn muốn xóa khóa học "${course.title || course.name}"?\n\nLưu ý an toàn: Hệ thống chỉ xóa riêng khóa học này. Danh mục "${course.categoryName || 'liên quan'}" sẽ được giữ nguyên hoàn toàn.`
  );
  if (!confirmed) return;

  try {
    await courseApi.deleteCourse(course.id);
    showToast(`Đã xóa khóa học thành công. Danh mục không bị ảnh hưởng.`);
    await fetchCourses();
  } catch (err) {
    console.error("Lỗi xóa khóa học:", err);
    showToast("Không thể xóa khóa học. Vui lòng thử lại.");
  }
}

onMounted(() => {
  fetchCourses();
});
</script>
