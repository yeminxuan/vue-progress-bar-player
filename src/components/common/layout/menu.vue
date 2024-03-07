<template>
  <div id="menu">
    <ul>
      <li v-for="(item,index) in routerList" :key="index"><router-link :to="item.to">{{ item.name_zh }}</router-link></li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const routerList = ref([
  {
    name_zh: '首页',
    to: "/home",
  },
  {
    name_zh: '组件总览',
    to: "/overview",
  },
  {
    name_zh: '颜色切割进度条',
    to: "/colorSplitProgressBar",
  },
]);
</script>
<style scoped lang="less">
#menu {
    width: 300px;
    height: 100%;
}
</style>
