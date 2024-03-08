<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-07 10:41:37
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-08 10:59:10
 * @FilePath: /vue3-process-bar-player/src/views/colorSplitProgressBar.vue
 * @Description: 
-->
<template>
  <div class="colorSplitProcessBar">
    <Example title="颜色分割进度条">
      <ColorSplitProcessBar
        ref="ColorSplitProcessBarRef"
        :data="data"
        @handle-play="handlePlay"
        :duration="50"
      ></ColorSplitProcessBar>
    </Example>
  </div>
</template>
<script setup lang="ts">
import { splitProgressData } from "@/assets/data";
import ColorSplitProcessBar from "@packages/colorSplitProgressBar/index.vue";
import Example from "@common/example.vue";
import { ref, onMounted } from "vue";
const data = ref([]);
const ColorSplitProcessBarRef = ref();
const formatData = () => {
  let arr: any = [];
  splitProgressData.forEach((item: any, index: number) => {
    let obj = {
      dataIndex: index,
      ...item,
    };
    arr.push(obj);
  });
  data.value = arr;
  console.log(arr);
  
};
const handlePlay = () => {
  console.log(ColorSplitProcessBarRef.value.getCurrentIndex());
};
onMounted(() => {
  formatData();
});
</script>
<style scoped lang="less">
#colorSplitProcessBar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
}
</style>
