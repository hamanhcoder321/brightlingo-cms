<template>
  <div class="min-h-screen bg-[#F4F1EB] flex items-center justify-center p-4 font-sans text-[#1D2A2E]">
    <div class="bg-white rounded-[16px] shadow-xs border border-[#E5E0D7] p-8 md:p-12 text-center max-w-md w-full flex flex-col items-center gap-4">
      <div class="font-serif font-bold text-7xl text-[#0B6E6E] leading-none">
        404
      </div>
      <h1 class="m-0 font-serif font-bold text-2xl text-[#1D2A2E]">
        Trang không tìm thấy
      </h1>
      <p class="m-0 text-[#4C5A60] text-[15px] leading-relaxed">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <router-link
        to="/dashboard"
        class="mt-2 inline-flex items-center justify-center h-11 px-6 rounded-[10px] bg-[#0B6E6E] hover:bg-[#08585A] text-white font-semibold text-[15px] shadow-xs transition-colors"
      >
        Quay lại Tổng quan
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Not Found Component
</script>