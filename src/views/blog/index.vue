<template>
  <div class="columns" style="width: 100%;margin: 0 auto;justify-content: space-evenly;overflow-x: hidden;overflow-y: auto"
       @scroll="columnsScroll">
    <!--  博客主体  -->
    <div style="width:  auto">
      <el-card class="blog-view simple-blog-card auto-line-feed"
               style="overflow: auto"
      >
        <div class="blog-title">{{ blogTitle }}</div>
        <md-editor v-model="markdownToHtml" :editor-id="state.id" :marked-heading-id="generateId" preview-only/>
        <el-divider/>
        <div class="comment-info" @click="showComment">
          <el-link :icon="ChatSquare" class="comment-font"
          >{{ commentList.length }} 条评论
          </el-link>
          <el-link class="comment-font">{{ updateTime }}</el-link>
        </div>
        <div class="comment-context">
          <transition name="el-fade-in-linear">
            <div v-show="showCommentHandle">
              <post-comment comment-user-name="" @refreshComment="refreshComment"
                            :comment-blog-id="blogIdRef" watch-click=""/>
            </div>
          </transition>
          <template v-for="item of commentList" :key="item.blogId">
            <comment
              v-if="item.commentCommentId == null && item.isDelete === 0"
              :blog-id="blogIdRef"
              :item="item"
              :parent-id="''"
              :select-comment-id="selectComment"
              @addComment="refreshComment"
            />
          </template>
        </div>
      </el-card>
    </div>
    <!--  pc端目录    -->
    <div style="position: sticky;top: 0">
      <template v-if="clientWidth > 900">
        <el-card class="simple-blog-card" shadow="always"
                 style="position: sticky;top:0;height: auto; min-width: 200px;max-width: 20vw">
          <md-catalog :editor-id="state.id" :marked-heading-id="generateId" :offsetTop="300" :scroll-element="element"
                      @onClick="changeElement"/>
        </el-card>
      </template>
    </div>
  </div>
  <!-- 移动侧边栏 -->
  <template v-if="clientWidth <= 900">
    <transition name="el-fade-in-linear">
      <div v-show="showSidebar" style="position: absolute;bottom: 30px;left: 5px;">
        <el-space direction="vertical" size="large">
          <el-popover :visible="showMobileHanding" :width="200" placement="left" trigger="click">
            <template #reference>
              <div class="sidebar-icon" @click="showMobileHanding = !showMobileHanding">
                <el-icon :size="32">
                  <Memo/>
                </el-icon>
              </div>
            </template>
            <div style="max-height: 400px">
              <md-catalog :editor-id="state.id" :marked-heading-id="generateId" :offsetTop="100"
                            :scroll-element="element"
                            @onClick="changeElement"/>
              </div>
            </el-popover>
            <div class="sidebar-icon" @click="backTop">
              <el-icon :size="32">
                <Top/>
              </el-icon>
            </div>
          </el-space>
      </div>
    </transition>
  </template>
</template>

<script setup lang="ts">
// @ts-ignore
import {ChatSquare} from "@element-plus/icons-vue"
import {nextTick, onMounted, reactive, ref, watch} from "vue"
import {useRoute, useRouter} from "vue-router"
import {getBlogById} from "@/api/blog"
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import Comment from "@/components/Comment/commentCard.vue"
import {getCommentByBlogId} from "@/api/comment"
import PostComment from "@/components/Comment/sendComment.vue";

const clientWidth = ref(document.body.clientWidth)
const windowWidth = ref(clientWidth.value > 800 ? clientWidth.value * 0.8 : '95%')
const route = useRoute()
const router = useRouter()
const blogTitle = ref("")
const isLoading = ref(true)
const markdownToHtml = ref("")
const updateTime = ref("")
const showCommentHandle = ref(false)
const commentList = ref([])
const blogIdRef = ref("")
const selectComment = ref("")
const element = ref('.columns')
const showSidebar = ref(false)
const showMobileHanding = ref(false)
const columns = ref()
const showComment = () => {
  showCommentHandle.value = !showCommentHandle.value
}
//目录点击
const changeElement = (e: any, t: any) => {
  showMobileHanding.value = false
  router.push("/blog/" + route.params.blogId + "?heading=heading-" + t.index)
}
const columnsScroll = () => {
  handler(function () {
    let item = document.documentElement.getElementsByClassName('columns').item(0);
    if (item) {
      showSidebar.value = item.scrollTop > 300
    }
  })
}
//载入时获取有无标题id
onMounted(() => {
  const catalogName: string = route.query.heading + ""
  if (catalogName.includes("heading-")) {
    nextTick(() => {
      isLoading.value = false
      setTimeout(() => {
        document.getElementById(catalogName)?.scrollIntoView({block: "center", behavior: "smooth"})
      }, 100)
    })
  }
})

let timer: string | number | NodeJS.Timeout | null | undefined = null

function handler(value: Function) {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    value();
  }, 50)

}

const MdCatalog = MdEditor.MdCatalog
const state = reactive({
  id: "my-editor"
})
const generateId = (_text: any, _level: any, index: any) => `heading-${index}`
MdEditor.config({
  markedRenderer(renderer) {
    renderer.heading = (text, level, _r, _s, index) => {
      const id = generateId(text, level, index)
      return `<h${level} id="${id}">${text}</h${level}>`
    }
    return renderer
  }
})
//监听标题id变化
watch(
  () => route.query.heading,
  (newVal, oldVal) => {
    if (newVal == oldVal) {
      return
    }
    if (newVal?.includes("heading-")) {
      setTimeout(() => {
        document.getElementById(newVal + "")?.scrollIntoView({block: "center", behavior: "smooth"})
      }, 0)
    }
  }
)
const getBlog = () => {
  blogIdRef.value = route.params.blogId + ""
  getBlogById({
    blogId: blogIdRef.value
  }).then((res) => {
    getCommentByBlogId({
      blogId: blogIdRef.value
    }).then((res) => {
      commentList.value = res.data
    })
    if (res.data == null) {
      router.push("/404")
    }
    const markdown = res.data.markdown
    updateTime.value = res.data.updateTime
    markdownToHtml.value = markdown
    blogTitle.value = res.data.title
  })
}
const refreshComment = () => {
  getCommentByBlogId({
    blogId: route.params.blogId + ""
  }).then((res) => {
    commentList.value = res.data
  })
}
const backTop = () => {
  document.documentElement.querySelector('.blog-title')?.scrollIntoView({block: "center", behavior: "smooth"})
}
getBlog()
</script>

<style scoped lang="scss">
@import url("@/styles/main.scss");

@media screen and (max-width: 600px) {
  .blog-view {
    max-width: 95vw;
  }
}

@media screen and (min-width: 600px) {
  .blog-view {
    max-width: 35vw;
  }
}

.blog-view {
  flex-direction: column;

  :deep(.md-editor-content) {
    padding: 10px;
  }

  padding: 20px 0;
  background-color: #fff;
}

.blog-title {
  background-color: #fff;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.auto-line-feed {
  word-wrap: break-word;
  word-break: break-all;
}

.comment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  padding-top: 0 !important;
}

.comment-font {
  font-size: 14px;
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
}

.comment-context {
  overflow: hidden;
}

.sidebar-icon {
  border-radius: 10px;
  display: flex;
  height: 40px;
  width: 40px;
  background-color: var(--el-bg-color-overlay);
  text-align: center;
  line-height: 40px;
  color: #bec2ca;
  justify-content: center;
  align-items: center;
}
</style>
