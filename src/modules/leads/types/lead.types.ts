import type { BaseEntity } from "@shared/types";

export type LeadStatus = "New" | "Contacted" | "Completed" | "Cancelled";

export interface ConsultationLead extends BaseEntity {
  full_name: string;
  phone: string;
  email?: string;
  course_id?: string;
  course_title?: string;
  course_name?: string;
  course_slug?: string;
  message?: string;
  status: LeadStatus;
  notes?: string;
  ref_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landing_url?: string;
  referrer_url?: string;
}
