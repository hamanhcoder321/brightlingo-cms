import type { BaseEntity } from "@shared/types";

export type LeadStatus = "New" | "Contacted" | "Completed";

export interface ConsultationLead extends BaseEntity {
  full_name: string;
  phone: string;
  email?: string;
  course_id?: string;
  course_title?: string;
  status: LeadStatus;
  notes?: string;
  ref_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}
