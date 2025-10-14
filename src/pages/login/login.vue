<script lang="ts" setup>
import { useTokenStore } from '@/store'
import useRedirect from './useRedirect'

definePage({
  style: {
    navigationBarTitleText: '登录',
  },
})

const option = ref()
onLoad((options) => {
  option.value = options
})

const tokenStore = useTokenStore()
async function doLogin() {
  if (tokenStore.hasLogin) {
    uni.navigateBack()
    return
  }
  try {
    // 调用登录接口
    await tokenStore.login({
      username: '菲鸽',
      password: '123456',
    })
    console.log(redirectUrl.value)
  }
  catch (error) {
    console.log('登录失败', error)
  }
  useRedirect(option.value)
}
</script>

<template>
  <view class="login">
    <!-- 本页面是非MP的登录页，主要用于 h5 和 APP -->
    <view class="text-center">
      登录页
    </view>
    <button class="mt-4 w-40 text-center" @click="doLogin">
      点击模拟登录
    </button>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
