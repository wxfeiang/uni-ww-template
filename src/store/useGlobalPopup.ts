import { defineStore } from 'pinia'
import { CommonUtil } from 'wot-design-uni'
import { getCurrentPath } from '@/utils'

interface popupOptions {
  show: boolean
  // 是否显示遮罩层
  modal: boolean
  // 是否点击遮罩层关闭
  closeOnClickModal: boolean
  // 弹窗类型(自定义需要显示对应的组件)
  showType: 1 | 2
}
const defaultOptions: popupOptions = {
  show: false,
  modal: true,
  closeOnClickModal: true,
  showType: 1,
}
export const useGlobalPopup = defineStore('global-popup', () => {
  const popupOptions = ref<popupOptions>({
    show: false,
    modal: true,
    closeOnClickModal: true,
    showType: 1,
  })
  const currentPage = ref('')
  const show = (option: popupOptions | boolean) => {
    currentPage.value = getCurrentPath()
    const options = CommonUtil.deepMerge(
      popupOptions.value,
      typeof option === 'boolean' ? { ...popupOptions.value, show: true } : { ...popupOptions.value, ...option, show: true },
    ) as popupOptions

    popupOptions.value = options
  }
  const close = () => {
    popupOptions.value = defaultOptions
  }
  return {
    popupOptions,
    currentPage,
    show,
    close,
  }
})
