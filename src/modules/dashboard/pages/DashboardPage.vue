<template>
  <div class="p-4 sm:p-6 md:p-8 pb-14 flex flex-col gap-5 sm:gap-6 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Top Bar: Title, Badge, Filter, Add Course Button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3 flex-wrap">
        <h1 class="m-0 font-serif font-bold text-2xl sm:text-[32px] text-[#1D2A2E] leading-tight">
          Tổng quan bán hàng
        </h1>
        <span class="bg-[#E4F3EA] text-[#155C35] text-[12px] sm:text-[13px] font-semibold px-2.5 py-0.5 rounded-full">
          Dữ liệu thời gian thực
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <label class="flex items-center gap-2 text-[14px] sm:text-[15px] text-[#4C5A60] flex-1 sm:flex-none">
          <span class="hidden xs:inline">Thời gian:</span>
          <select
            v-model="selectedPeriod"
            @change="handlePeriodChange"
            class="h-10 sm:h-11 border-[1.5px] border-[#D8D2C7] rounded-[10px] px-3 font-inherit text-[14px] sm:text-[15px] bg-white text-[#1D2A2E] focus:outline-none focus:border-[#0B6E6E] w-full sm:w-auto"
          >
            <option value="30days">30 ngày qua</option>
            <option value="7days">7 ngày qua</option>
            <option value="month">Tháng này</option>
            <option value="custom">Tùy chọn…</option>
          </select>
        </label>

        <router-link
          to="/courses/create"
          class="h-10 sm:h-11 px-4 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm flex-1 sm:flex-none text-decoration-none"
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
        <span class="text-[14px] text-[#4C5A60]">VNĐ / ngày (k = nghìn, tr = triệu)</span>
      </div>

      <!-- Bars Container (Scrollable on mobile) -->
      <div class="overflow-x-auto pb-2 -mx-2 px-2">
        <div class="min-w-[560px] flex flex-col gap-2">
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
        </div>
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
import { ref, computed, onMounted } from "vue";
import ResendConfirmModal from "@modules/orders/components/ResendConfirmModal.vue";
import type { Order } from "@modules/orders/types/order.types";
import { dashboardApi } from "../api/dashboard.api";

const selectedPeriod = ref("30days");

// Metric summary
const currentMetrics = ref({
  revenue: "0đ",
  revenueGrowth: "Thu nhập thực tế",
  paidOrders: 0,
  totalOrdersText: "0 đơn được tạo",
  conversionRate: "0%",
  expiredOrdersText: "0 đơn đang chờ",
  leadsCount: 0,
});

// Bar chart data for 14 days (thực tế từ Database)
const bars = ref<Array<{ v: string; d: string; height: number; isToday: boolean }>>([]);

// Course performance table data
const performanceCourses = ref<any[]>([]);

// Recent orders table
const statusConfig: Record<string, { label: string; style: string }> = {
  paid: { label: "Đã thanh toán", style: "background: #E4F3EA; color: #155C35;" },
  wait: { label: "Chờ thanh toán", style: "background: #FDF0E3; color: #8A3F12;" },
  cancel: { label: "Đã hủy", style: "background: #FEE2E2; color: #991B1B;" },
  exp: { label: "Hết hạn QR", style: "background: #ECE7DE; color: #4C5A60;" },
};

interface RecentOrderRow {
  id?: string;
  code: string;
  name: string;
  email: string;
  course: string;
  amount: string;
  k: "paid" | "wait" | "cancel" | "exp";
  mail: string;
  time: string;
}

const rawOrders = ref<RecentOrderRow[]>([]);

const recentOrders = computed(() => {
  return rawOrders.value.map((o) => ({
    ...o,
    statusLabel: statusConfig[o.k]?.label || o.k,
    statusStyle: statusConfig[o.k]?.style || "",
    canResend: o.k === "paid",
  }));
});

// Load dữ liệu đơn hàng và doanh thu thực tế từ backend
async function loadRealStats(period?: string) {
  try {
    const summary: any = await dashboardApi.getSummary(period || selectedPeriod.value);
    if (summary) {
      const totalRev = Number(summary.totalRevenue || summary.kpi?.totalRevenue || 0);
      const paid = Number(summary.paidOrders || summary.kpi?.paidOrders || 0);
      const total = Number(summary.totalOrders || summary.kpi?.totalOrders || 0);
      const pending = Number(summary.pendingOrders || summary.kpi?.pendingOrders || 0);
      const leads = Number(summary.newLeads ?? summary.kpi?.newLeads ?? 0);
      const convRate = total > 0 ? Math.round((paid / total) * 100) : 0;

      currentMetrics.value.revenue = new Intl.NumberFormat("vi-VN").format(totalRev) + "đ";
      currentMetrics.value.paidOrders = paid;
      currentMetrics.value.totalOrdersText = `trên ${total} đơn được tạo`;
      currentMetrics.value.conversionRate = `${convRate}%`;
      currentMetrics.value.expiredOrdersText = `${pending} đơn đang chờ thanh toán`;
      currentMetrics.value.leadsCount = leads;

      // 1. Biểu đồ doanh thu 14 ngày thực tế
      const chartList = summary.chart14Days || [];
      if (chartList.length > 0) {
        const maxRev = Math.max(...chartList.map((item: any) => Number(item.revenue) || 0), 50000);
        bars.value = chartList.map((item: any, idx: number) => {
          const rev = Number(item.revenue) || 0;
          return {
            v: rev > 0 ? (rev >= 1000000 ? `${(rev / 1000000).toFixed(1).replace(".", ",")}tr` : `${Math.round(rev / 1000)}k`) : "0",
            d: item.date_label || `${idx + 1}/10`,
            height: rev > 0 ? Math.max(14, Math.round((rev / maxRev) * 140)) : 6,
            isToday: idx === chartList.length - 1,
          };
        });
      }

      // 2. Đơn hàng gần đây
      const ordersList = summary.recentOrders || [];
      if (ordersList.length > 0) {
        rawOrders.value = ordersList.map((o: any) => ({
          id: o.id || o.order_code,
          code: o.order_code,
          name: o.customer_name || "Học viên",
          email: o.customer_email || "—",
          course: o.course_title || "Khóa học",
          amount: new Intl.NumberFormat("vi-VN").format(o.total_amount) + "đ",
          k: o.status === "PAID" ? "paid" : o.status === "PENDING" ? "wait" : o.status === "CANCELLED" ? "cancel" : "exp",
          mail: o.paid_at ? "Đã xác nhận" : "—",
          time: new Date(o.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " " + new Date(o.created_at).toLocaleDateString("vi-VN"),
        }));
      }

      // 3. Hiệu quả từng khóa học (Lượt xem thực tế & Đơn bán thực tế)
      const coursesList = summary.coursePerformance || [];
      if (coursesList.length > 0) {
        performanceCourses.value = coursesList.map((c: any) => {
          const views = Number(c.views_count) || 0;
          const convNum = views > 0 ? ((Number(c.paid) || 0) / views) * 100 : 0;
          const convRateStr = convNum.toFixed(1);
          return {
            name: c.name,
            slug: c.slug,
            views: new Intl.NumberFormat("vi-VN").format(views),
            created: c.created || 0,
            paid: c.paid || 0,
            convText: `${convRateStr.replace(".", ",")}%`,
            convPercent: views > 0 ? Math.min(100, Math.max(0, Math.round(convNum))) : 0,
            revenue: new Intl.NumberFormat("vi-VN").format(c.revenue || 0) + "đ",
          };
        });
      }
    }
  } catch (err) {
    console.error("Failed to load real dashboard stats:", err);
  }
}

onMounted(() => {
  loadRealStats();
});

// Modal state for Resend Email
const isResendModalOpen = ref(false);
const modalOrderData = ref<Order | null>(null);

function handleOpenResend(order: any) {
  modalOrderData.value = {
    id: order.id || order.code,
    order_code: order.code,
    customer_name: order.name,
    customer_email: order.email,
    customer_phone: "",
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
  loadRealStats(selectedPeriod.value);
}
</script>
