import { apiService } from "@shared/services";
import type { EmailTemplate } from "../types/email-template.types";

export const emailTemplateApi = {
  getTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      const res = await apiService.get("/admin/email-templates");
      return Array.isArray(res.data) ? res.data : (res.data?.items || []);
    } catch {
      return [
        {
          id: "tpl-1",
          template_key: "order_delivery",
          title: "Email Giao Khóa học & Tài liệu Học viên",
          subject: "[BrightLingo] Xác nhận thanh toán & Giao tài liệu: {{course_title}}",
          body_html: `<h2>Chào {{customer_name}},</h2><p>Cảm ơn bạn đã mua <strong>{{course_title}}</strong>!</p><p>Link truy cập tài nguyên chính thức của bạn: <a href="{{resource_link}}">{{resource_link}}</a></p>`,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }
  },

  getTemplateById: async (id: string): Promise<EmailTemplate> => {
    try {
      const res = await apiService.get(`/admin/email-templates/${id}`);
      return res.data;
    } catch {
      return {
        id: "tpl-1",
        template_key: "order_delivery",
        title: "Email Giao Khóa học & Tài liệu Học viên",
        subject: "[BrightLingo] Xác nhận thanh toán & Giao tài liệu: {{course_title}}",
        body_html: `<h2>Chào {{customer_name}},</h2><p>Cảm ơn bạn đã mua <strong>{{course_title}}</strong>!</p><p>Link truy cập tài nguyên chính thức của bạn: <a href="{{resource_link}}">{{resource_link}}</a></p>`,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  updateTemplate: async (id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    const res = await apiService.put(`/admin/email-templates/${id}`, data);
    return res.data;
  },

  sendTestEmail: async (id: string, email: string): Promise<{ success: boolean; message: string }> => {
    const res = await apiService.post(`/admin/email-templates/${id}/test`, { email });
    return res.data;
  },
};
