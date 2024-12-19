import AdminCenterView from '@/views/AdminCenter/AdminCenterView.vue';
import AdminLoginView from '@/views/AdminLogin/AdminLoginView.vue';
import CategoryView from '@/views/Category/CategoryView.vue';
import HomeView from '@/views/Home/HomeView.vue';
import LayoutView from '@/views/Layout/LayoutView.vue';
import PostView from '@/views/Post/PostView.vue';
import UserCenterView from '@/views/UserCenter/UserCenterView.vue';
import UserHomepageView from '@/views/UserHomepage/UserHomepageView.vue';
import UserLoginView from '@/views/UserLogin/UserLoginView.vue';
import { createRouter, createWebHistory } from 'vue-router';

//页面路由配置
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: LayoutView,
      meta:{authRequired:true},
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'category/:id',
          name: 'category',
          component: CategoryView
        },
        {
          path: 'post/:id',
          name: 'post',
          component: PostView
        }
      ]
    },
    {
      path: '/usercenter',
      name: 'usercenter',
      component: UserCenterView,
    },
    {
      path: '/userhomepage/:id',
      name: 'userhomepage',
      component: UserHomepageView,
    },
    {
      path: '/userlogin',
      name: 'userlogin',
      component: UserLoginView,
    },
    {
      path: '/adminlogin',
      name: 'adminlogin',
      component: AdminLoginView,
    },
    {
      path: '/admincenter',
      name: 'admincenter',
      component: AdminCenterView,
    }
  ]
});


export default router;