import { apiService } from "@shared/services";
import type { Coupon, CreateCouponDto } from "../types/coupon.types";

export const couponApi = {
  getCoupons: async (params?: any): Promise<{ items: Coupon[]; total: number }> => {
    try {
      const res = await apiService.get("/admin/coupons", { params });
      return {
        items: Array.isArray(res.data) ? res.data : (res.data?.items || []),
        total: res.data?.total || (Array.isArray(res.data) ? res.data.length : 0),
      };
    } catch {
      return {
        items: [
          {
            id: "cp-1",
            code: "BRIGHT10",
            discount_type: "Percentage",
            discount_value: 10,
            usage_limit: 100,
            used_count: 14,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "cp-2",
            code: "CHAO2026",
            discount_type: "Fixed",
            discount_value: 5000,
            usage_limit: 50,
            used_count: 8,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        total: 2,
      };
    }
  },

  createCoupon: async (data: CreateCouponDto): Promise<Coupon> => {
    const res = await apiService.post("/admin/coupons", data);
    return res.data;
  },

  updateCoupon: async (id: string, data: Partial<CreateCouponDto>): Promise<Coupon> => {
    const res = await apiService.put(`/admin/coupons/${id}`, data);
    return res.data;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await apiService.delete(`/admin/coupons/${id}`);
  },
};
