export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"zh-CN\",\"title\":\"\",\"description\":\"\",\"head\":[],\"locales\":{\"/zh/\":{\"lang\":\"zh-CN\",\"title\":\"Vue3 进度条播放器\",\"description\":\"流畅的、易用的、功能齐全的Vue3进度条组件\"},\"/\":{\"lang\":\"en-US\",\"title\":\"Vue3 Progress-Bar-Player\",\"description\":\"Vue3 Progress-Bar-Player\"}}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
