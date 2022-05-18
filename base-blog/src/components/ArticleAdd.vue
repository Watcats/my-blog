<template>
  <div id="editor">
    <el-form>
      <el-formItem label="标题" label-width="60px">
        <el-input
          v-model="state.params.title"
          placeholder=""
          class="border"
          autocomplete="off"
        >
        </el-input>
      </el-formItem>
      <el-formItem label="关键字" label-width="60px">
        <el-input
          v-model="state.params.keyword"
          placeholder="使用 , 分割"
          class="border"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem label="简介" label-width="60px">
        <el-input
          v-model="state.params.desc"
          placeholder=""
          class="border"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem label="标签" label-width="60px">
        <el-input
          v-model="state.params.tags"
          placeholder="使用 , 分割"
          class="border"
          autocomplete="off"
        ></el-input>
      </el-formItem>
    </el-form>
    <v-md-editor v-model="state.params.content" height="400px"></v-md-editor>
    <el-button type="primary" @click="submit" style="margin-top: 10px"
      >发表文章</el-button
    >
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { UserInfo } from "../types/index";
import { useStore } from "vuex";
import { key } from "../store";
import { ElMessage } from "element-plus";
import service from "../utils/https";
import urls from "../utils/urls";

export default defineComponent({
  name: "ArticleAdd",
  setup(props, context) {
    const store = useStore(key);
    const state = reactive({
      params: {
        title: "",
        keyword: "",
        author: "admin",
        desc: "",
        content: "",
        type: 1,
        state: 1,
        tags: "",
        origin: 1,
      },
    });

    const submit = async (): Promise<void> => {
      const data = await service.post(urls.addArticle, state.params);
      ElMessage({
        message: "成功发表文章",
        type: "success",
      });
    };

    const getCurrentUser = async (): Promise<void> => {
      const data: UserInfo = await service.get(
        urls.currentUser,
        { withCredentials: true }
      );
      state.params.author = data.name;
    };

    onMounted(() => {
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
      // state.params.user=userInfo.name;
      // getCurrentUser();
    });
    return {
      state,
      submit,
    };
  },
});
</script>
<style scoped>
#editor {
  margin: auto;
  width: 80%;
  /* height: 600px; */
}
</style>
<style>
.border .el-input__inner {
  width: 40%;
  border-bottom: 1px solid black !important;
}
</style>

