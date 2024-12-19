<template>
  <div>
    <h1>用户个人中心</h1>

    <!-- 数据加载成功后的显示 -->
    <div v-if="users.length > 0">
      <div v-for="user in users" :key="user.userId">
        <p>昵称: {{ user.nickname }}</p>
        <p>邮箱: {{ user.email }}</p>
      </div>
    </div>

    <!-- 数据加载中 -->
    <p v-else>加载中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { list } from '@/apis/testapi';  // 导入封装的 `list` 函数

const users = ref([]);  // 用来存储用户列表数据

onMounted(async () => {
  try {
    const response = await list();  // 调用封装的 `list` 函数获取数据
    if (response && response.data && response.data.code === 200) {
      users.value = response.data.data;  // 将数据存储到 `users`
    } else {
      console.error('数据加载失败', response);
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
});
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>

