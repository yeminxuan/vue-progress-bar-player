<p align="center" style="font-size:24px;">vue-process-bar-player</p>

<p align="center">
    <a href="https://www.npmjs.com/package/vue-progress-bar-player" target="_black"><img src="https://img.shields.io/npm/v/vue-progress-bar-player.svg"/></a> <a href="https://npmcharts.com/compare/vue-progress-bar-player?minimal=true">
    <img src="https://img.shields.io/npm/dm/vue-progress-bar-player.svg" />
  </a>
</p>

- 💪 Vue 3 Composition API
- 🔥 Written in TypeScript

## Installation

Package manager like [pnpm](https://pnpm.io/zh/),[yarn](https://classic.yarnpkg.com/en/),[npm](https://www.npmjs.com/),etc.

```bash
pnpm add vue3-progress-bar
yarn add vue3-progress-bar
npm install vue3-progress-bar
```

## Usage

If you don't really care about the size of the packaged file, it's easier to use a full import.

```ts
//main.ts
import { createApp } from "vue";
import App from "./App.vue";
import VueProgressBar from "vue-progress-bar-player";
createApp(App).use(VueProgressBar).mount("#app");
```

## API

### Props

| Field                 | Required | Description                                                             | Type                                          | Default   |
| --------------------- | -------- | ----------------------------------------------------------------------- | --------------------------------------------- | --------- |
| data                  | true     | data                                                                    | `Array`                                       | []        |
| duration              | false    | the transition time for the animation to move to the next point         | `number`                                      | 1000      |
| performance           | false    | enabling High Performance Mode,Applies to split color progress bar only | boolean                                       | false     |
| has-real-time-tip-box | false    | display tooltip                                                         | `boolean`                                     | false     |
| progress-bac-color    | false    | Progress bar background color when color splitting is not enabled       | `string`                                      | "#ccc"    |
| progress-fill-color   | false    | progress bar fills color when color splitting is not enabled            | `string`                                      | "#409eff" |
| is-split              | false    | open the color split progress bar                                       | `boolean`                                     | false     |
| split-config          | false    | split the progress bar configuration                                    | [SplitConfig](#SplitConfig)                   | ——        |
| split-fields-interval | false    | division interval range`eg: "[0,10)" =>  10 < a >= 0`                   | `string`                                      | ""        |
| progressTextPosition  | false    | displays progress percentage text                                       | [ProgressTextPosition](#ProgressTextPosition) | null      |

### Events

| Event         | Description                                                                                                                      | Type       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| handle-play   | When the animation plays, the index and data of the current point are returned periodically according to the set transition time | `Function` |
| skip-progress | Returns the index and data for the current point when the mouse clicks on the progress bar                                       | `Function` |

### Slots

| Slot Name  | Type                                               | Description                           |
| ---------- | -------------------------------------------------- | ------------------------------------- |
| controlBtn | `{ play: boolean, pause:boolean, replay:boolean }` | control buttons (Play, pause, replay) |
| currentTip | `{}`                                               | tooltip content                       |

### Exposes

| Event           | Description                           | Type       |
| --------------- | ------------------------------------- | ---------- |
| initProgressBar | init the progress bar player          | `Function` |
| play            | control progress bar player to play   | `Function` |
| pause           | control progress bar player to pause  | `Function` |
| refresh         | control progress bar player to replay | `Function` |

## Types

### <div id="SplitConfig">SplitConfig</div>

| 属性名           | Description                                                              | Type     | Default             |
| ---------------- | ------------------------------------------------------------------------ | -------- | ------------------- |
| splitFields      | a field used to split colors                                             | `string` | ""                  |
| inRangeColor     | the progress bar within the set interval is filled with color            | `string` | "blue"              |
| outRangeColor    | progress bars that are not within the set interval are filled with color | `string` | "red"               |
| outRangeBacColor | progress bar background color that is not within the set interval        | `string` | "rgba(255,0,0,0.3)" |
| inRangeBacColor  | the progress bar background color within the set interval                | `string` | "rgba(0,0,255,0.3)" |

### <div id="ProgressTextPosition">ProgressTextPosition</div>

| Field        | Description                                           | Type     |
| ------------- | ---------------------------------------------- | -------- |
| null          | not display progress percentage text           | `null`   |
| follow        | followed to the left of the current progress   | `string` |
| inside-left   | fixed to the far left inside the progress bar  | `string` |
| inside-right  | fixed to the far right inside the progress bar | `string` |
| outside-right | fixed to the right outside the progress bar    | `string` |

## Contributors

This project exists thanks to all the people who contribute.

And thank you to all our backers! 🙏

<a href="https://github.com/yeminxuan/vue-progress-player/graphs/contributors">
 <img src="https://contrib.rocks/image?repo=yeminxuan/vue-progress-player" />
</a>

## License

Element Plus is open source software licensed as
[MIT](https://github.com/yeminxuan/vue-progress-player/blob/master/LICENSE).
