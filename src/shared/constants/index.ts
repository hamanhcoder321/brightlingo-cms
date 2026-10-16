export const STORAGE_KEYS = {
  LOCALE: "lingo_locale",
  THEME: "lingo_theme",
  ACCESS_TOKEN: "lingo_access_token",
  REFRESH_TOKEN: "lingo_refresh_token",
  USER: "lingo_admin_user",
};

export const ROUTE_NAMES = {
  LOGIN: "login",
  DASHBOARD: "dashboard",
  COURSES: "courses",
  COURSE_CREATE: "course-create",
  COURSE_EDIT: "course-edit",
  COURSE_CATEGORIES: "course-categories",
  ORDERS: "orders",
  ORDER_DETAIL: "order-detail",
  COUPONS: "coupons",
  LEADS: "leads",
  EMAIL_TEMPLATES: "email-templates",
  EMAIL_TEMPLATE_EDIT: "email-template-edit",
  SETTINGS: "settings",
  AUDIT_LOGS: "audit-logs",
};

export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  HIDDEN: "Hidden",
} as const;

export const COURSE_TYPE = {
  COURSE: "Course",
  DOCUMENT: "Document",
  COMBO: "Combo",
} as const;

export const ORDER_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  CANCELLED: "Cancelled",
} as const;

export const LEAD_STATUS = {
  NEW: "New",
  CONTACTED: "Contacted",
  COMPLETED: "Completed",
} as const;

export const DISCOUNT_TYPE = {
  PERCENTAGE: "Percentage",
  FIXED: "Fixed",
} as const;
