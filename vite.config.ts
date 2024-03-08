/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-06 11:19:39
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-08 11:02:14
 * @FilePath: /vue3-process-bar-player/vite.config.ts
 * @Description:
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import dts from "vite-plugin-dts";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode == "npm") {
    return defineConfig({
      plugins: [
        vue(),
        dts({
          entryRoot: "src/packages/colorSplitProgressBar",
        }),
      ],
      resolve: {
        // 配置路径别名
        alias: {
          "@": path.resolve(__dirname, "./src"),
          "@api": path.resolve(__dirname, "./src/api"),
          "@assets": path.resolve(__dirname, "./src/assets"),
          "@common": path.resolve(__dirname, "./src/components/common"),
          "@components": path.resolve(__dirname, "./src/components"),
          "@store": path.resolve(__dirname, "./src/store"),
          "@views": path.resolve(__dirname, "./src/views"),
          "@packages": path.resolve(__dirname, "./src/packages"),
        },
      },
      build: {
        target: "es2015",
        cssTarget: "chrome61",
        copyPublicDir: false,
        lib: {
          entry: "src/packages/export.ts",
          formats: ["cjs", "es", "umd"],
          name: "ColorSplitProgressBar",
          fileName: "index",
        },
        rollupOptions: {
          external: ["vue"],
          output: {
            globals: {
              vue: "Vue",
            },
            exports: "named",
          },
        },
      },
    });
  } else {
    return defineConfig({
      base: "/",
      plugins: [vue()],
      server: {
        port: 8888,
      },
      build: {
        target: "es2015",
        cssTarget: "chrome61",
      },
      resolve: {
        // 配置路径别名
        alias: {
          "@": path.resolve(__dirname, "./src"),
          "@api": path.resolve(__dirname, "./src/api"),
          "@assets": path.resolve(__dirname, "./src/assets"),
          "@common": path.resolve(__dirname, "./src/components/common"),
          "@components": path.resolve(__dirname, "./src/components"),
          "@store": path.resolve(__dirname, "./src/store"),
          "@views": path.resolve(__dirname, "./src/views"),
          "@packages": path.resolve(__dirname, "./src/packages"),
        },
      },
    });
  }
});
