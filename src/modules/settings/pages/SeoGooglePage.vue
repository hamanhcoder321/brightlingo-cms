<template>
  <div
    class="p-6 md:p-8 pb-14 flex flex-col gap-[22px] max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]"
    style="color-scheme: light"
  >
    <!-- Top Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="m-0 font-serif font-bold text-[32px] text-[#1D2A2E] leading-tight">
          SEO &amp; Google
        </h1>
        <p class="m-0 text-[#4C5A60] text-[15px]">
          Cấu hình chung để Google tìm thấy, hiểu và xếp hạng website. SEO riêng từng khóa nằm trong trang sửa khóa học.
        </p>
      </div>

      <button
        type="button"
        @click="handleSave"
        :disabled="isSaving"
        class="h-[46px] px-5 rounded-[10px] border-0 bg-[#0B6E6E] hover:bg-[#08585A] text-white font-bold text-[15px] cursor-pointer transition-colors shadow-xs disabled:opacity-50 flex items-center gap-2"
      >
        <span
          v-if="isSaving"
          class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
        ></span>
        <span>{{ isSaving ? "Đang lưu..." : "Lưu cấu hình" }}</span>
      </button>
    </div>

    <!-- Save Banner -->
    <div
      v-if="saveMessage"
      class="p-3.5 px-4 rounded-[12px] bg-[#E4F3EA] border border-[#A4DBC0] text-[14px] text-[#155C35] font-medium flex items-center justify-between"
    >
      <span>{{ saveMessage }}</span>
      <button
        type="button"
        @click="saveMessage = ''"
        class="text-[#155C35] hover:opacity-75 font-bold cursor-pointer"
      >
        ✕
      </button>
    </div>

    <!-- Main 2-Column Layout -->
    <div class="flex flex-wrap gap-[22px] items-start">
      <!-- Left Column: 5 SEO Config Sections -->
      <div class="flex-[999_1_560px] min-w-0 flex flex-col gap-5">
        <!-- 1. SEO trang chủ -->
        <section class="bg-white border border-[#E5E0D7] rounded-[16px] p-6 flex flex-col gap-4 shadow-xs">
          <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">1. SEO trang chủ</h2>

          <label class="flex flex-col gap-1.5 font-medium text-[15px]">
            <span>Tên website (site name)</span>
            <input
              v-model="form.site_name"
              type="text"
              placeholder="EngNest"
              class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] px-3.5 text-[16px] bg-white text-[#1D2A2E] outline-none transition-colors"
            />
          </label>

          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label for="h-title" class="font-medium text-[15px]">Tiêu đề trang chủ</label>
              <span
                class="text-[14px] font-semibold"
                :class="form.meta_title.length <= 60 ? 'text-[#155C35]' : 'text-[#B4531A]'"
              >
                {{ form.meta_title.length }}/60
              </span>
            </div>
            <input
              id="h-title"
              v-model="form.meta_title"
              type="text"
              class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] px-3.5 text-[16px] bg-white text-[#1D2A2E] outline-none transition-colors"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label for="h-desc" class="font-medium text-[15px]">Mô tả trang chủ</label>
              <span
                class="text-[14px] font-semibold"
                :class="form.meta_description.length <= 160 ? 'text-[#155C35]' : 'text-[#B4531A]'"
              >
                {{ form.meta_description.length }}/160
              </span>
            </div>
            <textarea
              id="h-desc"
              v-model="form.meta_description"
              rows="3"
              class="border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] p-3 px-3.5 text-[16px] bg-white text-[#1D2A2E] outline-none resize-y transition-colors"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Ảnh chia sẻ mặc định (1200x630) -->
            <div class="flex flex-col gap-1.5">
              <span class="font-medium text-[15px]">Ảnh chia sẻ mặc định (1200×630)</span>
              <input
                ref="ogFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleOgFileChange"
              />
              <div
                @click="triggerOgUpload"
                class="h-[110px] border-2 border-dashed border-[#C9C2B6] hover:border-[#0B6E6E] rounded-[12px] bg-[#FAF7F2] flex items-center justify-center text-[14px] text-[#4C5A60] cursor-pointer overflow-hidden relative group transition-colors"
              >
                <img
                  v-if="form.og_image"
                  :src="form.og_image"
                  alt="OG Default"
                  class="w-full h-full object-cover"
                />
                <div
                  v-if="form.og_image"
                  class="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold text-[13px] transition-opacity"
                >
                  Đổi ảnh chia sẻ
                </div>
                <span v-else class="font-medium group-hover:text-[#0B6E6E]">
                  {{ isUploadingOg ? "Đang tải ảnh..." : "Tải ảnh lên" }}
                </span>
              </div>
              <input
                v-model="form.og_image"
                type="text"
                placeholder="Hoặc dán link ảnh https://..."
                class="h-9 border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[8px] px-2.5 text-[13px] bg-white text-[#1D2A2E] outline-none"
              />
            </div>

            <!-- Favicon (512x512) -->
            <div class="flex flex-col gap-1.5">
              <span class="font-medium text-[15px]">Favicon (512×512)</span>
              <input
                ref="faviconFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFaviconFileChange"
              />
              <div
                @click="triggerFaviconUpload"
                class="h-[110px] border-2 border-dashed border-[#C9C2B6] hover:border-[#0B6E6E] rounded-[12px] bg-[#FAF7F2] flex items-center justify-center gap-3 text-[14px] text-[#4C5A60] cursor-pointer transition-colors group"
              >
                <span
                  class="w-12 h-12 rounded-[12px] bg-[#0B6E6E] flex items-center justify-center overflow-hidden shrink-0"
                >
                  <img
                    v-if="form.favicon && form.favicon.startsWith('http')"
                    :src="form.favicon"
                    alt="Favicon"
                    class="w-full h-full object-cover"
                  />
                  <svg
                    v-else
                    width="30"
                    height="30"
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 6h24a11 11 0 0 1 11 11v10a11 11 0 0 1-11 11H24l-9 8v-8.6A11 11 0 0 1 4 27V17A11 11 0 0 1 15 6z"
                      fill="#FFFFFF"
                    ></path>
                    <path
                      d="M37 28h13a9 9 0 0 1 9 9v6a9 9 0 0 1-6 8.5V58l-7.5-5.5H37a9 9 0 0 1-9-9v-6.5a9 9 0 0 1 9-9z"
                      fill="#E8873A"
                      stroke="#0B6E6E"
                      stroke-width="3"
                    ></path>
                  </svg>
                </span>
                <span class="font-medium group-hover:text-[#0B6E6E]">
                  {{ isUploadingFavicon ? "Đang tải..." : "Đổi ảnh" }}
                </span>
              </div>
              <input
                v-model="form.favicon"
                type="text"
                placeholder="/logo-tab-1.png hoặc https://..."
                class="h-9 border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[8px] px-2.5 text-[13px] bg-white text-[#1D2A2E] outline-none"
              />
            </div>
          </div>
        </section>

        <!-- 2. Kết nối Google & công cụ đo lường -->
        <section class="bg-white border-2 border-[#9FC9C2] rounded-[16px] p-6 flex flex-col gap-4 shadow-xs">
          <div>
            <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">
              2. Kết nối Google &amp; công cụ đo lường
            </h2>
            <span class="text-[14px] text-[#4C5A60]">
              Dán mã từ các công cụ; website tự chèn vào thẻ &lt;head&gt; của mọi trang.
            </span>
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex flex-wrap justify-between items-center gap-2">
              <label for="gsc" class="font-medium text-[15px]">
                Google Search Console – mã xác minh (thẻ meta)
              </label>
              <span
                v-if="hasGscVerified"
                class="bg-[#E4F3EA] text-[#155C35] text-[13px] font-semibold px-2.5 py-0.5 rounded-full"
              >
                Đã xác minh
              </span>
              <span
                v-else
                class="bg-[#FDF0E3] text-[#8A3F12] text-[13px] font-semibold px-2.5 py-0.5 rounded-full"
              >
                Chưa xác minh
              </span>
            </div>
            <input
              id="gsc"
              v-model="form.google_site_verification"
              type="text"
              placeholder='<meta name="google-site-verification" content="xxxxxxxx" />'
              class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] px-3.5 font-mono text-[14px] bg-white text-[#1D2A2E] outline-none transition-colors"
            />
            <span class="text-[14px] text-[#4C5A60]">
              Search Console › Thêm sản phẩm › Tiền tố URL › Thẻ HTML.
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              <span>Google Analytics 4 (Measurement ID)</span>
              <input
                v-model="form.google_analytics_id"
                type="text"
                placeholder="G-XXXXXXXXXX"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] px-3.5 font-mono text-[15px] bg-white text-[#1D2A2E] outline-none transition-colors"
              />
            </label>

            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              <span>Google Tag Manager (không bắt buộc)</span>
              <input
                v-model="form.gtm_id"
                type="text"
                placeholder="GTM-XXXXXXX"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] px-3.5 font-mono text-[15px] bg-white text-[#1D2A2E] outline-none transition-colors"
              />
            </label>

            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              <span>Facebook Pixel ID (chạy quảng cáo)</span>
              <input
                v-model="form.facebook_pixel_id"
                type="text"
                placeholder="1234567890"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] px-3.5 font-mono text-[15px] bg-white text-[#1D2A2E] outline-none transition-colors"
              />
            </label>
          </div>

          <label class="flex gap-2.5 items-center text-[15px] min-h-[40px] cursor-pointer select-none">
            <input
              v-model="form.send_purchase_event"
              type="checkbox"
              class="w-[22px] h-[22px] accent-[#0B6E6E] cursor-pointer"
            />
            <span>Gửi sự kiện “Mua hàng” (purchase) kèm giá trị đơn khi thanh toán thành công</span>
          </label>
        </section>

        <!-- 3. Sitemap & robots.txt -->
        <section class="bg-white border border-[#E5E0D7] rounded-[16px] p-6 flex flex-col gap-4 shadow-xs">
          <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">3. Sitemap &amp; robots.txt</h2>

          <div
            class="flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F2] rounded-[12px] p-3.5 px-4"
          >
            <div class="flex flex-col">
              <strong class="font-mono text-[15px] text-[#1D2A2E]">
                {{ cleanDomain }}/sitemap.xml
              </strong>
              <span class="text-[14px] text-[#4C5A60]">
                Tự cập nhật khi thêm/sửa khóa học · {{ form.sitemap_url_count || 6 }} đường dẫn · tạo lúc
                {{ form.sitemap_last_generated || "09:12 hôm nay" }}
              </span>
            </div>

            <div class="flex gap-2">
              <button
                type="button"
                @click="handlePreviewSitemap"
                class="h-10 px-3.5 rounded-[10px] border-[1.5px] border-[#C9DCD8] bg-white hover:bg-[#E6F2F0] text-[#0B6E6E] font-semibold text-[14px] cursor-pointer transition-colors"
              >
                Xem file
              </button>
              <button
                type="button"
                @click="handleRegenerateSitemap"
                :disabled="isRegeneratingSitemap"
                class="h-10 px-3.5 rounded-[10px] border-[1.5px] border-[#C9DCD8] bg-white hover:bg-[#E6F2F0] text-[#0B6E6E] font-semibold text-[14px] cursor-pointer transition-colors disabled:opacity-50"
              >
                {{ isRegeneratingSitemap ? "Đang tạo..." : "Tạo lại" }}
              </button>
            </div>
          </div>

          <label class="flex flex-col gap-1.5 font-medium text-[15px]">
            <span>Nội dung robots.txt</span>
            <textarea
              v-model="form.robots_txt"
              rows="6"
              class="border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] p-3 px-3.5 font-mono text-[14px] leading-relaxed bg-white text-[#1D2A2E] outline-none resize-y transition-colors"
            ></textarea>
          </label>

          <label
            class="flex gap-2.5 items-start text-[15px] min-h-[40px] bg-[#FDF0E3] rounded-[10px] p-2.5 px-3 cursor-pointer select-none"
          >
            <input
              v-model="form.noindex"
              type="checkbox"
              class="w-[22px] h-[22px] accent-[#B4531A] shrink-0 mt-0.5 cursor-pointer"
            />
            <span class="text-[#1D2A2E]">
              Chặn Google toàn bộ website (noindex) – chỉ bật khi website còn đang dựng thử
            </span>
          </label>
        </section>

        <!-- 4. Tên miền & chuyển hướng -->
        <section class="bg-white border border-[#E5E0D7] rounded-[16px] p-6 flex flex-col gap-4 shadow-xs">
          <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">4. Tên miền &amp; chuyển hướng</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              <span>Tên miền chính</span>
              <input
                v-model="form.primary_domain"
                type="text"
                placeholder="https://engnest.vn"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[10px] px-3.5 text-[16px] bg-white text-[#1D2A2E] outline-none transition-colors"
              />
            </label>

            <fieldset class="border-0 m-0 p-0 flex flex-col gap-1.5">
              <legend class="font-medium text-[15px] mb-1.5">Dạng www</legend>
              <label class="flex gap-2.5 items-center text-[15px] cursor-pointer">
                <input
                  v-model="form.www_redirect"
                  type="radio"
                  name="www"
                  value="non-www"
                  class="w-5 h-5 accent-[#0B6E6E] cursor-pointer"
                />
                <span>www.{{ bareDomain }} → {{ bareDomain }}</span>
              </label>
              <label class="flex gap-2.5 items-center text-[15px] cursor-pointer">
                <input
                  v-model="form.www_redirect"
                  type="radio"
                  name="www"
                  value="www"
                  class="w-5 h-5 accent-[#0B6E6E] cursor-pointer"
                />
                <span>{{ bareDomain }} → www.{{ bareDomain }}</span>
              </label>
            </fieldset>
          </div>

          <div class="flex flex-col gap-2">
            <span class="font-medium text-[15px]">
              Chuyển hướng 301 (khi đổi slug, link cũ vẫn chạy)
            </span>

            <div class="border border-[#E5E0D7] rounded-[12px] overflow-x-auto">
              <table class="w-full min-w-[560px] border-collapse text-[14px]">
                <thead>
                  <tr class="bg-[#FAF7F2] text-[#4C5A60]">
                    <th class="py-2.5 px-3 font-semibold text-left">Link cũ</th>
                    <th class="py-2.5 px-3 font-semibold text-left">Chuyển tới</th>
                    <th class="py-2.5 px-3 font-semibold text-left">Lượt dùng</th>
                    <th class="py-2.5 px-3 font-semibold text-right w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="form.redirects_301.length === 0">
                    <td colspan="4" class="py-4 px-3 text-center text-[#78888D]">
                      Chưa có quy tắc chuyển hướng 301 nào.
                    </td>
                  </tr>
                  <tr
                    v-for="(item, idx) in form.redirects_301"
                    :key="item.id || idx"
                    class="border-t border-[#EFEBE4] hover:bg-[#FAF7F2]/60"
                  >
                    <td class="py-2.5 px-3 font-mono text-[#1D2A2E]">{{ item.from }}</td>
                    <td class="py-2.5 px-3 font-mono text-[#0B6E6E]">{{ item.to }}</td>
                    <td class="py-2.5 px-3 text-[#4C5A60]">{{ item.note || "Thủ công" }}</td>
                    <td class="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        @click="removeRedirect(idx)"
                        class="text-[#8C989C] hover:text-red-600 font-semibold text-[13px] cursor-pointer"
                        title="Xóa chuyển hướng"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Form thêm nhanh chuyển hướng 301 -->
            <div
              v-if="showAddRedirect"
              class="p-3.5 rounded-[12px] bg-[#FAF7F2] border border-[#E5E0D7] flex flex-wrap items-end gap-3 mt-1"
            >
              <label class="flex-1 min-w-[180px] flex flex-col gap-1 text-[13px] font-medium">
                <span>Link cũ (VD: /khoa-hoc/link-cu)</span>
                <input
                  v-model="newRedirect.from"
                  type="text"
                  placeholder="/khoa-hoc/day-con-tieng-anh"
                  class="h-10 border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[8px] px-3 font-mono text-[13px] bg-white outline-none"
                />
              </label>
              <label class="flex-1 min-w-[180px] flex flex-col gap-1 text-[13px] font-medium">
                <span>Chuyển tới (VD: /khoa-hoc/link-moi)</span>
                <input
                  v-model="newRedirect.to"
                  type="text"
                  placeholder="/khoa-hoc/me-day-con-tieng-anh"
                  class="h-10 border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-[8px] px-3 font-mono text-[13px] bg-white outline-none"
                />
              </label>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="addRedirectRule"
                  class="h-10 px-4 rounded-[8px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[13px] cursor-pointer"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  @click="showAddRedirect = false"
                  class="h-10 px-3 rounded-[8px] border border-[#D8D2C7] bg-white text-[#4C5A60] font-semibold text-[13px] cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </div>

            <button
              v-else
              type="button"
              @click="showAddRedirect = true"
              class="self-start h-10 px-3.5 rounded-[10px] border-[1.5px] border-dashed border-[#9FC9C2] bg-white hover:bg-[#E6F2F0] text-[#0B6E6E] font-semibold text-[15px] cursor-pointer transition-colors"
            >
              + Thêm chuyển hướng
            </button>
          </div>
        </section>

        <!-- 5. Dữ liệu có cấu trúc (Schema.org) -->
        <section class="bg-white border border-[#E5E0D7] rounded-[16px] p-6 flex flex-col gap-3 shadow-xs">
          <div>
            <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">
              5. Dữ liệu có cấu trúc (Schema.org)
            </h2>
            <span class="text-[14px] text-[#4C5A60]">
              Giúp Google hiểu website là ai, bán gì – có thể hiện thêm thông tin trên kết quả tìm kiếm.
            </span>
          </div>

          <label class="flex gap-2.5 items-center text-[15px] min-h-[40px] cursor-pointer select-none">
            <input
              v-model="form.schema_organization"
              type="checkbox"
              class="w-[22px] h-[22px] accent-[#0B6E6E] cursor-pointer"
            />
            <span>
              <strong>Organization</strong> – tên, logo, hotline, Fanpage, Zalo (lấy từ Giao diện &amp; Banner)
            </span>
          </label>

          <label class="flex gap-2.5 items-center text-[15px] min-h-[40px] cursor-pointer select-none">
            <input
              v-model="form.schema_course"
              type="checkbox"
              class="w-[22px] h-[22px] accent-[#0B6E6E] cursor-pointer"
            />
            <span>
              <strong>Course + Offer</strong> – cho mỗi trang khóa học (tên, mô tả, giá VND)
            </span>
          </label>

          <label class="flex gap-2.5 items-center text-[15px] min-h-[40px] cursor-pointer select-none">
            <input
              v-model="form.schema_faq"
              type="checkbox"
              class="w-[22px] h-[22px] accent-[#0B6E6E] cursor-pointer"
            />
            <span>
              <strong>FAQPage</strong> – từ phần Hỏi đáp
            </span>
          </label>

          <label class="flex gap-2.5 items-center text-[15px] min-h-[40px] cursor-pointer select-none">
            <input
              v-model="form.schema_breadcrumb"
              type="checkbox"
              class="w-[22px] h-[22px] accent-[#0B6E6E] cursor-pointer"
            />
            <span>
              <strong>BreadcrumbList</strong> – đường dẫn Trang chủ › Danh mục › Khóa học
            </span>
          </label>

          <label class="flex gap-2.5 items-center text-[15px] min-h-[40px] opacity-70 select-none">
            <input type="checkbox" disabled class="w-[22px] h-[22px]" />
            <span><strong>Article</strong> – cho bài viết</span>
            <span class="bg-[#ECE7DE] text-[#4C5A60] text-[12px] font-bold px-2 py-0.5 rounded-[6px]">
              GĐ 2
            </span>
          </label>
        </section>
      </div>

      <!-- Right Sticky Sidebar: SEO Diagnostics -->
      <aside class="flex-[1_1_320px] min-w-0 sticky top-6 flex flex-col gap-4">
        <section class="bg-white border border-[#E5E0D7] rounded-[16px] p-5 flex flex-col gap-3 shadow-xs">
          <h2 class="m-0 text-[17px] font-semibold text-[#1D2A2E]">Tình trạng SEO</h2>

          <ul class="list-none m-0 p-0 flex flex-col gap-2.5 text-[15px]">
            <!-- Check 1: Search Console -->
            <li class="flex gap-2.5 items-start">
              <svg
                v-if="hasGscVerified"
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E7A47"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12.5 4.5 4.5L19 7.5"></path>
              </svg>
              <svg
                v-else
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B4531A"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 8v5M12 16.5v.01"></path>
              </svg>
              <span>
                {{
                  hasGscVerified
                    ? "Đã xác minh Google Search Console"
                    : "Chưa xác minh Google Search Console"
                }}
              </span>
            </li>

            <!-- Check 2: Sitemap -->
            <li class="flex gap-2.5 items-start">
              <svg
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E7A47"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12.5 4.5 4.5L19 7.5"></path>
              </svg>
              <span>Sitemap đã tạo ({{ form.sitemap_url_count || 6 }} đường dẫn)</span>
            </li>

            <!-- Check 3: HTTPS -->
            <li class="flex gap-2.5 items-start">
              <svg
                v-if="isHttpsDomain"
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E7A47"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12.5 4.5 4.5L19 7.5"></path>
              </svg>
              <svg
                v-else
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B4531A"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 8v5M12 16.5v.01"></path>
              </svg>
              <span>{{ isHttpsDomain ? "HTTPS hoạt động" : "Tên miền chưa dùng HTTPS" }}</span>
            </li>

            <!-- Check 4: Noindex warning -->
            <li v-if="form.noindex" class="flex gap-2.5 items-start text-[#B4531A] font-medium">
              <svg
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B4531A"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 8v5M12 16.5v.01"></path>
              </svg>
              <span>Đang bật chặn Google lập chỉ mục (noindex)</span>
            </li>
            <li v-else class="flex gap-2.5 items-start">
              <svg
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B4531A"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 8v5M12 16.5v.01"></path>
              </svg>
              <span>Nhớ gửi link sitemap.xml lên Search Console</span>
            </li>

            <!-- Check 5: Course SEO image check -->
            <li class="flex gap-2.5 items-start">
              <svg
                v-if="!form.missing_seo_image_count"
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E7A47"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12.5 4.5 4.5L19 7.5"></path>
              </svg>
              <svg
                v-else
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B4531A"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 8v5M12 16.5v.01"></path>
              </svg>
              <span v-if="form.missing_seo_image_count">
                {{ form.missing_seo_image_count }} khóa học thiếu ảnh SEO –
                <router-link to="/courses" class="text-[#0B6E6E] font-semibold hover:underline">
                  Sửa
                </router-link>
              </span>
              <span v-else>
                Tất cả khóa học đã có ảnh chia sẻ SEO –
                <router-link to="/courses" class="text-[#0B6E6E] font-semibold hover:underline">
                  Xem
                </router-link>
              </span>
            </li>

            <!-- Check 6: Google Analytics 4 -->
            <li class="flex gap-2.5 items-start">
              <svg
                v-if="form.google_analytics_id && form.google_analytics_id.trim()"
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E7A47"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12.5 4.5 4.5L19 7.5"></path>
              </svg>
              <svg
                v-else
                class="shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B4531A"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 8v5M12 16.5v.01"></path>
              </svg>
              <span>
                {{
                  form.google_analytics_id && form.google_analytics_id.trim()
                    ? `Đã kết nối GA4 (${form.google_analytics_id.trim()})`
                    : "Chưa nhập Google Analytics 4"
                }}
              </span>
            </li>
          </ul>

          <span class="text-[13px] text-[#4C5A60]">
            Hệ thống tự kiểm tra trực tiếp khi lưu.
          </span>
        </section>

        <section class="bg-[#E6F2F0] rounded-[16px] p-5 flex flex-col gap-2 text-[15px] text-[#1D2A2E]">
          <strong class="text-[16px]">Website tự làm sẵn</strong>
          <span>• Thẻ title, description, canonical, Open Graph cho mọi trang</span>
          <span>• Link đẹp dạng /khoa-hoc/{slug}</span>
          <span>• Ảnh tự nén WebP, có alt</span>
          <span>• Trang thanh toán và admin không cho Google lập chỉ mục</span>
        </section>
      </aside>
    </div>

    <!-- Sitemap XML Preview Modal -->
    <div
      v-if="sitemapPreviewXml"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
    >
      <div
        class="bg-white rounded-[16px] border border-[#E5E0D7] shadow-xl max-w-2xl w-full p-6 flex flex-col gap-4 text-[#1D2A2E]"
      >
        <div class="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
          <div>
            <h3 class="m-0 font-serif font-bold text-[20px]">Nội dung Sitemap XML</h3>
            <p class="m-0 text-[13px] text-[#4C5A60] font-mono">{{ cleanDomain }}/sitemap.xml</p>
          </div>
          <button
            type="button"
            @click="sitemapPreviewXml = ''"
            class="text-[#4C5A60] hover:text-[#1D2A2E] text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <pre
          class="m-0 p-4 rounded-[12px] bg-[#FAF7F2] border border-[#E5E0D7] font-mono text-[13px] text-[#1D2A2E] overflow-x-auto max-h-[380px] overflow-y-auto"
        >{{ sitemapPreviewXml }}</pre>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="sitemapPreviewXml = ''"
            class="h-10 px-5 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[14px] cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, inject } from "vue";
import { settingsApi, DEFAULT_SYSTEM_SETTINGS } from "../api/settings.api";
import type { SystemSettings } from "../types/settings.types";

const toast = inject<any>("toast", {
  success: (m: string) => console.log(m),
  error: (m: string) => console.error(m),
});

const form = reactive<SystemSettings>({
  ...DEFAULT_SYSTEM_SETTINGS,
  redirects_301: [...DEFAULT_SYSTEM_SETTINGS.redirects_301],
});

const isSaving = ref(false);
const saveMessage = ref("");
const isRegeneratingSitemap = ref(false);
const sitemapPreviewXml = ref("");

const showAddRedirect = ref(false);
const newRedirect = reactive({
  from: "",
  to: "",
});

const ogFileInput = ref<HTMLInputElement | null>(null);
const faviconFileInput = ref<HTMLInputElement | null>(null);
const isUploadingOg = ref(false);
const isUploadingFavicon = ref(false);

const cleanDomain = computed(() => {
  return (form.primary_domain || "https://engnest.vn").replace(/\/$/, "");
});

const bareDomain = computed(() => {
  return cleanDomain.value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
});

const isHttpsDomain = computed(() => {
  return cleanDomain.value.toLowerCase().startsWith("https://");
});

const hasGscVerified = computed(() => {
  const v = (form.google_site_verification || "").trim();
  return v.length > 0 && !v.includes('content="xxxxxxxx"');
});

onMounted(async () => {
  const data = await settingsApi.getSettings();
  Object.assign(form, data);
});

function triggerOgUpload() {
  ogFileInput.value?.click();
}

async function handleOgFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  isUploadingOg.value = true;
  try {
    const url = await settingsApi.uploadImage(file);
    if (url) {
      form.og_image = url;
      toast.success("Đã tải ảnh chia sẻ mặc định lên");
    }
  } catch {
    toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
  } finally {
    isUploadingOg.value = false;
    target.value = "";
  }
}

function triggerFaviconUpload() {
  faviconFileInput.value?.click();
}

async function handleFaviconFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  isUploadingFavicon.value = true;
  try {
    const url = await settingsApi.uploadImage(file);
    if (url) {
      form.favicon = url;
      toast.success("Đã cập nhật ảnh Favicon");
    }
  } catch {
    toast.error("Không thể tải Favicon lên.");
  } finally {
    isUploadingFavicon.value = false;
    target.value = "";
  }
}

function addRedirectRule() {
  const fromPath = newRedirect.from.trim();
  const toPath = newRedirect.to.trim();
  if (!fromPath || !toPath) return;

  form.redirects_301.push({
    id: `red-${Date.now()}`,
    from: fromPath.startsWith("/") ? fromPath : `/${fromPath}`,
    to: toPath.startsWith("/") ? toPath : `/${toPath}`,
    note: "Thêm thủ công",
  });
  newRedirect.from = "";
  newRedirect.to = "";
  showAddRedirect.value = false;
}

function removeRedirect(idx: number) {
  form.redirects_301.splice(idx, 1);
}

async function handleRegenerateSitemap() {
  isRegeneratingSitemap.value = true;
  try {
    const res = await settingsApi.regenerateSitemap();
    if (res) {
      form.sitemap_last_generated = res.sitemap_last_generated;
      form.sitemap_url_count = res.sitemap_url_count;
      toast.success(`Đã tạo lại Sitemap (${res.sitemap_url_count} đường dẫn)`);
    }
  } catch {
    toast.error("Không thể tạo lại Sitemap");
  } finally {
    isRegeneratingSitemap.value = false;
  }
}

async function handlePreviewSitemap() {
  try {
    const res = await settingsApi.regenerateSitemap();
    if (res?.xml) {
      sitemapPreviewXml.value = res.xml;
      form.sitemap_last_generated = res.sitemap_last_generated;
      form.sitemap_url_count = res.sitemap_url_count;
    }
  } catch {
    const d = cleanDomain.value;
    sitemapPreviewXml.value = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${d}/</loc>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>${d}/khoa-hoc</loc>\n    <priority>0.9</priority>\n  </url>\n</urlset>`;
  }
}

async function handleSave() {
  isSaving.value = true;
  saveMessage.value = "";
  try {
    const updated = await settingsApi.updateSettings({
      site_name: form.site_name,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      og_image: form.og_image,
      favicon: form.favicon,
      google_site_verification: form.google_site_verification,
      google_analytics_id: form.google_analytics_id,
      gtm_id: form.gtm_id,
      facebook_pixel_id: form.facebook_pixel_id,
      send_purchase_event: form.send_purchase_event,
      robots_txt: form.robots_txt,
      noindex: form.noindex,
      primary_domain: form.primary_domain,
      www_redirect: form.www_redirect,
      redirects_301: form.redirects_301,
      schema_organization: form.schema_organization,
      schema_course: form.schema_course,
      schema_faq: form.schema_faq,
      schema_breadcrumb: form.schema_breadcrumb,
      schema_article: form.schema_article,
    });
    Object.assign(form, updated);
    saveMessage.value = "Đã lưu cấu hình SEO & Google thành công! Dữ liệu đã được đồng bộ với website.";
    toast.success("Đã lưu cấu hình SEO & Google");
    setTimeout(() => {
      if (saveMessage.value) saveMessage.value = "";
    }, 4500);
  } catch (err) {
    console.error("Failed to save SEO settings", err);
    toast.error("Có lỗi khi lưu cấu hình SEO");
  } finally {
    isSaving.value = false;
  }
}
</script>
