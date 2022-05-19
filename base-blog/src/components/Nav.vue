<template>
  <div>
    <div class="nav">
      <div class="nav-content">
        <el-row gutter:20>
          <el-col :span="3">
            <!-- <router-link to="/">
              <img class="logo" src="../assets/logo.jpg" alt="首页" />
            </router-link> -->
          </el-col>
          <el-col :span="16">
            <el-menu
              :router="true"
              :default-active="state.activeIndex"
              active-text-color="#409eff"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item
                :route="l.path"
                :index="l.index"
                v-for="l in state.list"
                :key="l.index"
              >
                {{ l.name }}
              </el-menu-item>
            </el-menu>
          </el-col>

          <el-col v-if="userInfo._id" :span="5">
            <el-row class="nav-right" gutter:0>
              <el-col :span="8">
                <img class="user-img" src="../assets/user.png" alt="头像" />
              </el-col>
              <el-col span="8" style="margin-top: 15px">
                {{ userInfo.name }}
              </el-col>
              <el-col :span="8" style="margin-top: 10px">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleLogout"
                  style="margin"
                  >登出</el-button
                >
              </el-col>
            </el-row>
          </el-col>
          <el-col v-else :span="5">
            <div class="nav-right">
              <el-button
                size="small"
                type="primary"
                @click="handleClick('login')"
                >登录</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="handleClick('register')"
                >注册</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <RegisterAndLogin
      :visible="state.visible"
      :handleFlag="state.handleFlag"
      @ok="handleOk"
      @cancel="handleCancel"
    >
    </RegisterAndLogin>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, reactive } from "vue";
import service from "../utils/https";
import urls from "../utils/urls";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import { key } from "../store";
import { getQueryStringByName } from "../utils/utils";
import { UserInfo, NavListItem } from "../types/index";

export default defineComponent({
  name: "Nav",
  components: {
    RegisterAndLogin: defineAsyncComponent(
      () => import("./RegisterAndLogin.vue")
    ),
  },
  computed: {
    userInfo(): UserInfo {
      let userInfo: UserInfo = {
        _id: "",
        name: "",
        avatar: "",
      };
      if (window.sessionStorage.userInfo) {
        userInfo = JSON.parse(window.sessionStorage.userInfo);
        (this as any).$store.commit("SAVE_USER", {
          userInfo,
        });
      }
      if ((this as any).$store.state.user.userInfo) {
        userInfo = (this as any).$store.state.user.userInfo;
      }
      return userInfo;
    },
  },
  watch: {
    $route: {
      handler(val: any, oldVal: any) {
        this.routeChange(val, oldVal);
      },
      immediate: true,
    },
  },
  mounted() {
    this.routeChange(this.$route, this.$route);
    this.getCurrentUser();
  },
  setup(props, context) {
    const store = useStore(key);
    const router = useRouter();
    const state = reactive({
      visible: false,
      handleFlag: "",
      title: "首页",
      list: [
        {
          index: "1",
          path: "/",
          name: "首页",
        },
        {
          index: "2",
          path: "/articles",
          name: "文章",
        },
        {
          index: "3",
          path: "/User",
          name: "个人中心",
        },
        {
          index: "4",
          path: "/ArticleDetail?type=2",
          name: "关于",
        },
      ] as Array<NavListItem>,
      activeIndex: "1",
    });
    router.beforeEach((to, from, next) => {
      if (to.path === "/articles" || to.path === "/User") {
        if (!window.sessionStorage.userInfo._id) {
          ElMessage({
            message: "请先登陆!",
            type: "warning",
          });
          router.push({ path: "/" });
        }
        next();
      }
      next();
    });

    //路由变化时更换高亮的菜单项
    const routeChange = (val: any, oldVal: any) => {
      for (let i = 0; i < state.list.length; i++) {
        const l: NavListItem = state.list[i];
        if (l.path === val.path) {
          state.activeIndex = i + 1 + "";
          state.title = l.name;
          break;
        }
      }
    };
    //选择菜单项更换高亮菜单项
    const handleSelect = (val: string, oldVal: string): void => {
      state.activeIndex = val;
    };

    //这两个函数用于父子组件传值
    const handleOk = (value: boolean): void => {
      state.visible = value;
    };
    const handleCancel = (value: boolean): void => {
      state.visible = value;
    };

    const handleClick = (value: string): void => {
      state.handleFlag = value;
      state.visible = true;
    };

    const handleLogout = (): void => {
      window.sessionStorage.userInfo = "";
      store.commit("SAVE_USER", {
        userInfo: {
          _id: "",
          name: "",
          avatar: "",
        },
      });
      service.post(urls.logout, {});
      router.push({ path: "/" });
    };

    const getCurrentUser = async (): Promise<void> => {
      const loading: any = ElLoading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });
      const data = await service.get(urls.currentUser, {
        withCredentials: true,
      });
      loading.close();

      const userInfo: UserInfo = {
        _id: data._id,
        name: data.name,
        avatar: data.avatar,
      };
      store.commit("SAVE_USER", {
        userInfo,
      });
      window.sessionStorage.userInfo = JSON.stringify(userInfo);

      // let preventHistory = JSON.parse(window.sessionStorage.preventHistory);
      // if (preventHistory) {
      //   router.push({
      //     path: preventHistory.name,
      //     query: preventHistory.query,
      //   });
      // }
    };

    return {
      state,
      handleCancel,
      handleOk,
      handleClick,
      handleLogout,
      getCurrentUser,
      handleSelect,
      routeChange,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid #eee;
  background-color: #fff;

  .nav-content {
    width: 80%;
    margin: 0 auto;
  }

  .logo {
    height: 40px;
    margin: 0;
    border-radius: 50%;
    margin-top: 5px;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }

  .el-menu--horizontal > .el-menu-item {
    cursor: pointer;
    color: #333;
  }

  .nav-right {
    position: relative;
    padding-top: 5px;
    text-align: center;

    .el-dropdown-link {
      cursor: pointer;
      margin-bottom: 30px;
      // background: #000;
      // text-align: center;
      // margin: auto;
      cursor: pointer;
      // color: var(--el-color-primary);
      display: flex;
      align-items: center;
    }

    .user-img {
      // position: absolute;
      // top: -15px;
      right: 0;
      width: 50px;
      border-radius: 50%;
    }
  }
}

.enter-slideUp,
.leave-slideDown {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1010;
}

.enter-slideUp {
  overflow: auto;
  visibility: visible;
  z-index: 1001;
  animation: slideUp 0.3s forwards;
}

.leave-slideDown {
  visibility: visible;
  z-index: 1001;
  animation: slideDown 0.3s forwards;
}

@keyframes slideUp {
  from {
    transform: translate3d(0, 100%, 0);
    opacity: 0.1;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
}

.mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
}

.mask-fade-out {
  animation: maskFadeOut 0.4s forwards;
}

@keyframes maskFadeOut {
  from {
    opacity: 0.5;
  }

  to {
    opacity: 0;
  }
}
</style>
