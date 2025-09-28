import JSEncrypt from 'jsencrypt'

class ParamsCrypt {
  private dot: string
  private resStrPpd: string
  encryptor: JSEncrypt

  /**
   * 构造函数，用于初始化实例对象
   * @param {string} dot - 点标识符，可选参数，默认为空字符串
   * @param {string} resStrPpd - 资源字符串前缀，可选参数，默认为空字符串
   */
  constructor(dot, resStrPpd) {
    this.dot = dot ?? ''
    this.resStrPpd = resStrPpd ?? ''
    this.encryptor = new JSEncrypt()
  }

  private getPublicKey(): string {
    return this.dot || ''
  }

  private getPrivateKey(): string {
    return this.resStrPpd ?? ''
  }

  // 加密
  /**
   * 加密方法
   * @param txt 需要加密的字符串
   * @return 返回加密后的字符串
   */
  setEncrypt(txt: string): string {
    this.encryptor.setPublicKey(this.getPublicKey()) // 设置公钥
    return this.encryptor.encrypt(txt) || '' // 对需要加密的数据进行加密，如果加密结果为null则返回空字符串
  }

  // 解密
  /**
   * 使用私钥解密文本的方法
   * @param txt - 需要解密的字符串
   * @returns 解密后的字符串，如果解密失败则返回空字符串
   */
  setDecrypt(txt: string): string {
    this.encryptor.setPrivateKey(this.getPrivateKey())
    return this.encryptor.decrypt(txt) || ''
  }

  // 密码转换
  /**
   * 修改密码方法
   * @param password - 需要修改的新密码字符串
   * @returns 返回处理后的加密密码字符串
   */
  setEncryptPassword(password: string): string {
    // 去除输入密码的前后空格，然后进行加密处理
    const encryptedPassword = this.setEncrypt(password.trim())
    return encodeURI(encryptedPassword).replace(/\+/g, '%2B')
  }
}
export { ParamsCrypt }
