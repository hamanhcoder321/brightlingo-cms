export interface HomepageSectionConfig {
  id: string;
  order: number;
  name: string;
  description: string;
  enabled: boolean;
  phase2?: boolean;
}

export type BannerPosition =
  | "home_hero"
  | "announcement_bar"
  | "home_after_courses"
  | "home_community"
  | "course_detail_bottom";

export type BannerStatus = "active" | "scheduled" | "inactive";

export interface BannerItemConfig {
  id: string;
  name: string;
  dimensions: string;
  position: BannerPosition;
  positionLabel: string;
  priority: number;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  desktopImage: string;
  mobileImage: string;
  altText: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  ctaText: string;
  ctaLink: string;
  openInNewTab: boolean;
}

export interface Redirect301Item {
  id: string;
  from: string;
  to: string;
  note: string;
}

export interface SystemSettings {
  // 1. Branding & Payment
  site_name: string;
  hotline: string;
  support_email: string;
  working_hours: string;
  vietqr_bank_code: string;
  vietqr_account_number: string;
  vietqr_account_name: string;
  order_code_prefix?: string;

  // 2. Email bàn giao tự động
  email_sender_name?: string;
  email_sender_address?: string;
  delivery_email_subject?: string;
  delivery_email_body?: string;

  // 3. Liên kết, mạng xã hội & cộng đồng
  zalo_url: string;
  fanpage_url: string;
  community_group_url: string;
  community_group_name: string;
  community_members: string;
  youtube_tiktok_url: string;
  company_name: string;
  tax_id: string;
  company_address: string;

  // 4. Giao diện & Banner
  homepage_sections: HomepageSectionConfig[];
  banners: BannerItemConfig[];
  active_banners?: Record<string, BannerItemConfig | null>;

  // 5. SEO & Google
  meta_title: string;
  meta_description: string;
  og_image: string;
  favicon: string;
  google_site_verification: string;
  google_analytics_id: string;
  gtm_id: string;
  facebook_pixel_id: string;
  send_purchase_event: boolean;
  robots_txt: string;
  noindex: boolean;
  primary_domain: string;
  www_redirect: "non-www" | "www";
  redirects_301: Redirect301Item[];
  schema_organization: boolean;
  schema_course: boolean;
  schema_faq: boolean;
  schema_breadcrumb: boolean;
  schema_article: boolean;

  // 6. Diagnostics & FAQ/Policies
  sitemap_last_generated?: string;
  sitemap_url_count?: number;
  missing_seo_image_count?: number;
  faqs_list?: Array<{ question: string; answer: string }>;
  policies_content?: Record<string, any>;
}
