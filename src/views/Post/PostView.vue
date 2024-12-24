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
        <el-button 
          :class="['action-btn', { active: post.isLiked }]" 
          @click="handlePostLike"
        >
          <i class="el-icon-thumb"></i>
          <span>{{ post.likes || 0 }}</span>
        </el-button>
        
        <el-button 
          :class="['action-btn', { active: post.isDisliked }]" 
          @click="handlePostDislike"
        >
          <i class="el-icon-thumb" style="transform: rotate(180deg)"></i>
          <span>{{ post.dislikes || 0 }}</span>
        </el-button>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comments-section">
      <div class="comment-form">
        <textarea v-model="newComment" placeholder="发表评论..."></textarea>
        <el-button @click="submitComment">发表</el-button>
      </div>

      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <div class="commenter-info" @click="goToUserProfile(comment.authorId)">
              <img :src="comment.authorAvatar" class="avatar" />
              <span>{{ comment.authorName }}</span>
            </div>
            <span class="comment-date">{{ comment.releasetime }}</span>
          </div>
          
          <p class="comment-content">{{ comment.content }}</p>
          
          <div class="comment-actions">
            <el-button 
              :class="['action-btn', { active: comment.isLiked }]" 
              @click="handleCommentLike(comment)"
            >
              <i class="el-icon-thumb"></i>
              <span>{{ comment.likes || 0 }}</span>
            </el-button>
            
            <el-button 
              :class="['action-btn', { active: comment.isDisliked }]" 
              @click="handleCommentDislike(comment)"
            >
              <i class="el-icon-thumb" style="transform: rotate(180deg)"></i>
              <span>{{ comment.dislikes || 0 }}</span>
            </el-button>

            <el-popover
              placement="top"
              trigger="hover"
              :width="200"
            >
              <template #reference>
                <span class="reaction-stats">
                  {{ comment.likes || 0 }}赞 · {{ comment.dislikes || 0 }}踩
                </span>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPostDetails, likePost, dislikePost, reportPost, createComment, getComments, likeComment, dislikeComment } from '@/apis/forum'

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
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false,
        likedUsers: [],
        dislikedUsers: []
      },
      comments: [],
      newComment: {
          content: '',
        commentTime: ''
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
        if (this.post.isLiked) {
          this.post.likes = (this.post.likes || 0) + 1
          if (this.post.isDisliked) {
            this.post.isDisliked = false
            this.post.dislikes = Math.max(0, (this.post.dislikes || 0) - 1)
          }
        } else {
          this.post.likes = Math.max(0, (this.post.likes || 0) - 1)
        }
      } catch (error) {
        this.$message.error('操作失败')
      }
    },

    async handlePostDislike() {
      try {
        await dislikePost(this.post.id)
        this.post.isDisliked = !this.post.isDisliked
        if (this.post.isDisliked) {
          this.post.dislikes = (this.post.dislikes || 0) + 1
          if (this.post.isLiked) {
            this.post.isLiked = false
            this.post.likes = Math.max(0, (this.post.likes || 0) - 1)
          }
        } else {
          this.post.dislikes = Math.max(0, (this.post.dislikes || 0) - 1)
        }
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
        const now = new Date();
        // 格式化时间为 "yyyy-MM-dd HH:mm:ss"
        const ptime = now.getFullYear() + '-' + 
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0') + ' ' +
          String(now.getHours()).padStart(2, '0') + ':' +
          String(now.getMinutes()).padStart(2, '0') + ':' +
          String(now.getSeconds()).padStart(2, '0');

        await createComment({
          postId: this.post.id,
          content: this.newComment,
          commentTime: ptime
        })
        this.newComment = ''
        await this.fetchComments()
        this.$message.success('评论成功')
      } catch (error) {
        this.$message.error('评论失败')
      }
    },

    async handleCommentLike(comment) {
      try {
        await likeComment(comment.id)
        comment.isLiked = !comment.isLiked
        if (comment.isLiked) {
          comment.likes = (comment.likes || 0) + 1
          if (comment.isDisliked) {
            comment.isDisliked = false
            comment.dislikes = Math.max(0, (comment.dislikes || 0) - 1)
          }
        } else {
          comment.likes = Math.max(0, (comment.likes || 0) - 1)
        }
      } catch (error) {
        this.$message.error('操作失败')
      }
    },

    async handleCommentDislike(comment) {
      try {
        await dislikeComment(comment.id)
        comment.isDisliked = !comment.isDisliked
        if (comment.isDisliked) {
          comment.dislikes = (comment.dislikes || 0) + 1
          if (comment.isLiked) {
            comment.isLiked = false
            comment.likes = Math.max(0, (comment.likes || 0) - 1)
          }
        } else {
          comment.dislikes = Math.max(0, (comment.dislikes || 0) - 1)
        }
      } catch (error) {
        this.$message.error('操作失败')
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

.comment-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.action-btn {
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn.active {
  color: #409EFF;
}

.reaction-stats {
  color: #666;
  font-size: 0.9em;
  cursor: pointer;
  margin: 0 10px;
}

.reaction-details {
  font-size: 0.9em;
}

.reaction-details > div {
  margin-bottom: 8px;
}

.reaction-details strong {
  display: block;
  margin-bottom: 4px;
}
</style> 