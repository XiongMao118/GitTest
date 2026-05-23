<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useUserStore } from '@/store/user'

interface Props {
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const userStore = useUserStore()
const isSignUp = ref(false)
const account = ref('')
const password = ref('')
const username = ref('')
const showPassword = ref(false)

const isLoading = computed(() => userStore.isLoading.value)
const error = computed(() => userStore.error.value)

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const resetForm = () => {
  account.value = ''
  password.value = ''
  username.value = ''
  showPassword.value = false
  isSignUp.value = false
  userStore.resetError()
}

const handleSubmit = async () => {
  if (!account.value || !password.value) {
    userStore.error.value = '请填写所有必填字段'
    return
  }
  
  if (isSignUp.value && !username.value) {
    userStore.error.value = '请填写用户名'
    return
  }
  
  let success: boolean
  if (isSignUp.value) {
    success = await userStore.signUp(account.value, password.value, username.value)
  } else {
    success = await userStore.signIn(account.value, password.value)
  }
  
  if (success) {
    emit('success')
    emit('close')
  }
}

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  userStore.resetError()
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 class="text-2xl font-bold text-white">
              {{ isSignUp ? '用户注册' : '用户登录' }}
            </h2>
            <p class="text-blue-100 mt-2">
              {{ isSignUp ? '创建新账户开始使用' : '登录到你的账户' }}
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="p-8 space-y-4">
            <div v-if="isSignUp" class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">用户名</label>
              <input
                v-model="username"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入用户名"
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">{{ isSignUp ? '邮箱' : '邮箱/用户名' }}</label>
              <input
                v-model="account"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="isSignUp ? '请输入邮箱' : '请输入邮箱或用户名'"
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">密码</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入密码"
                  :disabled="isLoading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>

            <Transition name="fade">
              <div v-if="error" class="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm">{{ error }}</span>
              </div>
            </Transition>

            <div class="flex gap-3">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                :disabled="isLoading"
              >
                取消
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading"
              >
                <span v-if="isLoading">处理中...</span>
                <span v-else>{{ isSignUp ? '注册' : '登录' }}</span>
              </button>
            </div>

            <div class="text-center">
              <button
                type="button"
                @click="toggleMode"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                {{ isSignUp ? '已有账户？点击登录' : '没有账户？点击注册' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
