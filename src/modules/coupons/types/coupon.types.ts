import type { BaseEntity } from "@shared/types";

export type DiscountType = "Percentage" | "Fixed";

export interface Coupon extends BaseEntity {
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  expires_at?: string;
}

export interface CreateCouponDto {
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  is_active: boolean;
  expires_at?: string;
}
