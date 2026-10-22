<template>
  <div class="p-6 md:p-8 pb-16 flex flex-col gap-5 max-w-[1440px] mx-auto min-h-full font-sans text-[#1D2A2E]">
    <!-- Breadcrumb & Title -->
    <div class="flex flex-col gap-1">
      <nav aria-label="Đường dẫn" class="text-sm text-[#4C5A60] flex items-center gap-1.5">
        <router-link to="/courses" class="text-[#4C5A60] hover:text-[#0B6E6E] transition-colors">
          Khóa học
        </router-link>
        <span>/</span>
        <span class="font-medium text-[#1D2A2E]">{{ isEdit ? 'Sửa' : 'Thêm mới' }}</span>
      </nav>
      <h1 class="m-0 font-serif font-bold text-[30px] text-[#1D2A2E] leading-tight">
        {{ form.title || (isEdit ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới') }}
      </h1>
    </div>

    <!-- Loading State for Edit mode -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-[#E5E0D7] p-12 text-center text-[#4C5A60]">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0B6E6E] border-t-transparent mb-3"></div>
      <p class="font-medium text-sm">Đang tải thông tin khóa học từ lingo-api...</p>
    </div>

    <!-- Main Content Layout (Form + Sticky Sidebar) -->
    <div v-else class="flex flex-wrap gap-6 items-start">
      <!-- Left Column: Form Sections -->
      <form @submit.prevent="handleSave" class="flex-[999_1_560px] min-w-0 flex flex-col gap-5">
        <!-- 1. Thông tin cơ bản -->
        <section class="bg-white border border-[#E5E0D7] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">1. Thông tin cơ bản</h2>

          <label class="flex flex-col gap-1.5 font-medium text-[15px]">
            Tên khóa học *
            <input
              v-model="form.title"
              type="text"
              required
              @input="onTitleInput"
              placeholder="VD: Mẹ dạy con tiếng Anh tại nhà"
              class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[16px] outline-none transition-colors"
            />
          </label>

          <div class="flex flex-col gap-1.5">
            <label for="slug" class="font-medium text-[15px]">Đường dẫn (slug) *</label>
            <div class="flex border-[1.5px] border-[#D8D2C7] focus-within:border-[#0B6E6E] rounded-xl overflow-hidden transition-colors">
              <span class="flex items-center px-3 bg-[#FAF7F2] text-[#4C5A60] border-r border-[#E5E0D7] text-[15px] select-none whitespace-nowrap">
                engnest.vn/khoa-hoc/
              </span>
              <input
                id="slug"
                v-model="form.slug"
                type="text"
                required
                placeholder="me-day-con-tieng-anh"
                class="flex-1 min-w-0 h-[46px] border-0 px-3 text-[16px] outline-none"
              />
            </div>
            <span class="text-[13px] text-[#4C5A60]">
              Chỉ chữ thường không dấu, số và dấu “-”. Đổi slug sau khi đã chạy quảng cáo sẽ làm hỏng link cũ.
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Category -->
            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              Danh mục
              <select
                v-model="form.categoryId"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3 text-[15px] bg-white outline-none transition-colors"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </label>

            <!-- Tag Badge -->
            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              Nhãn hiển thị
              <input
                v-model="form.tagBadge"
                type="text"
                placeholder="32 video · 6 PDF · Audio"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none transition-colors"
              />
            </label>

            <!-- Duration -->
            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              Tổng thời lượng
              <input
                v-model="form.duration"
                type="text"
                placeholder="9 giờ"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none transition-colors"
              />
            </label>
          </div>

          <label class="flex flex-col gap-1.5 font-medium text-[15px]">
            Mô tả ngắn (hiện dưới tiêu đề)
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Lộ trình 8 tuần, mỗi ngày 15 phút: bố mẹ – kể cả khi không giỏi tiếng Anh – vẫn tự tin trò chuyện tiếng Anh cùng con 4–10 tuổi."
              class="border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl p-3 text-[15px] outline-none resize-y transition-colors"
            ></textarea>
          </label>
        </section>

        <!-- 2. Giá bán -->
        <section class="bg-white border border-[#E5E0D7] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">2. Giá bán</h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              Giá bán (đ) *
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                required
                placeholder="399000"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[16px] outline-none transition-colors"
              />
            </label>

            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              Giá gốc – gạch ngang (đ)
              <input
                v-model.number="form.originalPrice"
                type="number"
                min="0"
                placeholder="699000"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[16px] outline-none transition-colors"
              />
            </label>

            <div class="h-12 flex items-center">
              <span class="bg-[#FDF0E3] text-[#B4531A] font-semibold text-[14px] px-3.5 py-2 rounded-lg">
                Hiển thị: Tiết kiệm {{ formatVND(savingsAmount) }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 border-[1.5px] border-dashed border-[#D8D2C7] rounded-xl p-3 bg-[#FAF7F2] opacity-60 cursor-not-allowed select-none">
            <label class="flex gap-2.5 items-center text-[15px] cursor-not-allowed pointer-events-none">
              <input
                v-model="allowCoupon"
                type="checkbox"
                disabled
                class="w-5 h-5 accent-[#0B6E6E] cursor-not-allowed"
              />
              <span>Cho phép áp dụng mã giảm giá cho khóa này</span>
            </label>
            <span class="bg-[#ECE7DE] text-[#4C5A60] text-[12px] font-bold px-2 py-0.5 rounded">GĐ 2</span>
            <span class="text-[13px] text-[#4C5A60]">Tính năng Mã giảm giá sẽ phát triển ở Giai đoạn 2.</span>
          </div>
        </section>

        <!-- 3. Hình ảnh & video -->
        <section class="bg-white border border-[#E5E0D7] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">3. Hình ảnh & video</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Cover image -->
            <div class="flex flex-col gap-1.5">
              <div class="flex justify-between items-center">
                <span class="font-medium text-[15px]">Ảnh bìa khóa học (1200×800)</span>
                <button
                  type="button"
                  @click="triggerImageUpload"
                  :disabled="isUploadingImage"
                  class="text-[13px] font-semibold text-[#0B6E6E] hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-60"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"></path></svg>
                  <span>{{ isUploadingImage ? 'Đang tải...' : 'Tải ảnh từ laptop' }}</span>
                </button>
                <input
                  ref="imageFileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onImageFileSelected"
                />
              </div>

              <div
                v-if="form.image"
                class="relative h-[150px] rounded-xl overflow-hidden border border-[#D8D2C7] group"
              >
                <img :src="form.image" alt="Cover" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <button
                    type="button"
                    @click="triggerImageUpload"
                    class="px-3 py-1.5 bg-white text-xs font-semibold rounded-lg shadow cursor-pointer"
                  >
                    Tải ảnh khác
                  </button>
                  <button
                    type="button"
                    @click="promptChangeImage"
                    class="px-3 py-1.5 bg-white text-xs font-semibold rounded-lg shadow cursor-pointer"
                  >
                    Đổi URL
                  </button>
                  <button
                    type="button"
                    @click="form.image = ''"
                    class="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg shadow cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              <div
                v-else
                class="h-[150px] border-2 border-dashed border-[#C9C2B6] rounded-xl bg-[#FAF7F2] flex flex-col items-center justify-center gap-2 text-[#4C5A60] text-[15px]"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B6E6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 16V4M7 9l5-5 5 5M4 20h16"></path>
                </svg>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="triggerImageUpload"
                    class="border-0 bg-none text-[#0B6E6E] font-semibold text-[15px] cursor-pointer hover:underline"
                  >
                    Tải ảnh từ laptop
                  </button>
                  <span>hoặc</span>
                  <button
                    type="button"
                    @click="promptChangeImage"
                    class="border-0 bg-none text-[#0B6E6E] font-semibold text-[15px] cursor-pointer hover:underline"
                  >
                    nhập URL
                  </button>
                </div>
              </div>
            </div>

            <!-- Video giới thiệu (YouTube hoặc tải trực tiếp file MP4/WebM từ laptop) -->
            <div class="flex flex-col gap-1.5">
              <div class="flex justify-between items-center">
                <span class="font-medium text-[15px]">Video giới thiệu bài giảng</span>
                <button
                  type="button"
                  @click="triggerVideoUpload"
                  :disabled="isUploadingVideo"
                  class="text-[13px] font-semibold text-[#0B6E6E] hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-60"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"></path></svg>
                  <span>{{ isUploadingVideo ? 'Đang tải lên...' : 'Tải video từ laptop (.mp4, .webm)' }}</span>
                </button>
                <input
                  ref="videoFileInput"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                  class="hidden"
                  @change="onVideoFileSelected"
                />
              </div>

              <input
                v-model="form.videoUrl"
                type="url"
                placeholder="Dán link YouTube (https://youtu.be/...) hoặc bấm Tải video từ laptop ở trên"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none transition-colors"
              />

              <div v-if="form.videoUrl" class="flex items-center justify-between text-xs bg-[#E6F2F0] text-[#08585A] p-2 rounded-lg font-mono">
                <span class="truncate max-w-[280px]">Đã gắn video: {{ form.videoUrl }}</span>
                <button type="button" @click="form.videoUrl = ''" class="text-red-600 font-bold hover:underline ml-2 cursor-pointer">Gỡ bỏ</button>
              </div>

              <span class="text-[13px] font-normal text-[#4C5A60]">
                Hỗ trợ link YouTube hoặc tải trực tiếp video từ laptop. Để trống thì trang chi tiết hiển thị ảnh bìa.
              </span>
            </div>
          </div>
        </section>

        <!-- 4. Nội dung trang chi tiết -->
        <section class="bg-white border border-[#E5E0D7] rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
          <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">4. Nội dung trang chi tiết</h2>

          <!-- Lợi ích -->
          <div class="flex flex-col gap-2.5">
            <span class="font-medium text-[15px]">Lợi ích (“Sau khóa học, bạn sẽ”)</span>
            <div
              v-for="(benefit, bIndex) in benefits"
              :key="'benefit-' + bIndex"
              class="flex gap-2 items-center"
            >
              <input
                v-model="benefit.title"
                type="text"
                :placeholder="'Lợi ích ' + (bIndex + 1)"
                class="flex-1 h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3 text-[15px] outline-none transition-colors"
              />
              <button
                type="button"
                @click="removeBenefit(bIndex)"
                class="w-11 h-11 rounded-xl border border-[#E5E0D7] bg-white hover:bg-red-50 text-[#4C5A60] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Xóa lợi ích này"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M6 6l12 12M18 6 6 18"></path>
                </svg>
              </button>
            </div>
            <button
              type="button"
              @click="addBenefit"
              class="self-start h-10 px-3.5 rounded-xl border-[1.5px] border-dashed border-[#9FC9C2] bg-white hover:bg-[#E6F2F0] text-[#0B6E6E] font-semibold text-[14px] cursor-pointer transition-colors"
            >
              + Thêm lợi ích
            </button>
          </div>

          <!-- Giáo trình -->
          <div class="flex flex-col gap-3 border-t border-[#EFEBE4] pt-4">
            <span class="font-medium text-[15px]">Giáo trình chi tiết</span>
            <div
              v-for="(sec, sIndex) in sections"
              :key="'sec-' + sIndex"
              class="border border-[#E5E0D7] rounded-xl p-3.5 flex flex-col gap-2.5 bg-[#FCFAF7]"
            >
              <div class="flex justify-between items-center gap-3">
                <input
                  v-model="sec.title"
                  type="text"
                  class="font-semibold text-[15px] bg-transparent border-b border-transparent focus:border-[#0B6E6E] outline-none flex-1"
                  placeholder="Tiêu đề phần học..."
                />
                <div class="flex items-center gap-2">
                  <span class="text-[13px] text-[#4C5A60]">{{ sec.lessons.length }} bài</span>
                  <button
                    type="button"
                    @click="removeSection(sIndex)"
                    class="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Xóa phần
                  </button>
                </div>
              </div>

              <!-- Lessons in section -->
              <div
                v-for="(lesson, lIndex) in sec.lessons"
                :key="'lesson-' + lIndex"
                class="grid grid-cols-[1fr_100px_90px_36px] gap-2 text-sm items-center"
              >
                <input
                  v-model="lesson.title"
                  type="text"
                  placeholder="Tên bài học"
                  class="h-9 border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-lg px-2.5 bg-white outline-none"
                />
                <select
                  v-model="lesson.type"
                  class="h-9 border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-lg px-2 bg-white outline-none"
                >
                  <option value="Video">Video</option>
                  <option value="PDF">PDF</option>
                  <option value="Audio">Audio</option>
                </select>
                <input
                  v-model="lesson.duration"
                  type="text"
                  placeholder="12:40"
                  class="h-9 border border-[#D8D2C7] focus:border-[#0B6E6E] rounded-lg px-2 bg-white outline-none"
                />
                <button
                  type="button"
                  @click="removeLesson(sec, lIndex)"
                  class="w-9 h-9 rounded-lg border border-[#E5E0D7] hover:bg-red-50 text-[#4C5A60] hover:text-red-600 flex items-center justify-center cursor-pointer"
                  title="Xóa bài"
                >
                  ✕
                </button>
              </div>

              <button
                type="button"
                @click="addLesson(sec)"
                class="self-start h-8 px-3 rounded-lg border border-dashed border-[#9FC9C2] bg-white hover:bg-[#E6F2F0] text-[#0B6E6E] font-medium text-[13px] cursor-pointer mt-1"
              >
                + Thêm bài
              </button>
            </div>

            <button
              type="button"
              @click="addSection"
              class="self-start h-10 px-3.5 rounded-xl border-[1.5px] border-dashed border-[#9FC9C2] bg-white hover:bg-[#E6F2F0] text-[#0B6E6E] font-semibold text-[14px] cursor-pointer"
            >
              + Thêm phần
            </button>
          </div>

          <!-- Câu hỏi thường gặp -->
          <div class="flex flex-col gap-3 border-t border-[#EFEBE4] pt-4">
            <span class="font-medium text-[15px]">Câu hỏi thường gặp của khóa này</span>
            <div
              v-for="(faq, fIndex) in faqs"
              :key="'faq-' + fIndex"
              class="border border-[#E5E0D7] rounded-xl p-3.5 flex flex-col gap-2 bg-[#FCFAF7]"
            >
              <div class="flex justify-between items-center gap-2">
                <input
                  v-model="faq.question"
                  type="text"
                  placeholder="VD: Con tôi 3 tuổi học được không?"
                  class="font-semibold text-[15px] bg-white border border-[#D8D2C7] rounded-lg px-3 py-1.5 flex-1 outline-none focus:border-[#0B6E6E]"
                />
                <button
                  type="button"
                  @click="removeFaq(fIndex)"
                  class="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Xóa
                </button>
              </div>
              <textarea
                v-model="faq.answer"
                rows="2"
                placeholder="Câu trả lời chi tiết..."
                class="text-[14px] bg-white border border-[#D8D2C7] rounded-lg p-2.5 outline-none focus:border-[#0B6E6E]"
              ></textarea>
            </div>
            <button
              type="button"
              @click="addFaq"
              class="self-start h-10 px-3.5 rounded-xl border-[1.5px] border-dashed border-[#9FC9C2] bg-white hover:bg-[#E6F2F0] text-[#0B6E6E] font-semibold text-[14px] cursor-pointer"
            >
              + Thêm câu hỏi
            </button>
          </div>
        </section>

        <!-- 5. Bàn giao tự động sau khi thanh toán -->
        <section class="bg-white border-2 border-[#9FC9C2] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <div>
            <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">5. Bàn giao tự động sau khi thanh toán</h2>
            <p class="m-0 text-[14px] text-[#4C5A60] mt-0.5">
              Hệ thống gửi email này ngay khi ngân hàng xác nhận đã nhận tiền (BankNoti / PayOS Webhook).
            </p>
          </div>

          <label class="flex flex-col gap-1.5 font-medium text-[15px]">
            Link Google Drive của khóa học *
            <input
              v-model="form.resourceLink"
              type="url"
              required
              placeholder="https://drive.google.com/drive/folders/1AbC…"
              class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] font-mono outline-none transition-colors"
            />
            <span class="text-[13px] font-normal text-[#4C5A60]">
              Đặt quyền chia sẻ thư mục: “Bất kỳ ai có đường liên kết – Người xem”.
            </span>
          </label>

          <label class="flex flex-col gap-1.5 font-medium text-[15px]">
            Tiêu đề email
            <input
              v-model="emailSubject"
              type="text"
              placeholder="[EngNest] Khóa học {ten_khoa_hoc} của bạn đã sẵn sàng"
              class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none transition-colors"
            />
          </label>

          <label class="flex flex-col gap-1.5 font-medium text-[15px]">
            Nội dung email
            <textarea
              v-model="emailBody"
              rows="7"
              class="border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl p-3.5 text-[15px] leading-relaxed outline-none resize-y transition-colors"
            ></textarea>
          </label>

          <div class="flex flex-wrap gap-2 items-center text-[14px] pt-1">
            <span class="text-[#4C5A60]">Chèn biến:</span>
            <button
              v-for="tag in ['{ho_ten}', '{ma_don}', '{ten_khoa_hoc}', '{link_drive}']"
              :key="tag"
              type="button"
              @click="insertTag(tag)"
              class="h-8 px-2.5 rounded-lg border border-[#C9DCD8] bg-[#E6F2F0] text-[#08585A] font-semibold text-[13px] hover:bg-[#d4ece8] cursor-pointer transition-colors"
            >
              {{ tag }}
            </button>
            <div class="flex-1"></div>
            <button
              type="button"
              @click="sendTestEmail"
              class="h-9 px-3.5 rounded-xl border-[1.5px] border-[#0B6E6E] bg-white hover:bg-[#E6F2F0] text-[#0B6E6E] font-semibold text-[14px] cursor-pointer transition-colors"
            >
              Gửi email thử cho tôi
            </button>
          </div>
        </section>

        <!-- 6. SEO cho Google & chia sẻ mạng xã hội -->
        <section class="bg-white border border-[#E5E0D7] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <div>
            <h2 class="m-0 text-[19px] font-semibold text-[#1D2A2E]">6. SEO cho Google & chia sẻ mạng xã hội</h2>
            <p class="m-0 text-[14px] text-[#4C5A60] mt-0.5">
              Các trường này sinh ra thẻ &lt;title&gt;, meta description, Open Graph, canonical và dữ liệu có cấu trúc Schema.
            </p>
          </div>

          <!-- SEO Title -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label for="seo-title" class="font-medium text-[15px]">Tiêu đề SEO</label>
              <span :class="['text-[14px] font-semibold', form.seoTitle.length > 60 ? 'text-[#B42318]' : 'text-[#155C35]']">
                {{ form.seoTitle.length }}/60
              </span>
            </div>
            <input
              id="seo-title"
              v-model="form.seoTitle"
              type="text"
              placeholder="VD: Mẹ dạy con tiếng Anh tại nhà – Video & PDF | EngNest"
              class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none transition-colors"
            />
            <div class="h-1.5 rounded-full bg-[#ECE7DE] overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :style="{
                  width: Math.min(100, Math.round((form.seoTitle.length / 60) * 100)) + '%',
                  backgroundColor: form.seoTitle.length > 60 ? '#B42318' : form.seoTitle.length >= 40 ? '#1E7A47' : '#E8873A'
                }"
              ></div>
            </div>
          </div>

          <!-- SEO Description -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label for="seo-desc" class="font-medium text-[15px]">Mô tả SEO (meta description)</label>
              <span :class="['text-[14px] font-semibold', form.seoDescription.length > 160 ? 'text-[#B42318]' : 'text-[#155C35]']">
                {{ form.seoDescription.length }}/160
              </span>
            </div>
            <textarea
              id="seo-desc"
              v-model="form.seoDescription"
              rows="3"
              placeholder="Lộ trình 8 tuần cho bố mẹ không giỏi tiếng Anh vẫn dạy con 4–10 tuổi..."
              class="border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl p-3 text-[15px] outline-none resize-y transition-colors"
            ></textarea>
            <div class="h-1.5 rounded-full bg-[#ECE7DE] overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :style="{
                  width: Math.min(100, Math.round((form.seoDescription.length / 160) * 100)) + '%',
                  backgroundColor: form.seoDescription.length > 160 ? '#B42318' : form.seoDescription.length >= 110 ? '#1E7A47' : '#E8873A'
                }"
              ></div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- OG Image -->
            <div class="flex flex-col gap-1.5">
              <span class="font-medium text-[15px]">Ảnh chia sẻ (OG) 1200×630</span>
              <div class="h-[100px] border-2 border-dashed border-[#C9C2B6] rounded-xl bg-[#FAF7F2] flex items-center justify-center gap-2 text-[#4C5A60] text-[14px] cursor-pointer hover:bg-[#F3EFE8] transition-colors" @click="promptChangeImage">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B6E6E" stroke-width="2">
                  <path d="M12 16V4M7 9l5-5 5 5M4 20h16"></path>
                </svg>
                <span>{{ form.image ? 'Dùng chung với ảnh bìa' : 'Tải ảnh SEO lên' }}</span>
              </div>
            </div>

            <!-- Keyword -->
            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              Từ khóa chính
              <input
                v-model="mainKeyword"
                type="text"
                placeholder="mẹ dạy con tiếng anh"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none transition-colors"
              />
              <span class="text-[13px] font-normal text-[#4C5A60]">
                Nên có trong tiêu đề SEO, slug và đoạn mô tả.
              </span>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#EFEBE4] pt-4">
            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              Mô tả ảnh (alt) cho ảnh bìa
              <input
                v-model="imageAlt"
                type="text"
                placeholder="Mẹ đọc truyện tiếng Anh cho con"
                class="h-12 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3.5 text-[15px] outline-none transition-colors"
              />
              <span class="text-[13px] font-normal text-[#4C5A60]">Giúp Google Hình ảnh hiểu nội dung ảnh.</span>
            </label>

            <label class="flex flex-col gap-1.5 font-medium text-[15px]">
              URL chuẩn (canonical)
              <input
                type="text"
                readonly
                :value="'https://engnest.vn/khoa-hoc/' + form.slug"
                class="h-12 border-[1.5px] border-[#E5E0D7] rounded-xl px-3.5 text-[14px] bg-[#FAF7F2] text-[#4C5A60] outline-none"
              />
              <span class="text-[13px] font-normal text-[#4C5A60]">Tự động theo slug – tránh trùng lặp nội dung.</span>
            </label>
          </div>

          <div class="flex flex-col gap-2 pt-2">
            <label class="flex gap-2.5 items-center text-[15px] cursor-pointer">
              <input type="checkbox" checked class="w-5 h-5 accent-[#0B6E6E]" />
              <span>Cho phép Google lập chỉ mục trang này (index, follow)</span>
            </label>
            <label class="flex gap-2.5 items-center text-[15px] cursor-pointer">
              <input type="checkbox" checked class="w-5 h-5 accent-[#0B6E6E]" />
              <span>Đưa vào sitemap.xml</span>
            </label>
            <label class="flex gap-2.5 items-center text-[15px] cursor-pointer">
              <input type="checkbox" checked class="w-5 h-5 accent-[#0B6E6E]" />
              <span>Tạo dữ liệu có cấu trúc (Schema) Course + FAQ tự động</span>
            </label>
          </div>

          <details class="border border-[#E5E0D7] rounded-xl overflow-hidden mt-1">
            <summary class="p-3.5 font-semibold text-[15px] cursor-pointer bg-[#FAF7F2] select-none hover:bg-[#F3EFE8] transition-colors">
              Xem mã Schema (JSON-LD) được tạo
            </summary>
            <pre class="m-0 p-4 bg-[#1D2A2E] text-[#D5E8E4] text-[13px] font-mono leading-relaxed overflow-x-auto whitespace-pre">{{ generatedSchemaJson }}</pre>
          </details>
        </section>
      </form>

      <!-- Right Column: Sticky Sidebar Actions & Live Preview -->
      <div class="flex-[1_1_320px] min-w-0 flex flex-col gap-4 sticky top-6">
        <!-- Publish Action Card -->
        <section class="bg-white border border-[#E5E0D7] rounded-2xl p-5 flex flex-col gap-3.5 shadow-sm">
          <h2 class="m-0 text-[17px] font-semibold text-[#1D2A2E]">Xuất bản</h2>

          <label class="flex flex-col gap-1.5 font-medium text-[15px]">
            Trạng thái
            <select
              v-model="form.status"
              class="h-11 border-[1.5px] border-[#D8D2C7] focus:border-[#0B6E6E] rounded-xl px-3 text-[15px] bg-white outline-none transition-colors"
            >
              <option value="PUBLISHED">Đang bán</option>
              <option value="DRAFT">Nháp (ẩn khỏi website)</option>
              <option value="HIDDEN">Ngừng bán</option>
            </select>
          </label>

          <label class="flex gap-2.5 items-center text-[15px] min-h-[40px] cursor-pointer">
            <input
              v-model="form.isFeatured"
              type="checkbox"
              class="w-5 h-5 accent-[#0B6E6E] cursor-pointer"
            />
            <span class="font-medium">Khóa nổi bật trên trang chủ</span>
          </label>

          <!-- Submit Button -->
          <button
            type="button"
            :disabled="isSubmitting"
            @click="handleSave"
            class="h-12 rounded-xl bg-[#0B6E6E] hover:bg-[#08585A] disabled:opacity-60 text-white font-bold text-[16px] cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <svg
              v-if="isSubmitting"
              class="w-5 h-5 animate-spin text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75"></path>
            </svg>
            <span>{{ isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
          </button>

          <!-- Preview Link -->
          <a
            :href="previewUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="h-11 rounded-xl border-[1.5px] border-[#D8D2C7] hover:bg-[#FAF7F2] text-[#1D2A2E] font-semibold text-[15px] flex items-center justify-center transition-colors"
          >
            Xem trước trang
          </a>

          <!-- Delete Button (Only in edit mode) -->
          <button
            v-if="isEdit"
            type="button"
            @click="confirmDelete"
            class="h-10 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[14px] cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Xóa khóa học này</span>
          </button>

          <span class="text-[13px] text-[#4C5A60] text-center pt-1">
            {{ lastSavedText }}
          </span>
        </section>

        <!-- Google SERP Live Preview -->
        <section class="bg-white border border-[#E5E0D7] rounded-2xl p-5 flex flex-col gap-2.5 shadow-sm">
          <h2 class="m-0 text-[17px] font-semibold text-[#1D2A2E]">Xem trước trên Google</h2>
          <div class="flex flex-col gap-1">
            <span class="text-[13px] text-[#1E7A47] break-all">
              engnest.vn › khoa-hoc › {{ form.slug || 'slug-khoa-hoc' }}
            </span>
            <span class="text-[18px] text-[#1A4FB5] font-normal line-clamp-2 leading-snug">
              {{ form.seoTitle || form.title || 'Tiêu đề khóa học | EngNest' }}
            </span>
            <span class="text-[14px] text-[#4C5A60] line-clamp-3 leading-relaxed">
              {{ form.seoDescription || form.description || 'Lộ trình chi tiết, học trọn đời, thanh toán QR...' }}
            </span>
          </div>
        </section>

        <!-- Social Share Live Preview -->
        <section class="bg-white border border-[#E5E0D7] rounded-2xl p-5 flex flex-col gap-2.5 shadow-sm">
          <h2 class="m-0 text-[17px] font-semibold text-[#1D2A2E]">Khi chia sẻ Facebook / Zalo</h2>
          <div class="border border-[#E5E0D7] rounded-xl overflow-hidden bg-[#FAF7F2]">
            <div class="aspect-[1200/630] bg-[#E6F2F0] flex items-center justify-center overflow-hidden">
              <img
                v-if="form.image"
                :src="form.image"
                alt="OG"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-[13px] text-[#3E5A5C] font-semibold">[ẢNH SEO 1200×630]</span>
            </div>
            <div class="p-3 bg-[#F4F1EB] flex flex-col gap-0.5">
              <span class="text-[11px] font-bold text-[#4C5A60] uppercase">engnest.vn</span>
              <span class="text-[15px] font-semibold text-[#1D2A2E] leading-snug line-clamp-2">
                {{ form.seoTitle || form.title || 'Tiêu đề khóa học' }}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-[#E5E0D7]">
        <div class="flex items-center gap-3 text-red-600">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div>
            <h3 class="m-0 text-lg font-bold text-[#1D2A2E]">Xác nhận xóa khóa học</h3>
            <span class="text-xs text-[#4C5A60]">Hành động này không thể hoàn tác</span>
          </div>
        </div>

        <div class="bg-[#FFF8F0] border border-[#F5D5B8] p-3.5 rounded-xl text-sm text-[#874314] leading-relaxed">
          <p class="m-0 font-medium">
            Bạn có chắc chắn muốn xóa khóa học: <strong>"{{ form.title }}"</strong>?
          </p>
          <p class="m-0 mt-2 text-xs text-[#6E350E]">
            Lưu ý quan trọng: Hệ thống chỉ xóa khóa học này (soft delete). Danh mục và các khóa học khác được bảo toàn nguyên vẹn.
          </p>
        </div>

        <div class="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="px-4 py-2.5 rounded-xl border border-[#D8D2C7] hover:bg-[#FAF7F2] font-semibold text-sm cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            :disabled="isDeleting"
            @click="handleDelete"
            class="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm cursor-pointer flex items-center gap-1.5"
          >
            <span v-if="isDeleting">Đang xóa...</span>
            <span v-else>Xóa khóa học</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Toast Notification -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1D2A2E] text-white px-5 py-3.5 rounded-xl shadow-xl border border-[#33403F] text-sm font-medium"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { courseApi } from "../api/course.api";
import type { CourseCategory, CourseBenefit, CourseSection } from "../types/course.types";

const route = useRoute();
const router = useRouter();

const courseId = computed(() => (route.params.id as string) || "");
const isEdit = computed(() => Boolean(courseId.value));

const isLoading = ref(false);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const showDeleteModal = ref(false);

const categories = ref<CourseCategory[]>([]);
const allowCoupon = ref(false);
const mainKeyword = ref("mẹ dạy con tiếng anh");
const imageAlt = ref("Mẹ đọc truyện tiếng Anh cho con");
const lastSavedText = ref("Chưa lưu thay đổi");

// File upload states & handlers (Tải từ laptop lên CMS)
const imageFileInput = ref<HTMLInputElement | null>(null);
const videoFileInput = ref<HTMLInputElement | null>(null);
const isUploadingImage = ref(false);
const isUploadingVideo = ref(false);

function triggerImageUpload() {
  imageFileInput.value?.click();
}

function triggerVideoUpload() {
  videoFileInput.value?.click();
}

async function onImageFileSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  isUploadingImage.value = true;
  showToast(`Đang tải ảnh "${file.name}" lên máy chủ...`);
  try {
    const res = await courseApi.uploadImage(file);
    form.image = res.url;
    showToast(`Đã tải ảnh lên thành công từ máy tính!`);
  } catch (err) {
    console.error("Upload image error:", err);
    showToast("Không thể tải ảnh lên. Vui lòng thử lại.");
  } finally {
    isUploadingImage.value = false;
    target.value = "";
  }
}

async function onVideoFileSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  isUploadingVideo.value = true;
  showToast(`Đang tải video "${file.name}" lên máy chủ... Vui lòng đợi.`);
  try {
    const res = await courseApi.uploadVideo(file);
    form.videoUrl = res.url;
    showToast(`Đã tải video từ laptop lên thành công!`);
  } catch (err) {
    console.error("Upload video error:", err);
    showToast("Không thể tải video lên. Vui lòng kiểm tra dung lượng (tối đa 200MB) hoặc định dạng file (.mp4, .webm).");
  } finally {
    isUploadingVideo.value = false;
    target.value = "";
  }
}

// Toast
const toastMessage = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = null;
  }, 2800);
}

// Form state
const form = reactive({
  id: "",
  title: "",
  slug: "",
  categoryId: "communication",
  tagBadge: "32 video · 6 PDF · Audio",
  duration: "9 giờ",
  description: "Lộ trình 8 tuần, mỗi ngày 15 phút: bố mẹ – kể cả khi không giỏi tiếng Anh – vẫn tự tin trò chuyện tiếng Anh cùng con 4–10 tuổi.",
  price: 399000,
  originalPrice: 699000,
  image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  videoUrl: "",
  resourceLink: "https://drive.google.com/drive/folders/tai-lieu-brightlingo-vip",
  status: "PUBLISHED",
  isFeatured: false,
  seoTitle: "Mẹ dạy con tiếng Anh tại nhà – Video & PDF | EngNest",
  seoDescription: "Lộ trình 8 tuần cho bố mẹ không giỏi tiếng Anh vẫn dạy con 4–10 tuổi. Mua 1 lần học trọn đời, thanh toán QR, nhận link qua email ngay.",
});

// Email delivery template
const emailSubject = ref("[EngNest] Khóa học {ten_khoa_hoc} của bạn đã sẵn sàng");
const emailBody = ref(
`Chào {ho_ten},

Cảm ơn bạn đã mua “{ten_khoa_hoc}” (mã đơn {ma_don}).
Bấm vào nút dưới đây để mở toàn bộ video và tài liệu:
[Mở khóa học] → {link_drive}

Mẹo: lưu email này lại để học lâu dài. Cần hỗ trợ, liên hệ hotline hỗ trợ.`
);

// Dynamic benefits
const benefits = ref<CourseBenefit[]>([
  { id: "b1", title: "Nói tiếng Anh cùng con mỗi ngày" },
  { id: "b2", title: "Phát âm đủ chuẩn để dạy con" },
]);

function addBenefit() {
  benefits.value.push({ id: `b-${Date.now()}`, title: "" });
}
function removeBenefit(index: number) {
  benefits.value.splice(index, 1);
}

// Dynamic curriculum sections
const sections = ref<CourseSection[]>([
  {
    id: "s1",
    title: "Phần 1 · Mẹ chuẩn bị: phát âm & 100 câu nền tảng",
    lessons: [
      { id: "l1", title: "Bài 1: Vì sao mẹ không cần giỏi vẫn dạy được con", type: "Video", duration: "12:40" },
    ],
  },
  {
    id: "s2",
    title: "Phần 2 · Tiếng Anh trong sinh hoạt hằng ngày",
    lessons: [
      { id: "l2", title: "Bài 2: Chào buổi sáng & Đánh răng cùng bé", type: "Video", duration: "10:15" },
    ],
  },
]);

function addSection() {
  sections.value.push({
    id: `sec-${Date.now()}`,
    title: `Phần ${sections.value.length + 1} · Chủ đề mới`,
    lessons: [{ id: `l-${Date.now()}`, title: "Bài 1: Giới thiệu", type: "Video", duration: "10:00" }],
  });
}
function removeSection(index: number) {
  sections.value.splice(index, 1);
}
function addLesson(sec: CourseSection) {
  sec.lessons.push({
    id: `l-${Date.now()}`,
    title: `Bài ${sec.lessons.length + 1}: `,
    type: "Video",
    duration: "10:00",
  });
}
function removeLesson(sec: CourseSection, lIndex: number) {
  sec.lessons.splice(lIndex, 1);
}

// Dynamic FAQs
const faqs = ref<{ question: string; answer: string }[]>([
  {
    question: "Con tôi 3 tuổi học được không?",
    answer: "Được bạn nhé, lộ trình áp dụng rất hiệu quả cho trẻ từ 3 đến 10 tuổi cùng bố mẹ.",
  },
]);

function addFaq() {
  faqs.value.push({ question: "", answer: "" });
}
function removeFaq(index: number) {
  faqs.value.splice(index, 1);
}

// Calculations
const savingsAmount = computed(() => {
  if (form.originalPrice && form.price && form.originalPrice > form.price) {
    return form.originalPrice - form.price;
  }
  return 0;
});

const previewUrl = computed(() => {
  const feUrl = import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000";
  return `${feUrl}/khoa-hoc/${form.slug || ""}`;
});

function formatVND(val: number): string {
  if (!val || isNaN(val)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(val) + "đ";
}

function onTitleInput() {
  // If slug is empty or currently matches an auto-generated version, keep it updated
  if (!form.slug && form.title) {
    form.slug = generateSlug(form.title);
  }
  if (!form.seoTitle) {
    form.seoTitle = `${form.title} | EngNest`;
  }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function promptChangeImage() {
  const current = form.image || "";
  const next = prompt("Nhập đường dẫn URL ảnh bìa khóa học:", current);
  if (next !== null && next.trim()) {
    const trimmed = next.trim();
    if (/^(javascript:|data:|file:|blob:)/i.test(trimmed)) {
      alert("Cảnh báo bảo mật: Không được nhập link chứa mã script độc hại (javascript:, data:, file:)!");
      return;
    }
    form.image = trimmed;
  }
}

function insertTag(tag: string) {
  emailBody.value += ` ${tag}`;
}

function sendTestEmail() {
  showToast("Đã gửi email thử nghiệm mẫu đến địa chỉ admin@engnest.vn!");
}

// Schema JSON-LD preview
const generatedSchemaJson = computed(() => {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: form.title || "Tên khóa học",
      description: form.description || form.seoDescription,
      provider: {
        "@type": "Organization",
        name: "EngNest",
        sameAs: "https://engnest.vn",
      },
      offers: {
        "@type": "Offer",
        price: form.price,
        priceCurrency: "VND",
        availability: "https://schema.org/InStock",
      },
    },
    null,
    2
  );
});

// Load Course Data for Editing
async function loadCourse() {
  if (!isEdit.value) {
    // Default blank form with unique slug
    form.title = "";
    form.slug = "";
    form.price = 199000;
    form.originalPrice = 399000;
    form.seoTitle = "";
    form.seoDescription = "";
    form.description = "";
    return;
  }

  isLoading.value = true;
  try {
    const data = await courseApi.getCourseById(courseId.value);
    if (data) {
      form.id = data.id;
      form.title = data.title || data.name || "";
      form.slug = data.slug || "";
      form.categoryId = data.categoryId || data.category_id || "communication";
      form.tagBadge = data.tagBadge || data.tag_badge || "";
      form.duration = data.duration || "9 giờ";
      form.description = data.description || "";
      form.price = data.price || 0;
      form.originalPrice = data.originalPrice || data.original_price || data.price;
      form.image = data.image || data.thumbnail || "";
      form.videoUrl = data.videoUrl || data.video_url || "";
      form.resourceLink = data.resourceLink || data.resource_link || "";
      form.status = String(data.status || "PUBLISHED").toUpperCase();
      form.isFeatured = Boolean(data.isFeatured);
      form.seoTitle = data.seoTitle || data.seo_title || data.title || "";
      form.seoDescription = data.seoDescription || data.seo_description || data.description || "";

      // Benefits
      if (Array.isArray(data.benefits) && data.benefits.length > 0) {
        benefits.value = data.benefits.map((b: any, idx: number) => ({
          id: b.id || `b-${idx}`,
          title: typeof b === "string" ? b : b.title || "",
          description: b.description || "",
        }));
      }

      // Curriculum
      if (data.curriculum?.sections && Array.isArray(data.curriculum.sections)) {
        sections.value = data.curriculum.sections;
      }

      // FAQs
      if (Array.isArray(data.faqs) && data.faqs.length > 0) {
        faqs.value = data.faqs;
      }

      lastSavedText.value = "Đã nạp dữ liệu từ hệ thống";
    }
  } catch (err) {
    console.error("Không thể tải thông tin khóa học:", err);
    showToast("Không thể tải dữ liệu khóa học. Vui lòng kiểm tra lại.");
  } finally {
    isLoading.value = false;
  }
}

// Save (Create or Update)
async function handleSave() {
  if (!form.title.trim()) {
    showToast("Vui lòng nhập tên khóa học.");
    return;
  }
  const cleanSlug = form.slug.trim().toLowerCase();
  if (!cleanSlug) {
    showToast("Vui lòng nhập đường dẫn slug.");
    return;
  }
  const RESERVED_COURSE_SLUGS = new Set([
    "admin", "api", "checkout", "payment", "payments", "policies", "policy",
    "chinh-sach", "khoa-hoc", "courses", "orders", "leads", "coupons", "auth",
    "login", "register", "dang-ky", "dashboard", "settings", "danh-gia", "loi-ich",
    "giao-tai-lieu-so", "chinh-sach-thanh-toan", "chinh-sach-bao-mat", "dieu-khoan-su-dung",
    "uploads", "sitemap", "robots", "categories"
  ]);
  if (RESERVED_COURSE_SLUGS.has(cleanSlug)) {
    showToast(`Đường dẫn "${cleanSlug}" trùng với route hệ thống được bảo lưu. Vui lòng chọn slug khác.`);
    return;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
    showToast("Đường dẫn (slug) chỉ được chứa chữ thường không dấu, số và dấu gạch nối.");
    return;
  }
  if (!form.resourceLink.trim()) {
    showToast("Vui lòng nhập link Google Drive tài liệu (bàn giao tự động).");
    return;
  }

  // BẢO VỆ AN TOÀN: Chặn link ảnh & video độc hại phía CMS Client
  const isDangerousUrl = (u: string) => /^(javascript:|data:|file:|blob:)/i.test((u || "").trim());
  if (isDangerousUrl(form.image)) {
    showToast("Ảnh bìa chứa giao thức độc hại (javascript:, data:, file:)! Bị từ chối.");
    return;
  }
  if (isDangerousUrl(form.videoUrl)) {
    showToast("Video bài giảng chứa giao thức độc hại (javascript:, data:, file:)! Bị từ chối.");
    return;
  }
  if (isDangerousUrl(form.resourceLink)) {
    showToast("Link tài liệu chứa giao thức không an toàn!");
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      ...form,
      benefits: benefits.value,
      curriculum: {
        summary: form.tagBadge,
        sections: sections.value,
      },
      faqs: faqs.value,
    };

    if (isEdit.value) {
      await courseApi.updateCourse(courseId.value, payload);
      lastSavedText.value = `Lưu lần cuối: ${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
      showToast(`Đã lưu thay đổi khóa học "${form.title}" thành công!`);
    } else {
      await courseApi.createCourse(payload);
      showToast(`Đã tạo khóa học mới "${form.title}" thành công!`);
      // Redirect to courses list or edit mode
      setTimeout(() => {
        router.push("/courses");
      }, 1000);
    }
  } catch (err) {
    console.error("Lỗi khi lưu khóa học:", err);
    showToast("Đã xảy ra lỗi khi lưu thông tin khóa học. Vui lòng thử lại.");
  } finally {
    isSubmitting.value = false;
  }
}

// Delete action
function confirmDelete() {
  showDeleteModal.value = true;
}

async function handleDelete() {
  isDeleting.value = true;
  try {
    await courseApi.deleteCourse(courseId.value);
    showDeleteModal.value = false;
    showToast(`Đã xóa khóa học thành công. Danh mục không bị ảnh hưởng.`);
    setTimeout(() => {
      router.push("/courses");
    }, 1200);
  } catch (err) {
    console.error("Lỗi khi xóa khóa học:", err);
    showToast("Không thể xóa khóa học. Vui lòng thử lại.");
  } finally {
    isDeleting.value = false;
  }
}

onMounted(async () => {
  // Load categories
  try {
    categories.value = await courseApi.getCategories();
  } catch (e) {
    console.warn("Could not load categories", e);
  }

  // Load course details
  await loadCourse();
});
</script>
