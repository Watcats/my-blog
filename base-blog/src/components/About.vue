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
      type: 2,
    });

    onMounted(() => {
      router.push(state.href + "?type=" + state.type);
    });

    return {
      state,
    };
  },
});
</script>
<style scoped>
</style>

