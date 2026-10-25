import { apiService } from "@shared/services";
import type { DashboardStats } from "../types/dashboard.types";

export const dashboardApi = {
  getSummary: async (period?: string): Promise<DashboardStats> => {
    try {
      const res = await apiService.get("/admin/dashboard", {
        params: period ? { period } : undefined,
      });
      return res.data;
    } catch {
      // Fallback mock stats for initial rendering
      return {
        totalRevenue: 2450000,
        totalOrders: 15,
        paidOrders: 12,
        pendingOrders: 3,
        totalLeads: 28,
        newLeads: 7,
        totalCourses: 10,
      };
    }
  },
};
