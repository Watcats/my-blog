<template>
  <router-view></router-view>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "About",
  setup(props, context) {
    const router = useRouter();
    const state = reactive({
      href: "/articleDetail",
      article_id: "62866dec8c94a83eccc0a8b1",
    });

    onMounted(() => {
      router.push(state.href + "?article_id=" + state.article_id);
    });

    return {
      state,
    };
  },
});
</script>
<style scoped>
</style>

