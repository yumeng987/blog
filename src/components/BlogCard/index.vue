<template>
  <el-card class="box-card simple-blog-card" shadow="always" @click="gotoBlog">
    <el-image :src="imgUrl"
              :style="windowWidth<500?'max-width: 80px;height: 60px;':'min-width: 192px;height: 120px;'" style="padding-right: 12px"/>
    <div>
      <div class="card-header" style="margin-bottom: 5px; font-size: 16px">
        <span>{{ title }}</span>
      </div>
      <div v-if="windowWidth>500" class="auto-line-feed blog-per" style="font-size: 14px;min-height: 60px">{{
          text
        }}
      </div>
      <div style="display: flex; justify-content: flex-start">
        <div>
          <template v-if="tags">
            <template v-for="item of tags.split(',')" :key="item">
              <el-tag size="small" style="margin-right: 15px">{{ tagsMap.get(parseInt(item)) }}</el-tag>
            </template>
          </template>
        </div>
        <el-tag size="small" type="info">{{ updateTime }}</el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router"
import {ref} from "vue";

const windowWidth = ref(document.body.clientWidth)
const props = defineProps({
  blogId: String,
  title: String,
  text: String,
  tags: String,
  updateTime: String,
  imgUrl: String,
  tagsMap: Map<number, string>
})
const router = useRouter()
const gotoBlog = () => {
  router.push({path: "/blog/" + props.blogId})
}
</script>

<style scoped lang="scss">
.box-card {
  border: none;
  background-color: rgba(255, 255, 255, 0.85);

  :deep(.md-editor-content) {
    background-color: rgba(255, 255, 255, 0.85);
  }

  width: 100%;
  overflow: hidden;
  margin: 0.7rem auto;
  display: flex;

  :deep(.el-card__body) {
    display: flex;
  }
;
}

.auto-line-feed {
  word-wrap: break-word;
  word-break: break-all;
  max-height: 100px;
  overflow: hidden;
  display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; // 从上到下垂直排列子元素
  -webkit-line-clamp: 4;
}

.blog-per {
  margin-bottom: 12px;
}
</style>
