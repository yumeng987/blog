import { request } from "@/utils/service"

export interface IGetData {
  /** admin 或 editor */
  blogId: string

}

/** 获取登录验证码 */
export function getBlogById(data: IGetData) {
  return request({
    url: "blog/getById",
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

export function getBlog(data: { pageIndex: number | string; pageSize: number | string }) {
  return request({
    url: "blog/get",
    method: "post",
    data
})}
export function getBlogTags(data: { pageIndex: number | string; pageSize: number | string }) {
  return request({
    url: "blog/tags/get",
    method: "post",
    data
  })
}

export function getArchive() {
  return request({
    url: "blog/archive",
    method: "post",
  })
}
