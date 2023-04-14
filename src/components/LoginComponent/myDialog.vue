<template>
  <div>
    <!-- 登录对话框 -->
    <el-dialog v-model="loginView" :width="dialogWidth" class="dialog" title="登录" @close="emits('close')">
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginFormData"
          :rules="loginFormRules"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="account">
            <el-input v-model="loginFormData.account" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginFormData.password" placeholder="请输入" show-password/>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="loginView = false">取消</el-button>
        <el-button type="primary" @click="handleLogin">确认</el-button>
      </template>
    </el-dialog>
    <!-- 注册对话框 -->
    <el-dialog v-model="registerView" :width="dialogWidth" class="dialog" title="注册" @close="emits('close')">
      <div>
        <el-form
          ref="registerFormRef"
          :model="registerFormData"
          :rules="registerFormRules"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="account">
            <el-input v-model="registerFormData.account" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerFormData.password" placeholder="请输入" show-password/>
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <el-select v-model="registerFormData.avatar" placeholder="请选择">
              <el-option
                v-for="item in avatarList"
                :key="item[0]"
                :label="item[0]"
                :value="item[0]"
                style="height: auto !important"
              >
                <div style="height: auto !important; text-align: center; margin-top: 5px">
                  <el-avatar :src="item[1]" shape="square" size="default"/>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="registerView = false">取消</el-button>
        <el-button type="primary" @click="handleRegister">确认</el-button>
      </template>
    </el-dialog>
    <!-- 信息对话框 -->
    <el-dialog v-model="myInfoView" :width="dialogWidth" class="dialog" title="我的信息" @close="emits('close')">
      <div>
        <el-form
          ref="myInfoFormRef"
          :model="myInfoFormData"
          :rules="myMsgFormRules"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="account">
            <el-input v-model="myInfoFormData.account" disabled placeholder="请输入"/>
          </el-form-item>
          <el-divider/>
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="myInfoFormData.oldPassword" placeholder="请输入" show-password/>
          </el-form-item>
          <el-form-item label="修改新密码" prop="newPassword">
            <el-input v-model="myInfoFormData.newPassword" placeholder="请输入" show-password/>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="myInfoFormData.confirmPassword" placeholder="请输入" show-password/>
          </el-form-item>
          <el-divider/>
          <el-form-item label="头像" prop="avatar">
            <el-select v-model="myInfoFormData.avatar" placeholder="请选择">
              <el-option
                v-for="item in avatarList"
                :key="item[0]"
                :label="item[0]"
                :value="item[0]"
                style="height: auto !important"
              >
                <div style="height: auto !important; text-align: center; margin-top: 5px">
                  <el-avatar :src="item[1]" shape="square" size="default"/>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="myInfoView = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateInfo">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {useUserStore} from "@/store/modules/user";
import {updateInfo} from "@/api/user";
import {getAvatarList} from "@/api/avatar";

const props = defineProps<{
  useView: "login" | "register" | "info" | "" | undefined
}>();
let emits = defineEmits(["close"]);

watch(() => props.useView, (newVal) => {
  if (newVal === "login") {
    loginView.value = true;
  } else if (newVal === "register") {
    registerView.value = true;
  } else if (newVal === "info") {
    showUpdateInfo();
  }
});
const dialogWidth = ref(document.body.clientWidth > 500 ? "500px" : "90%")
const isLogin = ref<undefined | boolean>(false)
const myInfoView = ref(false)
const store = useUserStore()
const avatarList = ref<Map<String, String>>()
const loginView = ref(false)
const registerView = ref(false)
const myInfoFormRef = ref<FormInstance | null>(null)
const myInfoFormData = reactive({
  account: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  avatar: ""
})
const loginFormRef = ref<FormInstance | null>(null)
const loginFormData = reactive({
  account: "",
  password: ""
})
const loginFormRules: FormRules = reactive({
  account: [{required: true, min: 5, max: 16, trigger: "blur", message: "长度不得小于5位或大于16位"}],
  password: [{required: true, trigger: "blur", message: "请输入密码"}]
})
const registerFormRef = ref<FormInstance | null>(null)
const registerFormData = reactive({
  account: "",
  password: "",
  avatar: ""
})
const registerFormRules: FormRules = reactive({
  account: [{required: true, min: 5, max: 16, trigger: "blur", message: "长度不得小于5位或大于16位"}],
  password: [{required: true, trigger: "blur", min: 8, max: 32, message: "长度不得小于8位或大于32位"}],
  avatar: [{required: true, trigger: "blur", message: "请选择头像"}]
})
const validateNewPassword = (rule: any, value: string, callback: any) => {
  if (!value && myInfoFormData.oldPassword == "") callback()
  if (value.length < 8 || value.length > 32) {
    callback(new Error("长度不得小于8位或大于32位"))
  }
  if (myInfoFormData.oldPassword == value) {
    callback(new Error("新密码不能与旧密码相同"))
  }
}
const myMsgFormRules: FormRules = reactive({
  oldPassword: [{min: 8, max: 32, trigger: "blur", message: "长度不得小于8位或大于32位"}],
  newPassword: [{validator: validateNewPassword, min: 8, max: 32, trigger: "blur"}],
  confirmPassword: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (myInfoFormData.newPassword != myInfoFormData.confirmPassword) callback(new Error("两次密码不相同"))
      },
      trigger: "blur"
    }
  ]
})
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      store.login(loginFormData).then((res) => {
        // @ts-ignore
        if (res) {
          ElMessage.success("登陆成功")
          isLogin.value = true
          loginView.value = false
          location.reload()
        }
      })
    } else {
      return false
    }
  })
}
const showUpdateInfo = () => {
  const item = store.userInfo
  getAvatar()
  if (!item) return
  myInfoFormData.oldPassword = ""
  myInfoFormData.newPassword = ""
  myInfoFormData.confirmPassword = ""
  myInfoFormData.avatar = item.avatar + ""
  myInfoFormData.account = item.account
  myInfoView.value = true
}

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

const handleRegister = () => {
  registerFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      useUserStore()
        .register(registerFormData)
        .then((res) => {
          // @ts-ignore
          if (res) {
            ElMessage.success("注册成功,请登陆")
            location.reload()
          }
        })
    } else {
      return false
    }
  })
}

const handleUpdateInfo = () => {
  updateInfo(myInfoFormData).then((res) => {
    // @ts-ignore
    if (res.msg.includes("成功")) {
      ElMessage.success("修改成功,请重新登陆")
      myInfoView.value = false
      store.logout()
      location.reload()
    }
  })
}


</script>

<style lang="scss" scoped>

</style>
