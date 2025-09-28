<script lang="ts" setup>
import { useRequest } from 'alova/client'

import { captchaConfig, userInfo } from '@/api/system'

definePage({
  style: {
    navigationBarTitleText: 'Alova 演示',
  },
})

const { loading: loading2, data: data2, send: send2 } = useRequest(captchaConfig, {

  immediate: false,
}).onComplete((res) => {
  console.log('🍅', res)
})

const { send: send3 } = useRequest(userInfo, {

  immediate: false,
}).onSuccess((res) => {
  console.log('🍅', res)
}).onError((err) => {
  console.log('🍅', err)
})

function wwjm() {
  console.log('🍅')
  send2()
}
</script>

<template>
  <view class="p-6 text-center">
    <button type="default" size="mini" class="my-6 w-160px" @click="wwjm">
      万维测试加密请求
    </button>
    <button type="default" size="mini" class="my-6 w-160px" @click="send3">
      万维测试加密请求
    </button>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
