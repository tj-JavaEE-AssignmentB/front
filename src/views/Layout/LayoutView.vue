<template>
  <div class="search-container">
    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="搜索帖子..."
      @keyup.enter="handleSearch"
    >
    <button @click="handleSearch" class="search-button">搜索</button>
    <el-button class="create-post" @click="showCreatePost = true">发布新帖子</el-button>
    <el-button class="create-post" @click="moveToCenter" style="color:aliceblue;background-color: blue;">个人中心</el-button>
    <router-link to="userlogin"><el-button class="create-post" style="color:aliceblue;background-color: blue;">登录/注册</el-button></router-link>
  </div>
      
      <div v-if="showCreatePost" class="create-post-dialog">
    <div class="dialog-content">
      <h2>发布新帖子</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <el-input v-model="newPost.title" placeholder="标题" />
      <el-input v-model="newPost.content" placeholder="内容" rows="5" />
      <el-select v-model="newPost.categoryId">
        <el-option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </el-option>
      </el-select>
      <div class="dialog-buttons">
        <el-button @click="createNewPost" :disabled="loading">发布</el-button>
        <el-button @click="showCreatePost = false" :disabled="loading">取消</el-button>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createPost } from '@/apis/forum'
import { getCategories } from '@/apis/forum'
import { identityGet } from '../../apis/identity';

export default {
  name: 'LayoutView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const showDropdown = ref(false)
    const categories = ref([])
    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push(`/search/${searchQuery.value.trim()}`)
      }
    }
    const moveToCenter=async()=>{
      try{
        const role = await identityGet()
        if (role.data["identity"] === 'admin') {
          router.push('/admincenter')
        } 
        else if(role.data["identity"] === 'user'){
          let path = '/usercenter/'+role.data["userId"]
          router.push(path)
        }
      }catch(error){
        console.log(error)
      }
    }
    const showCreatePost = ref(false)
    const newPost = ref({
      title: '',
      content: '',
      categoryId: '',
      releaseTime:''
    })

    const loading = ref(false)

    const fetchCategories = async () => {
      loading.value = true
      try {
        // 并行请求数据
        const [categoriesRes] = await Promise.all([
          getCategories()
        ])
        categories.value = categoriesRes.data.data
      } catch (error) {
        console.error('获取数据失败:', error)
        // 这里可以添加错误处理，比如显示错误提示
      }
       finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchCategories()
    })


    const createNewPost = async () => {
      loading.value = true
      try {
        // 获取当前时间并格式化
        const now = new Date()
        const time = now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
        newPost.value.releaseTime = time
        createPost(newPost.value)
        showCreatePost.value = false
        newPost.value = { title: '', content: '', categoryId: '' }
      } catch (error) {
        console.error('发布帖子失败:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      moveToCenter,
      searchQuery,
      showDropdown,
      handleSearch,
      categories,
      newPost,
      createNewPost,
      showCreatePost,
      loading
    }
  }
}
</script>

<style>

.search-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
}
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
}
.create-post {
  margin-bottom: 20px;
  padding-left: 400px;
}

.create-post-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.dialog-content input,
.dialog-content textarea,
.dialog-content select {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
}

.search-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #45a049;
}

</style>