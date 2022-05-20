<template>
  <div class="content">
    <el-container>
      <el-menu  class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">
          <router-link to="/ArticleList">文章列表</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/ArticleAdd">新建文章</router-link>
        </el-menu-item>
      </el-menu>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <LoadingCustom v-if="state.isLoading"></LoadingCustom>
    <LoadEnd v-if="state.isLoadEnd"></LoadEnd>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadEnd from "../components/LoadEnd.vue";
import LoadingCustom from "../components/Loading.vue";

export default defineComponent({
  name: "Articles",
  components: {
    LoadEnd,
    LoadingCustom,
  },
  setup(props, context) {
    const router = useRouter();
    const state = reactive({
      user_id: "",
      user_name: "",
      isLoadEnd: false,
      isLoading: false,
    });

    return {
      state,
    };
  },
});
</script>


<style lang="less" scoped>
.content {
  margin: 0;
  padding: 0;
  width: 100%;
}
.el-menu-item {
  font-size: 14px;
  text-align: center;
}
.el-menu-item.is-active {
  //设置背景颜色
  background-color: #18909b !important;
  //设置字体颜色
  color: white !important;
}
</style>