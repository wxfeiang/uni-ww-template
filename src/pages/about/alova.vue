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
  console.log('over', res.data)
})

const { send: send3, data: data3 } = useRequest(data => userInfo(data), {
  immediate: false,
}).onSuccess((res) => {
  console.log('onsuccness', res.data)
}).onError((err) => {
  console.log('error', err)
})

function wwjm() {
  send2()
}
</script>

<template>
  <view class="p-6 text-center">
    <button type="default" size="mini" class="my-6 w-160px" @click="wwjm">
      系统初始化
    </button>
    <button type="default" size="mini" class="my-6 w-160px" @click="send3">
      加密请求数据
    </button>
  </view>
  <view>
    {{ data2 }}
    {{ data3?.appKey }}
  </view>
</template>

<style lang="scss" scoped>
//
</style>
