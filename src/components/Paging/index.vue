<template>
  <el-skeleton v-if="onloadData" :rows="10" animated />
  <div
    v-if="windowWidth > 600 && dateCount > 10"
    style="width: 100%; margin-top: 20px; margin-bottom: 50px; height: 100px"
  >
    <el-pagination v-model:current-page="currentPage" :page-size="10" :total="dateCount" />
  </div>
  <div style="text-align: center" v-else>
    <el-divider v-if="!onloadData" class="loading-icon">
      <el-icon v-if="currentPage * 10 < dateCount" class="is-loading loading-icon"><Loading /></el-icon>
      <span style="color: #b8b9bb" v-else>end</span>
    </el-divider>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue"
const onloadData = ref(false)
const windowWidth = ref(document.body.clientWidth)
const currentPage = ref(1)
const dateCount = ref(0)
const emit = defineEmits(["getMsg"])
const props = defineProps<{
  callback: (val: any) => any
}>()
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop //滚动条在Y轴滚动过的高度
  const scrollHeight = document.documentElement.scrollHeight //滚动条的高度
  const clientHeight = document.documentElement.clientHeight //浏览器的可视高度
  if (
    scrollTop + clientHeight >= scrollHeight - 200 &&
    dateCount.value > 10 &&
    currentPage.value * 10 < dateCount.value
  ) {
    currentPage.value++
  }
}
const debounce = (fn: any, delay: any) => {
  let timer: string | number | NodeJS.Timeout | null | undefined = null // 借助闭包
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay) // 简化写法
  }
}
onMounted(() => {
  onloadData.value = true
  props
    .callback({ pageSize: 10, pageIndex: 1 })
    .then((res: any) => {
      dateCount.value = res.dataCount
      emit("getMsg", res)
    })
    .then(() => {
      onloadData.value = false
    })
  if (windowWidth.value < 600) {
    document.addEventListener("scroll", debounce(handleScroll, 500))
  }
})
watch(
  () => currentPage.value,
  (val) => {
    props.callback({ pageSize: 10, pageIndex: val }).then((res: any) => {
      emit("getMsg", res)
      if (windowWidth.value > 600) document.documentElement.scrollTop = 0
    })
  }
)
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped lang="scss">
.loading-icon {
  :deep(.el-divider__text) {
    background-color: #f0f1f3;
  }
}
</style>
