<!-- eslint-disable prettier/prettier -->
<script lang="ts" setup>
import {useTheme} from "@/hooks/useTheme"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import NavBar from "@/components/navbar/index.vue"
import {useRouter} from "vue-router";
import {onBeforeMount, ref} from "vue";
import {useUserStore} from "@/store/modules/user";

const { initTheme } = useTheme()

const router = useRouter()

const r = ref()
router.beforeEach((to: any, from: any, next: () => void) => {
  r.value =to
  next()
})
onBeforeMount(() => {
  const userStore = useUserStore()
  userStore.checkLogin()
})

/** 初始化主题 */
initTheme()
/** 将 Element-Plus 的语言设置为中文 */
const locale = zhCn
</script>

<template>
  <div class="simple-blog-main">
    <nav-bar route="r.value"/>
    <router-view v-slot="{ Component }">
      <transition>
        <div class="simple-blog-main simple-blog-component">
          <component :is="Component" style=""/>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss">


::-webkit-scrollbar {
  width: 8px
}

::-webkit-scrollbar-thumb {
  background-color: #dddee0;
  border-radius: 15px
}

::-webkit-scrollbar-thumb:hover {
  background-color: #8899a7
}

@media screen and (max-width: 500px) {
  .simple-blog-main {
    justify-content: center;
  }
}

@media screen and (min-width: 500px) {
  .simple-blog-component {
    padding: 1vh 0;
  }
  .simple-blog-main {
    justify-content: space-around;
  }
}

.simple-blog-main {
  background-color: #fdfdfd;
  width: 100%;
  display: flex;
  overflow: hidden;
  height: 100%
}

.simple-blog-component {
  background-color: #f2f3f5;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  width: 100%
}

</style>

