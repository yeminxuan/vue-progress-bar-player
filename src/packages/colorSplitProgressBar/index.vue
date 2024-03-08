<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 19:06:46
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-08 12:54:39
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
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
interface Props {
  data: any;
  duration: number;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "skipProgress", event: any): void;
  (e: "handlePlay"): void;
}>();
const widthValues: Ref<any[]> = ref([]);
const computedWidth = () => {
  widthValues.value = Array.from({ length: props.data.length }, (_, i) => {
    return {
      procentage: ((i + 1) * 100) / props.data.length,
      index: i,
    };
  });
};
const getCurrentIndex = () => {
  return Math.floor(props.data.length * (procentage.value / 100));
};
defineExpose({
  getCurrentIndex,
  widthValues,
});
//Percentage of progress bar
const procentage = ref(0);
//Whether the player is playing
const isPlay = ref(false);
const progressTimer = ref(null) as any;
const refreshClick = ref(false);
const dataIndex = ref(0);
const updateProgress = () => {
  if (dataIndex.value < props.data.length) {
    emits("handlePlay");
    // 设置目标宽度
    const targetWidth =
      dataIndex.value == -1 ? 0 : widthValues.value[dataIndex.value].procentage;
    //Change the progress bar percentage
    procentage.value = targetWidth;
    dataIndex.value++;
    if (targetWidth >= 100) {
      // If the progress bar ends playing
      dataIndex.value = 100;
      clearInterval(progressTimer.value);
      progressTimer.value = null;
      isPlay.value = false;
    }
  } else {
    return;
  }
};
const animateProgress = () => {
  requestAnimationFrame(() => {
    updateProgress();
  });
};
const play = (status: boolean) => {
  refreshClick.value = true;
  isPlay.value = !status;
  if (isPlay.value) {
    if (procentage.value == 100) {
      refreshClick.value = false;
      dataIndex.value = -1;
      procentage.value - 0  
      setTimeout(() => {
        refreshClick.value = true;
      }, 50);
    }
    progressTimer.value = setInterval(animateProgress, props.duration);
  } else {
    clearInterval(progressTimer.value);
    progressTimer.value = null;
    isPlay.value = false;
  }
};
const refresh = () => {
  refreshClick.value = false;
  clearInterval(progressTimer.value);
  progressTimer.value = null;
  procentage.value = 0;
  dataIndex.value = -1;
  isPlay.value = false;
};
const changeSlider = (e: Event) => {
  emits("skipProgress", e);
};
onMounted(() => {
  computedWidth();
});
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
      will-change: transition;
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
