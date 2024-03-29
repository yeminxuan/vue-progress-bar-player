<template>
  <div class="progressBarPlayerWrap">
    <Example
      title="Basic usage"
      class="progress-bar-player-wrap"
    >
      <ProgressBarPlayer
        v-if="splitProgressData.length > 0"
        ref="progressBarPlayerRef"
        :data="splitProgressData"
        :duration="100"
      >
        <template #controlBtn="{ play, pause, refresh }">
          <div
            v-if="play"
            class="controlBtn"
            @click="progressBarPlayerRef.play()"
          >
            <i class="iconfont icon-bofang" />
          </div>
          <div
            v-if="pause"
            class="controlBtn"
            @click="progressBarPlayerRef.pause()"
          >
            <i class="iconfont icon-zanting" />
          </div>
          <div
            v-if="refresh"
            class="controlBtn"
            @click="progressBarPlayerRef.refresh()"
          >
            <i class="iconfont icon-zhongzhi" />
          </div>
        </template>
      </ProgressBarPlayer>
    </Example>
    <Example
      title="Color split process bar"
      class="progress-bar-player-wrap"
    >
      <ProgressBarPlayer
        v-if="splitProgressData.length > 0"
        ref="progressBarPlayerRef1"
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
        split-fields-interval="[0,10]"
      >
        <template #controlBtn="{ play, pause, refresh }">
          <div
            v-if="play"
            class="controlBtn"
            @click="progressBarPlayerRef1.play()"
          >
            <i class="iconfont icon-bofang" />
          </div>
          <div
            v-if="pause"
            class="controlBtn"
            @click="progressBarPlayerRef1.pause()"
          >
            <i class="iconfont icon-zanting" />
          </div>
          <div
            v-if="refresh"
            class="controlBtn"
            @click="progressBarPlayerRef1.refresh()"
          >
            <i class="iconfont icon-zhongzhi" />
          </div>
        </template>
      </ProgressBarPlayer>
    </Example>
    <Example
      title="Color split process bar & Real time tip"
      class="progress-bar-player-wrap"
    >
      <ProgressBarPlayer
        v-if="splitProgressData.length > 0"
        ref="progressBarPlayerRef2"
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
        split-fields-interval="[0,10]"
        @handle-play="handleHasTipPlay"
        @skip-progress="skipHasTipProgress"
      >
        <template #controlBtn="{ play, pause, refresh }">
          <div
            v-if="play"
            class="controlBtn"
            @click="progressBarPlayerRef2.play()"
          >
            <i class="iconfont icon-bofang" />
          </div>
          <div
            v-if="pause"
            class="controlBtn"
            @click="progressBarPlayerRef2.pause()"
          >
            <i class="iconfont icon-zanting" />
          </div>
          <div
            v-if="refresh"
            class="controlBtn"
            @click="progressBarPlayerRef2.refresh()"
          >
            <i class="iconfont icon-zhongzhi" />
          </div>
        </template>
        <template #currentTip>
          {{ currentDate }}
        </template>
      </ProgressBarPlayer>
    </Example>
  </div>
</template>
<script setup lang="ts">
import { splitProgressData } from "@/assets/data";
import ProgressBarPlayer from "@packages/progressBarPlayer/index.vue";
import Example from "@common/example.vue";
import { ref } from "vue";
import moment from "moment";
const currentDate = ref(
  moment(splitProgressData[0].gpstime).format("yyyy/MM/DD HH:mm:ss")
);
const progressBarPlayerRef = ref();
const progressBarPlayerRef1 = ref();
const progressBarPlayerRef2 = ref();
const handleHasTipPlay = (item: any) => {
  console.log(item);

  currentDate.value = moment(item.gpstime).format("yyyy/MM/DD HH:mm:ss");
};
const skipHasTipProgress = (item: any) => {
  currentDate.value = moment(item.gpstime).format("yyyy/MM/DD HH:mm:ss");
};
</script>
<style scoped lang="less">
:deep(.progress-bar-player-wrap) {
  .progress-bar-player {
    height: 30px;
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
  }
}
</style>
