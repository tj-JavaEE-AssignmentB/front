<template>
  <div class="container" v-if="currentUser">
    <div class="content-wrapper">
      <div class="left-panel">
        <!-- 用户头像 -->
        <div class="avatar-container" @click="openAvatarSelection">
          <img :src="currentUser.avatar" alt="用户头像" class="avatar" />
          <div class="avatar-overlay">更换头像</div>
          <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none;" />
        </div>
        <!-- 用户信息 -->
        <div class="user-info">
          <div class="form-group">
            <label>用户名：</label>
            <span v-if="!editing">{{ currentUser.username }}</span>
            <input v-else type="text" v-model="userTemp.username" @input="validateUsername" />
            <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
          </div>
          <div class="form-group">
            <label>邮箱：</label>
            <span v-if="!editing">{{ currentUser.email }}</span>
            <input v-else type="email" v-model="userTemp.email" @input="validateEmail" />
            <p v-if="emailError" class="error-message">{{ emailError }}</p>
          </div>
          <div class="form-group">
            <label>简介：</label>
            <span v-if="!editing">{{ currentUser.bio }}</span>
            <textarea v-else v-model="userTemp.bio"></textarea>
          </div>
          <!-- 编辑按钮 -->
          <div class="edit-btn">
            <button v-if="!editing" @click="editUserInfo">编辑个人信息</button>
            <div v-else>
              <button @click="confirmEdit">确认</button>
              <button @click="cancelEdit">取消</button>
            </div>
          </div>
          <!-- 修改密码按钮 -->
          <button @click="showChangePasswordDialog = true">修改账户密码</button>
          <!-- 退出登录按钮 -->
          <button @click="performLogout">退出登录</button>
        </div>
      </div>
      <div class="right-panel">
        <!-- 选项卡 -->
        <div class="tab-container">
          <div class="tab-item" :class="{ active: selectedTab === 'posts' }" @click="selectedTab = 'posts'">我的帖子</div>
          <div class="tab-item" :class="{ active: selectedTab === 'favorites' }" @click="selectedTab = 'favorites'">我的收藏</div>
          <div class="tab-item" :class="{ active: selectedTab === 'comments' }" @click="selectedTab = 'comments'">我的评论</div>
          <div class="tab-item" :class="{ active: selectedTab === 'follows' }" @click="selectedTab = 'follows'">我的关注</div>
          <div class="tab-item" :class="{ active: selectedTab === 'interests' }" @click="selectedTab = 'interests'">兴趣板块</div>
        </div>
        <!-- 内容区域 -->
        <div class="content-area">
          <!-- 我的帖子 -->
          <div v-if="selectedTab === 'posts'">
            <div v-for="post in posts" :key="post.id" class="post-item">
              <h3>{{ post.title }}</h3>
              <p>{{ post.content }}</p>
              <p>发布时间：{{ post.publishedDate }}</p>
              <button @click="deletePost(post)">删除</button>
            </div>
          </div>
          <!-- 我的收藏 -->
          <div v-if="selectedTab === 'favorites'">
            <div v-for="favorite in favorites" :key="favorite.id" class="post-item">
              <h3>{{ favorite.title }}</h3>
              <p>{{ favorite.content }}</p>
              <p>发布时间：{{ favorite.publishedDate }}</p>
              <button @click="cancelFavorite(favorite)">取消收藏</button>
            </div>
          </div>
          <!-- 我的评论 -->
          <div v-if="selectedTab === 'comments'">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <p>{{ comment.content }}</p>
              <p>评论时间：{{ comment.createdAt }}</p>
              <button @click="deleteComment(comment)">删除</button>
            </div>
          </div>
          <!-- 我的关注 -->
          <div v-if="selectedTab === 'follows'">
            <div v-for="follow in follows" :key="follow.id" class="follow-item">
              <p>{{ follow.username }}</p>
              <button @click="cancelFollow(follow)">取消关注</button>
            </div>
          </div>
          <!-- 兴趣板块 -->
          <div v-if="selectedTab === 'interests'">
            <div v-for="interest in interests" :key="interest.id" class="interest-item">
              <p>{{ interest.name }}</p>
              <button @click="unsubscribeInterest(interest)">取消订阅</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 投诉功能 -->
    <div class="complaint-container">
      <button @click="showComplaintDialog = true">投诉</button>
      <!-- 投诉弹出框 -->
      <div v-if="showComplaintDialog" class="complaint-dialog">
        <h3>投诉</h3>
        <textarea placeholder="请输入投诉内容"></textarea>
        <button @click="submitComplaint">提交</button>
        <button @click="cancelComplaint">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  computed: {
    // ...mapGetters({
    //   currentUser: 'getUserInfo', // 获取当前用户信息
    //   isAdmin: 'isAdmin', // 检查是否为管理员
    //   userAvatar: 'userAvatar', // 使用 getter 获取头像
    //   isAuthenticated: 'isAuthenticated',// 检查认证状态
    //   getPosts: 'getPosts',
    //   userComment: 'commentsByUser',
    // }),
    posts() {
      return this.userPosts;
    },
    commentInPost() {
      return this.postComment;
    },
  },
  data() {
    return {
      userComments: [
        { id: 1, content: '这是我的第一条评论', author: '张三', postId: 1 },
        { id: 2, content: '这是我的第二条评论', author: '李四', postId: 2 },

      ],
      userPosts: [
        { id: 1, title: '我的第一个帖子', content: '这是第一个帖子的内容...', publishedDate: '2024-09-06' },
        { id: 2, title: '我的第二个帖子', content: '这是第二个帖子的内容...', publishedDate: '2024-09-05' },

      ],
      userFavors: [
        { favorite_id: 1, article_id: 101, title: "收藏的帖子1", content: "这是第一个示例帖子的内容...", publishedDate: "2024-09-06" },
        { favorite_id: 2, article_id: 102, title: "收藏的帖子2", content: "这是第二篇收藏的帖子内容...",publishedDate: "2024-09-05" }
      ],
      postComment: [], // 如果需要可以填充一些示例数据
      showChangePasswordDialog: false, // 控制弹出框显示
      passwordError: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',

      showPostDialog: false, // 控制帖子详情弹框是否显示

      showConfirmDialog: false, // 删除确认弹框
      selectedPost: null, // 当前选中的帖子

      showDropdown: false, // 控制下拉菜单的显示与隐藏
      selectedText: '我的帖子', // 默认选择

      showConfirmFavoriteDialog: false, // 控制收藏删除确认弹框
      selectedFavorite: null, // 当前选中的收藏

      selectedComment: null, // 当前选择的评论
      showConfirmCommentDialog: false, // 控制评论删除确认弹框

      userTemp: {},
      editing: false,
      emailError: null,
      usernameError: null,

      // 添加一个当前用户对象，用于模拟用户信息
      currentUser: {
        id: 1,
        username: '张三',
        email: 'zhangsan@example.com',
        avatar: 'https://example.com/avatar.jpg'
      }
    };
  },
  //comments: [/*从后端获取*/ ],  // 存储用户的评论信息
  // mounted() {
  //   // 模拟或实际获取用户帖子
  //   this.fetchUserPosts(this.currentUser.userId)
  //       .then(result => {
  //         console.log('fetchUserPosts 返回的有效数据:', result); // 调试信息
  //         this.userPosts = result; // 将异步获取的数据存储在组件的 data 中
  //       })
  //       .catch(error => {
  //         console.error('获取帖子时出错:', error);
  //       });
  //
  //   // 模拟或实际获取用户评论
  //   if (process.env.NODE_ENV === 'development') {
  //     // 模拟数据（仅用于开发环境）
  //     console.log('模拟获取用户评论');
  //     this.userComments = [
  //       { id: 1, content: '模拟评论1' },
  //       { id: 2, content: '模拟评论2' }
  //     ];
  //   } else {
  //     // 生产环境中实际调用API
  //     this.$store.dispatch('fetchCommentsByUser', this.currentUser.userId)
  //         .then(result => {
  //           console.log('获取到的评论:', result); // 调试信息
  //           this.userComments = result; // 将返回的数据存储在本地
  //         })
  //         .catch(error => {
  //           console.error('获取用户评论时出错:', error);
  //         });
  //   }
  //
  //   // 获取用户收藏
  //   this.getUserFavorites();
  //
  //   // this.$store.dispatch('fetchFavoritesByUser', this.currentUser.userId)
  //   //   .then(result => {
  //   //     console.log('获取到的收藏:', result); // 调试信息
  //   //     this.userFavors = result; // 将返回的数据存储在本地
  //   //   })
  //   //   .catch(error => {
  //   //     console.error('获取用户收藏时出错:', error);
  //   //   });
  // },
  methods: {
    // ...mapActions({
    //   logout: 'logout',
    //   setAvatar: 'setAvatar',
    //   updateUserInfo: 'updateUserInfo',
    //   fetchUserPosts: 'fetchUserPosts',
    //   deletePost: 'deletePost',
    // }),
    async fetchUserPosts(userId) {
      try {
        let response;
        if (process.env.NODE_ENV === 'development') {
          // 模拟数据（仅用于开发环境）
          console.log('模拟获取帖子:', userId);
          response = await new Promise((resolve) =>
              setTimeout(() => resolve([
                { id: 1, title: '模拟帖子1', content: '这是模拟内容1' },
                { id: 2, title: '模拟帖子2', content: '这是模拟内容2' }
              ]), 1000));
        } else {
          // 生产环境中实际调用API
          response = await this.fetchApi('/api/posts/user/' + userId); // 替换为实际的API路径
        }
        this.userPosts = response; // 将帖子数据存储在组件的 data 中
      } catch (error) {
        console.error('获取帖子时出错:', error);
      }
    },

    async fetchPostComments(articleId) {
      try {
        let response;
        if (process.env.NODE_ENV === 'development') {
          // 模拟数据（仅用于开发环境）
          console.log('模拟获取帖子评论:', articleId);
          response = await new Promise((resolve) =>
              setTimeout(() => resolve([
                { id: 1, content: '模拟评论1' },
                { id: 2, content: '模拟评论2' }
              ]), 1000));
        } else {
          // 生产环境中实际调用API
          response = await this.fetchApi('/api/comments/post/' + articleId); // 替换为实际的API路径
        }
        this.postComment = response; // 将评论数据存储在组件中
      } catch (error) {
        console.error('获取帖子评论失败:', error);
      }
    },

    async getUserFavorites() {
      try {
        let result;
        if (process.env.NODE_ENV === 'development') {
          // 模拟数据（仅用于开发环境）
          console.log('模拟加载收藏');
          result = [
            { id: 1, name: '模拟收藏1' },
            { id: 2, name: '模拟收藏2' }
          ];
        } else {
          // 生产环境中实际调用API
          result = await this.fetchApi('/api/favorites/user/' + this.currentUser.userId); // 替换为实际的API路径
        }
        console.log('收藏加载成功:', result);
        this.userFavors = result;
      } catch (error) {
        console.error('加载收藏失败:', error);
      }
    },
    editUserInfo() {
      this.userTemp = { ...this.currentUser };
      this.editing = true;
    },
    // 验证用户名是否为邮箱格式
    validateUsername() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(this.userTemp.username)) {
        this.usernameError = '用户名不能是邮箱格式';
      } else {
        this.usernameError = null;
      }
    },
    // 验证邮箱格式
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.userTemp.email)) {
        this.emailError = '请输入有效的邮箱地址';
      } else {
        this.emailError = null;
      }
    },

    async confirmEdit() {
      if (!this.emailError && !this.usernameError && this.editing) {
        try {
          // 调用 Vuex 中的 action，发送更新的用户信息到后端
          await this.updateUserInfo({
            username: this.userTemp.username,
            email: this.userTemp.email,
            password: this.userTemp.password,
            languagePreference: this.userTemp.languagePreference,
            bio: this.userTemp.bio,
            avatar: this.userTemp.avatar,
            gender: this.userTemp.gender
          });
          this.editing = false;
        } catch (error) {
          console.error('更新失败:', error);
          alert('更新用户信息失败，请稍后重试。');
        }
      }
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    handleUserAvatarClick() {
      if (this.currentUser.role === 'guest') {
        this.$router.push('/login'); // 如果是guest用户，点击跳转到登录页面
      } else {
        this.goToUserProfile(); // 否则跳转到个人主页
      }
    },
    cancelEdit() {
      this.editing = false;  // 恢复到原来的状态，不保存修改
      this.emailError = null;  // 取消编辑时，清除错误信息
    },
    openAvatarSelection() {
      this.$refs.fileInput.click(); // 点击头像区域时，打开文件选择器
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedAvatar = e.target.result; // 将Base64数据存储在selectedAvatar
          this.updateUserAvatar(); // 调用方法更新头像
        };
        reader.readAsDataURL(file); // 将文件读取为Base64格式
      }
    },
    async updateUserAvatar() {
      try {
        await this.updateUserInfo({
          username: this.currentUser.username,
          email: this.currentUser.email,
          password: this.currentUser.password,
          languagePreference: this.currentUser.languagePreference,
          bio: this.currentUser.bio,
          avatar: this.selectedAvatar,
          gender: this.currentUser.gender
        });
      } catch (error) {
        console.error('更新头像失败:', error);
        alert('更新头像失败，请稍后再试。');
      }
    },
    goToCatalog() {
      this.$router.push('/catalog');
    },
    goToCommunity() {
      this.$router.push('/community');
    },
    goToAdminPanel() {
      this.$router.push('/adminpanel');
    },
    goHome() {
      this.$router.push('/home');
    },
    performLogout() {
      this.logout();
      this.$router.push('/login'); // 跳转到登录页面
    },
    goToUserProfile() {
      this.$router.push('/userprofile');
    },

    //刪除帖子部分
    // 点击删除按钮时，显示确认弹框
    confirmDelete(post) {
      this.selectedPost = post; // 保存要删除的帖子
      //console.log(this.selectedPost);
      this.showConfirmDialog = true; // 显示确认弹框
    },
    // 确认删除操作
    deletepost(post) {
      // 实际删除操作应通过API调用来删除帖子
      this.deletePost(post.articleId);
      this.userPosts = this.userPosts.filter(p => p.articleId !== post.articleId);
      this.showConfirmDialog = false; // 关闭弹框
      this.selectedPost = null; // 重置选择的帖子
    },
    // 取消删除操作
    cancelDelete() {
      this.showConfirmDialog = false; // 关闭弹框
      this.selectedPost = null; // 重置选择的帖子
    },
    // 打开帖子详情弹框
    openPostDialog(post) {
      this.selectedPost = post;
      this.showPostDialog = true;
      // 根据选中的 post 的 articleId 获取该帖子的评论
      this.fetchPostComments(post.articleId);
    },
    // 关闭帖子详情弹框
    closePostDialog() {
      this.showPostDialog = false;
      this.selectedPost = null;
    },
    async confirmChangePassword() {
      // 清除之前的错误提示
      this.passwordError = '';

      // 确保新密码和确认密码相同
      if (this.newPassword !== this.confirmPassword) {
        this.passwordError = '新密码与确认密码不匹配';
        return;
      }
      // 验证旧密码是否正确
      if (this.oldPassword !== this.currentUser.password) {
        this.passwordError = '旧密码不正确';
        return;
      }

      // 确保新密码与旧密码不同
      if (this.newPassword === this.oldPassword) {
        this.passwordError = '新密码不能与旧密码相同';
        return;
      }


      // 确保新密码长度在 8 到 20 位之间
      if (this.newPassword.length < 8 || this.newPassword.length > 20) {
        this.passwordError = '新密码长度应为 8 到 20 位';
        return;
      }
      // 向后端发送请求更新密码
      try {
        await this.updateUserInfo({
          username: this.currentUser.username,
          email: this.currentUser.email,
          password: this.newPassword,
          languagePreference: this.currentUser.languagePreference,
          bio: this.currentUser.bio,
          avatar: this.currentUser.avatar,
          gender: this.currentUser.gender
        });
        alert('密码修改成功');
        this.cancelChangePassword(); // 关闭弹框并清空数据
      } catch (error) {
        console.error('更新密码失败:', error);
        alert('更新密码失败，请稍后再试');
      }
    },
    cancelChangePassword() {
      this.showChangePasswordDialog = false; // 关闭弹窗
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordError = '';
    },
    // 打开收藏的帖子详情，使用与帖子相同的弹框
    openFavoriteDialog(favorite) {
      this.selectedPost = favorite; // 将选中的收藏帖子数据传递给 selectedPost
      //this.comments = [ /* 模拟或者获取实际的评论数据 */];
      this.showPostDialog = true; // 显示弹框
      this.fetchPostComments(favorite.articleId);
    },
    // 确认取消收藏操作
    confirmCancelFavorite(favorite) {
      this.selectedFavorite = favorite;
      this.showConfirmFavoriteDialog = true;
    },

    // 取消收藏操作
    cancelFavorite(favorite) {
      console.log('favor:', favorite.favorId); // 调试信息
      this.$store.dispatch('deleteFavorite', favorite.favorId);
      //console.log('comment:', comment); // 调试信息
      this.userFavors = this.userFavors.filter(p => p.favorId !== favorite.favorId);
      this.showConfirmFavoriteDialog = false;
      this.selectedFavorite = null;
    },

    // 关闭弹框
    cancelDialog() {
      this.showConfirmFavoriteDialog = false;
      this.selectedFavorite = null;
    },
    confirmComment(comment) {
      //确认删除函数，然后接入后端
      this.$store.dispatch('deleteComment', comment.commentId);
      console.log('comment:', comment); // 调试信息
      this.userComments = this.userComments.filter(p => p.commentId !== comment.commentId);
      this.showConfirmCommentDialog = false;
      this.selectedComment = null;
    },
    deleteComment(comment) {
      this.selectedComment = comment;
      this.showConfirmCommentDialog = true;
    },

    // 关闭弹框
    cancelCommentDialog() {
      this.showConfirmCommentDialog = false;
      this.selectedComment = null;
    },
    //选择框
    toggleDropdown() {
      this.showDropdown = !this.showDropdown; // 切换下拉菜单的显示状态
    },
    selectOption(option) {
      this.selectedText = option; // 设置选中的选项
      this.showDropdown = false; // 选择后隐藏下拉菜单
    },
  }
};
</script>


<style>

/* 头像容器 */
.avatar-container {
  position: relative;
  margin-bottom: 20px;
  cursor: pointer;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

/* 用户信息 */
.user-info {
  width: 100%;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}
.form-group input, .form-group textarea {
  width: calc(100% - 90px);
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.form-group textarea {
  height: 100px;
}
.error-message {
  color: red;
  font-size: 12px;
}
.edit-btn button {
  margin-top: 10px;
}

/* 右面板 */
.right-panel {
  margin-left: 20px;
}
.tab-container {
  display: flex;
  margin-bottom: 20px;
}
.tab-item {
  padding: 10px 15px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-bottom: none;
}
.tab-item.active {
  background-color: #409EFF;
  color: #fff;
}
.content-area {
  border: 1px solid #ccc;
  padding: 20px;
}
.post-item, .comment-item, .follow-item, .interest-item {
  margin-bottom: 20px;
}
.post-item h3 {
  margin-top: 0;
}
.post-item p {
  color: #666;
}
.post-item button, .comment-item button, .follow-item button, .interest-item button {
  background-color: #409EFF;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

/* 投诉功能 */
.complaint-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
.complaint-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.complaint-dialog textarea {
  width: 100%;
  height: 100px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 10px;
}
.complaint-dialog button {
  background-color: #409EFF;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.gender-group {
  display: flex;
  align-items: center;
}

.gender-label {
  text-align: left;
}

.gender-display {
  flex: 2;
  text-align: center;
  /* 性别文本居中显示 */
}

.gender-options {
  justify-content: center;
  gap: 10px;
}


.editable-field-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  /* 让输入框和反馈信息垂直排列 */
  width: 100%;
}

.editable-field input,
.editable-field span,
textarea {
  width: 100%;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: rgba(255, 255, 255, 0.7);
}

input[type="text"],
textarea {
  width: 100%;
  /* 设置宽度为父容器的100% */
  max-width: 300px;
  /* 设置最大宽度，确保不会变大 */
  height: 30px;
  /* 固定高度 */
  box-sizing: border-box;
  /* 包括内边距和边框在内计算宽度 */
  padding: 5px;
  font-size: 14px;
}

textarea {
  height: 100px;
  /* 设置多行文本框的固定高度 */
  resize: none;
  /* 禁用手动调整大小 */
}

.confirm-button,
.cancel-button {
  width: 120px;
  /* 调整宽度为长方形 */
  padding: 10px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s ease;
}

.confirm-button {
  background-color: #28a745;
  color: white;
}

.confirm-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}

.edit-actions {
  display: flex;
  justify-content: center;
  /* 居中对齐容器内的按钮 */
  gap: 20px;
  /* 增加按钮之间的间距 */
  width: 260px;
  /* 容器的宽度设置为按钮的总宽度加上间距 */
}

.logout-button-container {
  display: flex;
  justify-content: center;
  margin-top: auto;
  /* 让按钮靠下 */
  margin-bottom: 20px;
}

.logout-button {
  background-color: #ff4d4d;
  width: 136px;
  /* 调整宽度为长方形 */
  height: 35px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 20px;
}

.logout-button:hover {
  background-color: #ff1a1a;
  transform: scale(1.05);
}

.logout-button:active {
  background-color: #cc0000;
  transform: scale(1);
}

/* 新增的样式 */
.edit-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.edit-button {
  background-color: #ffc107;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.edit-button:hover {
  background-color: #e0a800;
  transform: scale(1.05);
}

.edit-actions {
  display: flex;
  justify-content: center;
  /* 水平居中对齐 */
  width: 100%;
  margin-top: 10px;
}

/* 头像选择弹出框相关样式 */
.avatar-selection-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.avatar-selection-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.avatar-option {
  position: relative;
  cursor: pointer;
}

.avatar-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.avatar-option.selected .avatar-image {
  border-color: #007bff;
  filter: brightness(0.7);
}

.checkmark {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 18px;
  color: white;
  background-color: #007bff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 2px;
  margin-left: 5px;
  /* 保持与输入框对齐 */
}

.validation-feedback {
  font-size: 12px;
  color: green;
  /* 默认成功信息颜色 */
  display: block;
  /* 确保反馈信息占据整行 */
}

.validation-feedback.error {
  color: red;
  /* 错误信息颜色 */
}

.validation-feedback.success {
  color: green;
  /* 成功信息颜色 */
}


.user-info {
  display: table-column;
  align-items: center;
  gap: 10px;
  position: relative;
}

.user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-info img:hover {
  transform: scale(1.1);
}

.user-info-list {
  z-index: 2;
  /* 提高用户信息列表的层级，确保它显示在 header 之上 */
  position: absolute;
  left: -200px !important;
  top: 50px;
  right: 0;
  background-color: white;
  /* 为弹出的内容添加背景色，避免透明度导致内容不清晰 */
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* 添加阴影效果，确保弹出层次感 */
}

.username {
  font-family: 'Caveat-VariableFont', 'ZhiMangXing-Regular', sans-serif;
  font-size: 28px;
  font-weight: bold;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.login-prompt {
  display: flex;
  justify-content: center;
  /* 水平居中对齐 */
  align-items: center;
  /* 垂直居中对齐 */
  height: 100%;
  /* 让内容充满父容器的高度 */
  color: blue;
  cursor: pointer;
  text-align: center;
}

.login-prompt:hover {
  text-decoration: underline;
}

.footer {
  position: fixed;
}


/*帖子*/
/* 帖子悬停变大效果 */
.post {
  background-color: white;
  padding: 15px;
  margin-bottom: 5px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 94%;
  max-height: 150px;
  box-sizing: border-box;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  z-index: 3;
  margin-left: 16px;
  margin-top: 10px;
}

.post:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.post-content {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  max-height: 80px;
  /* 限制最大高度 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 限制行数为3，超出部分显示省略号 */
  white-space: normal;
  /* 允许换行 */
}


.post-meta {
  font-size: 12px;
  color: #666;
  text-align: right;
}

.comment-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 20px;
  max-height: 80px;
  /* 限制最大高度 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  /* 限制行数为3，超出部分显示省略号 */
  overflow-y: auto;
  white-space: normal;
  /* 允许换行 */
}

/* 删除按钮样式 */
.delete-comment,
.cancelFavorite-button,
.delete-button {
  position: absolute;
  right: 20px;
  top: 25%;
  transform: translateY(-50%);
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-comment {
  top: 80%;
}

.cancelFavorite-button {
  background-color: #ffc107;
}

.delete-button:hover {
  background-color: darkred;
}

/* 删除确认弹框样式 */
.confirm-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.confirm-dialog-content {
  text-align: center;
}

.confirm-dialog-content button {
  margin: 10px;
  padding: 5px 15px;
  cursor: pointer;
}

.confirm-dialog-content button {
  margin: 10px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.confirm-dialog-content button {
  background-color: #4CAF50;
  /* 确认按钮的绿色 */
  color: white;
}

.confirm-dialog-content button:hover {
  background-color: #45a049;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.confirm-dialog-content button:last-child {
  background-color: #f44336;
  /* 取消按钮的红色 */
  color: white;
}

.confirm-dialog-content button:last-child:hover {
  background-color: #e53935;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 帖子详情弹框样式 */
.post-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  width: 60%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  /* 不显示外部滚动条 */
}

.post-dialog-content {
  display: flex;
  flex-direction: column;
}

.post-dialog-header {
  display: flex;
  justify-content: space-between;
  /* 标题和按钮在同一行 */
  align-items: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.post-dialog-header h3 {
  font-size: 20px;
  color: #00aaff;
}

.close-button {
  padding: 5px 10px;
  font-size: 40px;
  /* 设置字体大小，让叉叉明显 */
  background-color: transparent;
  /* 去掉背景色 */
  color: #007bff;
  /* 设置叉叉的颜色 */
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #0056b3;
  /* 悬停时变成深蓝色 */
}

/* 中间内容部分：固定高度，支持滚动 */
.post-dialog-body {
  flex: 1;
  max-height: 250px;
  /* 固定内容区域高度 */
  overflow-y: auto;
  /* 内容超出时显示滚动条 */
  margin-bottom: 20px;
}

/* 评论区：固定高度，支持滚动 */
.post-dialog-footer {
  font-size: 14px;
  max-height: 150px;
  /* 固定评论区域高度 */
  overflow-y: auto;
  /* 评论超出时显示滚动条 */
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 5px;
}

/* 修改个人信息和修改密码按钮 */
.edit-button,
.change-password-button {
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 0;
}

.edit-button {
  background-color: orange;
  color: white;
}

.change-password-button {
  background-color: #007bff;
  /* 蓝色按钮 */
  color: white;
}

.change-password-button:hover {
  background-color: #0056b3;
  /* 悬停时颜色变深 */
}

/* 修改密码弹窗背景 */
.password-dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  /* 确保弹窗显示在最上层 */
}

/* 修改密码弹窗 */
.password-dialog {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.password-dialog h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
}

.password-dialog .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.password-dialog .form-group label {
  margin-bottom: 5px;
}

.password-dialog .form-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
}

.confirm-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button:hover {
  background-color: #c82333;
}

.dropdown-container {
  position: relative;
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.5);
  /* 透明背景 */
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  text-align: right;
  z-index: 4;
  margin-left: 16px;
}

.dropdown-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.triangle {
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.triangle-rotate {
  transform: rotate(180deg);
  /* 点击后旋转三角形 */
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  z-index: 1;
  list-style: none;
  padding: 10px 0;
  margin: 0;
  z-index: 5;
}

.dropdown-menu li {
  padding: 10px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.selectedoption {
  width: 100%;
  margin-left: 1px;
  overflow-y: auto;
  /* 当内容溢出时显示滚动条 */
  overflow-x: hidden;
  /* 当内容溢出时显示滚动条 */
}

.divider {
  border: none;
  min-height: 3px;
  width: 100%;
  background-color: #45c789;
  /* 天蓝色 */
  z-index: 3;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  /* 左右分布 */
  font-size: 12px;
  color: #666;
}

.comment-left {
  display: flex;
}

.comment-right {
  margin-right: 40%;
  font-weight: bold;
  white-space: nowrap;
  /* 防止换行 */
  overflow: hidden;
  /* 隐藏超出部分 */
  text-overflow: ellipsis;
  /* 显示省略号 */
  width: 20ch;
  /* 限制显示的字符数为 20 */
}
</style>
