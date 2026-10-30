import { apiService } from "@shared/services";
import type { AuditLog } from "../types/audit-log.types";

export const auditLogApi = {
  getLogs: async (params?: any): Promise<{ items: AuditLog[]; total: number }> => {
    try {
      const res = await apiService.get("/admin/audit-logs", { params });
      return {
        items: Array.isArray(res.data) ? res.data : (res.data?.items || []),
        total: res.data?.total || (Array.isArray(res.data) ? res.data.length : 0),
      };
    } catch {
      return {
        items: [
          {
            id: "aud-1",
            action: "RESEND_EMAIL",
            entity_type: "Order",
            entity_id: "BL2026101601",
            actor_name: "Quản trị viên",
            actor_email: "admin@engnest.vn",
            metadata: { recipient: "an.nguyen@example.com", reason: "Khách báo lạc thư" },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "aud-2",
            action: "UPDATE_RESOURCE_LINK",
            entity_type: "Course",
            entity_id: "1000-tu-vung-giao-tiep",
            actor_name: "Quản trị viên",
            actor_email: "admin@engnest.vn",
            metadata: { note: "Cập nhật folder Google Drive bản sửa đổi 2.0" },
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        total: 2,
      };
    }
  },
};
