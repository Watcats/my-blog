<template>
  <div>
    <el-menu :default-active="'/' + activeIndex2" mode="vertical" background-color="#344a5f" text-color="#fff"
      active-text-color="#f56c6c" router unique-opened>
      <el-submenu v-for="item in sideData" :key="item.title" :index="item.title">
        <template slot="title">{{ item.title }}</template>
        <template v-if="item.subItem">
          <el-menu-item v-for="(itemY, index) in item.subItem" :key="index" :index="itemY.routerpath">{{ itemY.name }}
          </el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "LeftNav",
  data() {
    return {
      activeIndex2: "infoIndex",
      sideData: [
        {
          title: "控制台",
          subItem: [
            { routerpath: "/2-1", name: "工作1" },
            { routerpath: "/2-2", name: "工作2" },
            { routerpath: "/2-3", name: "工作3" }
          ]
        },
        {
          title: "信息管理",
          subItem: [
            { routerpath: "/infoIndex", name: "信息列表" },
            { routerpath: "/infoCategory", name: "信息分类" },
            { routerpath: "/infoDetailed", name: "信息详情" }
          ]
        },
        {
          title: "用户管理",
          subItem: [{ routerpath: "/userIndex", name: "用户列表" }]
        }
      ]
    };
  },
  methods: {

  }
};
</script>



<style scoped>
.el-menu {
  border-right: none;
}
</style>