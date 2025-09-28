// system params type

// 定义 Header 接口
interface Header {
  responsek?: string
  ResponseK?: string
  responsev?: string
  Responsev?: string
}
// 定义 Response 接口
interface Response {
  header: Header
  data: string
}

interface ParamList {
  enable: boolean
  paramList: string[]
  whiteList: string[]
  headerKey: string
  expandMap: { [key: string]: any[] }
  type: string
  paramId: string
}
interface FilterData {
  enable: boolean
  paramList: string[]
  whiteList: string[]
  headerKey: string
  expandMap: { [key: string]: any[] }
  type: string
  paramId: string
}
interface SysTemType {
  appSecret: string
  resstrppd: string
  filterData: FilterData
  dot?: string
}
