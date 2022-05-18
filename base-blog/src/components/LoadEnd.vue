<template>
  <div class="load-end">
    <!-- --------- 我也是有底线的啦 --------- -->
    <hr
      style="
        filter: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15);
      "
      width="80%"
      SIZE="1"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoadEnd",
});
</script>
<style scoped>
.load-end {
  text-align: center;
  padding: 30px;
}
</style>

