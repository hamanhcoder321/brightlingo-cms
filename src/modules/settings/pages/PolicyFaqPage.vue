<template>
  <div class="p-4 sm:p-6 md:p-8 pb-16 flex flex-col gap-6 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Breadcrumb & Title -->
    <div class="flex flex-col gap-1">
      <nav aria-label="Đường dẫn" class="text-sm text-[#4C5A60] flex items-center gap-1.5">
        <router-link to="/dashboard" class="text-[#4C5A60] hover:text-[#0B6E6E] transition-colors">
          Quản trị
        </router-link>
        <span>/</span>
        <span class="font-medium text-[#1D2A2E]">Chính sách & Hỏi đáp</span>
      </nav>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="m-0 font-serif font-bold text-2xl sm:text-[30px] text-[#1D2A2E] leading-tight">
            Chính sách & Hỏi đáp (FAQ)
          </h1>
          <p class="m-0 mt-1 text-[14px] text-[#4C5A60]">
            Quản lý các câu hỏi thường gặp hiển thị trên trang chủ và nội dung các điều khoản, chính sách pháp lý.
          </p>
        </div>

        <button
          type="button"
          :disabled="isSaving"
          @click="saveFaqs"
          class="h-11 px-5 rounded-xl bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[15px] cursor-pointer flex items-center gap-2 shadow-sm transition-colors disabled:opacity-60"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75"></path>
          </svg>
          <span>{{ isSaving ? 'Đang lưu...' : 'Lưu câu hỏi FAQ' }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-[#E5E0D7] p-12 text-center text-[#4C5A60]">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0B6E6E] border-t-transparent mb-3"></div>
      <p class="font-medium text-sm">Đang tải danh sách câu hỏi...</p>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col gap-6">
      <!-- 1. Danh sách câu hỏi thường gặp (FAQ) -->
      <section class="bg-white border border-[#E5E0D7] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEBE4] pb-3">
          <div>
            <h2 class="m-0 text-[18px] font-semibold text-[#1D2A2E] flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6E" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Câu hỏi thường gặp trang chủ ({{ faqs.length }})</span>
            </h2>
            <p class="m-0 text-[13px] text-[#4C5A60] mt-0.5">
              Hiển thị ở khối Hỏi đáp & Chính sách trên trang chủ website.
            </p>
          </div>

          <button
            type="button"
            @click="addFaq"
            class="h-9 px-3.5 rounded-lg border border-dashed border-[#0B6E6E] bg-[#E6F2F0] text-[#0B6E6E] hover:bg-[#d4ece8] text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            + Thêm câu hỏi mới
          </button>
        </div>

        <div v-if="faqs.length === 0" class="text-center py-8 text-[#4C5A60] text-sm">
          Chưa có câu hỏi nào. Bấm "+ Thêm câu hỏi mới" để tạo câu hỏi đầu tiên.
        </div>

        <div v-else class="flex flex-col gap-3.5">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="border border-[#E5E0D7] rounded-xl p-4 bg-[#FCFAF7] flex flex-col gap-3"
          >
            <div class="flex items-start justify-between gap-3">
              <span class="text-xs font-bold text-[#0B6E6E] px-2 py-0.5 rounded bg-[#E6F2F0] shrink-0">
                #{{ index + 1 }}
              </span>
              <input
                v-model="faq.question"
                type="text"
                placeholder="Nhập câu hỏi (VD: Mua khóa học xong thì học thế nào?)"
                class="flex-1 font-semibold text-[15px] bg-white border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-lg px-3 py-2 outline-none"
              />
              <button
                type="button"
                @click="removeFaq(index)"
                class="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded cursor-pointer"
                title="Xóa câu hỏi"
              >
                Xóa
              </button>
            </div>

            <textarea
              v-model="faq.answer"
              rows="3"
              placeholder="Nhập câu trả lời chi tiết và rõ ràng cho học viên..."
              class="w-full text-[14px] bg-white border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-lg p-3 outline-none resize-y leading-relaxed"
            ></textarea>
          </div>
        </div>
      </section>

      <!-- 2. Danh sách trang chính sách & Pháp lý -->
      <section class="bg-white border border-[#E5E0D7] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
        <div class="border-b border-[#EFEBE4] pb-3">
          <h2 class="m-0 text-[18px] font-semibold text-[#1D2A2E] flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6E" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span>Các trang chính sách công khai trên website</span>
          </h2>
          <p class="m-0 text-[13px] text-[#4C5A60] mt-0.5">
            Các văn bản chính sách phục vụ tuân thủ pháp lý thương mại điện tử và hiển thị ở chân trang (Footer).
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="policy in policyList"
            :key="policy.slug"
            class="border border-[#E5E0D7] rounded-xl p-4 bg-[#FAF7F2] flex flex-col justify-between gap-3"
          >
            <div>
              <div class="font-bold text-[15px] text-[#1D2A2E]">{{ policy.name }}</div>
              <div class="text-xs text-[#0B6E6E] font-mono mt-0.5">{{ policy.path }}</div>
              <p class="text-xs text-[#4C5A60] mt-2 leading-relaxed">{{ policy.desc }}</p>
            </div>

            <a
              :href="getFrontendUrl(policy.path)"
              target="_blank"
              rel="noopener noreferrer"
              class="self-start text-xs font-semibold text-[#0B6E6E] hover:underline flex items-center gap-1"
            >
              <span>Xem trang thực tế</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>

    <!-- Floating Toast Notification -->
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
import { ref, onMounted } from "vue";
import { settingsApi } from "../api/settings.api";
import { getFrontendPageUrl } from "@/shared/utils";

const isLoading = ref(true);
const isSaving = ref(false);
const toastMessage = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = null;
  }, 2800);
}

function getFrontendUrl(path: string): string {
  return getFrontendPageUrl(path);
}

interface FaqItem {
  question: string;
  answer: string;
}

const faqs = ref<FaqItem[]>([
  {
    question: "Mua một lần là được học mãi mãi hay theo tháng?",
    answer: "Tất cả các khóa học và tài liệu số tại EngNest đều áp dụng hình thức mua một lần sở hữu trọn đời. Bạn hoàn toàn không phải trả thêm bất kỳ khoản phí gia hạn định kỳ nào.",
  },
  {
    question: "Sau khi chuyển khoản bao lâu thì tôi nhận được tài liệu?",
    answer: "Hệ thống đối soát tự động của ngân hàng ghi nhận trong vòng 1–3 phút. Sau khi thanh toán thành công, email chứa đường dẫn tải tài liệu và video sẽ được gửi ngay lập tức tới email bạn đã đăng ký.",
  },
  {
    question: "Tôi không rành công nghệ thì có học được không?",
    answer: "Toàn bộ tài liệu được sắp xếp khoa học trên Google Drive và website, bạn chỉ cần mở link trên máy tính, điện thoại hoặc máy tính bảng là có thể học và tải tài liệu về dễ dàng.",
  },
]);

const policyList = [
  {
    name: "Chính sách thanh toán",
    path: "/chinh-sach-thanh-toan",
    slug: "thanh-toan",
    desc: "Quy định thanh toán 1 lần trọn đời, cổng chuyển khoản VietQR tự động và đối soát giao dịch.",
  },
  {
    name: "Chính sách đổi trả & Hoàn tiền",
    path: "/chinh-sach-hoan-tien",
    slug: "hoan-tien",
    desc: "Quy định hoàn tiền 100% trong 7 ngày, quy trình tiếp nhận và thời gian xử lý hoàn tiền.",
  },
  {
    name: "Chính sách giao nhận tài liệu số",
    path: "/giao-tai-lieu-so",
    slug: "giao-hang",
    desc: "Quy trình bàn giao đường link học tập qua email ngay lập tức sau khi xác nhận thanh toán.",
  },
  {
    name: "Chính sách bảo mật thông tin",
    path: "/chinh-sach-bao-mat",
    slug: "bao-mat",
    desc: "Cam kết bảo mật dữ liệu cá nhân, thông tin liên hệ và lịch sử đơn hàng của học viên.",
  },
  {
    name: "Điều khoản sử dụng dịch vụ",
    path: "/dieu-khoan-su-dung",
    slug: "dieu-khoan",
    desc: "Quyền sở hữu trí tuệ bản quyền tài liệu và trách nhiệm của học viên khi tham gia học tập.",
  },
];

function addFaq() {
  faqs.value.push({
    question: "",
    answer: "",
  });
}

function removeFaq(index: number) {
  faqs.value.splice(index, 1);
}

async function loadData() {
  isLoading.value = true;
  try {
    const data: any = await settingsApi.getSettings();
    if (data && Array.isArray(data.faqs_list) && data.faqs_list.length > 0) {
      faqs.value = data.faqs_list;
    }
  } catch (err) {
    console.error("Load faqs error:", err);
  } finally {
    isLoading.value = false;
  }
}

async function saveFaqs() {
  isSaving.value = true;
  try {
    await settingsApi.updateSettings({
      faqs_list: faqs.value.filter((f) => f.question.trim()),
    });
    showToast("Đã lưu danh sách câu hỏi FAQ thành công!");
  } catch (err) {
    console.error("Save faqs error:", err);
    showToast("Không thể lưu, vui lòng thử lại.");
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>
