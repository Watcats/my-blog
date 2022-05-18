<template>
  <div class="footer">
    <div>个人博客网站</div>
    <div class="number">
      <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2021018619号</a>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
});
</script>
<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  font-weight: bold;
}
</style>

