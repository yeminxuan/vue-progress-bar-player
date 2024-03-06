/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 11:19:39
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-06 12:12:43
 * @FilePath: /vue3-process-bar-player/vite.config.ts
 * @Description:
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8888,
  },
});
