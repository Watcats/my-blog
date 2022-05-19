<template>
  <div class="content">
    <el-form>
      <el-formItem label="电话" label-width="60px">
        <el-input
          v-model="state.params.phone"
          placeholder=""
          class="border"
          autocomplete="off"
        >
        </el-input>
      </el-formItem>
      <el-formItem label="邮箱" label-width="60px">
        <el-input
          v-model="state.params.email"
          placeholder=""
          class="border"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem label="简介" label-width="60px">
        <el-input
          v-model="state.params.introduce"
          placeholder=""
          class="border"
          autocomplete="off"
        ></el-input>
      </el-formItem>
    </el-form>
    <el-button type="primary" @click="submit" style="margin-top: 10px"
      >保存修改</el-button
    >
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  getCurrentScope,
  onMounted,
  reactive,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { key } from "../store";
import { RegAndLogParams, UserInfo } from "../types/index";
import service from "../utils/https";
import urls from "../utils/urls";

export default defineComponent({
  name: "UserInfo",
  setup(props, context) {
    const store = useStore(key);
    const state = reactive({
      params: {
        email: "",
        name: "",
        password: "",
        phone: "",
        introduce: "",
      } as RegAndLogParams,
    });

    const submit = async (): Promise<void> => {
      const data = await service.post(urls.updateArticle, state.params);
      ElMessage({
        message: "成功修改用户信息",
        type: "success",
      });
    };

    const getUser = async (): Promise<void> => {
      const data = await service.post(urls.userInfo, state.params);

      state.params.email = data.email;
      state.params.phone = data.phone;
      state.params.introduce = data.introduce;
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
      state.params.name = userInfo.name;
      getUser();
    });

    return {
      state,
      submit,
    };
  },
});
</script>
<style scoped>
</style>

