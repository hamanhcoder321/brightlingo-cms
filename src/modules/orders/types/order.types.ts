import type { BaseEntity } from "@shared/types";

export type OrderStatus = "Pending" | "Paid" | "Cancelled";

export interface OrderPayment extends BaseEntity {
  order_id: string;
  transaction_id: string;
  amount: number;
  provider: string; // VietQR / BankNoti
  status: "Success" | "Failed" | "Pending";
  description?: string;
}

export interface Order extends BaseEntity {
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  course_id: string;
  course_title: string;
  course_price: number;
  discount_amount: number;
  final_amount: number;
  status: OrderStatus;
  coupon_code?: string;
  resend_count: number;
  notes?: string;
  ref_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  payments?: OrderPayment[];
}
