import type { ApiService } from './tools/server'
import 'alova'

declare module 'alova' {
  export interface AlovaCustomTypes {
    meta: {
      ignoreSign?: boolean // 忽略签名
      ignorEencrypt?: boolean // 忽略加密
      ignorToken?: boolean // 忽略token
      resAll?: boolean // 返回所有数据
      noEencryptData?: boolean // 不加解密的情况下只返回data
      loading?: boolean // 是否显示全局loading 默认不显示
      loadingText?: string // 全局loading文字
      Tips?: boolean // 是否显示  /全局提示 (默认显示: false)  true 不在全局显示
      initParams?: boolean // 是否需要初始参数
      otherServiceUrl?: ApiService // 其他服务地址 // 默认第一服务地址
      headers?: Record<string, any> // 其他请求头 (alova 参数未知也有headers)
    }
  }
}
