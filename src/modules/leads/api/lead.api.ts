import { apiService } from "@shared/services";
import type { ConsultationLead, LeadStatus } from "../types/lead.types";

export const leadApi = {
  getLeads: async (params?: any): Promise<{ items: ConsultationLead[]; total: number }> => {
    try {
      const res = await apiService.get("/admin/leads", { params });
      return {
        items: Array.isArray(res.data) ? res.data : (res.data?.items || []),
        total: res.data?.total || (Array.isArray(res.data) ? res.data.length : 0),
      };
    } catch {
      return {
        items: [
          {
            id: "ld-1",
            full_name: "Lê Hoàng Quân",
            phone: "0912345678",
            email: "quan.le@example.com",
            course_title: "Combo Khóa học Giao tiếp Toàn diện",
            status: "New",
            utm_source: "tiktok",
            utm_campaign: "lead_gen_oct",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "ld-2",
            full_name: "Phạm Thúy Hằng",
            phone: "0978901234",
            email: "hang.pham@example.com",
            course_title: "1000 Từ Vựng Giao Tiếp",
            status: "Contacted",
            notes: "Đã gọi lần 1 lúc 9h30, hẹn chiều tư vấn tiếp",
            utm_source: "facebook",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        total: 2,
      };
    }
  },

  updateLeadStatus: async (id: string, status: LeadStatus, notes?: string): Promise<ConsultationLead> => {
    const res = await apiService.patch(`/admin/leads/${id}`, { status, notes });
    return res.data;
  },
};
