<template>
  <div class="home">



    <el-row :gutter="20" class="category-list">
      <el-col :span="3" v-for="category in categories" :key="category.id">
        <el-card class="category-tag" shadow="hover">
          <button @click="goToCategory(category.id)">
          <img :src="category.imageUrl" alt="category.description" class="category-image" />
          </button>
        </el-card>>
      </el-col>
    </el-row>



    <div class="posts-list">
      <div v-if="!posts.length">暂无帖子</div>
      
      <div v-for="post in posts" :key="post.id" class="post-card" @click="goToPost(post.id)">
        <h3>{{ post.title }}</h3>
        <p class="post-preview">{{ post.content?.substring(0, 100) || '' }}...</p>
        <div class="post-meta">
          <span>{{ post.authorName }}</span>
          <span>{{ post.releaseTime || '暂无时间' }}</span>
          <div class="post-stats">
            <span>👍 {{ post.likes || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <button @click="goToUserCenter">前往个人中心</button>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories,getRecentPosts } from '@/apis/forum'

export default {
  data() {
    return {
      currentUserId: '123', // 这里替换成实际的用户ID逻辑
    };
  },
  methods: {
    goToUserCenter() {
      this.$router.push({
        name: 'usercenter',
        params: { userid: this.currentUserId }
      });
    }
  },
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const posts = ref([])
    const categories = ref([])

    // 获取数据的方法
    const fetchData = async () => {
      try {
        // 并行请求数据
        const [categoriesRes, postsRes] = await Promise.all([
          getCategories(),
          getRecentPosts()
        ])

        categories.value = categoriesRes.data
        posts.value = postsRes.data.data
        
        console.log('Posts loaded:', posts.value)
      } catch (error) {
        console.error('获取数据失败:', error)
        // 这里可以添加错误处理，比如显示错误提示
      }
    }

    onMounted(() => {
      fetchData()
    })

    const goToPost = (postId) => {
      router.push(`/post/${postId}`)
    }

    const goToCategory = (categoryId) => {
      router.push(`/category/${categoryId}`)
    }

    return {
      posts,
      categories,
      goToPost,
      goToCategory
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar {
  margin-bottom: 20px;
}

.categories {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.category-tag {
  padding: 5px 15px;
  background-color: #f0f0f0;
  border-radius: 15px;
  cursor: pointer;
}



.posts-list {
  display: grid;
  gap: 20px;
}

.post-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9em;
}


</style>
