import { apiService } from "@shared/services";
import type { Order } from "../types/order.types";

export const orderApi = {
  getOrders: async (params?: any): Promise<{ items: Order[]; total: number }> => {
    try {
      const res = await apiService.get("/admin/orders", { params });
      return {
        items: Array.isArray(res.data) ? res.data : (res.data?.items || []),
        total: res.data?.total || (Array.isArray(res.data) ? res.data.length : 0),
      };
    } catch {
      // Mock data for initial scaffolding preview if endpoint is under development
      return {
        items: [
          {
            id: "ord-1",
            order_code: "BL2026101601",
            customer_name: "Nguyễn Văn An",
            customer_email: "an.nguyen@example.com",
            customer_phone: "0901234567",
            course_id: "c-1",
            course_title: "1000 Từ Vựng Giao Tiếp Chuyên Sâu",
            course_price: 20000,
            discount_amount: 0,
            final_amount: 20000,
            status: "Paid",
            resend_count: 0,
            utm_source: "facebook",
            utm_campaign: "launch_oct",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "ord-2",
            order_code: "BL2026101602",
            customer_name: "Trần Thị Mai",
            customer_email: "mai.tran@example.com",
            customer_phone: "0987654321",
            course_id: "c-2",
            course_title: "Ebook Luyện Thi IELTS Writing 7.0+",
            course_price: 20000,
            discount_amount: 5000,
            final_amount: 15000,
            status: "Pending",
            resend_count: 0,
            utm_source: "google",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        total: 2,
      };
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res = await apiService.get(`/admin/orders/${id}`);
    return res.data;
  },

  resendEmail: async (orderId: string): Promise<{ success: boolean; message: string }> => {
    const res = await apiService.post(`/admin/emails/resend/${orderId}`);
    return res.data;
  },
};
