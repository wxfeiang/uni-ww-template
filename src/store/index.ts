import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)

export default store

export * from './system'
// 模块统一导出
export * from './theme'
export * from './token'
export * from './useGlobalLoading'
export * from './useGlobalMessage'
export * from './useGlobalToast'
export * from './user'
