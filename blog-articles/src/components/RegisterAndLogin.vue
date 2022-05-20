<template>
  <el-dialog
    title="登录"
    width="50%"
    v-model="state.dialogDodel"
    @close="cancel"
    :show-close="true"
  >
    <el-form>
      <el-formItem label="邮箱" label-width="60px">
        <el-input
          v-model="state.params.email"
          placeholder="邮箱"
          autocomplete="off"
        >
        </el-input>
      </el-formItem>
      <el-formItem label="密码" label-width="60px">
        <el-input
          type="password"
          placeholder="密码"
          v-model="state.params.password"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="昵称"
        label-width="60px"
      >
        <el-input
          v-model="state.params.name"
          placeholder="用户名或昵称"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="手机"
        label-width="60px"
      >
        <el-input
          v-model="state.params.phone"
          placeholder="手机号"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="简介"
        label-width="60px"
      >
        <el-input
          v-model="state.params.introduce"
          placeholder="个人简介"
          autocomplete="off"
        ></el-input>
      </el-formItem>
    </el-form>
    <template v-slot:footer class="dialog-footer">
      <el-button
        v-if="handleFlag === 'login'"
        :loading="state.btnLoading"
        type="primary"
        @click="handleOk"
        >登 录
      </el-button>
      <el-button
        v-if="handleFlag === 'register'"
        :loading="state.btnLoading"
        type="primary"
        @click="handleOk"
        >注 册
      </el-button>
    </template>
  </el-dialog>
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
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
// import { key } from "../store";
import { RegAndLogParams, UserInfo } from "../types/index";
import service from "../utils/https";
import urls from "../utils/urls";

export default defineComponent({
  name: "RegisterAndLogin",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    handleFlag: {
      type: String,
      default: false,
    },
  },
  emits: ["ok", "cancel"],
  setup(props, context) {
    // const store = useStore(key);
    const router = useRouter();
    const state = reactive({
      dialogDodel: props.visible,
      btnLoading: false,
      loading: false,
      params: {
        email: "",
        name: "",
        password: "",
        phone: "",
        introduce: "",
      } as RegAndLogParams,
    });

    const submit = async (): Promise<void> => {
      let data: any = "";
      state.btnLoading = true;
      if (props.handleFlag === "register") {
        data = await service.post(urls.register, state.params);
      } else {
        // console.log(state.params)
        data = await service.post(urls.login, state.params);
      }
      // console.log(data)
      state.btnLoading = false;

      const userInfo: UserInfo = {
        _id: data._id,
        name: data.name,
        avatar: data.avatar,
      };
      // store.commit("SAVE_USER", {
      //   userInfo,
      // });
      window.sessionStorage.userInfo = JSON.stringify(userInfo);
      context.emit("ok", false);
      ElMessage({
        message: "登录成功",
        type: "success",
      });
      router.push({ path: "/" });
    };

    const handleOk = (): void => {
      const reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      ); //邮箱检验正则表达式
      if (!state.params.email) {
        ElMessage({
          message: "邮箱不能为空！",
          type: "warning",
        });
        return;
      } else if (!reg.test(state.params.email)) {
        ElMessage({
          message: "请输入格式正确的邮箱！",
          type: "warning",
        });
        return;
      }
      if (props.handleFlag === "register") {
        if (!state.params.password) {
          ElMessage({
            message: "密码不能为空！",
            type: "warning",
          });
          return;
        } else if (!state.params.name) {
          ElMessage({
            message: "用户名不能为空！",
            type: "warning",
          });
          return;
        }
        const re =
          /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (state.params.phone && !re.test(state.params.phone)) {
          ElMessage({
            message: "请输入正确的手机号!",
            type: "warning",
          });
          return;
        }
      }
      submit();
    };

    const cancel = (): boolean => {
      context.emit("cancel", false);
      return false;
    };

    watch(props, (val, oldVal) => {
      state.dialogDodel = val.visible;
    });

    return {
      state,
      handleOk,
      submit,
      cancel,
    };
  },
});
</script>
<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
<style>
.el-dialog {
  background-color: white;
}
</style>