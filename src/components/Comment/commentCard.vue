<template>
  <div class="comment-card" style="flex-direction: column">
    <!--评论展示-->
    <div style="width: 100%">
      <div style="display: flex">
        <el-avatar :src="item.avatar" shape="square" size="40" style="margin-right: 10px"/>
        <div style="display: flex;flex-direction: column;flex-grow: 1;">
          <div style="font-size: 14px;display: flex; align-items: center;color: #606266">
            <template v-if="!commentUser">
              {{ item.account }}
            </template>
            <template v-else>
              {{ splitUser(commentUser)[0] }}
              <el-icon>
                <CaretRight/>
              </el-icon>
              {{ splitUser(commentUser)[1] }}
            </template>
          </div>
          <div>
            <div v-if="item.isDelete != 1" class="comment-font">{{ item.context }}</div>
            <div v-else class="comment-font">
              <el-tag class="ml-2" type="info">该评论已删除</el-tag>
            </div>
          </div>
          <div class="comment-info" style="padding: 0; width: 100%; margin: 4px 0 0 !important; color: #606266">
            <span style="font-size: 10px;color: rgb(153, 153, 153)">{{ item.updateTime }}</span>
            <el-link v-if="item.children" :disabled="item.isDelete === 1" :icon="ChatSquare" class="comment-font"
                     @click="showComment">{{ item.children ? item.children.length : 0 }}
              条评论
            </el-link>
            <el-link v-else :disabled="item.isDelete === 1" :icon="ChatSquare" class="comment-font"
                     @click="showComment">评论
            </el-link>
          </div>
        </div>
      </div>
    </div>

    <!--  评论模块  -->
    <transition name="el-fade-in-linear">
      <div v-show="showCommentHandle" style="width: 100%">
        <post-comment :comment-blog-id="blogId" :comment-comment-id="props.item.id"
                      :comment-user-name="item?.parentUserName" :watch-click="watchClick"
                      @refreshComment="addCommentParent" @close-view="showCommentHandle = !showCommentHandle"/>
      </div>
    </transition>
    <!--  子评论  -->
    <div style="padding-left: 14px; width: 100%; margin: 0 auto">
      <template v-for="item of props.item.children" :key="item.commentId">
        <comment-card :select-comment-id="selectComment" @addComment="refreshComment" :parent-id="parentId" :item="item"
                      :blog-id="blogId" :comment-user="
            item.parentUserName && item.commentId != item.commentCommentId
             ? item.account + '->' + item.parentUserName
             : item.account
          "/>
      </template>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import CommentCard from "@/components/Comment/commentCard.vue"
import {ChatSquare} from "@element-plus/icons-vue"
import PostComment from "@/components/Comment/sendComment.vue"
import {useUserStore} from "@/store/modules/user";

const props = defineProps<{
  item: any
  blogId: string | number
  parentId: string | number
  parentNode?: Array<any>
  selectCommentId?: string | number | undefined
  isDelete?: string | number | undefined
  commentUser?: string
}>()
const emit = defineEmits(["addCommentParent", "addComment"])
const showCommentHandle = ref(false)
const selectComment = ref("")
const watchClick = ref("a")

useUserStore().test = '@/components/screenfull/index.vue'

const addCommentParent = () => {
  emit("addComment")
}

const showComment = () => {
  watchClick.value = Math.random() + ""
  showCommentHandle.value = !showCommentHandle.value
}

const refreshComment = () => {
  emit("addComment")
}

const splitUser = (commentUser: string) => {
  return commentUser.split("->")
}
</script>

<style scoped lang="scss">
.comment-info {

  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  padding-top: 0 !important;
}

.comment-font {
  font-size: 16px;
  margin-top: 4px;
}

.comment-card {
  :deep(.el-textarea__inner) {
    min-height: 50px !important;
    resize: none;
    line-height: normal;
    overflow-y: hidden;
  }

  font-size: 14px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 auto;
  background-color: #fff;
  padding-top: 12px;
}

.comment-context {
  overflow: hidden;
}
</style>
