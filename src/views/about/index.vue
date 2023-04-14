<template>
  <el-card :style="{ width: windowWidth > 800 ? '800px' : '95%' }" class="about-view simple-blog-card"
           style="border-radius: 15px">
    <md-editor v-model="markdownToHtml" preview-only/>
  </el-card>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue"
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import {getAboutMe} from "@/api/user"

const markdownToHtml = ref("")
const windowWidth = ref(document.body.clientWidth)
onMounted(() => {
  getAboutMe().then((res) => {
    markdownToHtml.value = res.data
  })
})
</script>

<style scoped lang="scss">

.about-view {
  overflow-y: auto;
  background-color: #fff;

  :deep(.md-editor-content) {
    padding: 10px;
  }

  margin: 0.7rem auto;
}
</style>
