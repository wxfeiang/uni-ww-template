import { defineStore } from 'pinia'
import { ref } from 'vue'

interface AuthState {
  token?: string
}
interface STSCONFIG {
  paramId: string
  enable: boolean
  paramList: any
  expandMap: any
  headerKey: string
  type: string
  whiteList: string[]
}
export const useSystemStore = defineStore(
  'systemStore',
  () => {
    const appSecret = ref('')

    const resstrppd = ref('') // 解密
    const filterData = ref(<STSCONFIG>{})
    const dot = ref('')

    function RESSTRPPD(value: string) {
      resstrppd.value = value
    }

    function fILTERDATA(value: STSCONFIG) {
      filterData.value = value
    }
    function DOT(value: string) {
      dot.value = value
    }

    function initSystemInfo() {
      let status = false
      if (!resstrppd.value || !filterData.value || !dot.value) {
        status = true
      }
      return status
    }

    return {
      RESSTRPPD,
      fILTERDATA,
      DOT,
      appSecret,
      resstrppd,
      filterData,
      dot,
      initSystemInfo,
    }
  },
  {
    persist: true,
  },
)
