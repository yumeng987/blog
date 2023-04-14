<template>
  <div>
    <el-card class="timeline simple-blog-card"
             style="border-radius: 15px;max-width: 400px; padding: 30px; margin: 0 auto; background-color: #fff">
      <el-timeline>
        <el-timeline-item
          v-for="item of archiveList.keys()"
          :key="item"
          :timestamp="item"
          class="blueLine"
          hollow
          placement="top"
          type="primary"
        >
          <el-timeline>
            <el-timeline-item
              v-for="item2 of archiveList.get(item).keys()"
              :key="item2"
              :timestamp="item2"
              class="greenLine"
              hollow
              placement="top"
              type="success"
            >
              <el-timeline>
                <el-timeline-item
                  v-for="item3 of archiveList.get(item).get(item2).values()"
                  :key="item3.id"
                  class="orangeLine"
                  hollow
                  type="warning"
                  @click="$router.push({ path: '/blog/' + item3.id })"
                >
                  <el-card shadow="hover" style="max-width: 250px">
                    <p>{{ item3.title }}</p>
                    <p>{{ item3.updateTime }}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-timeline-item>
          </el-timeline>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>

</template>

<script lang="ts" setup>
import {onBeforeMount, ref} from "vue"
import {getArchive} from "@/api/blog"

interface Archive {
  id: number
  title: string
  updateTime: string
}

const archiveList = ref<Map<string, Map<string, Array<Archive>>>>(new Map())
onBeforeMount(() => {
  getArchive().then((res: { data: Array<Archive> }) => {
    const map: Map<string, Map<string, Array<Archive>>> = new Map()
    for (const datum of res.data) {
      const data = datum.updateTime.substring(0, 10)
      const year = data.substring(0, 4)
      const month = data.substring(5, 7)
      if (map.has(year)) {
        const monthMap = map.get(year)
        if (monthMap?.has(month)) {
          monthMap.get(month)?.push(datum)
        } else {
          monthMap?.set(month, [datum])
        }
      } else {
        const monthMap = new Map()
        monthMap.set(month, [datum])
        map.set(year, monthMap)
      }
    }
    archiveList.value = map
  })
})
</script>

<style scoped lang="scss">
.timeline {
  :deep(.el-timeline) {
    padding: 0 !important;
  }
}
.blueLine {
  :deep(.el-timeline-item__tail) {
    border-color: var(--el-color-primary) !important;
  }
  :deep(.el-timeline-item__timestamp) {
    color: var(--el-color-primary) !important;
  }
}
.greenLine {
  :deep(.el-timeline-item__tail) {
    border-color: var(--el-color-success) !important;
  }
  :deep(.el-timeline-item__timestamp) {
    color: var(--el-color-success) !important;
  }
}
.orangeLine {
  :deep(.el-timeline-item__tail) {
    border-color: var(--el-color-warning) !important;
  }
  :deep(.el-timeline-item__timestamp) {
    color: var(--el-color-warning) !important;
  }
}
</style>
