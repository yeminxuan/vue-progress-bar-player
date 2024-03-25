<!--
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-07 10:41:37
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-25 11:15:00
 * @FilePath: /vue3-process-bar-player/src/views/colorSplitProgressBar.vue
 * @Description: 
-->
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
        :duration="1000"
        :is-split="true"
        :split-config="{
          splitFields: 'speed',
          inRangeColor: splitColorConfig.inRangeColor,
          outRangeColor: splitColorConfig.outRangeColor,
          outRangeBacColor: splitColorConfig.inRangeBacColor,
          inRangeBacColor: splitColorConfig.outRangeBacColor,
        }"
        :split-fields-config="splitFieldsConfig"
        @handle-play="handlePlay"
        @skip-progress="skipProgress"
      />
      <div class="color-split-progress-control">
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
                type="text"
              >
            </div>
            <div>
              min: <input
                v-model="splitFieldsConfig.min"
                type="text"
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
const splitColorConfig = ref({
  inRangeColor: "red",
  outRangeColor: "blue",
  inRangeBacColor: "rgba(255,0,0,0.3)",
  outRangeBacColor: "rgba(0,0,255,0.3)",
});
const splitFieldsConfig = ref({
  max: 1,
  min: 0.5,
});
const handlePlay = (index: number) => {
  console.log(index);
};
const skipProgress = (index: number, item: any) => {
  console.log(index, item);
};
const confirmSplitFieldsConfig = () => {
  ColorSplitProcessBarRef.value.initProgressBar();
};
const resetSplitFieldsConfig = () => {
  splitColorConfig.value = {
    inRangeColor: "red",
    outRangeColor: "blue",
    inRangeBacColor: "rgba(255,0,0,0.3)",
    outRangeBacColor: "rgba(0,0,255,0.3)",
  };
  splitFieldsConfig.value = {
    max: 1,
    min: 0.5,
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
