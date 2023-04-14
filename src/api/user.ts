import { request } from "@/utils/service"

export interface ILoginData {
  /** admin 或 editor */
  account: string
  /** 密码 */
  password: string

  avatar?: string|number
}

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request({
    url: "login/code",
    method: "get"
  })
}
/** 登录并返回 Token */
export function loginApi(data: ILoginData) {
  return request({
    url: "login",
    method: "post",
    data,
    // 利用 transformRequest 进行转换配置
    transformRequest: [
      function (oldData) {
        // console.log(oldData)
        let newStr = ""
        for (const item in oldData) {
          newStr += encodeURIComponent(item) + "=" + encodeURIComponent(oldData[item]) + "&"
        }
        newStr = newStr.slice(0, -1)
        return newStr
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}
/** 获取用户详情 */
export function getUserInfoApi() {
  return request({
    url: "role/getMyRole",
    method: "get"
  })
}
export function checkLoginApi() {
  return request({
    url: "checkLogin",
    method: "get"
  })
}
export function registerApi(data: ILoginData) {
  return request({
    url: "register",
    method: "post",
    data,
    // 利用 transformRequest 进行转换配置
    transformRequest: [
      function (oldData) {
        // console.log(oldData)
        let newStr = ""
        for (const item in oldData) {
          newStr += encodeURIComponent(item) + "=" + encodeURIComponent(oldData[item]) + "&"
        }
        newStr = newStr.slice(0, -1)
        return newStr
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}

export function getAboutMe() {
  return request({
    url: "aboutMe",
    method: "get"
  })
}
export function updateInfo(data:{avatar?:string|number,oldPassword?:string,newPassword?:string}) {
 return request({
    url: "updateInfo",
    method: "post",
   data,
   transformRequest: [
     function (oldData) {
       // console.log(oldData)
       let newStr = ""
       for (const item in oldData) {
         newStr += encodeURIComponent(item) + "=" + encodeURIComponent(oldData[item]) + "&"
       }
       newStr = newStr.slice(0, -1)
       return newStr
     }
   ],
   headers: {
     "Content-Type": "application/x-www-form-urlencoded"
   }
 })
}
