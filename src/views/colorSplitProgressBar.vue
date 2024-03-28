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
        <template #play>
          <i
            class="iconfont icon-bofang"
            @click="progressBarPlayerRef.play()"
          />
        </template>
        <template #pause>
          <i
            class="iconfont icon-zanting"
            @click="progressBarPlayerRef.pause()"
          />
        </template>
        <template #refresh>
          <i
            class="iconfont icon-zhongzhi"
            @click="progressBarPlayerRef.refresh()"
          />
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
        :split-fields-config="{ max: 10, min: 0 }"
      >
        <template #play>
          <i
            class="iconfont icon-bofang"
            @click="progressBarPlayerRef1.play()"
          />
        </template>
        <template #pause>
          <i
            class="iconfont icon-zanting"
            @click="progressBarPlayerRef1.pause()"
          />
        </template>
        <template #refresh>
          <i
            class="iconfont icon-zhongzhi"
            @click="progressBarPlayerRef1.refresh()"
          />
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
        :split-fields-config="{ max: 10, min: 0 }"
        @handle-play="handleHasTipPlay"
        @skip-progress="skipHasTipProgress"
      >
        <template #play>
          <i
            class="iconfont icon-bofang"
            @click="progressBarPlayerRef2.play()"
          />
        </template>
        <template #pause>
          <i
            class="iconfont icon-zanting"
            @click="progressBarPlayerRef2.pause()"
          />
        </template>
        <template #refresh>
          <i
            class="iconfont icon-zhongzhi"
            @click="progressBarPlayerRef2.refresh()"
          />
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
