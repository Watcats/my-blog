<template>
  <div class="list-content">
    <ul class="articles-list" id="list">
      <transition-group name="el-fade-in">
        <li
          v-for="article in state.articlesList"
          :key="article._id"
          class="item"
        >
          <router-link :to="state.href + article._id">
            <div class="content">
              <h4 class="title">{{ article.title }}</h4>
              <p class="abstract">{{ article.desc }}</p>
              <div class="meta">
                <span>查看 {{ article.meta.views }}</span>
                <span>评论 {{ article.meta.comments }}</span>
                <span>赞 {{ article.meta.likes }}</span>
                <span v-if="article.create_time" class="time">
                  {{ formatTime(article.create_time) }}
                </span>
              </div>
            </div>
          </router-link>
          <el-button
            size="small"
            type="primary"
            @click="handleClick('update', article._id)"
            >修改文章
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleClick('delete', article._id)"
            >删除文章
          </el-button>
        </li>
      </transition-group>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { key } from "../store";
import service from "../utils/https";
import urls from "../utils/urls";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { ArticlesParams, ArticlesData, UserInfo } from "../types/index";
import {
  throttle,
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  getQueryStringByName,
  timestampToTime,
} from "../utils/utils";

export default defineComponent({
  name: "ArticleList",
  watch: {
    $route: {
      handler(val: any, oldVal: any) {
        this.routeChange(val, oldVal);
      },
      immediate: true,
    },
  },
  setup(props, context) {
    const store = useStore(key);
    const router = useRouter();
    const state = reactive({
      isLoadEnd: false,
      isLoading: false,
      articlesList: [] as Array<any>,
      total: 0,
      params: {
        user: "",
        keyword: "",
        state: 1, //1 已发布
        likes: "",
        tag_id: "",
        pageNum: 1,
        pageSize: 10,
      } as ArticlesParams,
      href: "http://localhost:3001/articleDetail?article_id=",
    });

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    const handleClick = (value: string, id: string): void => {
      if (value === "update") {
        router.push({ path: "/ArticleUpdate", query: { article_id: id } });
      } else if (value === "delete") {
        ElMessageBox.confirm("要删除文章吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            service.post(urls.delArticle, { id });
            ElMessage({
              message: "删除成功!",
              type: "success",
            });
            location.reload();
          })
          .catch(() => {
            ElMessage({
              message: "已取消删除",
              type: "info",
            });
          });
      }
    };

    const routeChange = (val: any, oldVal: any): void => {
      state.articlesList = [];
      state.params.pageNum = 1;
      // handleSearch();
    };

    const handleSearch = async (): Promise<void> => {
      state.isLoading = true;
      let URL =
        urls.getArticleList +
        "?user=" +
        state.params.user +
        "&keyword=" +
        state.params.keyword +
        "&state=" +
        state.params.state +
        "&likes=" +
        state.params.likes +
        "&tag_id=" +
        state.params.tag_id +
        "&pageNum=" +
        state.params.pageNum +
        "&pageSize=" +
        state.params.pageSize;
      console.log(URL);
      console.log("getList: " + state.params.user);

      const data: ArticlesData = await service.get(URL);
      state.isLoading = false;
      state.articlesList = [...state.articlesList, ...data.list];
      state.total = data.count;
      state.params.pageNum++;
      // nextTick(() => {
      //   lazyload();
      // });
      if (data.list.length === 0 || state.total === state.articlesList.length) {
        state.isLoadEnd = true;
        document.removeEventListener("scroll", () => {});
        window.onscroll = null;
      }
    };

    const getCurrentUser = async (): Promise<void> => {
      const data: UserInfo = await service.get(urls.currentUser, {
        withCredentials: true,
      });
      state.params.user = data.name;
      console.log("getuser: " + state.params.user);
    };

    onMounted(() => {
      // getCurrentUser();
      // console.log(state.params.user);
      let userInfo: UserInfo = {
        _id: "",
        name: "",
        avatar: "",
      };
      if (window.sessionStorage.userInfo) {
        userInfo = JSON.parse(window.sessionStorage.userInfo);
        store.commit("SAVE_USER", {
          userInfo,
        });
      }
      state.params.user = userInfo.name;

      handleSearch();
      window.onscroll = () => {
        if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
          // 如果不是已经没有数据了，都可以继续滚动加载
          if (state.isLoadEnd === false && state.isLoading === false) {
            handleSearch();
          }
        }
      };
    });

    return {
      state,
      routeChange,
      formatTime,
      handleSearch,
      handleClick,
    };
  },
});
</script>

<style lang="less" scoped>
.list-content {
  .articles-list {
    margin: 0;
    padding: 0;
    list-style: none;

    .title {
      color: #333;
      margin: 7px 0 4px;
      display: inherit;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
    }

    .item > div {
      padding-right: 140px;
    }

    .item .wrap-img {
      position: absolute;
      top: 50%;
      margin-top: -50px;
      right: 0;
      width: 125px;
      height: 100px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
      }
    }

    li {
      line-height: 20px;
      position: relative;
      width: 80%;
      padding: 15px 0px;
      padding-right: 150px;
      border-bottom: 1px solid #b69f9f;
      word-wrap: break-word;
      cursor: pointer;

      &:hover {
        .title {
          color: #000;
        }
      }

      .abstract {
        min-height: 30px;
        margin: 0 0 8px;
        font-size: 13px;
        line-height: 24px;
        color: #555;
      }

      .meta {
        padding-right: 0 !important;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;

        a {
          margin-right: 10px;
          color: #b4b4b4;

          &::hover {
            transition: 0.1s ease-in;
            -webkit-transition: 0.1s ease-in;
            -moz-transition: 0.1s ease-in;
            -o-transition: 0.1s ease-in;
            -ms-transition: 0.1s ease-in;
          }
        }

        span {
          margin-right: 10px;
          color: #666;
        }
      }
    }
  }
}
</style>
