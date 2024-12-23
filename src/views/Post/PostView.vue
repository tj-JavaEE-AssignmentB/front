<template>
  <div class="forum-detail">
    <!-- 帖子内容 -->
    <div class="post-content">
      <div class="author-info" @click="goToUserProfile(post.authorId)">
        <img :src="post.authorAvatar" class="avatar" />
        <span class="author-name">{{ post.authorName }}</span>
      </div>
      
      <div class="post-body">
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
      </div>

      <div class="post-actions">
        <button 
          :class="['like-btn', { active: post.isLiked }]" 
          @click="handlePostLike"
        >
          <i class="icon-like"></i>
          <span>{{ post.likes }}</span>
        </button>
        <button @click="reportPost">举报</button>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comments-section">
      <div class="comment-form">
        <textarea v-model="newComment" placeholder="发表评论..."></textarea>
        <button @click="submitComment">发表</button>
      </div>

      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <div class="commenter-info" @click="goToUserProfile(comment.authorId)">
              <img :src="comment.authorAvatar" class="avatar" />
              <span>{{ comment.authorName }}</span>
            </div>
            <span class="comment-date">{{ comment.date }}</span>
          </div>
          
          <p class="comment-content">{{ comment.content }}</p>
          
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPostDetails, likePost, reportPost , createComment , getComments } from '@/apis/forum'


export default {
  name: 'ForumDetail',
  data() {
    return {
      post: {
        id: '',
        title: '',
        content: '',
        authorId: '',
        authorName: '',
        authorAvatar: '',
        likes: '',
        isLiked: false
      },
      comments: [],
      newComment: {
        content: '',
        publishTime: ''
      }
    }
  },
  methods: {
    async fetchPostDetail() {
      try {
        // 获取帖子详情的API调用
        const response = await getPostDetails(this.$route.params.id)
        this.post = response.data
      } catch (error) {
        this.$message.error('获取帖子详情失败')
      }
    },

    async fetchComments() {
      const response = await getComments(this.post.id)
      this.comments = response.data
    },
    
    async handlePostLike() {
      try {
        await likePost(this.post.id)
        this.post.isLiked = !this.post.isLiked
        this.post.likes += this.post.isLiked ? 1 : -1
      } catch (error) {
        this.$message.error('操作失败')
      }
    },

    async reportPost() {
      try {
        await reportPost(this.post.id)
        this.$message.success('举报成功')
      } catch (error) {
        this.$message.error('举报失败')
      }
    },

    goToUserProfile(userId) {
      this.$router.push(`/userhomepage/${userId}`)
    },

    async submitComment() {
      if (!this.newComment.trim()) return
      
      try {
        var time = new Date().toISOString();
        var ptime = time.toISOString().split('T')[0] + ' '  
        + time.toTimeString().split(' ')[0]; 
        await createComment({
          postId: this.post.id,
          content: this.newComment,
          publishTime: ptime
        })
        this.newComment = ''
        await this.fetchComments()
        this.$message.success('评论成功')
      } catch (error) {
        this.$message.error('评论失败')
      }
    }

  },
  created() {
    this.fetchPostDetail()
    this.fetchComments()
  }
}
</script>

<style scoped>
.forum-detail {
  padding: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.post-actions,
.comment-actions {
  margin-top: 10px;
}

.like-btn {
  cursor: pointer;
}

.like-btn.active {
  color: #e74c3c;
}

.comment-form {
  margin: 20px 0;
}

.comment-form textarea {
  width: 100%;
  min-height: 80px;
  margin-bottom: 10px;
}

.comment-item {
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style> 