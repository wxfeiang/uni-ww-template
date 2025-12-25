<!-- src/components/GlobalToast.vue -->
<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGlobalPopup } from '@/store'
import { getCurrentPath } from '@/utils'

const { popupOptions, currentPage } = storeToRefs(useGlobalPopup())

const popup = useGlobalPopup()
const currentPath = getCurrentPath()

const show = ref(false)
// 监听全局状态变化
watch(() => popupOptions.value, (newVal) => {
  if (newVal && newVal.show) {
    // 只在当前页面显示 Toast
    if (currentPage.value === currentPath) {
      show.value = true
    }
  }
  else {
    popup.close()
  }
})
function handleClose() {
  popup.close()
}
</script>

<template>
  <wd-popup v-model="show" custom-class="px-10px rounded-10px w-90%" @close="handleClose">
    <view v-if="popupOptions.showType === 2">
      这里是自定义的内容
    </view>
    <text class="custom-txt">自定义的弹出来，后期对弹出的内容进行更多的改造，写在同级别的组件里面，避免更多的耦合</text>
  </wd-popup>
</template>
