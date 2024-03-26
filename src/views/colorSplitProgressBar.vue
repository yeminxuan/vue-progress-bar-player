<template>
  <div class="colorSplitProcessBarWrap">
    <Example
      title="Color Split Progress Bar"
      class="color-split-progress"
    >
      <ColorSplitProcessBar
        v-if="splitProgressData.length > 0"
        ref="ColorSplitProcessBarRef"
        :data="splitProgressData"
        :has-real-time-tip-box="baseOptions.hasRealTimeTipBox"
        :duration="baseOptions.duration"
        :is-split="true"
        :split-config="{
          splitFields: 'speed',
          inRangeColor: splitColorConfig.inRangeColor,
          outRangeColor: splitColorConfig.outRangeColor,
          outRangeBacColor: splitColorConfig.outRangeBacColor,
          inRangeBacColor: splitColorConfig.inRangeBacColor,
        }"
        :split-fields-config="splitFieldsConfig"
        @handle-play="handlePlay"
        @skip-progress="skipProgress"
      >
        <template #currentTip>
          {{
            currentDate
          }}
        </template>
      </ColorSplitProcessBar>
      <div class="color-split-progress-control">
        <div class="controlBox">
          <div class="name">
            Base
          </div>
          <div class="controlForm">
            <div>
              duration: <input
                v-model="baseOptions.duration"
                type="number"
              >
            </div>
            <div>
              hasRealTimePromptBox:
              <select
                v-model="hasRealTimeTipBoxValue"
                @change="changeHasRealTimeTipBox"
              >
                <option value="true">
                  true
                </option>
                <option value="false">
                  false
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="controlBox">
          <div class="name">
            splitColorConfig
          </div>
          <div class="controlForm">
            <div>
              inRangeColor:
              <input
                v-model="splitColorConfig.inRangeColor"
                type="text"
              >
            </div>
            <div>
              outRangeColor:
              <input
                v-model="splitColorConfig.outRangeColor"
                type="text"
              >
            </div>
            <div>
              inRangeBacColor:
              <input
                v-model="splitColorConfig.inRangeBacColor"
                type="text"
              >
            </div>
            <div>
              outRangeBacColor:
              <input
                v-model="splitColorConfig.outRangeBacColor"
                type="text"
              >
            </div>
          </div>
        </div>
        <div class="controlBox">
          <div class="name">
            splitFieldsConfig
          </div>
          <div class="controlForm">
            <div>
              max: <input
                v-model="splitFieldsConfig.max"
                type="number"
              >
            </div>
            <div>
              min: <input
                v-model="splitFieldsConfig.min"
                type="number"
              >
            </div>
          </div>
        </div>
        <div class="controlBtn">
          <button @click="confirmSplitFieldsConfig">
            confirm
          </button><button @click="resetSplitFieldsConfig">
            reset
          </button>
        </div>
      </div>
    </Example>
  </div>
</template>
<script setup lang="ts">
import { splitProgressData } from "@/assets/data";
import ColorSplitProcessBar from "@packages/colorSplitProgressBar/index.vue";
import Example from "@common/example.vue";
import { ref } from "vue";
const ColorSplitProcessBarRef = ref();
import moment from "moment";
const currentDate = ref(
  moment(splitProgressData[0].gpstime).format("yyyy年MM月DD日 HH:mm:ss")
);
const hasRealTimeTipBoxValue = ref("true");
const baseOptions = ref({
  duration: 1000,
  hasRealTimeTipBox: true,
});
const splitColorConfig = ref({
  inRangeColor: "blue",
  outRangeColor: "red",
  inRangeBacColor: "rgba(0,0,255,0.3)",
  outRangeBacColor: "rgba(255,0,0,0.3)",
});
const splitFieldsConfig = ref({
  max: 10,
  min: 1,
});
const handlePlay = (index: number, item: any) => {
  console.log(index, item);
  currentDate.value = moment(item.gpstime).format("yyyy年MM月DD日 HH:mm:ss");
};
const skipProgress = (index: number, item: any) => {
  console.log(index, item);
  currentDate.value = moment(item.gpstime).format("yyyy年MM月DD日 HH:mm:ss");
};
const confirmSplitFieldsConfig = () => {
  ColorSplitProcessBarRef.value.initProgressBar();
};
const changeHasRealTimeTipBox = () => {
  baseOptions.value.hasRealTimeTipBox = JSON.parse(
    hasRealTimeTipBoxValue.value
  );
};
const resetSplitFieldsConfig = () => {
  baseOptions.value = {
    duration: 1000,
    hasRealTimeTipBox: true,
  };
  splitColorConfig.value = {
    inRangeColor: "blue",
    outRangeColor: "red",
    inRangeBacColor: "rgba(0,0,255,0.3)",
    outRangeBacColor: "rgba(255,0,0,0.3)",
  };
  splitFieldsConfig.value = {
    max: 10,
    min: 1,
  };
  ColorSplitProcessBarRef.value.initProgressBar();
};
</script>
<style scoped lang="less">
button {
  padding: 2px 5px;
  font-size: 14px;
  cursor: pointer;
}
.color-split-progress {
  .color-split-progress-control {
    margin-top: 10px;
    background-color: #f6f6f7;
    padding: 10px;
    .controlBox {
      .name {
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }
      .controlForm {
        margin-left: 10px;
        & > div {
          margin-top: 5px;
          font-size: 14px;
        }
      }
    }
    .controlBtn {
      margin-top: 10px;
      button:last-child {
        margin-left: 5px;
      }
    }
  }
}
</style>
