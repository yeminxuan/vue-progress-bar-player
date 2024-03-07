<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 18:55:41
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-07 11:10:59
 * @FilePath: /vue3-process-bar-player/src/components/common/layout/index.vue
 * @Description: 
-->

<template>
  <div class="layoutWrap">
    <Header></Header>
    <div class="content">
      <Menu></Menu>
      <router-view name="main" class="main_content" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from "./header.vue";
import Menu from "./menu.vue";
</script>
<style scoped lang="less">
.layoutWrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .content {
    flex: 1;
    display: flex;
    .main_content {
        flex: 1;
      height: 100%;
      overflow-y: scroll;
    }
  }
}
</style>
