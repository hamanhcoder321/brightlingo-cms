<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Trang không tìm thấy</h2>
      <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <router-link to="/" class="home-link">
        Quay lại trang chủ
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Not Found Component
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.not-found-content {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.not-found-content h1 {
  font-size: 6rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 1rem;
  line-height: 1;
}

.not-found-content h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.not-found-content p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-link {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.home-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 2rem;
  }
  
  .not-found-content h1 {
    font-size: 4rem;
  }
  
  .not-found-content h2 {
    font-size: 1.5rem;
  }
}
</style>