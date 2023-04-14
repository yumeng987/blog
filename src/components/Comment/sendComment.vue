<template>
  <div v-if="isLogin">
    <div class="comment-card" :style="{ width: windowWidth > 700 ? '100%' : '95%' }">
      <div class="comment-input">
        <el-input
          ref="editTask"
          v-model="commentContext"
          autofocus="autofocus"
          autosize
          maxlength="200"
          placeholder="请输入评论内容"
          style="margin-right: 20px"
          type="textarea"
          @blur="closeView"
        />
        <el-button color="#b1b3b8" plain type="primary" @click="comment">评论</el-button>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="bg-color" @click="useView = 'login'">
      <span style="color: var(--el-color-info-light-3)">请登录后在评论~</span>
    </div>
  </div>
  <my-dialog :useView="useView" @close="useView=''"/>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue"
import {addComment} from "@/api/comment"
import {ElMessage} from "element-plus"
import {useUserStore} from "@/store/modules/user"
import MyDialog from "@/components/LoginComponent/myDialog.vue";

const editTask = ref()
const useView = ref("")
const props = defineProps<{
  commentBlogId: string | number
  commentCommentId?: string | number
  commentUserName: string | number | undefined
  watchClick: string | number
}>()
const windowWidth = ref(document.body.clientWidth)
const isLogin = ref(false)
const accountRef = ref("")
const commentContext = ref("")
const userInfo = useUserStore().userInfo
const checkLogin = () => {
  const userInfo = useUserStore().userInfo
  if (userInfo) {
    isLogin.value = true
    accountRef.value = userInfo.account
  }
}
const emit = defineEmits(["refreshComment", "closeView"])
const comment = () => {
  if (commentContext.value.trim() == "") {
    ElMessage.error("评论内容不能为空")
    return
  }
  addComment({
    context: commentContext.value,
    commentBlogId: props.commentBlogId,
    commentCommentId: props.commentCommentId
  }).then(() => {
    ElMessage.success("评论成功")
    emit("refreshComment")
  })
}
watch(
  () => props.watchClick,
  () => {
    editTask.value.focus()
  }
)
const closeView = () => {
  emit("closeView")
}

checkLogin()
</script>

<style scoped lang="scss">

.bg-color {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 100%;
  height: 35px;
  background-color: var(--el-color-info-light-7);
}

.comment-card {
  :deep(.el-textarea__inner) {
    min-height: 40px !important;
    resize: none;
    line-height: normal;
    overflow-y: hidden;
  }

  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
  background-color: #fff;
  padding: 10px 0;
}

.comment-input {
  display: flex;
  width: 100%;
  min-height: 60px;
  border: 1px solid var(--el-color-info-light-3);
  border-radius: 5px;
  padding: 10px;

  :deep(.el-button) {
    height: 40px;
    color: #434343;
  }
}
</style>
