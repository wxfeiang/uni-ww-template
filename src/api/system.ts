import type { Meta } from '@/http/types'
import { http } from '@/http/alova'
import { ApiService } from '@/http/tools/server'

export interface IFoo {
  id: number
  name: string
}

export function captchaConfig() {
  const meta: Partial<Meta> = {
    ignorEencrypt: true,
  }

  return http.Post<IFoo>('/captcha/config', { id: 1 }, {
    params: {
      b: 2,
      test: 13,
    },
    meta,
  })
}
export function test() {
  const meta: Partial<Meta> = {
    otherServiceUrl: ApiService.SECONDARY,
    ignorEencrypt: true,
  }

  return http.Post<IFoo>('/test', { id: 1 }, {
    params: {
      b: 2,
      test: 13,
    },
    meta,
  })
}
export function userInfo() {
  return http.Post('/member/app/xcxLogin/getUserLoginInfo', {
    appKey: 'wx',
    timestamp: 1759025493000,
    replay: 'b59e3b84-b4d2-4822-80f6-549e45718b03',
    userId: '1903988113338949633',
    userDId: '1903988113338949633',
    phone: '18193278565',
    merchantId: '1903996070706343938',
    cardId: '1903988511097380865',
    terminal: 'h5',
  })
}
