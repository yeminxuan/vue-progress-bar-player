import type { App } from "vue";
import ColorSplitProgressBar from "./colorSplitProgressBar/index.vue";

export { ColorSplitProgressBar };

export default {
  install(app: App) {
    app.component(ColorSplitProgressBar.name, ColorSplitProgressBar);
  },
};

// 全局引入时，需要声明一下全局组件，不然没有提示
declare module "vue" {
  export interface GlobalComponents {
    ColorSplitProcessBar: typeof ColorSplitProgressBar;
  }
}
