import { request } from "@/utils/service"

export interface IGetData {
  /** admin 或 editor */
  blogId: string

}
export interface IPostData {
  /** admin 或 editor */
  context: string
  commentBlogId: string
  commentCommentId?: string
}
export function getCommentByBlogId(data: IGetData) {
  return request({
    url: "comment/get",
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
export function addComment(data: IGetData) {
  return request({
    url: "comment/add",
    method: "post",
    data
  })
}
export function deleteComment(data: IPostData) {
  return request({
    url: "comment/delete",
    method: "post",
    data:{commentId:data},
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
export function getMyComment(data: { pageSize: number | string; pageIndex: number | string }) {
  return request({
    url: "getMyComment",
    method: "post",
    data
  })
}

