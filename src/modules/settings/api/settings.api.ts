import { apiService } from "@shared/services";
import type {
  SystemSettings,
  HomepageSectionConfig,
  BannerItemConfig,
  Redirect301Item,
} from "../types/settings.types";

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  {
    id: "announcement",
    order: 1,
    name: "Thanh thông báo",
    description: "Dải chữ trên cùng – khuyến mãi, tin mới",
    enabled: true,
  },
  {
    id: "hero",
    order: 2,
    name: "Banner chính (Hero)",
    description: "Ảnh + tiêu đề + nút",
    enabled: true,
  },
  {
    id: "courses",
    order: 3,
    name: "Khóa nổi bật & danh sách",
    description: "Lấy từ menu Khóa học",
    enabled: true,
  },
  {
    id: "how_to_buy",
    order: 4,
    name: "Mua hàng 3 bước",
    description: "Nội dung cố định",
    enabled: true,
  },
  {
    id: "community",
    order: 5,
    name: "Cộng đồng Facebook",
    description: "Ảnh, link nhóm, số thành viên",
    enabled: true,
  },
  {
    id: "blog",
    order: 6,
    name: "Góc chia sẻ (Bài viết)",
    description: "Mở ở giai đoạn 2",
    enabled: false,
    phase2: true,
  },
  {
    id: "faq",
    order: 7,
    name: "Hỏi đáp & Chính sách",
    description: "Lấy từ menu Chính sách & Hỏi đáp",
    enabled: true,
  },
  {
    id: "consultation",
    order: 8,
    name: "Form tư vấn",
    description: "Gửi về menu Yêu cầu tư vấn",
    enabled: true,
  },
];

export const DEFAULT_BANNERS: BannerItemConfig[] = [
  {
    id: "banner-hero-main",
    name: "Hero chính",
    dimensions: "1440×720 · 780×960",
    position: "home_hero",
    positionLabel: "Trang chủ › Đầu trang",
    priority: 1,
    startDate: "",
    endDate: "",
    status: "active",
    desktopImage: "",
    mobileImage: "",
    altText: "Học viên EngNest học tiếng Anh tại nhà",
    title: "Tự học tiếng Anh tại nhà",
    subtitle:
      "Khóa học dạng video, tài liệu PDF tiện lợi, dùng được ngay. Mua một lần, nhận link học qua email trong vài phút, học trọn đời – không cần tạo tài khoản.",
    badgeText: "Tiếng Anh thực chiến cho người Việt",
    ctaText: "Xem các khóa học",
    ctaLink: "/#khoa-hoc-noi-bat",
    openInNewTab: false,
  },
  {
    id: "banner-hero-tet",
    name: "Hero Tết (dự phòng)",
    dimensions: "1440×720 · 780×960",
    position: "home_hero",
    positionLabel: "Trang chủ › Đầu trang",
    priority: 2,
    startDate: "2026-01-20",
    endDate: "2026-02-10",
    status: "scheduled",
    desktopImage: "",
    mobileImage: "",
    altText: "Đón Tết học tiếng Anh cùng con tại nhà",
    title: "Khai xuân học tiếng Anh – Ưu đãi đầu năm cho mẹ và bé",
    subtitle: "Tặng thêm bộ thẻ từ vựng Tết song ngữ PDF khi đăng ký trong dịp Tết.",
    badgeText: "Ưu đãi Tết",
    ctaText: "Xem các khóa học",
    ctaLink: "/#khoa-hoc-noi-bat",
    openInNewTab: false,
  },
  {
    id: "banner-announcement",
    name: "Thông báo khuyến mãi",
    dimensions: "Chữ + link",
    position: "announcement_bar",
    positionLabel: "Mọi trang › Thanh thông báo",
    priority: 1,
    startDate: "2026-10-15",
    endDate: "2026-10-31",
    status: "active",
    desktopImage: "",
    mobileImage: "",
    altText: "Thông báo khuyến mãi",
    title:
      "Ưu đãi đặc biệt: Giảm tới 40% các khóa học tiếng Anh thực chiến — Nhận tài liệu qua Email ngay sau khi thanh toán QR!",
    ctaText: "Xem khóa học",
    ctaLink: "/#khoa-hoc-noi-bat",
    openInNewTab: false,
  },
  {
    id: "banner-detail-1000",
    name: "Gợi ý “1.000 câu”",
    dimensions: "1200×300",
    position: "course_detail_bottom",
    positionLabel: "Chi tiết › Dưới nội dung",
    priority: 1,
    startDate: "",
    endDate: "",
    status: "active",
    desktopImage: "",
    mobileImage: "",
    altText: "1.000 câu tiếng Anh mẹ nói với con mỗi ngày",
    title: "1.000 câu tiếng Anh giao tiếp & mẹ nói với con mỗi ngày",
    subtitle: "Bộ mẫu câu kèm âm thanh chuẩn bản xứ, áp dụng ngay trong sinh hoạt hằng ngày.",
    ctaText: "Xem chi tiết khóa này",
    ctaLink: "/khoa-hoc/ngu-phap-1000-mau-cau-so",
    openInNewTab: false,
  },
  {
    id: "banner-community",
    name: "Ảnh khối cộng đồng",
    dimensions: "800×600",
    position: "home_community",
    positionLabel: "Trang chủ › Cộng đồng",
    priority: 1,
    startDate: "",
    endDate: "",
    status: "active",
    desktopImage: "",
    mobileImage: "",
    altText: "Cộng đồng Dạy con tiếng Anh tự nhiên",
    title: "Tham gia nhóm Dạy con tiếng Anh tự nhiên",
    ctaText: "Tham gia nhóm Facebook",
    ctaLink: "https://facebook.com/groups/",
    openInNewTab: true,
  },
  {
    id: "banner-after-courses",
    name: "Banner khóa phát âm",
    dimensions: "1200×300",
    position: "home_after_courses",
    positionLabel: "Trang chủ › Sau khóa học",
    priority: 1,
    startDate: "",
    endDate: "",
    status: "inactive",
    desktopImage: "",
    mobileImage: "",
    altText: "Phát âm chuẩn từ đầu cho người lớn",
    title: "Phát âm chuẩn từ đầu cho người lớn – Tự tin nói chuẩn sau 30 ngày",
    subtitle: "Video hướng dẫn khẩu hình chi tiết kèm bài tập luyện shadowing mỗi ngày.",
    ctaText: "Tìm hiểu khóa phát âm",
    ctaLink: "/khoa-hoc/phat-am-chuan-my-shadowing",
    openInNewTab: false,
  },
];

export const DEFAULT_REDIRECTS_301: Redirect301Item[] = [
  {
    id: "red-1",
    from: "/khoa-hoc/day-con-tieng-anh",
    to: "/khoa-hoc/me-day-con-tieng-anh",
    note: "Tự tạo khi đổi slug",
  },
];

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  site_name: "EngNest",
  hotline: "0989 898 989",
  support_email: "support@engnest.vn",
  working_hours: "8:00–21:00 hằng ngày",
  vietqr_bank_code: "MBBANK",
  vietqr_account_number: "0399046519",
  vietqr_account_name: "HA VAN MANH",
  zalo_url: "https://zalo.me/0989898989",
  fanpage_url: "https://facebook.com/engnest.vn",
  community_group_url: "https://facebook.com/groups/daycontienganhtunhien",
  community_group_name: "Dạy con tiếng Anh tự nhiên",
  community_members: "12.000+",
  youtube_tiktok_url: "",
  company_name: "Hộ kinh doanh Giáo dục EngNest",
  tax_id: "0109876543",
  company_address: "Cầu Giấy, Hà Nội",
  homepage_sections: DEFAULT_HOMEPAGE_SECTIONS,
  banners: DEFAULT_BANNERS,
  meta_title: "EngNest – Tiếng Anh online cho người lớn & mẹ dạy con",
  meta_description:
    "Khóa học tiếng Anh dạng video & PDF, mua một lần học trọn đời. Không cần tài khoản – thanh toán QR, nhận tài liệu qua email trong vài phút.",
  og_image: "",
  favicon: "/logo-tab-1.png",
  google_site_verification: '<meta name="google-site-verification" content="xxxxxxxx" />',
  google_analytics_id: "",
  gtm_id: "",
  facebook_pixel_id: "",
  send_purchase_event: true,
  robots_txt:
    "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /thanh-toan\n\nSitemap: https://engnest.vn/sitemap.xml",
  noindex: false,
  primary_domain: "https://engnest.vn",
  www_redirect: "non-www",
  redirects_301: DEFAULT_REDIRECTS_301,
  schema_organization: true,
  schema_course: true,
  schema_faq: true,
  schema_breadcrumb: true,
  schema_article: false,
  sitemap_last_generated: "09:12 hôm nay",
  sitemap_url_count: 6,
  missing_seo_image_count: 0,
};

export const settingsApi = {
  getSettings: async (): Promise<SystemSettings> => {
    try {
      const res = await apiService.get<any>("/admin/settings");
      const raw = res?.data || res || {};
      return {
        ...DEFAULT_SYSTEM_SETTINGS,
        ...raw,
        homepage_sections:
          Array.isArray(raw.homepage_sections) && raw.homepage_sections.length > 0
            ? raw.homepage_sections
            : DEFAULT_HOMEPAGE_SECTIONS,
        banners:
          Array.isArray(raw.banners) && raw.banners.length > 0
            ? raw.banners
            : DEFAULT_BANNERS,
        redirects_301: Array.isArray(raw.redirects_301)
          ? raw.redirects_301
          : DEFAULT_REDIRECTS_301,
      };
    } catch {
      return { ...DEFAULT_SYSTEM_SETTINGS };
    }
  },

  updateSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    const res = await apiService.put<any>("/admin/settings", data);
    return (res?.data || res) as SystemSettings;
  },

  regenerateSitemap: async (): Promise<{
    success: boolean;
    sitemap_last_generated: string;
    sitemap_url_count: number;
    urls: Array<{ loc: string; lastmod: string; priority: string }>;
    xml: string;
  }> => {
    const res = await apiService.post<any>("/admin/seo/regenerate-sitemap", {});
    return res?.data || res;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiService.post<any>("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const payload = res?.data || res;
    return payload?.url || "";
  },
};
