<template>
  <div class="p-7 md:p-8 flex flex-col gap-6 max-w-[1440px] mx-auto text-[#1D2A2E]">
    <!-- Top Bar: Title, Badge, Filter, Add Course Button -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3 flex-wrap">
        <h1 class="m-0 font-serif font-bold text-[32px] text-[#1D2A2E] leading-tight">
          Tổng quan bán hàng
        </h1>
        <span class="bg-[#FDF0E3] text-[#B4531A] text-[13px] font-semibold px-2.5 py-0.5 rounded-full">
          Số liệu minh họa
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <label class="flex items-center gap-2 text-[15px] text-[#4C5A60]">
          <span>Khoảng thời gian</span>
          <select
            v-model="selectedPeriod"
            @change="handlePeriodChange"
            class="h-11 border-[1.5px] border-[#D8D2C7] rounded-[10px] px-3 font-inherit text-[15px] bg-white text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E]"
          >
            <option value="30days">30 ngày qua</option>
            <option value="7days">7 ngày qua</option>
            <option value="month">Tháng này</option>
            <option value="custom">Tùy chọn…</option>
          </select>
        </label>

        <router-link
          to="/courses/create"
          class="h-11 px-4 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[15px] flex items-center gap-2 transition-colors shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          <span>Thêm khóa học</span>
        </router-link>
      </div>
    </div>

    <!-- 4 Key Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Card 1: Doanh thu -->
      <div class="bg-white border border-[#E5E0D7] rounded-[16px] p-5 flex flex-col gap-1 shadow-sm">
        <span class="text-[15px] text-[#4C5A60]">Doanh thu</span>
        <span class="text-[30px] font-bold text-[#1D2A2E] leading-tight">{{ currentMetrics.revenue }}</span>
        <span class="text-[14px] text-[#1E7A47] font-semibold">{{ currentMetrics.revenueGrowth }}</span>
      </div>

      <!-- Card 2: Đơn đã thanh toán -->
      <div class="bg-white border border-[#E5E0D7] rounded-[16px] p-5 flex flex-col gap-1 shadow-sm">
        <span class="text-[15px] text-[#4C5A60]">Đơn đã thanh toán</span>
        <span class="text-[30px] font-bold text-[#1D2A2E] leading-tight">{{ currentMetrics.paidOrders }}</span>
        <span class="text-[14px] text-[#4C5A60]">{{ currentMetrics.totalOrdersText }}</span>
      </div>

      <!-- Card 3: Tỉ lệ hoàn tất thanh toán -->
      <div class="bg-white border border-[#E5E0D7] rounded-[16px] p-5 flex flex-col gap-1 shadow-sm">
        <span class="text-[15px] text-[#4C5A60]">Tỉ lệ hoàn tất thanh toán</span>
        <span class="text-[30px] font-bold text-[#1D2A2E] leading-tight">{{ currentMetrics.conversionRate }}</span>
        <span class="text-[14px] text-[#4C5A60]">{{ currentMetrics.expiredOrdersText }}</span>
      </div>

      <!-- Card 4: Yêu cầu tư vấn mới -->
      <div class="bg-white border border-[#E5E0D7] rounded-[16px] p-5 flex flex-col gap-1 shadow-sm">
        <span class="text-[15px] text-[#4C5A60]">Yêu cầu tư vấn mới</span>
        <span class="text-[30px] font-bold text-[#1D2A2E] leading-tight">{{ currentMetrics.leadsCount }}</span>
        <router-link to="/leads" class="text-[14px] font-semibold text-[#0B6E6E] hover:text-[#08585A]">
          Xem và gọi lại →
        </router-link>
      </div>
    </div>

    <!-- Section 1: Doanh thu 14 ngày gần nhất (Bar Chart) -->
    <section class="bg-white border border-[#E5E0D7] rounded-[16px] p-5 md:p-6 flex flex-col gap-4 shadow-sm">
      <div class="flex justify-between items-baseline gap-3 flex-wrap">
        <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">Doanh thu 14 ngày gần nhất</h2>
        <span class="text-[14px] text-[#4C5A60]">triệu đồng / ngày</span>
      </div>

      <!-- Bars Container -->
      <div
        role="img"
        aria-label="Biểu đồ cột doanh thu theo ngày"
        class="grid grid-cols-14 gap-2.5 items-end h-[180px] border-b border-[#E5E0D7] pb-0"
        style="grid-template-columns: repeat(14, minmax(0, 1fr));"
      >
        <div
          v-for="(b, idx) in bars"
          :key="idx"
          class="flex flex-col items-center gap-1 justify-end h-full group"
        >
          <span class="text-[12px] text-[#4C5A60] font-mono group-hover:font-bold group-hover:text-[#0B6E6E] transition-all">
            {{ b.v }}
          </span>
          <div
            class="w-full max-w-[36px] rounded-t-[6px] transition-all duration-300 group-hover:opacity-90"
            :style="{
              height: `${b.height}px`,
              backgroundColor: b.isToday ? '#0B6E6E' : '#8CC3BB'
            }"
          ></div>
        </div>
      </div>

      <!-- Dates labels below bars -->
      <div
        class="grid gap-2.5 text-[12px] text-[#4C5A60] text-center font-mono"
        style="grid-template-columns: repeat(14, minmax(0, 1fr));"
      >
        <span v-for="(b, idx) in bars" :key="'label-' + idx" :class="{ 'font-bold text-[#0B6E6E]': b.isToday }">
          {{ b.d }}
        </span>
      </div>
    </section>

    <!-- Section 2: Hiệu quả từng khóa học -->
    <section class="bg-white border border-[#E5E0D7] rounded-[16px] p-5 md:p-6 flex flex-col gap-3.5 shadow-sm">
      <div class="flex justify-between items-baseline gap-3 flex-wrap">
        <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">Hiệu quả từng khóa học</h2>
        <router-link to="/courses" class="text-[15px] font-semibold text-[#0B6E6E] hover:text-[#08585A]">
          Quản lý khóa học →
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse text-[15px]">
          <thead>
            <tr class="text-[#4C5A60] border-b border-[#E5E0D7]">
              <th class="py-2.5 px-2 font-semibold text-left">Khóa học</th>
              <th class="py-2.5 px-2 font-semibold text-right">Lượt xem trang</th>
              <th class="py-2.5 px-2 font-semibold text-right">Đơn tạo</th>
              <th class="py-2.5 px-2 font-semibold text-right">Đã thanh toán</th>
              <th class="py-2.5 px-2 font-semibold text-right">Tỉ lệ mua / xem</th>
              <th class="py-2.5 px-2 font-semibold text-right">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(p, index) in performanceCourses"
              :key="index"
              class="border-b border-[#EFEBE4] hover:bg-[#FAF8F5] transition-colors"
            >
              <td class="py-3.5 px-2">
                <div class="font-semibold text-[#1D2A2E]">{{ p.name }}</div>
                <div class="text-[13px] text-[#4C5A60] font-mono">/khoa-hoc/{{ p.slug }}</div>
              </td>
              <td class="py-3.5 px-2 text-right tabular-nums text-[#1D2A2E]">
                {{ p.views }}
              </td>
              <td class="py-3.5 px-2 text-right tabular-nums text-[#1D2A2E]">
                {{ p.created }}
              </td>
              <td class="py-3.5 px-2 text-right tabular-nums text-[#1D2A2E]">
                {{ p.paid }}
              </td>
              <td class="py-3.5 px-2 text-right">
                <span class="inline-flex items-center gap-2">
                  <span class="w-[60px] h-[6px] rounded-full bg-[#ECE7DE] inline-block overflow-hidden">
                    <span
                      class="block h-full rounded-full bg-[#0B6E6E]"
                      :style="{ width: `${p.convPercent}%` }"
                    ></span>
                  </span>
                  <span class="tabular-nums font-medium">{{ p.convText }}</span>
                </span>
              </td>
              <td class="py-3.5 px-2 text-right font-bold tabular-nums text-[#1D2A2E]">
                {{ p.revenue }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 3: Đơn hàng mới nhất -->
    <section class="bg-white border border-[#E5E0D7] rounded-[16px] p-5 md:p-6 flex flex-col gap-3.5 shadow-sm">
      <div class="flex justify-between items-baseline gap-3 flex-wrap">
        <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">Đơn hàng mới nhất</h2>
        <router-link to="/orders" class="text-[15px] font-semibold text-[#0B6E6E] hover:text-[#08585A]">
          Tất cả đơn hàng →
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[860px] border-collapse text-[15px]">
          <thead>
            <tr class="text-[#4C5A60] border-b border-[#E5E0D7]">
              <th class="py-2.5 px-2 font-semibold text-left">Mã đơn</th>
              <th class="py-2.5 px-2 font-semibold text-left">Khách hàng</th>
              <th class="py-2.5 px-2 font-semibold text-left">Khóa học</th>
              <th class="py-2.5 px-2 font-semibold text-right">Số tiền</th>
              <th class="py-2.5 px-2 font-semibold text-left">Trạng thái</th>
              <th class="py-2.5 px-2 font-semibold text-left">Email khóa học</th>
              <th class="py-2.5 px-2 font-semibold text-left">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in recentOrders"
              :key="order.code"
              class="border-b border-[#EFEBE4] hover:bg-[#FAF8F5] transition-colors"
            >
              <td class="py-3 px-2 font-semibold text-[#1D2A2E] font-mono">
                {{ order.code }}
              </td>
              <td class="py-3 px-2">
                <div class="font-medium text-[#1D2A2E]">{{ order.name }}</div>
                <div class="text-[13px] text-[#4C5A60]">{{ order.email }}</div>
              </td>
              <td class="py-3 px-2 text-[#1D2A2E]">
                {{ order.course }}
              </td>
              <td class="py-3 px-2 text-right tabular-nums font-medium text-[#1D2A2E]">
                {{ order.amount }}
              </td>
              <td class="py-3 px-2">
                <span
                  class="inline-block text-[13px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                  :style="order.statusStyle"
                >
                  {{ order.statusLabel }}
                </span>
              </td>
              <td class="py-3 px-2">
                <span class="flex items-center gap-2.5">
                  <span class="text-[14px] text-[#4C5A60]">{{ order.mail }}</span>
                  <button
                    v-if="order.canResend"
                    type="button"
                    @click="handleOpenResend(order)"
                    class="h-[34px] px-2.5 rounded-[8px] border-[1.5px] border-[#C9DCD8] bg-white text-[#0B6E6E] hover:bg-[#EAF5F3] font-inherit text-[13px] font-semibold transition-colors"
                  >
                    Gửi lại
                  </button>
                </span>
              </td>
              <td class="py-3 px-2 text-[#4C5A60] text-[14px]">
                {{ order.time }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Resend Email Modal (BR-05 & BR-06 Integration) -->
    <ResendConfirmModal
      :is-open="isResendModalOpen"
      :order="modalOrderData"
      @close="isResendModalOpen = false"
      @success="handleResendSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ResendConfirmModal from "@modules/orders/components/ResendConfirmModal.vue";
import type { Order } from "@modules/orders/types/order.types";

const selectedPeriod = ref("30days");

// Metric summary
const currentMetrics = ref({
  revenue: "18.748.000đ",
  revenueGrowth: "+12% so với 30 ngày trước",
  paidOrders: 52,
  totalOrdersText: "trên 83 đơn được tạo",
  conversionRate: "63%",
  expiredOrdersText: "31 đơn hết hạn QR",
  leadsCount: 7,
});

// Bar chart data for 14 days
const vals = [0.8, 1.2, 0.4, 1.6, 2.0, 0.8, 1.2, 1.6, 0.4, 2.4, 1.2, 0.8, 2.0, 1.6];
const maxVal = 2.4;

const bars = computed(() => {
  return vals.map((v, i) => ({
    v: v.toFixed(1).replace(".", ","),
    d: `${i + 1}/10`,
    height: Math.round((v / maxVal) * 140),
    isToday: i === vals.length - 1,
  }));
});

// Course performance table data
const performanceCourses = ref([
  {
    name: "Mẹ dạy con tiếng Anh tại nhà",
    slug: "me-day-con-tieng-anh",
    views: "3.420",
    created: 61,
    paid: 38,
    convText: "1,1%",
    convPercent: Math.round((1.1 / 1.2) * 100),
    revenue: "15.162.000đ",
  },
  {
    name: "1.000 câu tiếng Anh mẹ nói với con",
    slug: "1000-cau-me-noi-voi-con",
    views: "1.180",
    created: 14,
    paid: 9,
    convText: "0,8%",
    convPercent: Math.round((0.8 / 1.2) * 100),
    revenue: "1.791.000đ",
  },
  {
    name: "Tiếng Anh giao tiếp cho người đi làm",
    slug: "tieng-anh-nguoi-di-lam",
    views: "640",
    created: 5,
    paid: 3,
    convText: "0,5%",
    convPercent: Math.round((0.5 / 1.2) * 100),
    revenue: "1.197.000đ",
  },
  {
    name: "Phát âm chuẩn từ đầu cho người lớn",
    slug: "phat-am-chuan-nguoi-lon",
    views: "410",
    created: 3,
    paid: 2,
    convText: "0,5%",
    convPercent: Math.round((0.5 / 1.2) * 100),
    revenue: "598.000đ",
  },
]);

// Recent orders table
const statusConfig: Record<string, { label: string; style: string }> = {
  paid: { label: "Đã thanh toán", style: "background: #E4F3EA; color: #155C35;" },
  wait: { label: "Chờ thanh toán", style: "background: #FDF0E3; color: #8A3F12;" },
  exp: { label: "Hết hạn QR", style: "background: #ECE7DE; color: #4C5A60;" },
};

interface RecentOrderRow {
  code: string;
  name: string;
  email: string;
  course: string;
  amount: string;
  k: "paid" | "wait" | "exp";
  mail: string;
  time: string;
}

const rawOrders: RecentOrderRow[] = [
  {
    code: "EN-7K2Q9",
    name: "Nguyễn Thị Lan",
    email: "lan.nguyen@gmail.com",
    course: "Mẹ dạy con tiếng Anh",
    amount: "399.000đ",
    k: "paid",
    mail: "Đã gửi 10:42",
    time: "Hôm nay 10:41",
  },
  {
    code: "EN-7K2P4",
    name: "Trần Văn Hùng",
    email: "hung.tv@yahoo.com",
    course: "Giao tiếp người đi làm",
    amount: "399.000đ",
    k: "wait",
    mail: "—",
    time: "Hôm nay 10:36",
  },
  {
    code: "EN-7K2M1",
    name: "Phạm Thu Hà",
    email: "thuha.pham@gmail.com",
    course: "1.000 câu mẹ nói với con",
    amount: "199.000đ",
    k: "paid",
    mail: "Đã gửi 09:58",
    time: "Hôm nay 09:57",
  },
  {
    code: "EN-7K2J8",
    name: "Lê Minh Tâm",
    email: "tamle@gmail.com",
    course: "Mẹ dạy con tiếng Anh",
    amount: "399.000đ",
    k: "exp",
    mail: "—",
    time: "Hôm qua 21:14",
  },
  {
    code: "EN-7K2H3",
    name: "Đỗ Thị Mai",
    email: "mai.do@gmail.com",
    course: "Mẹ dạy con tiếng Anh",
    amount: "399.000đ",
    k: "paid",
    mail: "Đã gửi 20:03",
    time: "Hôm qua 20:02",
  },
];

const recentOrders = computed(() => {
  return rawOrders.map((o) => ({
    ...o,
    statusLabel: statusConfig[o.k]?.label || o.k,
    statusStyle: statusConfig[o.k]?.style || "",
    canResend: o.k === "paid",
  }));
});

// Modal state for Resend Email
const isResendModalOpen = ref(false);
const modalOrderData = ref<Order | null>(null);

function handleOpenResend(order: any) {
  modalOrderData.value = {
    id: order.code,
    order_code: order.code,
    customer_name: order.name,
    customer_email: order.email,
    customer_phone: "0901234567",
    course_id: "c-1",
    course_title: order.course,
    course_price: 399000,
    discount_amount: 0,
    final_amount: 399000,
    status: "Paid",
    resend_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  isResendModalOpen.value = true;
}

function handleResendSuccess() {
  alert("Gửi lại email tài liệu thành công! Đã ghi nhận lịch sử.");
}

function handlePeriodChange() {
  if (selectedPeriod.value === "7days") {
    currentMetrics.value.revenue = "4.380.000đ";
    currentMetrics.value.paidOrders = 12;
    currentMetrics.value.totalOrdersText = "trên 18 đơn được tạo";
    currentMetrics.value.conversionRate = "67%";
    currentMetrics.value.expiredOrdersText = "6 đơn hết hạn QR";
  } else if (selectedPeriod.value === "month") {
    currentMetrics.value.revenue = "18.748.000đ";
    currentMetrics.value.paidOrders = 52;
    currentMetrics.value.totalOrdersText = "trên 83 đơn được tạo";
    currentMetrics.value.conversionRate = "63%";
  }
}
</script>
