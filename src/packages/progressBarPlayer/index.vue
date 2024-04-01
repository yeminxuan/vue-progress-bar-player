<template>
  <div class="progress-bar-player">
    <slot
      name="controlBtn"
      :play="!isPlay && procentage < 100"
      :pause="isPlay"
      :refresh="!refreshClick && procentage == 100"
    />
    <div
      ref="progressBarPlayerBacRef"
      class="progress-bar-player-bac"
      :style="{
        background: isSplit ? `url(${bacSvgUrl})` : '#ccc',
      }"
      @mousedown.stop="changeSlider($event)"
    >
      <div
        ref="progressBarPlayerBacFillRef"
        :class="{
          refresh: refreshClick == false,
        }"
        class="progress-bar-player-fill"
        :style="{
          width: procentage + '%',
          background: isSplit ? 'none' : progressFillColor,
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
    <CurrentTip
      v-if="hasRealTimeTipBox"
      ref="currentTipRef"
      :style="{
        transform: currentTipTranslate,
        transition: isPlay
          ? `transform ${
            remainingTime == -1 ? duration / 1000 : remainingTime / 1000
          }s  linear`
          : ``,
      }"
    >
      <slot name="currentTip" />
    </CurrentTip>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch, computed } from "vue";
import type { Ref } from "vue";
import CurrentTip from "@packages/common/currentTip.vue";
import { isNumeric } from "../utils/utils";
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
interface Props {
  data: any;
  duration: number;
  progressFillColor?: string;
  isSplit?: boolean;
  splitConfig?: SplitConfig;
  hasRealTimeTipBox?: boolean;
  splitFieldsInterval?: string;
}
const props = withDefaults(defineProps<Props>(), {
  progressFillColor: "#409eff",
  hasRealTimeTipBox: false,
  data: () => [],
  duration: 1000,
  isSplit: false,
  splitConfig: () => ({
    splitFields: "",
    inRangeColor: "blue",
    outRangeColor: "red",
    outRangeBacColor: "rgba(255,0,0,0.3)",
    inRangeBacColor: "rgba(0,0,255,0.3)",
    position: {
      x: 0,
      y: 0,
    },
  }),
  splitFieldsInterval: "",
});
const emits = defineEmits<{
  (e: "refresh"): void;
  (e: "play"): void;
  (e: "skipProgress", item: any, index: number): void;
  (e: "handlePlay", item: any, index: number): void;
}>();
const splitResult = ref([]);
const height = ref(0);
const progressBarPlayerBacRef = ref();
const progressBarPlayerBacFillRef = ref();
const currentTooltipTranslateX = ref(0);
const currentTooltipTranslateY = ref(0);
const currentTipHalfWidth = ref(0);
const currentTipTranslate = computed(() => {
  return `translateX(${
    currentTooltipTranslateX.value +
    (procentage.value / 100) * width.value -
    currentTipHalfWidth.value
  }px) translateY(${currentTooltipTranslateY.value}px)`;
});
const currentTipRef = ref();
let stagedIndex = ref(0);
const width = ref(0);
const widthValues: Ref<any[]> = ref([]);
const computedWidth = () => {
  let arr: any = [];
  if (props.data.length < 2) {
    throw Error(
      "data.length less than 2,Please pass in data for more than 1 attributes!"
    );
  }
  for (let i = 0; i < props.data.length; i++) {
    const domClientWidth = progressBarPlayerBacRef.value.clientWidth;
    let obj = {
      procentage: (i * 100) / (props.data.length - 1),
      index: i,
      width: (domClientWidth * i) / (props.data.length - 1),
    };
    arr.push(obj);
  }
  widthValues.value = arr;
};
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
const splitSvgUrl = ref("");
const bacSvgUrl = ref("");
const stagedIndexTimer = ref(null) as any;
const initProgressBar = () => {
  setTimeout(() => {
    dataIndex.value = 0;
    stagedIndex.value = 0;
    splitSvgUrl.value = "";
    bacSvgUrl.value = "";
    remainingTime.value = -1;
    procentage.value = 0;
    isPlay.value = false;
    refreshClick.value = false;
    clearInterval(progressTimer.value);
    nextTick(() => {
      const domClientWidth = progressBarPlayerBacRef.value.clientWidth;
      width.value = domClientWidth;
    });
    computedWidth();
    splitFun();
  }, 5);
};
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
//  play + 1   dataIndex + 1
const play = () => {
  refreshClick.value = true;
  isPlay.value = true;
  const targetWidth = widthValues.value[dataIndex.value + 1].procentage;
  procentage.value = targetWidth;
  dataIndex.value++;
  //If it is playing normally
  if (remainingTime.value == -1) {
    clearInterval(progressTimer.value);
    progressTimer.value = null;
    progressTimer.value = setInterval(updateProgress, props.duration);
  } else {
    //If it is replay after paused
    if (dataIndex.value == props.data.length - 1) {
      setTimeout(() => {
        isPlay.value = false;
        refreshClick.value = false;
      }, remainingTime.value);
      return;
    }
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
  fillWidth.value = progressBarPlayerBacFillRef.value.clientWidth;
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
  emits("handlePlay", props.data[stagedIndex.value], stagedIndex.value);
  remainingTime.value = -1;
  //replay in 100 milliseconds later
  setTimeout(() => {
    play();
  }, 100);
};
const changeSlider = (e: MouseEvent) => {
  computedOffsetX(e);
  fillWidth.value = progressBarPlayerBacFillRef.value.clientWidth;
  emits("skipProgress", props.data[dataIndex.value], dataIndex.value);
  document.onmousemove = (event) => {
    computedOffsetX(event);
    emits("skipProgress", props.data[dataIndex.value], dataIndex.value);
  };
  document.onmouseup = (event) => {
    computedOffsetX(event);
    fillWidth.value = progressBarPlayerBacFillRef.value.clientWidth;
    computedPauseOffsetX();
    document.onmousemove = null;
    document.onmouseup = null;
  };
};
const computedOffsetX = (event: MouseEvent) => {
  let closest = { percentage: -1, index: 0 };
  let offsetX =
    event.pageX - progressBarPlayerBacRef.value.getBoundingClientRect().x;
  let currentProcentage = (offsetX / width.value) * 100;
  if (currentProcentage <= 0) {
    currentProcentage = 0;
  }
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
  if (dataIndex.value >= props.data.length - 1) {
    procentage.value = 100;
    refreshClick.value = false;
  }
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
  if (dataIndex.value < props.data.length - 1) {
    let IncompleteProgress =
      widthValues.value[dataIndex.value + 1].procentage - procentage.value;
    //Calculate the distance moved per millisecond
    let avgDistance =
      (widthValues.value[dataIndex.value + 1].procentage -
        widthValues.value[dataIndex.value].procentage) /
      props.duration;
    // Remaining time (milliseconds)
    remainingTime.value = IncompleteProgress / avgDistance;
  }
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
  rect.setAttribute("height", `${height.value}`);
  rect.setAttribute("fill", bacColor);
  rect.setAttribute("stroke", "none");
  const fillRect = document.createElementNS(ns, "rect");
  fillRect.setAttribute("x", `${x}`);
  fillRect.setAttribute("width", `${width}`);
  fillRect.setAttribute("height", `${height.value}`);
  fillRect.setAttribute("fill", splitColor);
  fillRect.setAttribute("stroke", "none");
  svg.appendChild(fillRect);
  bacSvg.appendChild(rect);
};

const splitFun = () => {
  if (props.splitFieldsInterval == "") return;
  let result: any = [];
  let currentArray: any = [];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const bacSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const startInterval = props.splitFieldsInterval.split(",")[0];
  const endInterval = props.splitFieldsInterval.split(",")[1];
  const start_matches = /[\[|\(]/.exec(startInterval);
  const end_matches = /[\)|\]]/.exec(endInterval);
  /* Error feedback start */
  if (start_matches == null || end_matches == null)
    throw Error("Please use `[]` or `()` to include the interval you set");
  if (
    !isNumeric(startInterval.split(start_matches[0])[1]) ||
    !isNumeric(endInterval.split(end_matches[0])[0])
  )
    throw Error(`Invalid comparison interval => ${props.splitFieldsInterval}`);
  /* Error feedback end */
  const newInterval = [
    start_matches[0],
    isNumeric(startInterval.split(start_matches[0])[1])
      ? Number(startInterval.split(start_matches[0])[1])
      : startInterval.split(start_matches[0])[1],
    isNumeric(endInterval.split(end_matches[0])[0])
      ? Number(endInterval.split(end_matches[0])[0])
      : endInterval.split(end_matches[0])[0],
    end_matches[0],
  ];
  bacSvg.setAttribute("width", "100%");
  bacSvg.setAttribute("height", `${height.value}px`);
  for (let i = 0; i < props.data.length; i++) {
    if (i != 0) {
      currentArray.push({ ...props.data[i], dataIndex: i });
    }
    /* when the loop reaches the last element */
    if (i == props.data.length - 1) {
      if (
        newInterval[3] == "]"
          ? props.data[i][props.splitConfig.splitFields] > newInterval[2]
          : props.data[i][props.splitConfig.splitFields] >= newInterval[2]
      ) {
        currentArray.map((item: any) => {
          item.color = props.splitConfig.outRangeColor;
          return item;
        });
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
        newInterval[0] == "["
          ? props.data[i][props.splitConfig.splitFields] < newInterval[1]
          : props.data[i][props.splitConfig.splitFields] <= newInterval[1]
      ) {
        currentArray.map((item: any) => {
          item.color = props.splitConfig.outRangeColor;
          return item;
        });
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
        newInterval[0] == "["
          ? props.data[i][props.splitConfig.splitFields] >= newInterval[1]
          : props.data[i][props.splitConfig.splitFields] > newInterval[1] &&
            newInterval[3] == "]"
            ? props.data[i][props.splitConfig.splitFields] <= newInterval[2]
            : props.data[i][props.splitConfig.splitFields] < newInterval[2]
      ) {
        currentArray.map((item: any) => {
          props.splitConfig.inRangeColor;
          return item;
        });
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

    /* Compare the previous number to determine the interval */
    // If the next number is greater than the max interval and the current number in the interval
    if (
      i > 0 &&
      (newInterval[0] == "["
        ? props.data[i][props.splitConfig.splitFields] >= newInterval[1]
        : props.data[i][props.splitConfig.splitFields] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? props.data[i][props.splitConfig.splitFields] <= newInterval[2]
        : props.data[i][props.splitConfig.splitFields] < newInterval[2]) &&
      (newInterval[3] == "]"
        ? props.data[i + 1][props.splitConfig.splitFields] > newInterval[2]
        : props.data[i + 1][props.splitConfig.splitFields] >= newInterval[2])
    ) {
      currentArray.map((item: any) => {
        item.color = props.splitConfig.inRangeColor;
        return item;
      });
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
      //If current number is greater than the max interval, and the new number is in the interval
      i > 0 &&
      (newInterval[3] == "]"
        ? props.data[i][props.splitConfig.splitFields] > newInterval[2]
        : props.data[i][props.splitConfig.splitFields] >= newInterval[2]) &&
      (newInterval[0] == "["
        ? props.data[i + 1][props.splitConfig.splitFields] >= newInterval[1]
        : props.data[i + 1][props.splitConfig.splitFields] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? props.data[i + 1][props.splitConfig.splitFields] <= newInterval[2]
        : props.data[i + 1][props.splitConfig.splitFields] < newInterval[2])
    ) {
      currentArray.map((item: any) => {
        item.color = props.splitConfig.outRangeColor;
        return item;
      });
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
      //If current number is in the interval and the new number is less than the min interval
      i > 0 &&
      (newInterval[0] == "["
        ? props.data[i][props.splitConfig.splitFields] >= newInterval[1]
        : props.data[i][props.splitConfig.splitFields] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? props.data[i][props.splitConfig.splitFields] <= newInterval[2]
        : props.data[i][props.splitConfig.splitFields] < newInterval[2]) &&
      (newInterval[0] == "["
        ? props.data[i + 1][props.splitConfig.splitFields] < newInterval[1]
        : props.data[i + 1][props.splitConfig.splitFields] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = props.splitConfig.inRangeColor;
        return item;
      });
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
      //If current number is less than the min interval and the new number is in the interval
      i > 0 &&
      (newInterval[0] == "["
        ? props.data[i + 1][props.splitConfig.splitFields] >= newInterval[1]
        : props.data[i + 1][props.splitConfig.splitFields] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? props.data[i + 1][props.splitConfig.splitFields] <= newInterval[2]
        : props.data[i + 1][props.splitConfig.splitFields] < newInterval[2]) &&
      (newInterval[0] == "["
        ? props.data[i][props.splitConfig.splitFields] < newInterval[1]
        : props.data[i][props.splitConfig.splitFields] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = props.splitConfig.outRangeColor;
        return item;
      });
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
      //If current number is greater than the max interval and the next number is less than the min interval
      i > 0 &&
      (newInterval[3] == "]"
        ? props.data[i][props.splitConfig.splitFields] > newInterval[2]
        : props.data[i][props.splitConfig.splitFields] >= newInterval[2]) &&
      (newInterval[0] == "["
        ? props.data[i + 1][props.splitConfig.splitFields] < newInterval[1]
        : props.data[i + 1][props.splitConfig.splitFields] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = props.splitConfig.outRangeColor;
        return item;
      });
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
      //If next number is less than the the min interval and the current number is greater than the max interval
      i > 0 &&
      (newInterval[3] == "]"
        ? props.data[i + 1][props.splitConfig.splitFields] > newInterval[2]
        : props.data[i + 1][props.splitConfig.splitFields] >= newInterval[2]) &&
      (newInterval[0] == "["
        ? props.data[i][props.splitConfig.splitFields] < newInterval[1]
        : props.data[i][props.splitConfig.splitFields] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = props.splitConfig.outRangeColor;
        return item;
      });
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
  splitResult.value = result;
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
    if (n[2] != -1 && n[0] != o[0] && n[1] == true) {
      clearTimeout(stagedIndexTimer.value);
      stagedIndexTimer.value = null;
      executeAfterApproximatelyOneSecond(() => {
        if (
          procentage.value >=
          widthValues.value[stagedIndex.value + 1].procentage
        ) {
          console.log("Suspend subsequent play");
          stagedIndex.value++;
          emits("handlePlay", props.data[stagedIndex.value], stagedIndex.value);
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
            console.log("Normal playback");
            if (procentage.value == 100) {
              isPlay.value = false;
              refreshClick.value = false;
            }
            stagedIndex.value++;
            emits(
              "handlePlay",
              props.data[stagedIndex.value],
              stagedIndex.value
            );
          }
        });
      }
    }
  }
);
defineExpose({
  splitResult,
  play,
  pause,
  refresh,
  initProgressBar,
});
onMounted(async () => {
  await nextTick(() => {
    width.value = progressBarPlayerBacRef.value.clientWidth;
    height.value = progressBarPlayerBacRef.value.clientHeight;
    if (props.hasRealTimeTipBox) {
      currentTooltipTranslateX.value =
        progressBarPlayerBacRef.value.getBoundingClientRect().x;
      currentTooltipTranslateY.value =
        progressBarPlayerBacRef.value.getBoundingClientRect().y -
        currentTipRef.value.getHeight() -
        10;
      currentTipHalfWidth.value = currentTipRef.value.getHalfWidth();
    }
  });
  computedWidth();
  splitFun();
  window.addEventListener("resize", () => {
    nextTick(() => {
      width.value = progressBarPlayerBacRef.value.clientWidth;
    });
    computedWidth();
    splitFun();
    if (props.hasRealTimeTipBox) {
      currentTipHalfWidth.value = currentTipRef.value.getHalfWidth();
      currentTooltipTranslateY.value =
        progressBarPlayerBacRef.value.getBoundingClientRect().y -
        currentTipRef.value.getHeight() -
        10;
    }
  });
});
</script>
<style scoped lang="less">
@import "@assets/style/iconfont.css";
.progress-bar-player {
  width: 100%;
  display: flex;
  .progress-bar-player-bac {
    flex: 1;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;

    .progress-bar-player-fill {
      height: 100%;
      border-radius: 5px;
      will-change: transition;
      border: none;
      user-select: none;
      pointer-events: none;
      position: relative;
      img {
        position: absolute;
      }
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
