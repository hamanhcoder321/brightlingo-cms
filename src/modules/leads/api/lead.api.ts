import { apiService } from "@shared/services";
import type { ConsultationLead, LeadStatus } from "../types/lead.types";

export interface GetLeadsParams {
  status?: string;
  search?: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  completed: number;
}

export interface GetLeadsResponse {
  items: ConsultationLead[];
  total: number;
  stats?: LeadStats;
}

export const leadApi = {
  getLeads: async (params?: GetLeadsParams): Promise<GetLeadsResponse> => {
    const res = await apiService.get("/admin/leads", { params });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    const total = res.data?.total !== undefined ? res.data.total : items.length;
    const stats = res.data?.stats;
    return { items, total, stats };
  },

  updateLeadStatus: async (
    id: string,
    status: LeadStatus,
    notes?: string,
  ): Promise<ConsultationLead> => {
    const res = await apiService.patch(`/admin/leads/${id}`, { status, notes });
    return res.data;
  },

  getNewCount: async (): Promise<number> => {
    try {
      const res = await apiService.get("/admin/leads/count-new");
      return res.data?.count || 0;
    } catch {
      return 0;
    }
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiService.delete(`/admin/leads/${id}`);
  },
};
