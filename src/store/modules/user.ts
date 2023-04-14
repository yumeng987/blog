import { Ref, ref, UnwrapRef } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { type ILoginData, loginApi, checkLoginApi, registerApi } from "@/api/user"

interface userInfo {
  account: string
  addTime: string
  avatar: string | number
  avatarUrl: string
  token: string
  updatetime: string
  userId: string | number
}

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const userInfo = ref<userInfo>()
  const isLogin: Ref<UnwrapRef<boolean | undefined>> = ref(undefined)
  const test =ref()

  const checkLogin = () => {
    return new Promise((resolve, reject) => {
      checkLoginApi()
        .then((res: any) => {
          const data: string = res.msg
          if (data.includes("未登录")) {
            isLogin.value = false
            window.localStorage.clear()
            reject(false)
          }
          const item = window.localStorage.getItem("userInfo")
          if (item) {
            const info: userInfo = JSON.parse(item)
            if (info.token) {
              userInfo.value = info
              isLogin.value = true
              setToken(info.token)
              resolve(true)
            }
          } else {
            removeToken()
            reject(false)
          }
        })
        .catch(() => {
          window.localStorage.clear()
          reject(false)
        })
    })
  }

  const register = (loginData: ILoginData) => {
    return new Promise((resolve, reject) => {
      registerApi(loginData)
        .then((res) => {
          // @ts-ignore
          if (res.msg.includes("成功")) {
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /** 登录 */
  const login = (loginData: ILoginData) => {
    return new Promise((resolve, reject) => {
      loginApi({
        account: loginData.account,
        password: loginData.password
      })
        .then((res: any) => {
          isLogin.value = true
          userInfo.value = res.data
          window.localStorage.setItem("userInfo", JSON.stringify(res.data))
          setToken(res.data.token)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    window.localStorage.clear()
    token.value = ""
    roles.value = []
    resetRouter()
    router.push("/").then(() => {
      location.reload()
    })
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return { isLogin, token, roles, login, logout, resetToken, checkLogin, userInfo, register,test }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
