<template>

  <div :style="{width: clientWidth<=500?'50px':'200px'}"
       style="position: relative;background-color: #fdfdfd;min-width: 50px;max-width: 200px">
    <div style="display: flex;flex-direction: column;align-items: center;height: 100%;justify-content: center;">
      <el-avatar :size="clientWidth <=500? 40: 80"
                 :src="userInfo?.avatarUrl"
                 class="simple-blog-navbar-avatar"
                 @click="useView = isLogin?'info':'login'"
      >
        <span style="font-weight: bolder;font-size: 1vw;color: #0a0a0a">未登录</span></el-avatar>
      <div style="position: relative;width: 100%">
        <template v-for="(item,index) in navContext" :key="index">
          <div style="height: 100px;width: 100%;" @click="goRouter(item)"
               @mouseenter="item.showContext=true" @mouseleave="item.showContext=item.path===$route.path">
            <div class="simple-blog-navbar-context">
              <transition :enter-active-class="navText[1]" :leave-active-class="navText[0]">
                <p v-show="item.showContext" class="simple-blog-navbar-item-text"
                   style="margin: 0;font-size: 18px;font-weight: 800">{{ item.name }}</p>
              </transition>
              <transition :enter-active-class="navIcon[1]" :leave-active-class="navIcon[0]">
                <el-icon v-show="!item.showContext" :color="'rgb(191,195,203)'" :size="35" style="position: absolute">
                  <Component :is="item.icon"/>
                </el-icon>
              </transition>
              <transition :enter-active-class="navPoint[1]" :leave-active-class="navPoint[0]">
                <i v-show="item.showContext" class="simple-blog-navbar-item-point"></i>
              </transition>
            </div>
          </div>
        </template>
        <div v-show="showNavLine" :style="'transform: translateY('+navLineTranslate+'px)'"
             class="simple-blog-navbar-line">
        </div>
      </div>
    </div>
  </div>
  <el-drawer v-model="handleMask" direction="ttb" :with-header="false" size="auto">
    <template v-for="item of menuMsg" :key="item.name">
      <div @click="$router.push(item.path), (handleMask = false)" class="markItem">
        <p style="font-size: 3vh">{{ item.name }}</p>
      </div>
    </template>
  </el-drawer>
  <my-dialog :use-view="useView" @close="useView =''"></my-dialog>
</template>

<script setup lang="ts">
import {computed, DefineComponent, markRaw, nextTick, reactive, ref, watch} from "vue"
import {RouteLocationNormalizedLoaded, useRoute} from "vue-router"
import "element-plus/theme-chalk/display.css"
import router from "@/router"
import 'animate.css';
import {useUserStore} from "@/store/modules/user"
import {Calendar, House, Star} from "@element-plus/icons-vue";
import MyDialog from "@/components/LoginComponent/myDialog.vue";

const route = useRoute()
//调整动画速度
document.documentElement.style.setProperty('--animate-duration', '0.5s');
const key = computed(() => {
  return route.path
})
let userInfo = ref(useUserStore().userInfo);
const useView = ref()
const activeName = ref("index")
const handleMask = ref(false)
const isLogin = ref<boolean | undefined>()
const clientWidth = document.documentElement.clientWidth
const props = defineProps<{
  route: RouteLocationNormalizedLoaded
}>()
const navLineTranslate = ref(0)

interface navItem {
  name: string,
  path: string,
  icon: DefineComponent,
  showContext: boolean
}

const navText = ref(['animate__animated animate__fadeOutUp', 'animate__animated animate__fadeInDown'])
const navIcon = ref(['animate__animated animate__fadeOut ', 'animate__animated animate__fadeIn'])
const navPoint = ref(['animate__animated animate__fadeOutDown ', 'animate__animated animate__fadeInUp'])

const navContext = reactive<Array<navItem>>([
  {
    name: "首页",
    path: "/index",
    icon: markRaw(House),
    showContext: false
  },
  {
    name: "归档",
    path: "/archive",
    icon: markRaw(Calendar),
    showContext: false
  },
  {
    name: "关于",
    path: "/about",
    icon: markRaw(Star),
    showContext: false
  }
])
watch(
  () => props.route,
  (val) => {
    if (val.path === "/mine") {
      activeName.value = "mine"
    } else if (val.path === "/archive") {
      activeName.value = "archive"
    } else if (val.path === "/about") {
      activeName.value = "about"
    }
  }
)
watch(
  () => useUserStore().isLogin,
  (val) => {
    isLogin.value = val
    console.log(isLogin.value)
  }
)
watch(() => useUserStore().userInfo, (val) => {
  userInfo.value = val
})
const handleClick = (any: any) => {
  nextTick(() => {
    if (activeName.value == "mine") {
      router.push("/mine")
    } else if (activeName.value == "index") {
      router.push("/")
    } else if (activeName.value == "about") {
      router.push("/about")
    } else if (activeName.value == "archive") {
      router.push("/archive")
    }
  })
}
const goRouter = (item: navItem) => {
  router.push(item.path)
}
const showNavLine = ref(false)
watch(() => route.path, (val) => {
  showNavLine.value = false
  for (let i = 0; i < navContext.length; i++) {
    if (navContext[i].path === val) {
      navContext[i].showContext = true
      navLineTranslate.value = i * 100
      showNavLine.value = true
    } else {
      navContext[i].showContext = false
    }
  }
})
</script>

<style scoped lang="scss">
.markItem {
  justify-content: center;
  display: flex;
  z-index: 150;
  width: 100%;
  text-align: center;
  height: 7vh;
  background-color: #fff;
  color: #409eff;
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.simple-blog-navbar-item-point {
  display: inline-block;
  margin-top: 2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #0a0a0a;
}

.simple-blog-navbar-context {
  flex-direction: column;
  position: relative;
  display: flex;
  width: 100%;
  height: 100px;
  align-items: center;
  justify-content: center;
}

.animate__animated .animate__fadeOutUp,
.animate__fadeOutDown .animate__fadeInUp {
  --animate-duration: 0.5s;
}

.simple-blog-navbar-line {
  transition: all .25s;
  border-radius: 5px;
  background-color: black;
  height: 100px;
  width: 3px;
  position: absolute;
  top: 0;
  z-index: 10;
  right: 0;
}

.simple-blog-navbar-avatar {
  transform: translateY(-100px)
}
</style>
