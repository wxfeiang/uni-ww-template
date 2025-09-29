export enum ResultEnum {
  // 0和200当做成功都很普遍，这里直接兼容两者（PS：0和200通常都不会当做错误码，但是有的接口会返回0，有的接口会返回200）
  Success0 = 0, // 成功
  Success200 = 200, // 成功
  Error = 400, // 错误
  Unauthorized = 401, // 未授权
  Forbidden = 403, // 禁止访问（原为forbidden）
  NotFound = 404, // 未找到（原为notFound）
  MethodNotAllowed = 405, // 方法不允许（原为methodNotAllowed）
  RequestTimeout = 408, // 请求超时（原为requestTimeout）
  InternalServerError = 500, // 服务器错误（原为internalServerError）
  NotImplemented = 501, // 未实现（原为notImplemented）
  BadGateway = 502, // 网关错误（原为badGateway）
  ServiceUnavailable = 503, // 服务不可用（原为serviceUnavailable）
  GatewayTimeout = 504, // 网关超时（原为gatewayTimeout）
  HttpVersionNotSupported = 505, // HTTP版本不支持（原为httpVersionNotSupported）
}
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

interface ErrorMessageMap {
  [key: number]: string
}

const HTTP_ERROR_MESSAGES: ErrorMessageMap = {
  400: '请求错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求出错',
  408: '请求超时',
  500: '服务器错误',
  501: '服务未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'HTTP版本不受支持',
}

function getErrorMessage(status: number): string {
  return HTTP_ERROR_MESSAGES[status] ?? `连接出错(${status})`
}
/**
 * 根据状态码，生成对应的错误信息
 * @param {number|string} status 状态码
 * @returns {string} 错误信息
 */
/**
 * 根据HTTP状态码返回对应的错误信息
 * @param status - HTTP状态码，可以是数字或字符串形式
 * @returns 返回格式化的错误信息字符串
 */
export function ShowMessage(status: number | string): string {
  const statusCode = Number(status) // 将输入的状态码转换为数字类型

  // 验证输入是否为有效的 HTTP 状态码（100-599之间）
  if (Number.isNaN(statusCode) || statusCode < 100 || statusCode >= 600) {
    return `未知错误(${status})，请检查网络或联系管理员！`
  }

  const message = getErrorMessage(statusCode) // 获取对应状态码的错误信息
  return `${message}，请检查网络或联系管理员！`
}
