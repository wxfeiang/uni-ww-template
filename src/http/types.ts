import type { ApiService } from './tools/server'

/**
 * 在 uniapp 的 RequestOptions 和 IUniUploadFileOptions 基础上，添加自定义参数
 */
export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

export interface HttpRequestResult<T> {
  promise: Promise<T>
  requestTask: UniApp.RequestTask
}

// 通用响应格式
export interface IResponse<T = any> {
  code: number | string
  data: T
  message: string
  status: string | number
  msg?: string
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
  [key: string]: any
}

// 分页响应数据
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
interface dataResponse<T = any> {
  /** 响应消息 */
  msg: string
  /** 状态码 */
  code: number
  /** 响应数据 */
  data: T
  /** 时间戳 */
  ts: number
}

// 元数据信息
export interface Meta<T = unknown> {
  data?: T
  ignoreSign?: boolean // 忽略签名
  ignorEencrypt?: boolean // 忽略加密
  ignorToken?: boolean // 忽略token
  resAll: boolean // 返回所有数据
  noEencryptData?: boolean // 不加解密的情况下只返回data
  loading?: boolean // 是否显示全局loading 默认不显示
  loadingText?: string // 全局loading文字
  Tips?: boolean // 是否显示  /全局提示 (默认显示: false)  true 不在全局显示
  initParams?: boolean // 是否需要初始参数
  otherServiceUrl?: ApiService // 其他服务地址 // 默认第一服务地址
  headers?: Record<string, any> // 其他请求头 (alova 参数未知也有headers)
}
