import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { LOGIN_PAGE } from '@/router/config'
import { afterResponse, beforeRequest, isExpired } from './tools'

/**
 * 创建请求实例
 */
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  // TODO: 根据实际情况处理token
  // async login(response) {
  //   const data = await response.clone().json();
  //   accessToken.value = data.accessToken;
  //   refreshToken.value = data.refreshToken;
  // },
  // logout() {
  //   accessToken.value = '';
  //   refreshToken.value = '';
  // },
  // assignToken(method) {
  //   method.config.headers.Authorization = '1121'
  // },
  // refreshToken ,无感刷新token
  refreshTokenOnError: {
    // 响应时触发，可获取到error和method，并返回boolean表示token是否过期
    // 当服务端返回401时，表示token过期，需要刷新token
    isExpired: error => isExpired(error),
    handler: async () => {
      try {
        // await authLogin();
        console.log('222222🍒======>>>>')
      }
      catch (error) {
        // 切换到登录页
        console.log('222222🍒======>>>>', error)
        await uni.reLaunch({ url: LOGIN_PAGE })
        throw error
      }
    },
  },
})

/**
 * alova 请求实例
 */
const alovaInstance = createAlova({
  // baseURL: import.meta.env.VITE_APP_PROXY_PREFIX,
  ...AdapterUniapp(),
  statesHook: VueHook,
  timeout: 5000,
  beforeRequest: onAuthRequired(method => beforeRequest(method)),
  responded: onResponseRefreshToken((response, method) => afterResponse(response, method)),
})

export const http = alovaInstance
