import { tabbarList } from '@/tabbar/config'
import { isPageTabbar } from '@/tabbar/store'
import { ensureDecodeURIComponent, parseUrlToObj } from '@/utils'

const redirectUrl = ref('')
export default function useRedirect(options) {
  console.log('login options: ', options)
  if (options.redirect) {
    redirectUrl.value = ensureDecodeURIComponent(options.redirect)
  }
  else {
    redirectUrl.value = tabbarList[0].pagePath
  }

  let path = redirectUrl.value
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  const { path: _path, query } = parseUrlToObj(path)
  console.log('_path:', _path, 'query:', query, 'path:', path)
  console.log('isPageTabbar(_path):', isPageTabbar(_path))
  if (isPageTabbar(_path)) {
    uni.switchTab({
      url: path,
    })
  }
  else {
    console.log('redirectTo:', path)
    uni.redirectTo({
      url: path,
    })
  }
}
