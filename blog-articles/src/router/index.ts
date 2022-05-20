import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/HomeView.vue';
import Articles from "../views/Articles.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import ArticleAdd from "../components/ArticleAdd.vue"
import ArticleUpdate from "../components/ArticleUpdate.vue"
import ArticleList from "../components/ArticleList.vue"
import User from "../views/User.vue";
import About from "../components/About.vue";
import UserInfo from "../components/UserInfo.vue";
import UserPwd from "../components/UserPwd.vue";


const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  // },
  {
    path: "/",
    name: "articles",
    component: Articles,
    children: [
      {
        path: "/ArticleAdd",
        name: "ArticleAdd",
        component: ArticleAdd,
      },
      {
        path: "/ArticleUpdate",
        name: "ArticleUpdate",
        component: ArticleUpdate,
      },
      {
        path: "/ArticleList",
        name: "ArticleList",
        component: ArticleList,
      },
    ]
  },
  {
    path: "/articleDetail",
    name: "articleDetail",
    component: ArticleDetail,
  },
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes,
// });

export default routes;
