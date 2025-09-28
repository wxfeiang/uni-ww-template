import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { IResponse } from './types'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { LOGIN_PAGE } from '@/router/config'
import { useSystemStore, useUserStore } from '@/store'
import { WwCryptUtils } from '@/utils/wwCryptUtils'
import { ContentTypeEnum, ResultEnum, ShowMessage, showToast } from './tools/enum'

/**
 * 创建请求实例
 */
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
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
    // 当服务端返回401时，表示token过期

    isExpired: (error) => {
      console.log('🍒======>>>>', error)
      return error.response?.status === ResultEnum.Unauthorized
    },
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

function beforeRequest(method) {
  const CryptUtils = new WwCryptUtils(useSystemStore())
  // 设置默认 Content-Type
  method.config.headers = {
    ContentType: ContentTypeEnum.JSON,
    Accept: 'application/json, text/plain, */*',
    ...method.config.headers,
  }
  const { config } = method
  // 处理动态域名多服务
  // method.baseURL = API_SERVE_URL[config.meta?.otherServiceUrl ?? ApiServiceName.DEFAULT]

  // 处理token
  if (!method?.meta?.ignorToken) {
    // token 可能是对象
    const token = {
      a: 1,
      b: 1,
    }
    method.config.headers = { ...method.config.headers, ...token }
  }
  // 其他Headers
  if (config.meta?.headers) {
    method.config.headers = { ...method.config.headers, ...config.meta.headers }
  }

  const userStore = useUserStore()
  const initParams = {
    appKey: 'ceshi ',
    timestamp: dayjs().valueOf(),
    replay: uuidv4(),
    userId: userStore.userInfo.userDId,
    userDId: userStore.userInfo.userDId,
    phone: userStore.userInfo.userPhone,
    merchantId: userStore.userInfo.merchantId,
    cardId: userStore.userInfo.cardId,
    terminal: '当前终端',
  }
  // 默认参数

  if (!config.meta?.initParams) {
    // 处理URL的参数合并
    const urlParas = CryptUtils.urlToObject(method.url)
    if (method.type === 'GET') {
      method.params = {
        ...initParams,
        ...method.params,
        ...urlParas,
      }
    }
    else {
      method.data = {
        ...initParams,
        ...method.data,
      }
      method.params = {
        ...urlParas,
      }
    }
  }
  if (!config.meta?.ignoreSign) {
    config.headers.sign = method.type === 'GET' ? CryptUtils.createSign(method.params) : CryptUtils.createSign(method.data)
  }
  else {
    config.headers.sign = ''
  }
  // 非白名单
  if (!config.meta?.ignorEencrypt && !CryptUtils.isReleaseWhitelist(method.url)) {
    CryptUtils.requestInit(method)
  }
}
function afterResponse(response, method) {
  console.log('🥜[response]:', response)
  const CryptUtils = new WwCryptUtils(useSystemStore())

  const { config } = method
  const { requestType, meta } = config
  const {
    statusCode,
    data: rawData,
    errMsg,
  } = response as UniNamespace.RequestSuccessCallbackResult

  // 处理特殊请求类型（上传/下载）
  if (requestType === 'upload' || requestType === 'download') {
    return response
  }
  // 处理 HTTP 状态码错误
  if (statusCode !== 200) {
    const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
    uni.showToast({
      title: errorMessage,
      icon: 'error',
    })
    return new Error(`${errorMessage}：${errMsg}`)
  }
  // 处理业务逻辑
  const { code, message, data } = rawData as IResponse
  // 整体数据
  if (meta?.resAll) {
    return response
  }

  // 不加密 data
  if (meta?.noEencryptData || meta?.ignorEencrypt || CryptUtils.isReleaseWhitelist(method.url)) {
    return data
  }
  if (data?.code && data?.code * 1 !== ResultEnum.Success200) {
    return showToast(data.msg)
  }

  // 加密 data
  const resEencryptData = CryptUtils.resultDecryption(response)
  if (resEencryptData?.code !== ResultEnum.Success200) {
    return showToast(data.msg)
  }
  // 处理成功响应，返回业务数据
  return resEencryptData
}

/**
 * alova 请求实例
 */
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_APP_PROXY_PREFIX,
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,
  beforeRequest: onAuthRequired(method => beforeRequest(method)),
  responded: onResponseRefreshToken((response, method) => afterResponse(response, method)),
})

export const http = alovaInstance
