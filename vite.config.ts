/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 11:19:39
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-06 19:23:05
 * @FilePath: /vue3-process-bar-player/vite.config.ts
 * @Description:
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8888,
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@views": path.resolve(__dirname, "./src/views"),
    },
  },
});
