import { isH5 } from '@uni-helper/uni-env' // TODO: 单独抽离的话删掉
// 定义枚举类型，表示 API 服务的名称
export enum ApiService {
  DEFAULT = 'DEFAULT',
  SECONDARY = 'SECONDARY',
}

interface ServiceConfig {
  baseURL: string // 实际服务地址（非H5用）
  proxyPrefix: string // H5代理前缀（如 '/api'）
  proxyTarget?: string // （可选）代理目标地址，默认用 baseURL
}

export const SERVICES: Record<ApiService, ServiceConfig> = {
  [ApiService.DEFAULT]: {
    baseURL: import.meta.env.VITE_SERVER_BASEURL,
    proxyPrefix: import.meta.env.VITE_APP_PROXY_PREFIX,
  },
  [ApiService.SECONDARY]: {
    baseURL: import.meta.env.VITE_API_SECONDARY_URL,
    proxyPrefix: import.meta.env.VITE_APP_PROXY_PREFIX_SECONDARY,
  },
}
/**
 * 根据配置服务器URL
 * @param {object} config - 配置对象，包含meta信息
 * @returns {string} 返回拼接后的服务器URL
 */
export function resolveApiUrl(service: ApiService = ApiService.DEFAULT): string {
  const { baseURL, proxyPrefix } = SERVICES[service]
  return isH5 ? proxyPrefix : baseURL
}

/**
 * 创建代理服务器配置对象
 * 该函数遍历所有服务配置，为每个服务创建代理规则
 * @returns {object} 返回包含所有服务代理配置的对象
 */
export function proxyServer() {
  return Object.values(SERVICES).reduce((proxy, service) => {
    proxy[service.proxyPrefix] = {
      target: service.baseURL,
      changeOrigin: true,
      secure: false,
      bypass(req, res, options: any) {
        const proxyURL = options.target + options.rewrite(req.url)
        console.log('proxyURL:==>>', proxyURL)
        req.headers['x-req-proxyURL'] = proxyURL // 设置未生效
        res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
      },
      rewrite: path => path.replace(new RegExp(`^${service.proxyPrefix}`), ''),
    }
    return proxy
  }, {})
}
