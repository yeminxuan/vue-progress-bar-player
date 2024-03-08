<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 19:06:46
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-08 10:58:52
 * @FilePath: /vue3-process-bar-player/src/packages/colorSplitProgressBar/index.vue
 * @Description: 
-->
<template>
  <div class="color-split-progress-bar">
    <div class="controlBtn" @click="play(isPlay)">
      <i class="iconfont icon-bofang" v-if="!isPlay"></i>
      <i class="iconfont icon-zanting" v-if="isPlay"></i>
    </div>
    <div
      class="color-split-progress-bar-bac"
      @mousedown.stop="changeSlider($event)"
    >
      <div
        :class="{
          play: isPlay == true,
          pause: isPlay == false,
          refresh: refreshClick == false,
        }"
        class="color-split-progress-bar-fill"
        :style="{ width: procentage + '%' }"
      ></div>
    </div>
    <div class="refresh" @click="refresh">
      <i class="iconfont icon-zhongzhi"></i>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
interface Props {
  data: any;
  duration: number;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "skipProgress", event: any): void;
  (e: "handlePlay"): void;
}>();
const getCurrentIndex = () => {
  return Math.floor(props.data.length * (procentage.value / 100));
};
defineExpose({
  getCurrentIndex,
});
const procentage = ref(0);
const isPlay = ref(false);
const timer = ref(null) as any;
const refreshClick = ref(false);
const play = (status: boolean) => {
  refreshClick.value = true;
  isPlay.value = !status;
  if (isPlay.value) {
    if (procentage.value == 100) {
      refreshClick.value = false;
      procentage.value = 0;
      setTimeout(() => {
        refreshClick.value = true;
      }, 50);
    }
    timer.value = setInterval(() => {
      emits("handlePlay");
      procentage.value += 100 / props.data.length;
      if (procentage.value >= 100) {
        procentage.value = 100;
        clearInterval(timer.value);
        timer.value = null;
        isPlay.value = false;
      }
    }, 50);
  } else {
    clearInterval(timer.value);
    timer.value = null;
    isPlay.value = false;
  }
};
const refresh = () => {
  refreshClick.value = false;
  clearInterval(timer.value);
  timer.value = null;
  procentage.value = 0;
  isPlay.value = false;
};
const changeSlider = (e: Event) => {
  emits("skipProgress", e);
};
</script>
<style scoped lang="less">
@import "@assets/style/iconfont.css";
.color-split-progress-bar {
  width: 100%;
  height: 30px;
  display: flex;
  .controlBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dcdfe6;
    height: 28px;
    width: 30px;
    cursor: pointer;
    i {
      color: #000;
    }
  }
  .color-split-progress-bar-bac {
    flex: 1;
    background-color: #ccc;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    .play {
      transition: width 0.2s linear;
    }
    .pause {
      animation-play-state: paused;
    }
    .color-split-progress-bar-fill {
      height: 100%;
      background-color: #409eff;
      border-radius: 5px;
      transition: width 0.2s linear;
      border: none;
    }
    .refresh {
      transition: none;
    }
  }
  .refresh {
    border: 1px solid #dcdfe6;
    height: 28px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
