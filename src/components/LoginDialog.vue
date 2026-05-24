<script setup lang="ts">
/**
 * 管理员登录对话框组件
 * 功能：提供管理员密码验证登录功能
 */
import { ref, watch } from 'vue'
import { useAuthStore } from '@/store/auth'

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
const authStore = useAuthStore()

// ============================================
// 状态
// ============================================
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const isLoading = ref(false)

// 监听对话框打开，重置表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    password.value = ''
    error.value = ''
  }
})

// ============================================
// 方法
// ============================================

/**
 * 处理表单提交
 * 验证密码并尝试登录
 */
const handleSubmit = async () => {
  if (!password.value) {
    error.value = '请输入密码'
    return
  }

  // 检查是否被锁定
  const remainingTime = authStore.getRemainingLockoutTime()
  if (remainingTime > 0) {
    error.value = `登录已锁定，请在 ${remainingTime} 分钟后重试`
    return
  }

  isLoading.value = true
  error.value = ''

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const success = authStore.login(password.value)
  
  isLoading.value = false

  if (success) {
    emit('success')
    emit('close')
  } else {
    const remainingAttempts = 5 - authStore.loginAttempts.value
    if (remainingAttempts > 0) {
      error.value = `密码错误，剩余 ${remainingAttempts} 次尝试机会`
    } else {
      error.value = '登录失败次数过多，请稍后再试'
    }
  }
}

/**
 * 关闭对话框
 * 重置表单状态
 */
const handleClose = () => {
  password.value = ''
  error.value = ''
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
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
          <div class="px-8 py-8">
            <h2 class="text-xl font-medium text-neutral-900 mb-2">管理员登录</h2>
            <p class="text-sm text-neutral-500 mb-6">请输入管理员密码以继续</p>
            
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-neutral-600">密码</label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all"
                    placeholder="请输入密码"
                    :disabled="isLoading"
                    @keyup.enter="handleSubmit"
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
                  <span v-if="isLoading" class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    验证中
                  </span>
                  <span v-else>登录</span>
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
