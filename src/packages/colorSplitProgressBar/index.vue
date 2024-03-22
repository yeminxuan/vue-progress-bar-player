<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 19:06:46
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @FilePath: /vue3-process-bar-player/src/packages/colorSplitProgressBar/index.vue
 * @Description: 
-->
<template>
  <div class="color-split-progress-bar">
    <div class="controlBtn">
      <i
        v-if="!isPlay && procentage < 100"
        class="iconfont icon-bofang"
        @click="play"
      />
      <i
        v-if="isPlay"
        class="iconfont icon-zanting"
        @click="pause"
      />
      <i
        v-if="!refreshClick && procentage == 100"
        class="iconfont icon-zhongzhi"
        @click="refresh"
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
          refresh: refreshClick == false,
        }"
        class="color-split-progress-bar-fill"
        :style="{
          width: procentage + '%',
          background: isSplit ? 'none' : '#409eff',
          transition: isPlay
            ? `width ${
              remainingTime == -1 ? duration / 1000 : remainingTime / 1000
            }s  linear`
            : ``,
        }"
      >
        <img
          v-if="isSplit"
          :src="splitSvgUrl"
          alt=""
          width="100%"
          height="100%"
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
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
  (e: "refresh"): void;
  (e: "play"): void;
  (e: "skipProgress", index: number, item: any): void;
  (e: "handlePlay", index: number): void;
}>();
let stagedIndex = ref(0);
const width = ref(0);
const widthValues: Ref<any[]> = ref([]);
const computedWidth = () => {
  let arr: any = [];
  for (let i = 0; i < props.data.length; i++) {
    const dom = document.getElementsByClassName("color-split-progress-bar-bac");
    let obj = {
      procentage: (i * 100) / (props.data.length - 1),
      index: i,
      width: (dom[0].clientWidth * i) / (props.data.length - 1),
    };
    arr.push(obj);
  }
  widthValues.value = arr;
  console.log(arr);
};
const getCurrentIndex = () => {
  return widthValues.value.find((item) => item.procentage == procentage.value)
    .index;
};
defineExpose({
  getCurrentIndex,
  widthValues,
  width,
});
//Percentage of progress bar
const procentage = ref(0);
//Whether the player is playing
const isPlay = ref(false);
// The width of the progress already filled
const fillWidth = ref(0);
const progressTimer = ref(null) as any;
const refreshClick = ref(false);
const dataIndex = ref(0);
const remainingTime = ref(-1);
const updateProgress = () => {
  requestAnimationFrame(() => {
    if (dataIndex.value < props.data.length - 1) {
      //set target width
      const targetWidth = widthValues.value[dataIndex.value + 1].procentage;
      procentage.value = targetWidth;
      dataIndex.value++;
      if (targetWidth >= 100) {
        // If the progress bar ends playing
        procentage.value = 100;
        clearInterval(progressTimer.value);
        progressTimer.value = null;
        setTimeout(() => {
          isPlay.value = false;
          refreshClick.value = false;
        }, props.duration);
      }
    } else {
      return;
    }
  });
};
const play = () => {
  isPlay.value = true;
  let targetWidth = widthValues.value[dataIndex.value + 1].procentage;
  //Change the progress bar percentage
  procentage.value = targetWidth;
  dataIndex.value++;
  refreshClick.value = true;
  if (procentage.value == 100) {
    refreshClick.value = false;
  }
  if (remainingTime.value == -1) {
    clearInterval(progressTimer.value);
    progressTimer.value = null;
    progressTimer.value = setInterval(updateProgress, props.duration);
  } else {
    setTimeout(() => {
      const targetWidth = widthValues.value[dataIndex.value + 1].procentage;
      procentage.value = targetWidth;
      dataIndex.value++;
      remainingTime.value = -1;
      clearInterval(progressTimer.value);
      progressTimer.value = null;
      progressTimer.value = setInterval(updateProgress, props.duration);
    }, remainingTime.value);
  }
};
const pause = () => {
  fillWidth.value = document.getElementsByClassName(
    "color-split-progress-bar-fill"
  )[0].clientWidth;
  computedPauseOffsetX();
  clearInterval(progressTimer.value);
  progressTimer.value = null;
  isPlay.value = false;
  stagedIndex.value = dataIndex.value;
};
const refresh = () => {
  emits("refresh");
  clearInterval(progressTimer.value);
  progressTimer.value = null;
  procentage.value = 0;
  dataIndex.value = 0;
  isPlay.value = false;
  stagedIndex.value = 0;
  remainingTime.value = -1;
  //replay in 100 milliseconds later
  setTimeout(() => {
    play();
  }, 100);
};
const changeSlider = (e: MouseEvent) => {
  computedOffsetX(e);

  document.onmousemove = (event) => {
    computedOffsetX(event);

    emits("skipProgress", dataIndex.value, props.data[dataIndex.value]);
  };
  document.onmouseup = (event) => {
    computedOffsetX(event);
    fillWidth.value = document.getElementsByClassName(
      "color-split-progress-bar-fill"
    )[0].clientWidth;
    computedPauseOffsetX();
    document.onmousemove = null;
    document.onmouseup = null;
  };
};
const computedOffsetX = (event: MouseEvent) => {
  let closest = { percentage: -1, index: 0 };
  let offsetX =
    event.pageX -
    document
      .getElementsByClassName("color-split-progress-bar-bac")[0]
      .getBoundingClientRect().x;
  let currentProcentage = (offsetX / width.value) * 100;
  widthValues.value.forEach((item: any, index: number) => {
    if (item.procentage <= currentProcentage) {
      let distance = Math.abs(item.procentage - currentProcentage);
      if (
        distance < Math.abs(closest.percentage - currentProcentage) ||
        closest.percentage < 0
      ) {
        closest = { percentage: item.procentage, index: index };
      }
    }
  });
  dataIndex.value = closest.index;
  procentage.value = currentProcentage;
  refreshClick.value = false;
  clearInterval(progressTimer.value);
  progressTimer.value = null;
  isPlay.value = false;
};
const computedPauseOffsetX = () => {
  /**
   * @Description: Calculates the actual dataIndex and progress bar percentage at pause
   */
  let closest = { percentage: -1, index: 0 };
  let offsetX = fillWidth.value;
  let currentProcentage = (offsetX / width.value) * 100;
  widthValues.value.forEach((item: any, index: number) => {
    if (item.procentage <= currentProcentage) {
      let distance = Math.abs(item.procentage - currentProcentage);
      if (
        distance < Math.abs(closest.percentage - currentProcentage) ||
        closest.percentage < 0
      ) {
        closest = { percentage: item.procentage, index: index };
      }
    }
  });
  dataIndex.value = closest.index;
  stagedIndex.value = closest.index;
  procentage.value = currentProcentage;
  let IncompleteProgress =
    widthValues.value[dataIndex.value + 1].procentage - procentage.value;
  //Calculate the distance moved per millisecond
  let avgDistance =
    (widthValues.value[dataIndex.value + 1].procentage -
      widthValues.value[dataIndex.value].procentage) /
    props.duration;
  // Remaining time (milliseconds)
  remainingTime.value = IncompleteProgress / avgDistance;
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
    if (i != 0) {
      currentArray.push({ ...props.data[i], dataIndex: i });
    }
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
      break;
    }

    /* Compare the previous number to determine the interval
     * Add The default value is 0.5
     */
    // If the previous number is in the [0.5,1] interval and the current number is greater than 1
    if (
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
const stagedIndexTimer = ref(null) as any;
const executeAfterApproximatelyOneSecond = (
  callback: any,
  remainTime?: number
) => {
  /**
   * @Description: System time compensation setTimeout method
   * Because the setTimeout event is not accurate, it must be compensated according to the system time
   * @param {any} callback
   */

  const startTime = performance.now();
  // Use setTimeout to delay execution
  if (remainTime != undefined) {
    stagedIndexTimer.value = setTimeout(() => {
      const elapsedTime = performance.now() - startTime;
      // Call the callback function and compensate for possible delays
      callback(elapsedTime - remainTime);
    }, remainTime);
  } else {
    stagedIndexTimer.value = setTimeout(() => {
      const elapsedTime = performance.now() - startTime;
      // Call the callback function and compensate for possible delays
      callback(elapsedTime - props.duration);
    }, props.duration);
  }
};
//Listen for the current percentage progress and return the index of the current point when the target implementation animation is complete
watch(
  () => [procentage.value, isPlay.value, remainingTime.value],
  (n, o: any) => {
    if (n[2] != -1) {
      clearTimeout(stagedIndexTimer.value);
      stagedIndexTimer.value = null;
      executeAfterApproximatelyOneSecond(() => {
        if (
          procentage.value >=
          widthValues.value[stagedIndex.value + 1].procentage
        ) {
          // console.log("Suspend subsequent play");
          stagedIndex.value++;
          emits("handlePlay", stagedIndex.value);
        }
      }, n[2]);
    } else {
      if (n[0] != o[0] && n[1] == true) {
        //Call the setTimeout method for system time compensation
        executeAfterApproximatelyOneSecond(() => {
          if (
            procentage.value >=
            widthValues.value[stagedIndex.value + 1].procentage
          ) {
            // console.log("Normal playback");
            stagedIndex.value++;
            emits("handlePlay", stagedIndex.value);
          }
        });
      }
    }
  }
);
onMounted(() => {
  nextTick(() => {
    const dom = document.getElementsByClassName("color-split-progress-bar-bac");
    width.value = dom[0].clientWidth;
  });
  computedWidth();
  splitFun();
  window.addEventListener("resize", () => {
    nextTick(() => {
      const dom = document.getElementsByClassName(
        "color-split-progress-bar-bac"
      );
      width.value = dom[0].clientWidth;
    });
    computedWidth();
    splitFun();
  });
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
    .color-split-progress-bar-fill {
      height: 100%;
      border-radius: 5px;
      will-change: transition;
      border: none;
      user-select: none;
      pointer-events: none;
    }
    .refresh {
      transition: width 0s linear;
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
