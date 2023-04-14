<template>
  <div class="columns blog-list">
    <div style="max-width: 700px">
      <template v-for="item of blogList" :key="item.id">
        <blog-card
          :tagsMap="tagsMap"
          :blogId="item.id + ''"
          :title="item.title"
          :text="item.text"
          :tags="item.tags"
          :update-time="item.updateTime"
          :img-url="item.imgUrl"
        />
      </template>
      <paging :callback="getBlog" @getMsg="blogPaging"/>
    </div>
    <div v-if="windowWidth > 800" style="position: sticky;top:80px;margin-top: 14px">
      <el-card class="simple-blog-card" style="flex-direction: column;width: 300px; height: 200px">
        <template #header>
          <div style="text-align: center">
            <span>标签</span>
          </div>
        </template>
        <div>
          <template v-for="item in tagsMap.values()" :key="item">
            <el-tag size="large" style="margin: 5px">{{ item }}</el-tag>
          </template>
        </div>
        </el-card>
      </div>
  </div>
</template>

<script lang="ts" setup>
import "element-plus/theme-chalk/display.css"
import BlogCard from "@/components/BlogCard/index.vue"
import {onBeforeMount, ref} from "vue"
import {getBlog, getBlogTags} from "@/api/blog"
import Paging from "@/components/Paging/index.vue"

interface Blog {
  id: number | string
  title: string
  text: string
  tags: string
  updateTime: string
  imgUrl: string
}

const windowWidth = ref(document.body.clientWidth)
const tagsMap = ref(new Map<number, string>())
const blogList = ref<Blog[]>([])
onBeforeMount(() => {
  getBlogTags({ pageIndex: 1, pageSize: 10 }).then(
    (res: { data: Array<{ tagsId: number | string; tagsName: string }> }) => {
      for (const dataKey in res.data) {
        let tagsId = res.data[dataKey].tagsId
        if (typeof tagsId === "string") tagsId = parseInt(tagsId)
        tagsMap.value.set(tagsId, res.data[dataKey].tagsName)
      }
    }
  )
})
const blogPaging = (res: {
  data: Array<{
    introduction: string
    id: number
    markdown: string
    tagsId: string
    title: string
    updateTime: string
    img: string
  }>
}) => {
  if (windowWidth.value > 600) blogList.value = []
  for (const datum of res.data) {
    blogList.value.push({
      id: datum.id,
      title: datum.title,
      text: datum.introduction,
      tags: datum.tagsId,
      updateTime: datum.updateTime,
      imgUrl: datum.img
    })
  }
}
</script>

<style scoped lang="scss">
@import url("@/styles/main.scss");

@media screen and (min-width: 800px) {
  .blog-list {
    width: 1100px;
    justify-content: space-around;
  }

}

@media screen and (max-width: 800px) {
  .blog-list {
    width: 95%;
    justify-content: center;
  }
}


.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  background-color: #fff;
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.tabhead {
  :deep(.el-tabs__header) {
    margin: 0;
  }
}
@keyframes slideUp {
  from {
    transform: translate3d(0, 100%, 0);
    opacity: 0.1;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes slideDown {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
}
.mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.mask-fade-out {
  animation: maskFadeOut 0.4s forwards;
}
@keyframes maskFadeOut {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 0;
  }
}

.phone-view {
  padding: 0 12px;
}
</style>
