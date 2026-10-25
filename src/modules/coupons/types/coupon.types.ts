import type { BaseEntity } from "@shared/types";

export type DiscountType = "PERCENT" | "FIXED" | "Percentage" | "Fixed";
export type CouponScope = "ALL" | "SPECIFIC";
export type CouponStatus = "ACTIVE" | "INACTIVE";

export interface CouponCourseInfo {
  id: string;
  title: string;
  slug?: string;
  price?: number;
}

export interface Coupon extends BaseEntity {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  discount_type?: DiscountType;
  discount_value?: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  scope: CouponScope;
  courses?: CouponCourseInfo[];
  start_date?: string;
  end_date?: string;
  usage_limit?: number;
  usage_count: number;
  status: CouponStatus;
  is_active?: boolean;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCouponDto {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  scope: CouponScope;
  courseIds?: string[];
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  status: CouponStatus;
  note?: string;
}

export interface UpdateCouponDto extends Partial<CreateCouponDto> {}
