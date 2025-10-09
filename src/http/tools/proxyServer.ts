export enum ApiService {
  DEFAULT = 'DEFAULT',
  SECONDARY = 'SECONDARY',
}

/**
 * 创建代理服务器配置对象
 * 该函数遍历所有服务配置，为每个服务创建代理规则
 * @returns {object} 返回包含所有服务代理配置的对象
 */
export function proxyServer(env) {
  // 得到整个环境变量
  const {
    VITE_SERVER_BASEURL,
    VITE_APP_PROXY_PREFIX,
    VITE_API_SECONDARY_URL,
    VITE_APP_PROXY_PREFIX_SECONDARY,
  } = env

  const proxyConfigArr = {
    [ApiService.DEFAULT]: {
      baseURL: VITE_SERVER_BASEURL,
      proxyPrefix: VITE_APP_PROXY_PREFIX,
    },
    [ApiService.SECONDARY]: {
      baseURL: VITE_API_SECONDARY_URL,
      proxyPrefix: VITE_APP_PROXY_PREFIX_SECONDARY,
    },
  }
  return Object.values(proxyConfigArr).reduce((proxy, service) => {
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
