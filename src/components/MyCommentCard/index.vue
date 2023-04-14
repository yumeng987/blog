<template>
  <div style="margin-top: 30px">
    <div style="margin: 0 auto; width: 100%; text-align: center">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <CollectionTag />
              </el-icon>
              标题
            </div>
          </template>
          {{ title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <ChatLineSquare />
              </el-icon>
              评论
            </div>
          </template>
          {{ text }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Clock />
              </el-icon>
              时间
            </div>
          </template>
          <el-tag size="small">{{ updateTime }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <iphone />
              </el-icon>
              选项
            </div>
          </template>
          <el-button :icon="Delete" type="danger" size="small" @click="deleteCommentFunc">删除</el-button>
          <el-button :icon="Position" type="primary" size="small" @click="gotoBlog">跳转</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { ref } from "vue"
import { Delete, Position, CollectionTag } from "@element-plus/icons-vue"
import { deleteComment } from "@/api/comment"
import { ElMessage } from "element-plus"

const props = defineProps<{
  commentId: String
  blogId: String
  title: String
  text: String
  user: String
  updateTime: String
  imgUrl: String
}>()
const router = useRouter()
const deleteCommentFunc = () => {
  deleteComment(props.commentId).then(() => {
    ElMessage.success("删除成功")
  })
}
const gotoBlog = () => {
  router.push({ path: "/blog/" + props.blogId })
}
</script>

<style scoped lang="scss">
.box-card {
  width: 100%;
  overflow: hidden;
  margin: 0.7rem auto;
}

.auto-line-feed {
  word-wrap: break-word;
  word-break: break-all;
}

.blog-per {
  margin-bottom: 12px;
}
</style>
