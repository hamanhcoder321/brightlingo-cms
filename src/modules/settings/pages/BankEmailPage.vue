<template>
  <div class="p-4 sm:p-6 md:p-8 pb-16 flex flex-col gap-6 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Breadcrumb & Title -->
    <div class="flex flex-col gap-1">
      <nav aria-label="Đường dẫn" class="text-sm text-[#4C5A60] flex items-center gap-1.5">
        <router-link to="/dashboard" class="text-[#4C5A60] hover:text-[#0B6E6E] transition-colors">
          Quản trị
        </router-link>
        <span>/</span>
        <span class="font-medium text-[#1D2A2E]">Ngân hàng & Email</span>
      </nav>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="m-0 font-serif font-bold text-2xl sm:text-[30px] text-[#1D2A2E] leading-tight">
            Cấu hình Ngân hàng & Email bàn giao
          </h1>
          <p class="m-0 mt-1 text-[14px] text-[#4C5A60]">
            Thiết lập tài khoản ngân hàng nhận thanh toán VietQR và mẫu email bàn giao tài liệu tự động sau khi thanh toán.
          </p>
        </div>

        <button
          type="button"
          :disabled="isSaving"
          @click="saveSettings"
          class="h-11 px-5 rounded-xl bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[15px] cursor-pointer flex items-center gap-2 shadow-sm transition-colors disabled:opacity-60"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75"></path>
          </svg>
          <span>{{ isSaving ? 'Đang lưu...' : 'Lưu cấu hình' }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-[#E5E0D7] p-12 text-center text-[#4C5A60]">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0B6E6E] border-t-transparent mb-3"></div>
      <p class="font-medium text-sm">Đang tải cấu hình...</p>
    </div>

    <!-- Content Sections -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- 1. Ngân hàng nhận thanh toán (VietQR) -->
      <section class="bg-white border border-[#E5E0D7] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-sm">
        <div class="border-b border-[#EFEBE4] pb-3">
          <h2 class="m-0 text-[18px] font-semibold text-[#1D2A2E] flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6E" stroke-width="2">
              <rect x="3" y="5" width="18" height="14" rx="2"></rect>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Tài khoản ngân hàng VietQR</span>
          </h2>
          <p class="m-0 text-[13px] text-[#4C5A60] mt-1">
            Thông tin hiển thị trên mã QR động Napas 24/7 khi khách hàng bấm mua khóa học.
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <label class="flex flex-col gap-1.5 font-medium text-[14px]">
            Mã ngân hàng (Bank Code) *
            <select
              v-model="form.vietqr_bank_code"
              class="h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3 text-[15px] bg-white outline-none"
            >
              <option value="MBBANK">MBBank (Ngân hàng Quân Đội)</option>
              <option value="VCB">Vietcombank</option>
              <option value="TCB">Techcombank</option>
              <option value="ACB">ACB</option>
              <option value="VPB">VPBank</option>
              <option value="TPB">TPBank</option>
              <option value="BIDV">BIDV</option>
              <option value="ICB">VietinBank</option>
            </select>
          </label>

          <label class="flex flex-col gap-1.5 font-medium text-[14px]">
            Số tài khoản nhận tiền *
            <input
              v-model="form.vietqr_account_number"
              type="text"
              required
              placeholder="0399046519"
              class="h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] font-mono outline-none"
            />
          </label>

          <label class="flex flex-col gap-1.5 font-medium text-[14px]">
            Tên chủ tài khoản (In hoa không dấu) *
            <input
              v-model="form.vietqr_account_name"
              type="text"
              required
              placeholder="HA VAN MANH"
              class="h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] uppercase font-mono outline-none"
            />
          </label>

          <label class="flex flex-col gap-1.5 font-medium text-[14px]">
            Tiền tố mã đơn hàng (Order Code Prefix) *
            <input
              v-model="form.order_code_prefix"
              type="text"
              maxlength="6"
              placeholder="EN"
              class="h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] font-mono uppercase outline-none"
            />
            <span class="text-[12px] font-normal text-[#4C5A60]">
              Ví dụ: "EN" sẽ sinh mã đơn: EN-1234. Học viên chuyển khoản với nội dung là mã này để hệ thống đối soát tự động.
            </span>
          </label>
        </div>

        <!-- QR Preview Card -->
        <div class="mt-2 bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 flex items-center gap-4">
          <div class="w-16 h-16 bg-white border border-[#D8D2C7] rounded-lg flex items-center justify-center shrink-0">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0B6E6E" stroke-width="1.5">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <div class="text-[13px] leading-snug">
            <div class="font-bold text-[#1D2A2E]">{{ form.vietqr_bank_code }} · {{ form.vietqr_account_number }}</div>
            <div class="text-[#4C5A60] font-mono uppercase">{{ form.vietqr_account_name }}</div>
            <div class="text-xs text-[#0B6E6E] mt-1">Chuẩn VietQR QuickLink (Napas247)</div>
          </div>
        </div>
      </section>

      <!-- 2. Email bàn giao tự động -->
      <section class="bg-white border border-[#E5E0D7] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-sm">
        <div class="border-b border-[#EFEBE4] pb-3">
          <h2 class="m-0 text-[18px] font-semibold text-[#1D2A2E] flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6E" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Mẫu email gửi học viên</span>
          </h2>
          <p class="m-0 text-[13px] text-[#4C5A60] mt-1">
            Email tự động gửi ngay sau khi tài khoản ngân hàng nhận tiền thành công.
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="flex flex-col gap-1.5 font-medium text-[14px]">
              Tên người gửi (Sender Name) *
              <input
                v-model="form.email_sender_name"
                type="text"
                placeholder="EngNest Support"
                class="h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none"
              />
            </label>

            <label class="flex flex-col gap-1.5 font-medium text-[14px]">
              Email gửi / Reply-to *
              <input
                v-model="form.email_sender_address"
                type="email"
                placeholder="hotro@engnest.vn"
                class="h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none"
              />
            </label>
          </div>

          <label class="flex flex-col gap-1.5 font-medium text-[14px]">
            Tiêu đề email mặc định *
            <input
              v-model="form.delivery_email_subject"
              type="text"
              placeholder="[EngNest] Khóa học {ten_khoa_hoc} của bạn đã sẵn sàng"
              class="h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none"
            />
          </label>

          <label class="flex flex-col gap-1.5 font-medium text-[14px]">
            Nội dung email mặc định *
            <textarea
              v-model="form.delivery_email_body"
              rows="6"
              class="border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl p-3 text-[14px] leading-relaxed outline-none resize-y"
            ></textarea>
          </label>

          <div class="flex flex-wrap gap-1.5 items-center text-[13px]">
            <span class="text-[#4C5A60] font-medium">Chèn biến:</span>
            <button
              v-for="tag in ['{ho_ten}', '{ma_don}', '{ten_khoa_hoc}', '{link_drive}']"
              :key="tag"
              type="button"
              @click="insertTag(tag)"
              class="h-7 px-2 rounded-md border border-[#C9DCD8] bg-[#E6F2F0] text-[#08585A] font-semibold text-[12px] hover:bg-[#d4ece8] cursor-pointer"
            >
              {{ tag }}
            </button>
          </div>

          <div class="pt-2 flex justify-between items-center border-t border-[#EFEBE4]">
            <span class="text-xs text-[#4C5A60]">Tích hợp qua Resend / SMTP</span>
            <button
              type="button"
              @click="sendTestEmail"
              class="h-9 px-3.5 rounded-lg border border-[#D8D2C7] hover:bg-[#FAF7F2] text-[#1D2A2E] text-xs font-semibold cursor-pointer transition-colors"
            >
              Gửi email thử nghiệm
            </button>
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
import { ref, reactive, onMounted } from "vue";
import { settingsApi } from "../api/settings.api";

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

const form = reactive({
  vietqr_bank_code: "MBBANK",
  vietqr_account_number: "0399046519",
  vietqr_account_name: "HA VAN MANH",
  order_code_prefix: "EN",
  email_sender_name: "EngNest Support",
  email_sender_address: "hotro@engnest.vn",
  delivery_email_subject: "[EngNest] Khóa học {ten_khoa_hoc} của bạn đã sẵn sàng",
  delivery_email_body: `Chào {ho_ten},

Cảm ơn bạn đã mua khóa học “{ten_khoa_hoc}” (mã đơn {ma_don}).
Bấm vào đường link dưới đây để mở toàn bộ video và tài liệu học tập trọn đời:

[Mở khóa học & Tài liệu] → {link_drive}

Mẹo: Lưu email này lại để truy cập lâu dài. Nếu gặp bất kỳ khó khăn nào, vui lòng liên hệ hotline/Zalo hỗ trợ của chúng tôi!`,
});

function insertTag(tag: string) {
  form.delivery_email_body += ` ${tag}`;
}

function sendTestEmail() {
  showToast("Đã gửi email thử nghiệm mẫu đến địa chỉ " + form.email_sender_address);
}

async function loadData() {
  isLoading.value = true;
  try {
    const data: any = await settingsApi.getSettings();
    if (data) {
      if (data.vietqr_bank_code) form.vietqr_bank_code = data.vietqr_bank_code;
      if (data.vietqr_account_number) form.vietqr_account_number = data.vietqr_account_number;
      if (data.vietqr_account_name) form.vietqr_account_name = data.vietqr_account_name;
      if (data.order_code_prefix) form.order_code_prefix = data.order_code_prefix;
      if (data.email_sender_name) form.email_sender_name = data.email_sender_name;
      if (data.email_sender_address) form.email_sender_address = data.email_sender_address;
      if (data.delivery_email_subject) form.delivery_email_subject = data.delivery_email_subject;
      if (data.delivery_email_body) form.delivery_email_body = data.delivery_email_body;
    }
  } catch (err) {
    console.error("Load settings error:", err);
  } finally {
    isLoading.value = false;
  }
}

async function saveSettings() {
  isSaving.value = true;
  try {
    await settingsApi.updateSettings({
      vietqr_bank_code: form.vietqr_bank_code,
      vietqr_account_number: form.vietqr_account_number,
      vietqr_account_name: form.vietqr_account_name,
      order_code_prefix: form.order_code_prefix,
      email_sender_name: form.email_sender_name,
      email_sender_address: form.email_sender_address,
      delivery_email_subject: form.delivery_email_subject,
      delivery_email_body: form.delivery_email_body,
    });
    showToast("Đã lưu cấu hình Ngân hàng & Email thành công!");
  } catch (err) {
    console.error("Save settings error:", err);
    showToast("Không thể lưu cấu hình, vui lòng thử lại.");
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>
