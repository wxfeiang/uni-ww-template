import { md5 } from 'js-md5'
import { Methods } from './methodUtils'
import { ParamsCrypt } from './paramsCrypt'
import { ResultCrypt } from './resultCrypt'

// 返回参数加解密

export class WwCryptUtils extends Methods {
  private systemStore: SysTemType
  private resultCrypt: ResultCrypt
  private paramsCrypt: ParamsCrypt

  constructor(systemData: SysTemType) {
    super(systemData.filterData)
    this.systemStore = systemData
    this.paramsCrypt = new ParamsCrypt(systemData.dot, systemData.resstrppd)
    this.resultCrypt = new ResultCrypt()
  }

  /**
   * 创建签名方法
   * @param obj - 需要生成签名的对象
   * @returns 返回加密后的签名字符串
   */
  createSign(obj: object): string {
    const str = this.objectToStringUrl(obj)
    const md5Str = md5(str).toString()
    return this.resultCrypt.setResEncrypt(md5Str)
  }

  /**
   * 检查URL是否在白名单中
   * @param url 需要检查的URL地址
   * @return 如果URL在白名单中则返回true，否则返回false
   */
  isReleaseWhitelist(url: string): boolean {
    return this.systemStore.filterData.whiteList?.includes(url) ?? false
  }

  /**
   * 初始化请求配置，设置加密头和加密数据
   * @param method - 包含请求配置、数据和URL的对象
   */
  requestInit(method: any): void {
    // 设置请求头中的加密字段
    method.config.headers[this.API_ENCRYPT_HEADER] = this.setHeaderKey()
    // 打印原始入参数数据，包括请求体和参数
    console.info('原始入参数数据', method.data, method.config.params)
    // 如果是POST请求，对请求体数据进行加密
    if (method.type === 'POST') {
      method.data = this.setEncryptBodyData(method.data)
    }
    // 如果请求配置中没有params参数，则设置加密后的URL参数
    if (method.config?.params) {
      method.config.params = this.setEncryptParams(method.config.params, method.url)
    }
  }

  /**
   * 解密服务器响应数据的方法
   * @param {Response} res - 服务器响应对象，包含加密的数据和头部信息
   * @returns {object} - 解析后的JSON对象或错误信息对象
   */
  resultDecryption(res: any): any {
  // 从响应头中获取加密的响应密钥和初始化向量尝试获取不同大小写的头部字段名
    const aesResKey = res.header.responsek ?? res.header.ResponseK
    const aesResIv = res.header.responsev ?? res.header.Responsev
    // 检查解密结果是否为空，如果为空则返回错误信息
    if (!aesResKey || !aesResIv) {
      return { msg: '数据提示:系统解密异常!' }
    }
    const aesRes = this.paramsCrypt.setDecrypt(aesResKey ?? '')
    const aesResiv = this.paramsCrypt.setDecrypt(aesResIv ?? '')

    // 解密 res.data 并尝试将其解析为 JSON
    const decryptedData = this.resultCrypt.setResDecrypt(res.data, aesRes, aesResiv)
    if (!decryptedData) {
      return { msg: '数据解密失败:无法获取有效数据!' }
    }
    try {
      console.log('解密后数据', JSON.parse(decryptedData))
      return JSON.parse(decryptedData)
    }
    catch (error) {
      return { msg: `数据解析失败:无法解析为有效 JSON!, ${error}` }
    }
  }
}
