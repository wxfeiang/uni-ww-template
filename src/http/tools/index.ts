// 定义枚举类型，表示 API 服务的名称
export enum ApiServiceName {
  DEFAULT,
  SECONDARY,
}

// API URL 字典
export const API_SERVE_URL: Record<ApiServiceName, string> = {
  [ApiServiceName.DEFAULT]: import.meta.env.VITE_SERVER_BASEURL!,
  [ApiServiceName.SECONDARY]: import.meta.env.VITE_API_SECONDARY_URL!,
}
//
export function changeMethod(method: object) {

}
