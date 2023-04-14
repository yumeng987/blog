<template>
  <div class="columns" :style="{ width: windowWidth > 800 ? '600px' : '95%' }">
    <el-card class="simple-blog-card">
      <div v-for="item of commentList" :key="item.id">
        <blog-card :key="item.id" :commentId="item.id" :blogId="item.commentBlogId" :title="item.blogTitle"
                   :text="item.context" :update-time="item.updateTime" :user="item.account"
                   img-url="https://sponsors.vuejs.org/images/chrome_frameworks_fund.png"/>
      </div>
    </el-card>
    <div style="width: 100%; margin-top: 20px; margin-bottom: 50px; height: 100px">
      <paging @getMsg="getComment" :callback="getMyComment" />
    </div>
    <template v-if="commentList.length === 0">
      <el-empty :image-size="200" />
    </template>
  </div>
</template>

<script setup lang="ts">
import BlogCard from "@/components/MyCommentCard/index.vue"
import {getMyComment} from "@/api/comment"
import {ref} from "vue"
import Paging from "@/components/Paging/index.vue"

const commentList = ref([])
const windowWidth = ref(document.body.clientWidth)
const getComment = (data: any) => {
  if (windowWidth.value < 600) commentList.value.push(...data.data)
  else commentList.value = data.data
}
</script>

<style scoped lang="scss">
.columns {
  width: 600px;
  margin: 0 auto;
}
</style>
