<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-07 12:33:54
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-27 13:21:27
 * @FilePath: /vue3-process-bar-player/src/components/common/example.vue
 * @Description: 
-->
<template>
  <div class="example">
    <div class="title">
      <h2>{{ title }}</h2>
    </div>
    <div class="example-box">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  title: string;
}
// @ts-ignore
const props = defineProps<Props>();
</script>
<style scoped lang="less">
.example {
  .title {
    margin: 1rem 0;
  }
  .example-box {
    border-radius: 5px;
    border: 1px solid #dcdfe6;
    padding: 20px;
  }
}
</style>
