import type { IResponse } from '../types'
import dayjs from 'dayjs'

import { useGlobalToast, useSystemStore, useUserStore } from '@/store'
import { WwCryptUtils } from '@/utils/wwCryptUtils'
import { ContentTypeEnum, ResultEnum, ShowMessage } from './enum'
import { resolveApiUrl } from './server'

/**
 * 显示提示信息并返回一个拒绝的Promise
 * @param message - 要显示的提示信息内容
 * @returns 返回一个被拒绝的Promise，拒绝值为包含错误信息的Error对象
 */
export function showToast(message: string) {
  uni.showToast({
    title: message,
    icon: 'none',
  })
  const error = new Error(message)
  Object.assign(error, { message })
  return Promise.reject(error)
}

/**
 * 创建UUID（Universally Unique Identifier）的函数
 * @param message - 用于生成UUID的输入消息字符串
 * @returns 返回生成的UUID字符串
 */
export function generateUUID() {
  const hexDigits = '0123456789abcdef'
  // 安全获取随机字节
  const bytes = (() => {
    if (typeof wx !== 'undefined' && wx.getRandomValues) {
      const arr = new Uint8Array(16)
      wx.getRandomValues(arr)
      return Array.from(arr, byte => byte)
    }
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
  })()
  return bytes
    .map((b, i) => {
      if (i === 6)
        return '4'
      if (i === 8)
        return hexDigits[(b & 0x3) | 0x8]
      return hexDigits[b % 16]
    })
    .join('')
    .replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5')
}

/**
 * 发起请求前的预处理函数
 * @param {object} method - 请求方法对象，包含请求配置、参数等信息
 */
export function beforeRequest(method) {
  const CryptUtils = new WwCryptUtils(useSystemStore())
  // 设置默认 Content-Type
  method.config.headers = {
    ContentType: ContentTypeEnum.JSON,
    Accept: 'application/json, text/plain, */*',
    ...method.config.headers,
  }
  const { config } = method
  // 处理动态域名多服务
  method.baseURL = resolveApiUrl(config.meta?.otherServiceUrl)
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
  // FIX: 可根据实际情况变更  初始化参数
  const initParams = {
    appKey: 'ceshi ',
    timestamp: dayjs().valueOf(),
    replay: generateUUID(),
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
  console.info('beforeRequest:', method)
}

/**
 * 处理请求响应后的函数
 * @param {object} method - 请求方法对象，包含请求配置、返回信息解密
 */
export function afterResponse(response, method) {
  const globalToast = useGlobalToast()
  globalToast.success('dsd')

  console.info('afterResponse:', response)
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
    return showToast(errorMessage)
  }
  // 处理业务逻辑
  const { data } = rawData as IResponse
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
    return showToast(data?.msg || '请求失败!')
  }

  return resEencryptData
}
