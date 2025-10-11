<script lang="ts" setup>
import { useGlobalLoading, useGlobalMessage, useGlobalToast, useThemeStore } from '@/store'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'Home',
})
const globalToast = useGlobalToast()
const globalLoading = useGlobalLoading()
const globalMessage = useGlobalMessage()
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const themeStore = useThemeStore()

const description = ref(
  'unibest 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite5 + UnoCss + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)
console.log('index/index 首页打印了')
function globaToast() {
  globalToast.success('测试全局弹出组建 toast')
}
function globaLoading() {
  globalLoading.loading('测试全局弹出组建 loading')
  setTimeout(() => {
    globalLoading.close()
  }, 3000)
}
function globaMessage() {
  // globalMessage.alert('测试全局弹出组建 message')
  globalMessage.confirm({
    title: '提示',
    msg: '测试全局弹出组建 message',
    confirmButtonText: 'kai',
    cancelButtonText: '取消',
    success: () => {
      console.log('点击了确定')
    },
    fail: () => {
      console.log('点击了取消')
    },

  })
}
onLoad(() => {
  console.log('测试 uni API 自动引入: onLoad')
})
</script>

<template>
  <view class="bg-white px-4 pt-2" :style="{ marginTop: `${safeAreaInsets?.top}px` }">
    <view class="mt-4 text-center">
      <view clas="bg-red-100 p-2 rounded-lg" @click="globaToast">
        点击测试全局弹出组建 toast
      </view>
      <view clas="bg-red-100 p-2 rounded-lg" @click="globaLoading">
        点击测试全局弹出组建 loading
      </view>
      <view clas="bg-red-100 p-2 rounded-lg" @click="globaMessage">
        点击测试全局弹出组建 message
      </view>
    </view>

    <view class="mt-4 text-center">
      <wd-button type="primary" class="ml-2" @click="themeStore.setThemeVars({ colorTheme: '#07c160' })">
        设置主题变量
      </wd-button>
    </view>
  </view>
</template>
