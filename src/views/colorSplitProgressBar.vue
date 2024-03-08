<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-07 10:41:37
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-08 19:16:31
 * @FilePath: /vue3-process-bar-player/src/views/colorSplitProgressBar.vue
 * @Description: 
-->
<template>
  <div class="colorSplitProcessBar">
    <Example title="颜色分割进度条">
      <ColorSplitProcessBar
        v-if="splitProgressData.length > 0"
        ref="ColorSplitProcessBarRef"
        :data="splitProgressData"
        @handle-play="handlePlay"
        :duration="10"
        :is-split="true"
        :split-config="{
          splitFields: 'speed',
          inRangeColor: 'blue',
          outRangeColor: 'red',
          outRangeBacColor: 'red',
          inRangeBacColor: 'blue'
        }"
      ></ColorSplitProcessBar>
    </Example>
  </div>
</template>
<script setup lang="ts">
import { splitProgressData } from "@/assets/data";
import ColorSplitProcessBar from "@packages/colorSplitProgressBar/index.vue";
import Example from "@common/example.vue";
import { ref } from "vue";
const ColorSplitProcessBarRef = ref();
const handlePlay = () => {
  console.log(ColorSplitProcessBarRef.value);
};
</script>
<style scoped lang="less">
#colorSplitProcessBar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
}
</style>
