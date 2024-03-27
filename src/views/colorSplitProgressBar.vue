<template>
  <div class="colorSplitProcessBarWrap">
    <Example
      title="Basic usage"
      class="color-split-progress"
    >
      <ColorSplitProcessBar
        v-if="splitProgressData.length > 0"
        ref="ColorSplitProcessBarRef"
        :data="splitProgressData"
        :duration="100"
      >
        <template #play>
          <i
            class="iconfont icon-bofang"
            @click="ColorSplitProcessBarRef.play()"
          />
        </template>
        <template #pause>
          <i
            class="iconfont icon-zanting"
            @click="ColorSplitProcessBarRef.pause()"
          />
        </template>
        <template #refresh>
          <i
            class="iconfont icon-zhongzhi"
            @click="ColorSplitProcessBarRef.refresh()"
          />
        </template>
        <template #currentTip>
          {{ currentDate }}
        </template>
      </ColorSplitProcessBar>
    </Example>
    <Example
      title="Color split process bar"
      class="color-split-progress"
    >
      <ColorSplitProcessBar
        v-if="splitProgressData.length > 0"
        ref="ColorSplitProcessBarRef1"
        :data="splitProgressData"
        :duration="100"
        :is-split="true"
        :split-config="{
          splitFields: 'speed',
          inRangeColor: 'blue',
          outRangeColor: 'red',
          inRangeBacColor: 'rgba(0,0,255,0.3)',
          outRangeBacColor: 'rgba(255,0,0,0.3)',
        }"
        :split-fields-config="{ max: 10, min: 0 }"
      >
        <template #play>
          <i
            class="iconfont icon-bofang"
            @click="ColorSplitProcessBarRef1.play()"
          />
        </template>
        <template #pause>
          <i
            class="iconfont icon-zanting"
            @click="ColorSplitProcessBarRef1.pause()"
          />
        </template>
        <template #refresh>
          <i
            class="iconfont icon-zhongzhi"
            @click="ColorSplitProcessBarRef1.refresh()"
          />
        </template>
        <template #currentTip>
          {{ currentDate }}
        </template>
      </ColorSplitProcessBar>
    </Example>
    <Example
      title="Color split process bar & Real time tip"
      class="color-split-progress"
    >
      <ColorSplitProcessBar
        v-if="splitProgressData.length > 0"
        ref="ColorSplitProcessBarRef2"
        :data="splitProgressData"
        :has-real-time-tip-box="true"
        :duration="100"
        :is-split="true"
        :split-config="{
          splitFields: 'speed',
          inRangeColor: 'blue',
          outRangeColor: 'red',
          inRangeBacColor: 'rgba(0,0,255,0.3)',
          outRangeBacColor: 'rgba(255,0,0,0.3)',
        }"
        :split-fields-config="{ max: 10, min: 0 }"
        @handle-play="handleHasTipPlay"
        @skip-progress="skipHasTipProgress"
      >
        <template #play>
          <i
            class="iconfont icon-bofang"
            @click="ColorSplitProcessBarRef2.play()"
          />
        </template>
        <template #pause>
          <i
            class="iconfont icon-zanting"
            @click="ColorSplitProcessBarRef2.pause()"
          />
        </template>
        <template #refresh>
          <i
            class="iconfont icon-zhongzhi"
            @click="ColorSplitProcessBarRef2.refresh()"
          />
        </template>
        <template #currentTip>
          {{ currentDate }}
        </template>
      </ColorSplitProcessBar>
    </Example>
  </div>
</template>
<script setup lang="ts">
import { splitProgressData } from "@/assets/data";
import ColorSplitProcessBar from "@packages/colorSplitProgressBar/index.vue";
import Example from "@common/example.vue";
import { ref } from "vue";
import moment from "moment";
const currentDate = ref(
  moment(splitProgressData[0].gpstime).format("yyyy/MM/DD HH:mm:ss")
);
const ColorSplitProcessBarRef = ref();
const ColorSplitProcessBarRef1 = ref();
const ColorSplitProcessBarRef2 = ref();
const handleHasTipPlay = (item: any) => {
  console.log(item);

  currentDate.value = moment(item.gpstime).format("yyyy/MM/DD HH:mm:ss");
};
const skipHasTipProgress = (item: any) => {
  currentDate.value = moment(item.gpstime).format("yyyy/MM/DD HH:mm:ss");
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
