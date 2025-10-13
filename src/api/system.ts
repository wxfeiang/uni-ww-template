import { http } from '@/http/alova'
import { ApiService } from '@/http/tools/server'

export interface IFoo {
  id: number
  name: string
}

export function captchaConfig() {
  return http.Post<IFoo>('/captcha/config', { id: 1 }, {
    params: {
      b: 2,
      test: 13,
    },
    meta: {
      ignorEencrypt: true,
      loading: false,
    },
  })
}
export function test() {
  return http.Post<IFoo>('/test', { id: 1 }, {
    params: {
      b: 2,
      test: 13,
    },
    meta: {
      otherServiceUrl: ApiService.SECONDARY,
      ignorEencrypt: true,
    },
  })
}

interface SocialCardInfo {
  isReal: string
  isPay: string // "1" | "0" – Could be boolean
  cardName: string // Name on card (e.g., "雷雪")
  socialCardType: string // Could be enum if limited types exist
  cardId: string // Long numeric string ID
  userAvatar: string // URL to avatar image
  userPhone: string // Chinese phone number format
  idCardNumber: string // Chinese ID card format
  socialCard: string // Social card identifier (e.g., "F27847324")
  appKey: string // Likely platform identifier (e.g., "wx" for WeChat)
  userName: string // Actual user name (may differ from cardName)
  userDId: string // Long numeric string user ID
}

export function userInfo(data: any) {
  return http.Post<SocialCardInfo>('/member/app/xcxLogin/getUserLoginInfo', {
    appKey: 'wx',
    timestamp: 1759025493000,
    replay: 'b59e3b84-b4d2-4822-80f6-549e45718b03',
    userId: '1903988113338949633',
    userDId: '1903988113338949633',
    phone: '18193278565',
    merchantId: '1903996070706343938',
    cardId: '1903988511097380865',
    terminal: 'h5',
    ...data,
  })
}
