/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-07 15:54:10
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-08 11:01:52
 * @FilePath: /vue3-process-bar-player/src/packages/export.ts
 * @Description: 
 */
import type { App } from "vue";
import ColorSplitProgressBar from "./colorSplitProgressBar/index.vue";

export { ColorSplitProgressBar };
export default {
  install(app: App) {
    app.component('ColorSplitProgressBar', ColorSplitProgressBar);
  },
};

// 全局引入时，需要声明一下全局组件，不然没有提示
declare module "vue" {
  export interface GlobalComponents {
    ColorSplitProcessBar: typeof ColorSplitProgressBar;
  }
}
