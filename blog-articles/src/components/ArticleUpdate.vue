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
      >保存修改</el-button
    >
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { UserInfo } from "../types/index";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
// import { key } from "../store";
import { ElMessage } from "element-plus";
import service from "../utils/https";
import urls from "../utils/urls";

export default defineComponent({
  name: "ArticleUpdate",
  setup(props, context) {
    // const store = useStore(key);
    const router = useRouter();
    const state = reactive({
      params: {
        id: "",
        title: "",
        keyword: "",
        desc: "",
        tags: "",
        content: "",
      },
    });

    const submit = async (): Promise<void> => {
      const data = await service.post(urls.updateArticle, state.params);
      ElMessage({
        message: "成功修改文章",
        type: "success",
      });
    };

    const getArticle = async (): Promise<void> => {
     const data = await service.post(urls.getArticleDetail, state.params);

      state.params.title=data.title;
      state.params.keyword=data.keyword.join(",");
      state.params.desc=data.desc;
      let arr=[]
      for(let i=0;i<data.tags.length;i++){
        arr.push(data.tags[i].name)
      }
      state.params.tags=arr.join(',');
      console.log(state.params.tags);
      
      state.params.content=data.content;
    };

    const route = useRoute();
    onMounted(() => {
      state.params.id = route.query.article_id as string;
      getArticle();
      let userInfo: UserInfo = {
        _id: "",
        name: "",
        avatar: "",
      };
      if (window.sessionStorage.userInfo) {
        userInfo = JSON.parse(window.sessionStorage.userInfo);
        // store.commit("SAVE_USER", {
        //   userInfo,
        // });
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
}
</style>
<style>
.border .el-input__inner {
  width: 40%;
  border-bottom: 1px solid black !important;
}
</style>
