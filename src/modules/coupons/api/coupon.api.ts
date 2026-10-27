import { apiService } from "@shared/services";
import type { Coupon, CreateCouponDto, UpdateCouponDto } from "../types/coupon.types";

export const couponApi = {
  getCoupons: async (
    filterParams?: any
  ): Promise<{ items: Coupon[]; total: number; totalPages?: number }> => {
    const apiResponse = await apiService.get("/admin/coupons", { params: filterParams });
    return {
      items: apiResponse.data?.items || (Array.isArray(apiResponse.data) ? apiResponse.data : []),
      total:
        apiResponse.data?.total ||
        (Array.isArray(apiResponse.data) ? apiResponse.data.length : 0),
      totalPages: apiResponse.data?.totalPages || 1,
    };
  },

  getCouponById: async (couponId: string | number): Promise<Coupon> => {
    const apiResponse = await apiService.get(`/admin/coupons/${couponId}`);
    return apiResponse.data;
  },

  createCoupon: async (createCouponPayload: CreateCouponDto): Promise<Coupon> => {
    const apiResponse = await apiService.post("/admin/coupons", createCouponPayload);
    return apiResponse.data;
  },

  updateCoupon: async (
    couponId: string | number,
    updateCouponPayload: UpdateCouponDto
  ): Promise<Coupon> => {
    const apiResponse = await apiService.put(`/admin/coupons/${couponId}`, updateCouponPayload);
    return apiResponse.data;
  },

  toggleCouponStatus: async (
    couponId: string | number
  ): Promise<{ id: string; status: string; message: string }> => {
    const apiResponse = await apiService.patch(`/admin/coupons/${couponId}/status`);
    return apiResponse.data;
  },

  deleteCoupon: async (couponId: string | number): Promise<void> => {
    await apiService.delete(`/admin/coupons/${couponId}`);
  },

  getCoursesForSelect: async (): Promise<
    Array<{ id: string; title: string; price: number; slug: string }>
  > => {
    try {
      const apiResponse = await apiService.get("/courses");
      return Array.isArray(apiResponse.data)
        ? apiResponse.data
        : apiResponse.data?.items || [];
    } catch {
      return [];
    }
  },
};
