import CryptoJS from 'crypto-js'

/**
 * ResultCrypt 类，提供基于AES算法的加密和解密功能
 * 使用CBC模式，PKCS7填充方式
 */
class ResultCrypt {
  protected basicString = 'c1e73438-9892-4f31-a334-1e83b147a760'
  protected key: CryptoJS.lib.WordArray
  protected iv: CryptoJS.lib.WordArray

  constructor() {
    this.key = this.setKey(this.basicString)
    this.iv = this.setKey(this.basicString)
  }

  private setKey = (key: string) => {
    return CryptoJS.enc.Utf8.parse(key.slice(0, 16))
  }

  /**
   * 解密方法
   * @param word 需要解密的字符串（Base64编码）
   * @returns 解密后的字符串
   */
  setResDecrypt(word: string, aesRes: string, aesResiv: string): string {
    if (aesRes && aesResiv) {
      this.key = this.setKey(aesRes)
      this.iv = this.setKey(aesResiv)
    }
    const base64 = CryptoJS.enc.Base64.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(base64)
    const decrypt = CryptoJS.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr
  }

  /**
   * 使用AES加密算法对输入的字符串进行加密
   * @param word 需要加密的字符串
   * @returns 返回Base64编码的加密结果
   */
  setResEncrypt(word: string): string {
    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const base64Str = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
    return base64Str
  }
}

export { ResultCrypt }
