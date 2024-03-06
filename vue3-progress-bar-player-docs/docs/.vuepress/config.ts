/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 17:33:08
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-06 18:25:21
 * @FilePath: /vue3-process-bar-player/vue3-progress-bar-player-docs/docs/.vuepress/config.ts
 * @Description:
 */
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress/cli";
import { viteBundler } from "@vuepress/bundler-vite";

export default defineUserConfig({
  lang: "zh-CN",
  theme: defaultTheme({
    logo: "https://vuejs.press/images/hero.png",

    navbar: ["/", "/get-started"],
  }),
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    "/zh/": {
      lang: "zh-CN",
      title: "Vue3 进度条播放器",
      description: "流畅的、易用的、功能齐全的Vue3进度条组件",
    },
    "/": {
      lang: "en-US",
      title: "Vue3 Progress-Bar-Player",
      description: "Vue3 Progress-Bar-Player",
    },
  },

  bundler: viteBundler(),
});
