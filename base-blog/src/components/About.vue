<template>
  <img alt="Vue logo" src="../assets/logo.png" />
  <h1>{{ msg }}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'About',
  data() {
    return {
      msg: 'Hello Vue 3.0 + Vite!'
    }
  },
  // setup() { }
})
</script>
