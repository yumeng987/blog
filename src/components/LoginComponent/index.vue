<template>
  <div v-if="!isLogin" style="text-align: center; padding: 4px; overflow: hidden">
    <template v-if="!phoneView">
      <el-button type="primary" @click.stop="handleClick('login')">登录</el-button>
      <el-button type="danger" @click.stop="handleClick('register')">注册</el-button>
    </template>
    <template v-else>
      <el-dropdown trigger="click">
        <el-avatar :size="docWidth > 500 ? '64px' : 'small'" shape="square" :icon="UserFilled" />
        <template #dropdown>
          <el-dropdown-menu class="dropdown-menu">
            <el-dropdown-item @click.stop="handleClick('login')">登录</el-dropdown-item>
            <el-dropdown-item @click.stop="handleClick('register')">注册</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
  <div v-else style="text-align: center; padding: 4px; overflow: hidden">
    <el-dropdown trigger="click">
      <el-avatar :size="!phoneView ? 'default' : 'small'" shape="square" :src="avatar" />
      <template #dropdown>
        <el-dropdown-menu class="dropdown-menu">
          <el-dropdown-item @click="$router.push('/mine')">我的评论</el-dropdown-item>
          <el-dropdown-item @click="handleClick('info')">我的信息</el-dropdown-item>
          <el-dropdown-item divided @click="useUserStore().logout()">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <my-dialog :useView="useView" @close="useView=''"></my-dialog>
</template>

<script setup lang="ts">
import {ref, watch} from "vue"
import {useUserStore} from "@/store/modules/user"
import {getAvatarList} from "@/api/avatar"
import {UserFilled} from "@element-plus/icons-vue"
import MyDialog from "@/components/LoginComponent/myDialog.vue";

const avatarList = ref<Map<String, String>>()
const phoneView = ref(document.body.clientWidth <= 650)
const avatar = ref("")
const docWidth = ref(document.body.clientWidth)
const useView = ref("")

function getAvatar() {
  getAvatarList({
    pageIndex: 1,
    pageSize: 20
  }).then((avatar: any) => {
    const arr: Array<{ imgId: string; imgUrl: string }> = avatar.data
    const map: Map<string, string> = new Map()
    for (const arrElement of arr) {
      map.set(arrElement.imgId, arrElement.imgUrl)
    }
    avatarList.value = map
  })
}

const handleClick = (type: string) => {
  useView.value = type
}
const store = useUserStore()

const dialogWidth = ref("50%")
const setDialogWidth = () => {
  const val = document.body.clientWidth
  const def = 500 // 默认宽度
  if (val < def) {
    dialogWidth.value = "90%"
  } else {
    dialogWidth.value = def + "px"
  }
}
const isLogin = ref<undefined | boolean>(false)
const accountRef = ref("")
watch(
  () => store.isLogin,
  (val) => {
    isLogin.value = val
    const item = store.userInfo
    if (item) {
      accountRef.value = item.account
      avatar.value = item.avatarUrl
    }
  }
)
setDialogWidth()
</script>

<style scoped lang="scss">
.dropdown-menu {
  :deep(.el-dropdown-menu__item) {
    justify-content: center;
  }
}
</style>
