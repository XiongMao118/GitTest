<script setup lang="ts">
/**
 * 用户认证对话框组件
 * 功能：提供用户登录和注册功能，支持登录/注册模式切换
 */
import { ref, watch, computed } from 'vue'
import { useUserStore } from '@/store/user'

// ============================================
// Props & Emits
// ============================================
interface Props {
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

// ============================================
// Store
// ============================================
const userStore = useUserStore()

// ============================================
// 状态
// ============================================
const isSignUp = ref(false)  // 是否为注册模式
const account = ref('')
const password = ref('')
const username = ref('')
const showPassword = ref(false)

const isLoading = computed(() => userStore.isLoading.value)
const error = computed(() => userStore.error.value)

// 监听对话框打开，关闭时重置表单
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

/**
 * 重置表单
 */
const resetForm = () => {
  account.value = ''
  password.value = ''
  username.value = ''
  showPassword.value = false
  isSignUp.value = false
  userStore.resetError()
}

// ============================================
// 方法
// ============================================

/**
 * 处理表单提交
 * 根据当前模式（登录/注册）调用相应的方法
 */
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

/**
 * 切换登录/注册模式
 */
const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  userStore.resetError()
}

/**
 * 关闭对话框
 */
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div class="px-8 py-8">
            <h2 class="text-xl font-medium text-neutral-900 mb-1">
              {{ isSignUp ? '用户注册' : '用户登录' }}
            </h2>
            <p class="text-sm text-neutral-500 mb-6">
              {{ isSignUp ? '创建新账户开始使用' : '登录到你的账户' }}
            </p>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div v-if="isSignUp" class="space-y-2">
                <label class="block text-sm font-medium text-neutral-600">用户名</label>
                <input
                  v-model="username"
                  type="text"
                  class="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all"
                  placeholder="请输入用户名"
                  :disabled="isLoading"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-neutral-600">{{ isSignUp ? '邮箱' : '邮箱/用户名' }}</label>
                <input
                  v-model="account"
                  type="text"
                  class="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all"
                  :placeholder="isSignUp ? '请输入邮箱' : '请输入邮箱或用户名'"
                  :disabled="isLoading"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-neutral-600">密码</label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 pr-12 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all"
                    placeholder="请输入密码"
                    :disabled="isLoading"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                  >
                    <svg 
                      class="w-5 h-5 transition-all duration-200"
                      :class="{ 'opacity-70': showPassword }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="1.5" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="1.5" 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                      />
                      <path 
                        v-if="showPassword"
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="1.5" 
                        d="M3 3l18 18"
                        class="text-red-400"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <Transition name="fade">
                <div v-if="error" class="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p class="text-sm text-red-600">{{ error }}</p>
                </div>
              </Transition>

              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="handleClose"
                  class="flex-1 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  :disabled="isLoading"
                >
                  取消
                </button>
                <button
                  type="submit"
                  class="flex-1 py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">处理中...</span>
                  <span v-else>{{ isSignUp ? '注册' : '登录' }}</span>
                </button>
              </div>

              <div class="text-center pt-2">
                <button
                  type="button"
                  @click="toggleMode"
                  class="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {{ isSignUp ? '已有账户？点击登录' : '没有账户？点击注册' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
