<template>
  <div class="content">
    <el-container>
      <el-menu  class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">
          <router-link to="/UserInfo">个人信息</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/UserPwd">修改密码</router-link>
        </el-menu-item>
      </el-menu>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "User",
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

