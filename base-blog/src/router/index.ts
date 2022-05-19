import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import HelloWorld from "../components/HelloWorld.vue";
import Home from "../views/Home.vue";
import Articles from "../views/Articles.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import ArticleAdd from "../components/ArticleAdd.vue"
import ArticleUpdate from "../components/ArticleUpdate.vue"
import ArticleList from "../components/ArticleList.vue"
import User from "../views/User.vue";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/articles",
    name: "articles",
    component: Articles,
    children: [
      {
        path: "/articleDetail",
        name: "articleDetail",
        component: ArticleDetail,
      },
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
    path: "/User",
    name: "User",
    component: User,
  },
  {
    path: "/ArticleDetail?type=2",
    name: "about",
    component: ArticleDetail
  },

];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes,
});

export default router;
