import type { BaseEntity } from "@shared/types";

export interface EmailTemplate extends BaseEntity {
  template_key: string; // e.g. 'order_delivery'
  title: string;
  subject: string;
  body_html: string;
  body_text?: string;
  is_active: boolean;
}
