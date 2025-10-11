<!-- src/components/GlobalToast.vue -->
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useToast } from 'wot-design-uni'
import { useGlobalToast } from '@/store'
import { getCurrentPath } from '@/utils'

const { toastOptions, currentPage } = storeToRefs(useGlobalToast())
const { close: closeGlobalToast } = useGlobalToast()

const toast = useToast('globalToast')
const currentPath = getCurrentPath()

// 支付宝小程序兼容性处理
// #ifdef MP-ALIPAY
const hackAlipayVisible = ref(false)
nextTick(() => {
  hackAlipayVisible.value = true
})
// #endif

// 监听全局状态变化
watch(() => toastOptions.value, (newVal) => {
  if (newVal && newVal.show) {
    // 只在当前页面显示 Toast
    if (currentPage.value === currentPath) {
      toast.show(toastOptions.value)
    }
  }
  else {
    toast.close()
  }
})
</script>

<template>
  <!-- 支付宝小程序特殊处理 -->
  <!-- #ifdef MP-ALIPAY -->
  <wd-toast v-if="hackAlipayVisible" selector="globalToast" :closed="closeGlobalToast" />
  <!-- #endif -->
  <!-- #ifndef MP-ALIPAY -->
  <wd-toast selector="globalToast" :closed="closeGlobalToast" />
  <!-- #endif -->
</template>
