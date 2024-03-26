<template>
  <div
    ref="cursorRef"
    class="cursor"
  >
    <div class="tooltip">
      <slot />
      <div class="centerPoint" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const cursorRef = ref();
const getHalfWidth = () => {
  return cursorRef.value.clientWidth / 2;
};
defineExpose({
  getHalfWidth,
});
</script>
<style lang="less" scoped>
.cursor {
  // pointer-events: none;
  position: absolute;
  inset: 0px auto auto 0px;
  .tooltip {
    border-radius: 5px;
    padding: 2px 5px;
    background-color: #000;
    color: #fff;

    .centerPoint {
      width: 16px;
      height: 16px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      pointer-events: none;
      display: flex;
    }
    .centerPoint::after {
      content: "";
      position: absolute;
      bottom: -8px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #000;
      width: 0;
      height: 0;
      transform-origin: center top;
      .triangle {
        width: 0;
        height: 0;
      }
    }
  }
}
</style>
