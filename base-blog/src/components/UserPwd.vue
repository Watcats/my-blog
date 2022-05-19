<template>
  <div class="content">
    <el-form>
      <el-formItem label="旧密码" label-width="60px">
        <el-input
          type="password"
          v-model="state.params.pwd"
          placeholder=""
          class="border"
          autocomplete="off"
        >
        </el-input>
      </el-formItem>
      <el-formItem label="新密码" label-width="60px">
        <el-input
          type="password"
          v-model="state.params.new_pwd"
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
  name: "UserPwd",
  setup(props, context) {
    const store = useStore(key);
    const state = reactive({
      params: {
        name: "",
        pwd: "",
        new_pwd: "",
      },
    });

    const submit = async (): Promise<void> => {
      const data = await service.post(urls.updatePwd, state.params);
      if(data){
        ElMessage({
        message: "成功修改密码",
        type: "success",
      });
      }
      
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

