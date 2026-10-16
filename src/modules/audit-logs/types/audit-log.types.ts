import type { BaseEntity } from "@shared/types";

export interface AuditLog extends BaseEntity {
  action: string;
  entity_type: string;
  entity_id: string;
  actor_name: string;
  actor_email: string;
  metadata?: Record<string, any>;
  ip_address?: string;
}
