<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 19:06:46
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-08 19:25:48
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
      :style="{
        background: splitBackgroundColor,
      }"
      @mousedown.stop="changeSlider($event)"
    >
      <div
        :class="{
          play: isPlay == true,
          pause: isPlay == false,
          refresh: refreshClick == false,
        }"
        class="color-split-progress-bar-fill"
        :style="{
          width: procentage + '%',
          background: isSplit && fillColor ? fillColor : '#409eff',
        }"
      >
        <svg width="100%" height="30" v-if="isSplit">
          <rect x="0" y="0" width="180" height="30" fill="red" />
          <rect x="180" y="0" width="180" height="30" fill="blue" />
        </svg>
      </div>
    </div>
    <div class="refresh" @click="refresh">
      <i class="iconfont icon-zhongzhi"></i>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import type { Ref } from "vue";
interface SplitConfig {
  splitFields: string;
  inRangeColor?: string;
  outRangeColor?: string;
  position?: {
    x?: number;
    y?: number;
  };
  outRangeBacColor: string;
  inRangeBacColor: string;
}
interface Props {
  data: any;
  duration: number;
  fillColor?: string;
  isSplit?: boolean;
  splitConfig?: SplitConfig;
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  duration: 50,
  fillColor: "none",
  isSplit: false,
  splitConfig: () => ({
    splitFields: "",
    inRangeColor: "red",
    outRangeColor: "green",
    outRangeBacColor: "rgba(255,255,0,0.2)",
    inRangeBacColor: "rgba(0,0,255,0.2)",
    position: {
      x: 0,
      y: 0,
    },
  }),
});
const emits = defineEmits<{
  (e: "skipProgress", event: any): void;
  (e: "handlePlay"): void;
}>();
const widthValues: Ref<any[]> = ref([]);
const splitArray = ref([]);
const formatSplitArray = () => {};
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
      procentage.value - 0;
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
const splitTrackSpeed = 0.5;
const splitBackgroundColor = ref("linear-gradient(to right,");
const splitFun = () => {
  let result: any = [];
  let currentArray: any = [];
  // const colorArray:any = [{color:'red',percent: widthValues.value.find((item) => item.index == currentArray[currentArray.length - 1].dataIndex).procentage}]
  for (let i = 0; i < props.data.length; i++) {
    currentArray.push({ ...props.data[i], dataIndex: i });
    /* 处理边界情况 */
    if (i == props.data.length - 1) {
      if (
        props.data[i][props.splitConfig.splitFields] >
        splitTrackSpeed + 0.5
      ) {
        splitBackgroundColor.value += `${props.splitConfig.outRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index == currentArray[currentArray.length - 1].dataIndex
          ).procentage
        }%)`;
        result.push(currentArray);
        currentArray = [];
      } else if (
        props.data[i][props.splitConfig.splitFields] < splitTrackSpeed
      ) {
        splitBackgroundColor.value += `${props.splitConfig.outRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index == currentArray[currentArray.length - 1].dataIndex
          ).procentage
        }%)`;
        result.push(currentArray);
        currentArray = [];
      } else if (
        props.data[i][props.splitConfig.splitFields] >= splitTrackSpeed &&
        props.data[i][props.splitConfig.splitFields] <= splitTrackSpeed + 0.5
      ) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index == currentArray[currentArray.length - 1].dataIndex
          ).procentage
        }%)`;
        // console.log(widthValues.value.find((item) => item.index == currentArray[currentArray.length - 1].dataIndex).procentage,props.splitConfig.inRangeColor);
        result.push(currentArray);
        currentArray = [];
      }
      break;
    } // 如果是最后一个元素，跳出循环
    /* 比较上一个数判断区间 */
    //如果上一个数在[0.5,1]区间内，且新数大于 1
    if (
      i > 0 &&
      props.data[i][props.splitConfig.splitFields] >= splitTrackSpeed &&
      props.data[i][props.splitConfig.splitFields] <= splitTrackSpeed + 0.5 &&
      props.data[i + 1][props.splitConfig.splitFields] > splitTrackSpeed + 0.5
    ) {
      result.push(currentArray);
      /* 设置背景色 */
      if (result.length == 1) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,`;
      } else if (result.length > 1) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 2][result[result.length - 2].length - 1]
                .dataIndex
          ).procentage
        }%,
        ${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,
        `;
      }
      //置空当前数组
      currentArray = [];
    } else if (
      //如果上一个数大于[0.5,1]区间，且新数在区间内
      i > 0 &&
      props.data[i][props.splitConfig.splitFields] > splitTrackSpeed + 0.5 &&
      props.data[i + 1][props.splitConfig.splitFields] >= splitTrackSpeed &&
      props.data[i + 1][props.splitConfig.splitFields] <= splitTrackSpeed + 0.5
    ) {
      result.push(currentArray);
      /* 设置背景色 */
      if (result.length == 1) {
        splitBackgroundColor.value += `${props.splitConfig.outRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,`;
      } else if (result.length > 1) {
        splitBackgroundColor.value += `${props.splitConfig.outRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 2][result[result.length - 2].length - 1]
                .dataIndex
          ).procentage
        }%,
        ${props.splitConfig.outRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,
        `;
      }
      currentArray = [];
    } else if (
      //如果上一个数在[0.5,1]区间内,且新数小于0.5
      i > 0 &&
      props.data[i][props.splitConfig.splitFields] >= splitTrackSpeed &&
      props.data[i][props.splitConfig.splitFields] <= splitTrackSpeed + 0.5 &&
      props.data[i + 1][props.splitConfig.splitFields] < splitTrackSpeed
    ) {
      result.push(currentArray);
      /* 设置背景色 */
      if (result.length == 1) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,`;
      } else if (result.length > 1) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 2][result[result.length - 2].length - 1]
                .dataIndex
          ).procentage
        }%,
        ${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,
        `;
      }
      currentArray = [];
    } else if (
      //如果上一个数小于0.5,且新数在区间内
      i > 0 &&
      props.data[i + 1][props.splitConfig.splitFields] >= splitTrackSpeed &&
      props.data[i + 1][props.splitConfig.splitFields] <=
        splitTrackSpeed + 0.5 &&
      props.data[i][props.splitConfig.splitFields] < splitTrackSpeed
    ) {
      result.push(currentArray);
      /* 设置背景色 */
      if (result.length == 1) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,`;
      } else if (result.length > 1) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 2][result[result.length - 2].length - 1]
                .dataIndex
          ).procentage
        }%,
        ${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,
        `;
      }

      currentArray = [];
    } else if (
      //如果上一个数大于区间。且新数小于区间
      i > 0 &&
      props.data[i][props.splitConfig.splitFields] > splitTrackSpeed + 0.5 &&
      props.data[i + 1][props.splitConfig.splitFields] < splitTrackSpeed
    ) {
      result.push(currentArray);
      /* 设置背景色 */
      if (result.length == 1) {
        splitBackgroundColor.value += `${props.splitConfig.outRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,`;
      } else if (result.length > 1) {
        splitBackgroundColor.value += `${props.splitConfig.outRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 2][result[result.length - 2].length - 1]
                .dataIndex
          ).procentage
        }%,
        ${props.splitConfig.outRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,
        `;
      }
      currentArray = [];
    } else if (
      //如果上一个数小于区间，且新数大于区间
      i > 0 &&
      props.data[i + 1][props.splitConfig.splitFields] >
        splitTrackSpeed + 0.5 &&
      props.data[i][props.splitConfig.splitFields] < splitTrackSpeed
    ) {
      result.push(currentArray);
      /* 设置背景色 */
      if (result.length == 1) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,`;
      } else if (result.length > 1) {
        splitBackgroundColor.value += `${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 2][result[result.length - 2].length - 1]
                .dataIndex
          ).procentage
        }%,
        ${props.splitConfig.inRangeBacColor} ${
          widthValues.value.find(
            (item) =>
              item.index ==
              result[result.length - 1][result[result.length - 1].length - 1]
                .dataIndex
          ).procentage
        }%,
        `;
      }
      currentArray = [];
    }
  }
  console.log(result);
  console.log(splitBackgroundColor.value);
};

onMounted(() => {
  computedWidth();
  splitFun();
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
    background: linear-gradient(to right, red 50%, blue 50%, blue 52%, red 52%);
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
