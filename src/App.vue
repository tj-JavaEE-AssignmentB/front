<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div>
    <button @click="fetchData">获取数据</button>
    <ul v-if="users.length">
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
    <p v-else>没有数据</p>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const users = ref([]);

const fetchData = async () => {
  try {
    const response = await axios.get('api/user/list');
    console.log('请求成功');
    users.value = response.data;
    console.log(users);
    console.log('请求成功');
  } catch (err) {
    console.error('请求失败:', err);
  }
};
</script>

<style>

</style>
