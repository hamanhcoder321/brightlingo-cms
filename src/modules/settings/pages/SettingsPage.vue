<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { settingsApi, DEFAULT_SYSTEM_SETTINGS } from "../api/settings.api";
import type {
  SystemSettings,
  HomepageSectionConfig,
  BannerItemConfig,
  BannerPosition,
  BannerStatus,
} from "../types/settings.types";

const loading = ref(true);
const saving = ref(false);
const uploadingDesktop = ref(false);
const uploadingMobile = ref(false);
const saveMessage = ref("");
const saveError = ref("");

const notify = (msg: string, isError = false) => {
  if (isError) {
    saveError.value = msg;
    saveMessage.value = "";
  } else {
    saveMessage.value = msg;
    saveError.value = "";
  }
  setTimeout(() => {
    saveMessage.value = "";
    saveError.value = "";
  }, 4000);
};

const desktopInputRef = ref<HTMLInputElement | null>(null);
const mobileInputRef = ref<HTMLInputElement | null>(null);

const form = ref<SystemSettings>(
  JSON.parse(JSON.stringify(DEFAULT_SYSTEM_SETTINGS)),
);

const selectedBannerId = ref<string>(
  form.value.banners[0]?.id || "banner-hero-main",
);

const POSITION_OPTIONS: Array<{
  value: BannerPosition;
  selectLabel: string;
  badgeLabel: string;
  defaultDimensions: string;
}> = [
  {
    value: "home_hero",
    selectLabel: "Trang chủ › Banner đầu trang",
    badgeLabel: "Trang chủ › Đầu trang",
    defaultDimensions: "1440×720 · 780×960",
  },
  {
    value: "announcement_bar",
    selectLabel: "Mọi trang › Thanh thông báo",
    badgeLabel: "Mọi trang › Thanh thông báo",
    defaultDimensions: "Chữ + link",
  },
  {
    value: "course_detail_bottom",
    selectLabel: "Chi tiết › Dưới nội dung",
    badgeLabel: "Chi tiết › Dưới nội dung",
    defaultDimensions: "1200×300",
  },
  {
    value: "home_community",
    selectLabel: "Trang chủ › Cộng đồng",
    badgeLabel: "Trang chủ › Cộng đồng",
    defaultDimensions: "800×600",
  },
  {
    value: "home_after_courses",
    selectLabel: "Trang chủ › Sau khóa học",
    badgeLabel: "Trang chủ › Sau khóa học",
    defaultDimensions: "1200×300",
  },
];

const sortedSections = computed(() => {
  return [...form.value.homepage_sections].sort((a, b) => a.order - b.order);
});

const selectedBanner = computed<BannerItemConfig | null>(() => {
  return (
    form.value.banners.find((b) => b.id === selectedBannerId.value) ||
    form.value.banners[0] ||
    null
  );
});

const normalizeSectionOrders = (sections: HomepageSectionConfig[]) => {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  sorted.forEach((sec, idx) => {
    sec.order = idx + 1;
  });
  form.value.homepage_sections = sorted;
};

const moveSection = (index: number, direction: -1 | 1) => {
  const list = [...sortedSections.value];
  const targetIndex = index + direction;
  const currentItem = list[index];
  const targetItem = list[targetIndex];
  if (!currentItem || !targetItem) return;
  list[index] = targetItem;
  list[targetIndex] = currentItem;
  list.forEach((item, idx) => {
    item.order = idx + 1;
  });
  form.value.homepage_sections = list;
};

const toggleSection = (section: HomepageSectionConfig) => {
  if (section.phase2) return;
  section.enabled = !section.enabled;
};

const selectBanner = (banner: BannerItemConfig) => {
  selectedBannerId.value = banner.id;
};

const handlePositionChange = (banner: BannerItemConfig) => {
  const found = POSITION_OPTIONS.find((opt) => opt.value === banner.position);
  if (found) {
    banner.positionLabel = found.badgeLabel;
    if (!banner.dimensions) {
      banner.dimensions = found.defaultDimensions;
    }
  }
};

const handleDateChange = (banner: BannerItemConfig) => {
  if (banner.status === "inactive") return;
  const today = new Date().toISOString().slice(0, 10);
  if (banner.startDate && banner.startDate > today) {
    banner.status = "scheduled";
  } else {
    banner.status = "active";
  }
};

const cycleBannerStatus = (banner: BannerItemConfig) => {
  const order: BannerStatus[] = ["active", "scheduled", "inactive"];
  const nextIndex = (order.indexOf(banner.status) + 1) % order.length;
  banner.status = order[nextIndex] || "active";
};

const addBanner = () => {
  const newBanner: BannerItemConfig = {
    id: `banner-${Date.now()}`,
    name: `Banner mới #${form.value.banners.length + 1}`,
    dimensions: "1440×720 · 780×960",
    position: "home_hero",
    positionLabel: "Trang chủ › Đầu trang",
    priority:
      form.value.banners.filter((b) => b.position === "home_hero").length + 1,
    startDate: "",
    endDate: "",
    status: "active",
    desktopImage: "",
    mobileImage: "",
    altText: "",
    title: "Tiêu đề banner mới",
    subtitle: "",
    ctaText: "Xem các khóa học",
    ctaLink: "/#khoa-hoc-noi-bat",
    openInNewTab: false,
  };
  form.value.banners.push(newBanner);
  selectedBannerId.value = newBanner.id;
  notify("Đã thêm banner mới. Hãy chỉnh sửa chi tiết ở khung bên dưới.");
};

const removeSelectedBanner = () => {
  if (!selectedBanner.value) return;
  if (form.value.banners.length <= 1) {
    notify("Cần giữ lại ít nhất 1 banner trong hệ thống.", true);
    return;
  }
  const removedName = selectedBanner.value.name;
  form.value.banners = form.value.banners.filter(
    (b) => b.id !== selectedBanner.value?.id,
  );
  selectedBannerId.value = form.value.banners[0]?.id || "";
  notify(`Đã xóa banner "${removedName}" (Nhấn Lưu thay đổi để cập nhật).`);
};

const formatBannerTime = (banner: BannerItemConfig): string => {
  if (!banner.startDate && !banner.endDate) {
    return banner.status === "inactive" ? "—" : "Luôn hiện";
  }
  const fmt = (iso: string) => {
    if (!iso) return "...";
    const parts = iso.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return iso;
  };
  if (banner.startDate && banner.endDate) {
    return `${fmt(banner.startDate)} – ${fmt(banner.endDate)}`;
  }
  if (banner.startDate) {
    return `Từ ${fmt(banner.startDate)}`;
  }
  return `Đến ${fmt(banner.endDate)}`;
};

const statusBadgeMeta = (status: BannerStatus) => {
  switch (status) {
    case "active":
      return {
        label: "Đang hiện",
        classes: "bg-[#E5F5EC] text-[#1F7A4C]",
      };
    case "scheduled":
      return {
        label: "Lên lịch",
        classes: "bg-[#FDF0E6] text-[#B4531A]",
      };
    default:
      return {
        label: "Tạm tắt",
        classes: "bg-[#ECE8DF] text-[#4C5A60]",
      };
  }
};

const triggerUpload = (target: "desktop" | "mobile") => {
  if (target === "desktop") {
    desktopInputRef.value?.click();
  } else {
    mobileInputRef.value?.click();
  }
};

const onFileChange = async (
  event: Event,
  target: "desktop" | "mobile",
) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !selectedBanner.value) return;

  try {
    if (target === "desktop") uploadingDesktop.value = true;
    else uploadingMobile.value = true;

    const url = await settingsApi.uploadImage(file);
    if (url) {
      if (target === "desktop") {
        selectedBanner.value.desktopImage = url;
      } else {
        selectedBanner.value.mobileImage = url;
      }
      notify("Tải ảnh banner lên thành công!");
    }
  } catch {
    notify("Không thể tải ảnh lên. Vui lòng kiểm tra định dạng hoặc dung lượng ảnh.", true);
  } finally {
    if (target === "desktop") uploadingDesktop.value = false;
    else uploadingMobile.value = false;
    input.value = "";
  }
};

const openHomepagePreview = () => {
  const domain = form.value.primary_domain || "http://localhost:3000";
  const targetUrl = domain.includes("localhost")
    ? domain
    : "http://localhost:3000";
  window.open(targetUrl, "_blank", "noopener,noreferrer");
};

const loadSettings = async () => {
  loading.value = true;
  try {
    const data = await settingsApi.getSettings();
    form.value = JSON.parse(JSON.stringify(data));
    normalizeSectionOrders(form.value.homepage_sections);
    const firstBanner = form.value.banners[0];
    if (
      firstBanner &&
      !form.value.banners.some((b) => b.id === selectedBannerId.value)
    ) {
      selectedBannerId.value = firstBanner.id;
    }
  } catch {
    notify("Không thể tải cấu hình giao diện & banner", true);
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  saving.value = true;
  try {
    normalizeSectionOrders(form.value.homepage_sections);
    await settingsApi.updateSettings(form.value);
    notify("Đã lưu cấu hình Giao diện & Banner thành công!");
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Lỗi khi lưu cấu hình Giao diện & Banner";
    notify(Array.isArray(msg) ? msg.join(", ") : msg, true);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8 pb-14 flex flex-col gap-4 sm:gap-[22px] max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Topbar -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="m-0 font-serif font-bold text-2xl sm:text-[32px] text-[#1D2A2E] leading-tight">
          Giao diện &amp; Banner
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px]">
          Sắp xếp các khối trang chủ, quản lý ảnh/banner theo vị trí và các liên kết mạng xã hội.
        </p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          class="h-[46px] px-4 rounded-[10px] border-[1.5px] border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#1D2A2E] font-semibold text-[15px] inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          @click="openHomepagePreview"
        >
          Xem trang chủ
        </button>
        <button
          type="button"
          :disabled="saving || loading"
          class="h-[46px] px-5 rounded-[10px] border-0 bg-[#0B6E6E] hover:bg-[#08585A] text-white font-bold text-[15px] inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
          @click="handleSave"
        >
          <span
            v-if="saving"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          <span>{{ saving ? "Đang lưu..." : "Lưu thay đổi" }}</span>
        </button>
      </div>
    </div>

    <div
      v-if="saveMessage"
      class="p-3.5 px-4 rounded-[12px] bg-[#E4F3EA] border border-[#A4DBC0] text-[#155C35] text-[14px] font-medium"
    >
      {{ saveMessage }}
    </div>
    <div
      v-if="saveError"
      class="p-3.5 px-4 rounded-[12px] bg-[#FBEAEA] border border-[#F3B8B8] text-[#B83232] text-[14px] font-medium"
    >
      {{ saveError }}
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-[18px]">
      <div
        v-for="i in 2"
        :key="i"
        class="h-96 bg-[#FFFEFA] rounded-[14px] border border-[#E5E0D7] animate-pulse"
      ></div>
    </div>

    <template v-else>
      <!-- Top Grid: 1. Thứ tự khối trên trang chủ & 2. Banner & ảnh theo vị trí -->
      <div class="grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-[18px] items-start">
        <!-- 1. Thứ tự khối trên trang chủ -->
        <div class="bg-[#FFFEFA] border border-[#E5E0D7] rounded-[14px] p-5">
          <div class="mb-3.5">
            <h2 class="text-[15.5px] font-bold text-[#1D2A2E]">
              1. Thứ tự khối trên trang chủ
            </h2>
            <p class="text-[12px] text-[#7A878D] mt-0.5">
              Số nhỏ hiển thị trước. Bấm mũi tên để đổi vị trí, công tắc để ẩn/hiện.
            </p>
          </div>

          <div class="space-y-2.5">
            <div
              v-for="(section, idx) in sortedSections"
              :key="section.id"
              :class="[
                'flex items-center justify-between gap-2.5 p-3 rounded-[10px] border transition-colors',
                section.phase2
                  ? 'bg-[#F5F2EB] border-[#E5E0D7] opacity-75'
                  : 'bg-[#FFFEFA] border-[#E5E0D7] hover:border-[#D8D2C7]',
              ]"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span
                  :class="[
                    'w-7 h-7 rounded-[7px] font-bold text-[12px] grid place-items-center shrink-0',
                    section.phase2
                      ? 'bg-[#ECE8DF] text-[#7A878D]'
                      : 'bg-[#E3F1EF] text-[#085454]',
                  ]"
                >
                  {{ idx + 1 }}
                </span>
                <div class="min-w-0">
                  <div class="text-[13px] font-bold text-[#1D2A2E] truncate">
                    {{ section.name }}
                  </div>
                  <div class="text-[11.5px] text-[#7A878D] leading-snug">
                    {{ section.description }}
                  </div>
                </div>
              </div>

              <!-- Right controls -->
              <div v-if="section.phase2" class="shrink-0">
                <span
                  class="px-2.5 py-1 rounded-full bg-[#ECE8DF] text-[#4C5A60] text-[11px] font-bold"
                >
                  GĐ 2
                </span>
              </div>
              <div v-else class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="section.enabled"
                  :class="[
                    'relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out mr-1',
                    section.enabled ? 'bg-[#0B6E6E]' : 'bg-[#CBD2D5]',
                  ]"
                  @click="toggleSection(section)"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-[3px]',
                      section.enabled ? 'translate-x-[19px]' : 'translate-x-[3px]',
                    ]"
                  />
                </button>
                <button
                  type="button"
                  :disabled="idx === 0"
                  class="w-7 h-7 rounded-[7px] border border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#4C5A60] grid place-items-center text-[10px] cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                  title="Chuyển lên"
                  @click="moveSection(idx, -1)"
                >
                  ▲
                </button>
                <button
                  type="button"
                  :disabled="idx === sortedSections.length - 1"
                  class="w-7 h-7 rounded-[7px] border border-[#D8D2C7] bg-white hover:bg-[#FAF7F2] text-[#4C5A60] grid place-items-center text-[10px] cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                  title="Chuyển xuống"
                  @click="moveSection(idx, 1)"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Banner & ảnh theo vị trí -->
        <div class="bg-[#FFFEFA] border border-[#E5E0D7] rounded-[14px] p-5 overflow-hidden">
          <div>
            <h2 class="text-[15.5px] font-bold text-[#1D2A2E]">
              2. Banner &amp; ảnh theo vị trí
            </h2>
            <p class="text-[12px] text-[#7A878D] mt-0.5">
              Cùng một vị trí: ưu tiên 1 hiện trước. Hết hạn sẽ tự chuyển sang banner kế tiếp.
            </p>
          </div>

          <div class="mt-3 mb-3.5">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] border border-[#0B6E6E] text-[#0B6E6E] bg-white hover:bg-[#E3F1EF]/50 text-[13px] font-semibold transition-colors cursor-pointer"
              @click="addBanner"
            >
              + Thêm banner
            </button>
          </div>

          <div class="overflow-x-auto -mx-5 px-5">
            <table class="w-full border-collapse min-w-[640px]">
              <thead>
                <tr class="border-b border-[#E5E0D7]">
                  <th
                    class="py-2.5 px-2.5 text-left text-[11px] uppercase tracking-[0.05em] text-[#7A878D] font-bold"
                  >
                    Banner
                  </th>
                  <th
                    class="py-2.5 px-2.5 text-left text-[11px] uppercase tracking-[0.05em] text-[#7A878D] font-bold"
                  >
                    Vị trí đặt
                  </th>
                  <th
                    class="py-2.5 px-2.5 text-left text-[11px] uppercase tracking-[0.05em] text-[#7A878D] font-bold"
                  >
                    Ưu tiên
                  </th>
                  <th
                    class="py-2.5 px-2.5 text-left text-[11px] uppercase tracking-[0.05em] text-[#7A878D] font-bold"
                  >
                    Thời gian
                  </th>
                  <th
                    class="py-2.5 px-2.5 text-left text-[11px] uppercase tracking-[0.05em] text-[#7A878D] font-bold"
                  >
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E5E0D7]">
                <tr
                  v-for="banner in form.banners"
                  :key="banner.id"
                  :class="[
                    'cursor-pointer transition-colors',
                    selectedBannerId === banner.id
                      ? 'bg-[#E3F1EF]/45'
                      : 'hover:bg-[#FAF7F2]',
                  ]"
                  @click="selectBanner(banner)"
                >
                  <!-- Banner Thumbnail + Title -->
                  <td class="py-3 px-2.5">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          'w-[50px] h-[34px] rounded-[6px] border grid place-items-center text-[10px] font-bold shrink-0 overflow-hidden',
                          banner.position === 'announcement_bar'
                            ? 'bg-[#1D2A2E] border-[#1D2A2E] text-white'
                            : banner.status === 'scheduled'
                              ? 'bg-[#FDF0E6] border-[#F2D1B8] text-[#B4531A]'
                              : 'bg-[#E3F1EF] border-[#C5DFDC] text-[#085454]',
                        ]"
                      >
                        <img
                          v-if="banner.desktopImage"
                          :src="banner.desktopImage"
                          :alt="banner.altText || banner.name"
                          class="w-full h-full object-cover"
                        />
                        <span v-else>
                          {{ banner.position === "announcement_bar" ? "[TEXT]" : "[ẢNH]" }}
                        </span>
                      </div>
                      <div class="min-w-0">
                        <div class="text-[13px] font-bold text-[#1D2A2E] leading-snug">
                          {{ banner.name }}
                        </div>
                        <div class="text-[11px] text-[#7A878D]">
                          {{ banner.dimensions }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Vị trí đặt -->
                  <td class="py-3 px-2.5">
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E3F1EF] text-[#085454] text-[11.5px] font-semibold whitespace-nowrap"
                    >
                      {{ banner.positionLabel }}
                    </span>
                  </td>

                  <!-- Ưu tiên -->
                  <td class="py-3 px-2.5" @click.stop>
                    <input
                      v-model.number="banner.priority"
                      type="number"
                      min="1"
                      class="w-[62px] px-2.5 py-1.5 rounded-[8px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] font-medium focus:outline-none focus:border-[#0B6E6E]"
                    />
                  </td>

                  <!-- Thời gian -->
                  <td class="py-3 px-2.5 text-[12.5px] text-[#1D2A2E] whitespace-nowrap">
                    {{ formatBannerTime(banner) }}
                  </td>

                  <!-- Trạng thái -->
                  <td class="py-3 px-2.5" @click.stop>
                    <button
                      type="button"
                      :class="[
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-bold whitespace-nowrap cursor-pointer transition-opacity hover:opacity-85',
                        statusBadgeMeta(banner.status).classes,
                      ]"
                      title="Bấm để đổi nhanh trạng thái"
                      @click="cycleBannerStatus(banner)"
                    >
                      {{ statusBadgeMeta(banner.status).label }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Selected Banner Editor Card -->
      <div
        v-if="selectedBanner"
        class="bg-[#FFFEFA] border-2 border-[#9FC9C2] rounded-[14px] p-5"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div class="flex items-center gap-2.5 flex-wrap">
            <h2 class="text-[15.5px] font-bold text-[#1D2A2E]">
              Sửa banner: {{ selectedBanner.name }}
            </h2>
            <input
              v-model="selectedBanner.name"
              type="text"
              placeholder="Tên gọi quản trị..."
              class="px-2.5 py-1 rounded-[7px] border border-[#D8D2C7] bg-[#FAF7F2] text-[12px] text-[#1D2A2E] font-medium focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div class="text-[12px] text-[#7A878D]">
            Nên dùng ảnh người thật, ánh sáng ấm, chừa khoảng trắng cho chữ.
          </div>
        </div>

        <!-- Hidden file inputs -->
        <input
          ref="desktopInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange($event, 'desktop')"
        />
        <input
          ref="mobileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange($event, 'mobile')"
        />

        <!-- Row 1: Desktop Image | Mobile Image | Alt Text -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <!-- Ảnh máy tính -->
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Ảnh máy tính (1440×720)
            </label>
            <div
              class="h-[118px] rounded-[10px] border border-dashed border-[#9FC9C2] bg-[#E3F1EF]/55 text-[#085454] font-semibold text-[12px] flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden group"
              @click="triggerUpload('desktop')"
            >
              <img
                v-if="selectedBanner.desktopImage"
                :src="selectedBanner.desktopImage"
                :alt="selectedBanner.altText || selectedBanner.name"
                class="w-full h-full object-cover"
              />
              <template v-else>
                <span>
                  {{ uploadingDesktop ? "ĐANG TẢI ẢNH..." : "[ẢNH HERO DESKTOP]" }}
                </span>
                <span class="text-[11px] font-normal text-[#4C5A60]">
                  Bấm để tải ảnh lên
                </span>
              </template>
              <div
                v-if="selectedBanner.desktopImage"
                class="absolute inset-0 bg-[#1D2A2E]/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
              >
                <span class="px-2.5 py-1 rounded bg-white text-[#1D2A2E] text-[11px] font-semibold">
                  Đổi ảnh
                </span>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded bg-[#B83232] text-white text-[11px] font-semibold"
                  @click.stop="selectedBanner.desktopImage = ''"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>

          <!-- Ảnh điện thoại -->
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Ảnh điện thoại (780×960)
            </label>
            <div
              class="h-[118px] rounded-[10px] border border-dashed border-[#9FC9C2] bg-[#E3F1EF]/55 text-[#085454] font-semibold text-[12px] flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden group"
              @click="triggerUpload('mobile')"
            >
              <img
                v-if="selectedBanner.mobileImage"
                :src="selectedBanner.mobileImage"
                :alt="selectedBanner.altText || selectedBanner.name"
                class="w-full h-full object-cover"
              />
              <template v-else>
                <span>
                  {{ uploadingMobile ? "ĐANG TẢI ẢNH..." : "[ẢNH HERO MOBILE]" }}
                </span>
                <span class="text-[11px] font-normal text-[#4C5A60]">
                  Bấm để tải ảnh lên
                </span>
              </template>
              <div
                v-if="selectedBanner.mobileImage"
                class="absolute inset-0 bg-[#1D2A2E]/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
              >
                <span class="px-2.5 py-1 rounded bg-white text-[#1D2A2E] text-[11px] font-semibold">
                  Đổi ảnh
                </span>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded bg-[#B83232] text-white text-[11px] font-semibold"
                  @click.stop="selectedBanner.mobileImage = ''"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>

          <!-- Mô tả ảnh (alt) -->
          <div class="flex flex-col justify-between">
            <div>
              <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
                Mô tả ảnh (alt)
              </label>
              <input
                v-model="selectedBanner.altText"
                type="text"
                placeholder="Mẹ và con cùng học sách tranh tiếng Anh"
                class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
              />
            </div>

            <div class="grid grid-cols-2 gap-2.5 mt-2.5">
              <div>
                <label class="block text-[11.5px] font-semibold text-[#4C5A60] mb-1">
                  Trạng thái hiển thị
                </label>
                <select
                  v-model="selectedBanner.status"
                  class="w-full px-2.5 py-1.5 rounded-[8px] border border-[#D8D2C7] bg-white text-[12.5px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
                >
                  <option value="active">Đang hiện</option>
                  <option value="scheduled">Lên lịch</option>
                  <option value="inactive">Tạm tắt</option>
                </select>
              </div>
              <div>
                <label class="block text-[11.5px] font-semibold text-[#4C5A60] mb-1">
                  Kích thước gợi ý
                </label>
                <input
                  v-model="selectedBanner.dimensions"
                  type="text"
                  class="w-full px-2.5 py-1.5 rounded-[8px] border border-[#D8D2C7] bg-white text-[12.5px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Tiêu đề | Chữ trên nút | Link của nút -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Tiêu đề
            </label>
            <input
              v-model="selectedBanner.title"
              type="text"
              placeholder="Học tiếng Anh tại nhà – cho bạn và cho con"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Chữ trên nút
            </label>
            <input
              v-model="selectedBanner.ctaText"
              type="text"
              placeholder="Xem các khóa học"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Link của nút
            </label>
            <input
              v-model="selectedBanner.ctaLink"
              type="text"
              placeholder="/#khoa-hoc"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
        </div>

        <!-- Row 3: Vị trí đặt | Ưu tiên | Hiện từ ngày | Đến ngày -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Vị trí đặt
            </label>
            <select
              v-model="selectedBanner.position"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
              @change="handlePositionChange(selectedBanner)"
            >
              <option
                v-for="opt in POSITION_OPTIONS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.selectLabel }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Ưu tiên
            </label>
            <input
              v-model.number="selectedBanner.priority"
              type="number"
              min="1"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Hiện từ ngày
            </label>
            <input
              v-model="selectedBanner.startDate"
              type="date"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
              @change="handleDateChange(selectedBanner)"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Đến ngày (để trống = luôn hiện)
            </label>
            <input
              v-model="selectedBanner.endDate"
              type="date"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
              @change="handleDateChange(selectedBanner)"
            />
          </div>
        </div>

        <!-- Row 4: Open in new tab + Delete button -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E5E0D7]">
          <label
            class="inline-flex items-center gap-2 text-[12.5px] text-[#1D2A2E] cursor-pointer select-none"
            style="color-scheme: light"
          >
            <input
              v-model="selectedBanner.openInNewTab"
              type="checkbox"
              class="w-4 h-4 rounded accent-[#0B6E6E] cursor-pointer"
            />
            <span>Mở link ở tab mới (dùng cho link ra Facebook, Zalo)</span>
          </label>

          <button
            v-if="form.banners.length > 1"
            type="button"
            class="text-[12px] font-semibold text-[#B83232] hover:underline cursor-pointer"
            @click="removeSelectedBanner"
          >
            Xóa banner này
          </button>
        </div>
      </div>

      <!-- 3. Liên kết, mạng xã hội & cộng đồng -->
      <div class="bg-[#FFFEFA] border border-[#E5E0D7] rounded-[14px] p-5">
        <div class="mb-4">
          <h2 class="text-[15.5px] font-bold text-[#1D2A2E]">
            3. Liên kết, mạng xã hội &amp; cộng đồng
          </h2>
          <p class="text-[12px] text-[#7A878D] mt-0.5">
            Dùng chung cho footer, khối Liên hệ và khối Cộng đồng trên trang chủ.
          </p>
        </div>

        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Zalo (số hoặc link Zalo OA)
            </label>
            <input
              v-model="form.zalo_url"
              type="text"
              placeholder="https://zalo.me/..."
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Fanpage Facebook
            </label>
            <input
              v-model="form.fanpage_url"
              type="text"
              placeholder="https://facebook.com/..."
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Nhóm cộng đồng Facebook
            </label>
            <input
              v-model="form.community_group_url"
              type="text"
              placeholder="https://facebook.com/groups/..."
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Tên nhóm hiển thị
            </label>
            <input
              v-model="form.community_group_name"
              type="text"
              placeholder="Dạy con tiếng Anh tự nhiên"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Số thành viên hiển thị
            </label>
            <input
              v-model="form.community_members"
              type="text"
              placeholder="Ví dụ: 12.000+"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              YouTube / TikTok (không bắt buộc)
            </label>
            <input
              v-model="form.youtube_tiktok_url"
              type="text"
              placeholder="https://..."
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
        </div>

        <!-- Row 3 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Hotline
            </label>
            <input
              v-model="form.hotline"
              type="text"
              placeholder="09xx xxx xxx"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Email hỗ trợ
            </label>
            <input
              v-model="form.support_email"
              type="email"
              placeholder="hotro@engnest.vn"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Giờ làm việc
            </label>
            <input
              v-model="form.working_hours"
              type="text"
              placeholder="8:00–21:00 hằng ngày"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
        </div>

        <!-- Row 4 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Tên công ty / hộ kinh doanh
            </label>
            <input
              v-model="form.company_name"
              type="text"
              placeholder="Hộ kinh doanh Giáo dục EngNest"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Mã số thuế
            </label>
            <input
              v-model="form.tax_id"
              type="text"
              placeholder="010xxxxxxx"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
          <div>
            <label class="block text-[12px] font-semibold text-[#1D2A2E] mb-1.5">
              Địa chỉ
            </label>
            <input
              v-model="form.company_address"
              type="text"
              placeholder="Cầu Giấy, Hà Nội"
              class="w-full px-3 py-2 rounded-[9px] border border-[#D8D2C7] bg-white text-[13px] text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
