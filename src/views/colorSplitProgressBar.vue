<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-07 10:41:37
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-16 18:03:51
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
        :duration="1000"
        :is-split="true"
        :split-config="{
          splitFields: 'speed',
          inRangeColor: 'blue',
          outRangeColor: 'red',
          outRangeBacColor: 'rgba(255,0,0,0.3)',
          inRangeBacColor: 'rgba(0,0,255,0.3)',
        }"
        :speed-config="{
          speed: splitTrackSpeed,
          uppperSpeed: uppperSpeed,
          nextSpeed: prevSpeed,
        }"
      ></ColorSplitProcessBar>
    </Example>
  </div>
</template>
<script setup lang="ts">
import { splitProgressData } from "@/assets/data";
import ColorSplitProcessBar from "@packages/colorSplitProgressBar/index.vue";
import Example from "@common/example.vue";
import { ref, computed } from "vue";
const ColorSplitProcessBarRef = ref();
const handlePlay = () => {
  console.log(ColorSplitProcessBarRef.value.getCurrentIndex());
};
const splitTrackSpeed = ref(null);
const uppperSpeed = ref(0);
const prevSpeed = computed(() => {
  if (splitTrackSpeed != null) {
    return Number((Number(splitTrackSpeed.value) - 0.5).toFixed(2));
  } else {
    return -0.5;
  }
});
const nextSpeed = computed(() => {
  if (splitTrackSpeed != null) {
    return Number((Number(splitTrackSpeed.value) + 0.5).toFixed(2));
  } else {
    return 0.5;
  }
});
const skipProgress = (event: MouseEvent)  => {

}
</script>
<style scoped lang="less">
#colorSplitProcessBar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
}
</style>
