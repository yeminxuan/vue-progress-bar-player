<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 19:06:46
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-13 19:33:07
 * @FilePath: /vue3-process-bar-player/src/packages/colorSplitProgressBar/index.vue
 * @Description: 
-->
<template>
  <div
    class="color-split-progress-bar"
  >
    <div
      class="controlBtn"
      @click="play(isPlay)"
    >
      <i
        v-if="!isPlay"
        class="iconfont icon-bofang"
      />
      <i
        v-if="isPlay"
        class="iconfont icon-zanting"
      />
    </div>
    <div
      class="color-split-progress-bar-bac"
      :style="{
        background: isSplit ? `url(${bacSvgUrl})` : '#ccc',
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
          background: isSplit ? 'none' : '#409eff',
        }"
      >
        <img
          v-if="isSplit"
          :src="splitSvgUrl"
          alt=""
          width="100%"
          height="30"
        >
      </div>
    </div>
    <div
      class="refresh"
      @click="refresh"
    >
      <i class="iconfont icon-zhongzhi" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watchEffect } from "vue";
import type { Ref } from "vue";
interface SplitConfig {
  splitFields: string;
  inRangeColor: string;
  outRangeColor: string;
  position?: {
    x?: number;
    y?: number;
  };
  outRangeBacColor: string;
  inRangeBacColor: string;
}
interface SpeedConfig {
  speed: number | null;
  uppperSpeed: number;
  nextSpeed: number;
}
interface Props {
  data: any;
  duration: number;
  isSplit?: boolean;
  splitConfig?: SplitConfig;
  speedConfig?: SpeedConfig;
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  duration: 50,
  isSplit: false,
  splitConfig: () => ({
    splitFields: "",
    inRangeColor: "",
    outRangeColor: "",
    outRangeBacColor: "",
    inRangeBacColor: "",
    position: {
      x: 0,
      y: 0,
    },
  }),
});
const emits = defineEmits<{
  (e: 'refresh'):void;
  (e: 'play'):void;
  (e: "skipProgress", event: any): void;
  (e: "handlePlay"): void;
}>();
const width = ref(0);
const widthValues: Ref<any[]> = ref([]);
const computedWidth = () => {
  widthValues.value = Array.from({ length: props.data.length }, (_, i) => {
    const dom = document.getElementsByClassName("color-split-progress-bar-bac");
    return {
      procentage: ((i + 1) * 100) / props.data.length,
      index: i,
      width: dom[0].clientWidth * ((i + 1) / props.data.length),
    };
  });
};
const getCurrentIndex = () => {
  return Math.floor(props.data.length * (procentage.value / 100));
};
defineExpose({
  getCurrentIndex,
  widthValues,
  width
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
      procentage.value = 100;
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
  emits('refresh');
  refreshClick.value = false;
  clearInterval(progressTimer.value);
  progressTimer.value = null;
  procentage.value = 0;
  dataIndex.value = -1;
  isPlay.value = false;
};
const changeSlider = (e: MouseEvent) => {
  computedOffsetX(e);
    
  document.onmousemove = (event) => {
    computedOffsetX(event);
   
  };
  document.onmouseup = (event) => {
    
    computedOffsetX(event);
    document.onmousemove = null;
    document.onmouseup = null;

  };
  

  
};
const computedOffsetX = (event:MouseEvent) => {
  let closest = { percentage: -1, index: -1 };
  let offsetX = event.pageX- document.getElementsByClassName("color-split-progress-bar-bac")[0].getBoundingClientRect().x;
  let currentProcentage = (offsetX / width.value) * 100;
  widthValues.value.forEach((item:any,index:number) => {
    if(item.procentage <= currentProcentage) {
      let distance = Math.abs(item.procentage - currentProcentage);
      if (distance < Math.abs(closest.percentage - currentProcentage) || closest.percentage < 0) {
        closest = { percentage: item.procentage, index: index };
      }
    }
  });
  console.log(closest);
    
  dataIndex.value = closest.index;
  procentage.value = closest.percentage;
  refreshClick.value = false;
  clearInterval(progressTimer.value);
  progressTimer.value = null;
  isPlay.value = false;
};
const addRange = (
  result: any,
  currentArray: any,
  svg: any,
  bacSvg: any,
  bacColor: string,
  splitColor: string
) => {
  /**
   * @Description: Adds a rectangle for the corresponding interval
   * @param {any} result Results for all intervals
   * @param {any} currentArray  Current interval data
   * @param {SVGAElement} svg fill svg
   * @param {SVGAElement} bacSvg svg background
   * @param {string} bacColor <rect> background-color
   * @param {string} splitColor <rect> fill color
   */
  const ns = "http://www.w3.org/2000/svg";
  let width = 0;
  let currentWidth = widthValues.value.find(
    (item) => item.index == currentArray[currentArray.length - 1].dataIndex
  ).width;
  let x = 0;
  let prevLastWidth = 0;
  if (result.length == 1) {
    x = 0;
    width = currentWidth;
  } else {
    prevLastWidth = widthValues.value.find(
      (item) =>
        item.index ==
        result[result.length - 2][result[result.length - 2].length - 1]
          .dataIndex
    ).width;

    x = prevLastWidth;
    width = currentWidth - prevLastWidth;
  }
  const rect = document.createElementNS(ns, "rect");
  rect.setAttribute("x", `${x}`);
  rect.setAttribute("width", `${width}`);
  rect.setAttribute("height", "30");
  rect.setAttribute("fill", bacColor);
  rect.setAttribute("stroke", "none");
  const fillRect = document.createElementNS(ns, "rect");
  fillRect.setAttribute("x", `${x}`);
  fillRect.setAttribute("width", `${width}`);
  fillRect.setAttribute("height", "30");
  fillRect.setAttribute("fill", splitColor);
  fillRect.setAttribute("stroke", "none");
  svg.appendChild(fillRect);
  bacSvg.appendChild(rect);
};
const splitTrackSpeed = 0.5;
const splitSvgUrl = ref("");
const bacSvgUrl = ref("");
const splitFun = () => {
  let result: any = [];
  let currentArray: any = [];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const bacSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  bacSvg.setAttribute("width", "100%");
  bacSvg.setAttribute("height", "30px");
  for (let i = 0; i < props.data.length; i++) {
    currentArray.push({ ...props.data[i], dataIndex: i });
    /* when the loop reaches the last element */
    if (i == props.data.length - 1) {
      if (
        props.data[i][props.splitConfig.splitFields] >
        splitTrackSpeed + 0.5
      ) {
        result.push(currentArray);
        addRange(
          result,
          currentArray,
          svg,
          bacSvg,
          props.splitConfig.outRangeBacColor,
          props.splitConfig.outRangeColor
        );
        currentArray = [];
      } else if (
        props.data[i][props.splitConfig.splitFields] < splitTrackSpeed
      ) {
        result.push(currentArray);
        addRange(
          result,
          currentArray,
          svg,
          bacSvg,
          props.splitConfig.outRangeBacColor,
          props.splitConfig.outRangeColor
        );
        currentArray = [];
      } else if (
        props.data[i][props.splitConfig.splitFields] >= splitTrackSpeed &&
        props.data[i][props.splitConfig.splitFields] <= splitTrackSpeed + 0.5
      ) {
        result.push(currentArray);
        addRange(
          result,
          currentArray,
          svg,
          bacSvg,
          props.splitConfig.inRangeBacColor,
          props.splitConfig.inRangeColor
        );
        currentArray = [];
      }
      continue;
    }

    /* Compare the previous number to determine the interval
     * Add The default value is 0.5
     */
    // If the previous number is in the [0.5,1] interval and the current number is greater than 1
    if (
      i > 0 &&
      props.data[i][props.splitConfig.splitFields] >= splitTrackSpeed &&
      props.data[i][props.splitConfig.splitFields] <= splitTrackSpeed + 0.5 &&
      props.data[i + 1][props.splitConfig.splitFields] > splitTrackSpeed + 0.5
    ) {
      result.push(currentArray);
      addRange(
        result,
        currentArray,
        svg,
        bacSvg,
        props.splitConfig.inRangeBacColor,
        props.splitConfig.inRangeColor
      );
      currentArray = [];
    } else if (
      //If previous number is greater than [0.5,1] interval, and the current number is in interval
      i > 0 &&
      props.data[i][props.splitConfig.splitFields] > splitTrackSpeed + 0.5 &&
      props.data[i + 1][props.splitConfig.splitFields] >= splitTrackSpeed &&
      props.data[i + 1][props.splitConfig.splitFields] <= splitTrackSpeed + 0.5
    ) {
      result.push(currentArray);
      addRange(
        result,
        currentArray,
        svg,
        bacSvg,
        props.splitConfig.outRangeBacColor,
        props.splitConfig.outRangeColor
      );
      currentArray = [];
    } else if (
      //If previous number is in the [0.5,1] interval and the new number is less than 0.5
      i > 0 &&
      props.data[i][props.splitConfig.splitFields] >= splitTrackSpeed &&
      props.data[i][props.splitConfig.splitFields] <= splitTrackSpeed + 0.5 &&
      props.data[i + 1][props.splitConfig.splitFields] < splitTrackSpeed
    ) {
      result.push(currentArray);
      addRange(
        result,
        currentArray,
        svg,
        bacSvg,
        props.splitConfig.inRangeBacColor,
        props.splitConfig.inRangeColor
      );
      currentArray = [];
    } else if (
      //If previous number is less than the [0.5,1] interval and the new number is in [0.5,1] interval
      i > 0 &&
      props.data[i + 1][props.splitConfig.splitFields] >= splitTrackSpeed &&
      props.data[i + 1][props.splitConfig.splitFields] <=
        splitTrackSpeed + 0.5 &&
      props.data[i][props.splitConfig.splitFields] < splitTrackSpeed
    ) {
      result.push(currentArray);
      addRange(
        result,
        currentArray,
        svg,
        bacSvg,
        props.splitConfig.outRangeBacColor,
        props.splitConfig.outRangeColor
      );
      currentArray = [];
    } else if (
      //If previous number is greater than the [0.5,1] interval and the new number is less than the [0.5,1] interval
      i > 0 &&
      props.data[i][props.splitConfig.splitFields] > splitTrackSpeed + 0.5 &&
      props.data[i + 1][props.splitConfig.splitFields] < splitTrackSpeed
    ) {
      result.push(currentArray);
      addRange(
        result,
        currentArray,
        svg,
        bacSvg,
        props.splitConfig.outRangeBacColor,
        props.splitConfig.outRangeColor
      );

      currentArray = [];
    } else if (
      //If previous number is less than the [0.5,1] interval and the new number is greater than the [0.5,1] interval
      i > 0 &&
      props.data[i + 1][props.splitConfig.splitFields] >
        splitTrackSpeed + 0.5 &&
      props.data[i][props.splitConfig.splitFields] < splitTrackSpeed
    ) {
      result.push(currentArray);
      addRange(
        result,
        currentArray,
        svg,
        bacSvg,
        props.splitConfig.outRangeBacColor,
        props.splitConfig.outRangeColor
      );
      currentArray = [];
    }
  }
  // Convert SVG elements to XML strings
  const newBacSvg = new XMLSerializer().serializeToString(bacSvg);
  const newFillSvg = new XMLSerializer().serializeToString(svg);
  //url encoding of xml strings => decode the URL-encoded string => convert to base64
  const bacSvgHref =
    "data:image/svg+xml;base64," +
    window.btoa(decodeURIComponent(encodeURIComponent(newBacSvg)));
  const newFillSvgHref =
    "data:image/svg+xml;base64," +
    window.btoa(decodeURIComponent(encodeURIComponent(newFillSvg)));
  bacSvgUrl.value = bacSvgHref;
  splitSvgUrl.value = newFillSvgHref;
};
onMounted(() => {
  nextTick(() => {
    const dom = document.getElementsByClassName("color-split-progress-bar-bac");
    width.value = dom[0].clientWidth; 
  });
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
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
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
      user-select: none;
      pointer-events: none;
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
