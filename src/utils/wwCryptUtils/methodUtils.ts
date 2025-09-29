import { isH5 } from '@uni-helper/uni-env' // TODO: 单独抽离的话删掉
import CryptoJS from 'crypto-js'
import { Base64 } from 'js-base64'
import JSEncrypt from 'jsencrypt'
import { isObject, isString } from 'lodash-es'
import qs from 'qs'
import { sm2, sm4 } from 'sm-crypto'

class Methods {
  API_ENCRYPT_KEY: string
    = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp5t8glnlZKID+pMuDrOSdHB5ADX3sh9EeSaEk0LdydPKR/+xSp63xlIx1FJRaTdljWDaLx3NTVJn5cyEOV3kXU/2diDVPBUOrfljJGFC1FaZh70tO8KWJNQZErImIHYTeDie5yV9Kk55ZYH6p6zjTWZHZ3+tYKWyLef107twkxQhDSDM6mjKfpT6UCvewLrRLa4CM2HR+bvbizNlVWAtYajhtkmDZdQPNHw92ujqltf5GOBVY98KN+VKfRhor7XZeKaXX23KLAyGzpY+PkhHm5ksG3dDXQdtHjQJ+VZD/EcPBMICTwhfgZsLtwgWbqgEat5j9AHHRyDKmUZkmY+DzQIDAQAB'

  API_ENCRYPT_HEADER = 'puubke'
  filterData: FilterData
  aseKey: string

  constructor(filterData: FilterData) {
    this.filterData = filterData
    this.aseKey = this.setAesKey()
  }

  /**
   * 设置AES密钥
   * @param len 密钥长度，默认为16
   * @returns 返回生成的密钥字符串
   */
  private setAesKey(len = 16): string {
    const length = len
    if (isH5) {
      const key = this.md5Crypto(window.crypto.getRandomValues(new Uint32Array(1))[0] as any)
      return this.isSmEncryptSm() ? key : this.md5Crypto(key).substring(0, length)
    }
    else {
      let key = ''
      const characters = '0123456789abcdefghijklmnopqrstuvwxyz'
      for (let i = 0; i < length; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      return key
    }
  }

  setHeaderKey() {
    return this.asyEncry(this.aseKey, this.filterData.paramId)
  }

  /**
   * 将URL字符串转换为对象
   * @param url - 需要转换的URL字符串，可以包含查询参数
   * @returns 返回一个包含查询参数的对象
   */
  urlToObject(url: string) {
    if (url.includes('?')) {
      url = url.split('?')[1]
    }

    return qs.parse(url, { ignoreQueryPrefix: true })
  }

  /**
   * 获取URL的前缀部分，移除查询参数
   * @param url 完整的URL字符串
   * @returns 返回不带查询参数的URL前缀部分
   */
  getUrlPrefix(url: string) {
    if (url.includes('?')) {
      url = url.split('?')[0]
    }

    // 返回处理后的URL
    return url
  }

  /**
   * 将对象转换为URL查询字符串格式的字符串
   * @param obj 需要转换的对象
   * @returns 返回转换后的字符串，格式为"key1=value1&key2=value2"
   */
  objectToStringUrl(obj: object): string {
    if (Object.keys(obj).length === 0) {
      return ''
    }
    const keys = Object.keys(obj).sort()
    // 过滤掉空值（除了 0 或 false）
    const nonEmptyKeys = keys.filter(key => obj[key] !== null && obj[key] !== undefined)
    const keyValuePairs = nonEmptyKeys.map((key) => {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim()
      }
      if (Array.isArray(obj[key])) {
        return obj[key].length > 0
          ? `${key}=${JSON.stringify(obj[key])}`
          : `${key}=[]`
      }
      else {
        return `${key}=${obj[key]}`
      }
    })
    // 使用 & 符号连接键值对
    return keyValuePairs.join('&')
  }

  /**
   * 是否对当前参数加密
   * @param url 请求地址
   * @returns 是否加密
   */
  private shouldEncryptParam(url: string): boolean {
    const expandMap = this.filterData.expandMap || {}
    if (Object.keys(expandMap).length === 0) {
      return true
    }
    for (const k in expandMap) {
      const key = k.replaceAll('-', '/')
      const patterns = expandMap[k]
      if (url.includes(key) && patterns.length === 0) {
        return false
      }
    }
    return true
  }

  /**
   * 对参数体加密
   * @param param  参数JSON 对象
   * @param url 请求地址
   * @returns  加密后的参数JSON 对象
   */
  setEncryptParams(param: any, url: string) {
    const obj: any = {}
    for (const prop in param) {
      const value = param[prop]
      if (value === null || value === undefined) {
        obj[prop] = ''
      }
      else if (this.filterData?.paramList?.includes(prop)) {
        obj[prop] = value
      }
      else {
        if (!this.shouldEncryptParam(url)) {
          obj[prop] = value
        }
        else {
          obj[prop] = this.syEncry(value.toString())
        }
      }
    }
    return qs.stringify(obj, { arrayFormat: 'brackets' })
  };

  setEncryptBodyData(data: any) {
    // method.data // boject

    if (isObject(data)) {
      return this.syEncry(JSON.stringify(data))
    }
    if (isString(data)) {
      return this.setEncryptUrl(data)
    }
    if (this.isFormData(data)) {
      return this.setEncryptFormData(data)
    }
  }

  /**
   * 设置加密URL的方法
   * @param url 需要处理的URL字符串
   * @returns 处理后的加密URL
   */
  setEncryptUrl(url: string) {
    url = decodeURIComponent(url)
    // 将URL分割为路径和查询字符串两部分
    const [path, query] = url.split('?')

    // 初始化参数对象
    let params = {}

    if (query) {
      params = qs.parse(query, { arrayFormat: 'brackets' })
    }

    // 如果参数对象不为空，则进行加密处理
    if (Object.keys(params).length > 0) {
      params = this.setEncryptParams(params, url)
      const encodedParams = qs.stringify(params, { arrayFormat: 'brackets' })

      url = `${path}?${encodedParams}`
    }
    return url
  };

  /**
   * 设置加密FormData的方法
   * @param url 需要处理的URL字符串
   * @returns 处理后的加密URL
   */
  setEncryptFormData(data: any) {
    data.forEach((v: any, k: any) => {
      if (!v) {
        data.set(k, '')
      }
      else if (this.filterData.paramList.includes(k)) {
        data.set(k, v)
      }
      else if (Object.keys(this.filterData.expandMap).length > 0) {
        const isEncrypt = Object.keys(this.filterData.expandMap).some((u) => {
          const key = u.replaceAll('-', '/')
          const val = this.filterData.expandMap[u]
          return data?.url?.includes(key) && val.includes(k)
        })
        data.set(k, isEncrypt ? this.syEncry(v) : v)
      }
      else {
        data.set(k, this.syEncry(decodeURIComponent(v)))
      }
    })
    return data
  }

  /**
   * 获取连续解码后的验证码
   * @param count 解码次数
   * @returns 解码后的字符串
   */
  getContCode(count: number): string {
    let initialCode = ''
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        initialCode = Base64.decode(initialCode)
      }
    }
    return initialCode
  }

  isFormData<T>(v: T): boolean {
    return Object.prototype.toString.call(v) === '[object FormData]'
  }

  /**
   * 使用MD5算法对输入字符串进行加密
   * @param data 需要进行MD5加密的字符串
   * @returns 返回经过MD5加密后的字符串
   */
  md5Crypto(data: string) {
    return CryptoJS.MD5(data).toString()
  }

  // sm4加密
  sm4Encrypt(data: string) {
    return sm4.encrypt(data, this.aseKey)
  }

  // sm2加密
  sm2Encrypt(data: string) {
    return `04${sm2.doEncrypt(data, this.aseKey, 1).toUpperCase()}`
  }

  // rsa 加密
  rsaEncrypt(data: string, key?: string) {
    const encryptTool = new JSEncrypt()
    encryptTool.setPublicKey(key ?? this.aseKey)
    return encryptTool.encrypt(data) as string
  }

  // aes 加密
  aesEncrypt(data: string) {
    const readyKey = CryptoJS.enc.Utf8.parse(this.aseKey)
    const readyText = CryptoJS.enc.Utf8.parse(data)
    const encryptedText = CryptoJS.AES.encrypt(readyText, readyKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encryptedText.toString()
  }

  isSmEncryptSm(): boolean {
    return this.filterData.type === 'sm'
  }

  // 对称加密
  syEncry(data: string): string {
    return this.isSmEncryptSm() ? this.sm4Encrypt(data) : this.aesEncrypt(data)
  }

  // 非对称加密
  asyEncry(data: string, key?: string): string {
    return this.isSmEncryptSm() ? this.sm2Encrypt(data) : this.rsaEncrypt(data, key)
  }
}

export {
  Methods,
}
