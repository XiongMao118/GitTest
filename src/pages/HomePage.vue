<script setup lang="ts">
/**
 * 首页组件
 * 功能：展示个人信息、技能、项目等内容，支持中英双语切换和管理员编辑模式
 */
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import AuthDialog from '@/components/AuthDialog.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'
import { useConfigStore } from '@/store/config'

// ============================================
// Store
// ============================================
const authStore = useAuthStore()
const userStore = useUserStore()
const configStore = useConfigStore()

const showAuthDialog = ref(false)
const currentUser = computed(() => userStore.currentUser.value)

// ============================================
// 双语支持
// ============================================
const currentLocale = ref<'zh' | 'en'>('zh')

const toggleLocale = () => {
  currentLocale.value = currentLocale.value === 'zh' ? 'en' : 'zh'
}

const t = (key: string | { zh: string; en: string }): string => {
  if (typeof key === 'object') {
    return key[currentLocale.value]
  }
  const translation = configStore.t(key, currentLocale.value)
  if (translation !== key) {
    return translation
  }
  const hardcodedTranslations: Record<string, { zh: string; en: string }> = {
    'Skills': { zh: '技能', en: 'Skills' },
    'Projects': { zh: '项目', en: 'Projects' },
    'Contact': { zh: '联系', en: 'Contact' },
    'About': { zh: '关于', en: 'About' },
    'Home': { zh: '首页', en: 'Home' },
    'Education': { zh: '教育背景', en: 'Education' },
    'Interests': { zh: '兴趣爱好', en: 'Interests' },
    'Programming': { zh: '编程', en: 'Programming' },
    'Reading': { zh: '阅读', en: 'Reading' },
    'Travel': { zh: '旅行', en: 'Travel' },
    'Photography': { zh: '摄影', en: 'Photography' },
    'Bachelor of Computer Science': { zh: '计算机科学学士', en: 'Bachelor of Computer Science' },
    'Years of industry experience': { zh: '多年行业经验', en: 'Years of industry experience' },
    'Just for fun': { zh: '只为乐趣', en: 'Just for fun' },
    'Passion': { zh: '热情', en: 'Passion' },
    '编辑': { zh: '编辑', en: 'Edit' },
    '设置': { zh: '设置', en: 'Settings' },
    '退出': { zh: '退出', en: 'Logout' },
    '登录': { zh: '登录', en: 'Login' },
    '编辑模式': { zh: '编辑模式', en: 'Edit Mode' },
    '取消': { zh: '取消', en: 'Cancel' },
    '保存': { zh: '保存', en: 'Save' },
    '我的头像': { zh: '我的头像', en: 'My Avatar' },
    '上传头像': { zh: '上传头像', en: 'Upload Avatar' },
    '姓名': { zh: '姓名', en: 'Name' },
    '职位': { zh: '职位', en: 'Title' },
    '简介': { zh: '简介', en: 'Bio' },
    'Email': { zh: '邮箱', en: 'Email' },
    'GitHub': { zh: 'GitHub', en: 'GitHub' },
    'Bilibili': { zh: 'B站', en: 'Bilibili' }
  }
  return hardcodedTranslations[key]?.[currentLocale.value] || key
}

// ============================================
// 状态管理
// ============================================
const contentVisible = ref(true)
const staggerKey = ref(0)

// ============================================
// 菜单管理
// ============================================
const activeMenu = ref('home')
const showMobileMenu = ref(false)
const showLoginDialog = ref(false)

const menuItems = ref([
  { id: 'home', label: { zh: '首页', en: 'Home' } },
  { id: 'about', label: { zh: '关于', en: 'About' } },
  { id: 'skills', label: { zh: '技能', en: 'Skills' } },
  { id: 'projects', label: { zh: '项目', en: 'Projects' } },
  { id: 'contact', label: { zh: '联系', en: 'Contact' } }
])

onMounted(async () => {
  authStore.checkAuth()
  userStore.checkSession()
  await configStore.fetchAllConfigs()
})

// ============================================
// 编辑模式
// ============================================
const isEditMode = ref(false)
const userAvatar = ref('')

const initUserAvatar = () => {
  const savedAvatar = localStorage.getItem('user_avatar_' + (currentUser.value?.id || 'default'))
  if (savedAvatar) {
    userAvatar.value = savedAvatar
  } else if (currentUser.value?.avatar_url) {
    userAvatar.value = currentUser.value.avatar_url
  } else if (configStore.personalInfo.value?.avatar) {
    userAvatar.value = configStore.personalInfo.value.avatar
  }
}

const saveUserAvatar = (avatar: string) => {
  if (currentUser.value?.id) {
    localStorage.setItem('user_avatar_' + currentUser.value.id, avatar)
  }
}

const startEdit = () => {
  initUserAvatar()
  isEditMode.value = true
}

const saveEdit = async () => {
  if (currentUser.value?.is_admin) {
    await configStore.updatePersonalInfo({
      avatar: configStore.personalInfo.value?.avatar || '',
      name: configStore.personalInfo.value?.name || { zh: '', en: '' },
      title: configStore.personalInfo.value?.title || { zh: '', en: '' },
      bio: configStore.personalInfo.value?.bio || { zh: '', en: '' }
    })
    await configStore.updateContact(configStore.contactInfo.value || {
      email: '',
      phone: '',
      address: { zh: '', en: '' },
      linkedin: '',
      github: '',
      bilibili: ''
    })
    
    await configStore.updateSkills(configStore.skills.value || [])
    await configStore.updateProjects(configStore.projects.value || [])
  }

  if (userAvatar.value !== currentUser.value?.avatar_url) {
    saveUserAvatar(userAvatar.value)
    await userStore.updateProfile({ avatar_url: userAvatar.value })
  }

  isEditMode.value = false
}

const cancelEdit = () => {
  isEditMode.value = false
}

// ============================================
// 头像上传
// ============================================

const handleAvatarUpload = (event: Event) => {
  const targetEl = event.target as HTMLInputElement
  const file = targetEl.files?.[0]

  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过 2MB')
      targetEl.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      userAvatar.value = result
      saveUserAvatar(result)
      // 如果是管理员，同时也更新首页的管理员头像
      if (currentUser.value?.is_admin) {
        configStore.personalInfo.value!.avatar = result
      }
      targetEl.value = ''
    }
    reader.onerror = () => {
      alert('图片读取失败，请重试')
      targetEl.value = ''
    }
    reader.readAsDataURL(file)
  } else {
    targetEl.value = ''
  }
}

const removeAvatar = () => {
  userAvatar.value = ''
  saveUserAvatar('')
  if (currentUser.value?.is_admin) {
    configStore.personalInfo.value!.avatar = ''
  }
}

// ============================================
// 表单辅助函数
// ============================================

const getFieldValue = (field: any, lang: 'zh' | 'en'): string => {
  if (typeof field === 'object' && field !== null) {
    return lang === 'zh' ? (field.zh || '') : (field.en || '')
  }
  return field || ''
}

const updateFieldValue = (fieldRef: any, lang: 'zh' | 'en', value: string) => {
  if (typeof fieldRef.value === 'object' && fieldRef.value !== null) {
    fieldRef.value[lang] = value
  } else {
    if (lang === 'zh') {
      fieldRef.value = value
    }
  }
}

// ============================================
// 用户认证
// ============================================

const handleLogout = async () => {
  await userStore.signOut()
  authStore.logout()
  isEditMode.value = false
  showAuthDialog.value = false
  showLoginDialog.value = false
}

const handleAuthSuccess = () => {
  showAuthDialog.value = false
  initUserAvatar()
}

// ============================================
// 菜单导航
// ============================================

const setActiveMenu = async (id: string) => {
  if (activeMenu.value === id) return
  contentVisible.value = false
  await new Promise(resolve => setTimeout(resolve, 150))
  activeMenu.value = id
  staggerKey.value++
  await nextTick()
  contentVisible.value = true
}

// ============================================
// 技能管理
// ============================================

const addSkillCategory = () => {
  if (configStore.skills.value) {
    configStore.skills.value.push({ 
      category: { zh: '新技能', en: 'New Skill' }, 
      items: [] 
    })
  }
}

const removeSkillCategory = (index: number) => {
  if (configStore.skills.value) {
    configStore.skills.value.splice(index, 1)
  }
}

const addSkillItem = (categoryIndex: number) => {
  const newItem = prompt('请输入技能名称')
  if (newItem && newItem.trim()) {
    if (configStore.skills.value && configStore.skills.value[categoryIndex]) {
      configStore.skills.value[categoryIndex].items.push(newItem.trim())
    }
  }
}

const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
  if (configStore.skills.value && configStore.skills.value[categoryIndex]) {
    configStore.skills.value[categoryIndex].items.splice(itemIndex, 1)
  }
}

// ============================================
// 项目管理
// ============================================

const addProject = () => {
  if (configStore.projects.value) {
    configStore.projects.value.push({ 
      title: { zh: '新项目', en: 'New Project' }, 
      description: { zh: '项目描述', en: 'Project description' }, 
      color: 'blue' 
    })
  }
}

const removeProject = (index: number) => {
  if (configStore.projects.value) {
    configStore.projects.value.splice(index, 1)
  }
}

// ============================================
  // 计算属性
  // ============================================

  const displayAvatar = computed(() => {
    return userAvatar.value || configStore.personalInfo.value.avatar || ''
  })

  const displayName = computed(() => {
    return configStore.getLocalizedText(configStore.personalInfo.value.name, currentLocale.value)
  })

  const displayTitle = computed(() => {
    return configStore.getLocalizedText(configStore.personalInfo.value.title, currentLocale.value)
  })

  const displayBio = computed(() => {
    return configStore.getLocalizedText(configStore.personalInfo.value.bio, currentLocale.value)
  })

  const displaySkills = computed(() => {
    return Array.isArray(configStore.skills.value) ? configStore.skills.value : []
  })

  const displayProjects = computed(() => {
    return Array.isArray(configStore.projects.value) ? configStore.projects.value : []
  })

  const displayContact = computed(() => {
    return configStore.contactInfo.value
  })

</script>

<template>
  <div class="min-h-screen bg-white text-neutral-800">
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <nav class="hidden sm:flex items-center gap-6">
            <button
              v-for="item in menuItems"
              :key="item.id"
              @click="setActiveMenu(item.id)"
              class="nav-link text-sm transition-colors duration-200 relative py-1"
              :class="activeMenu === item.id 
                ? 'text-neutral-900 font-medium' 
                : 'text-neutral-500 hover:text-neutral-700'"
            >
              {{ t(item.label) }}
              <span 
                class="nav-underline absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-neutral-800 transition-all duration-300"
                :class="activeMenu === item.id ? 'w-full' : 'w-0 group-hover:w-full'"
              ></span>
            </button>
          </nav>
          
          <div class="flex items-center gap-3">
            <template v-if="currentUser">
              <div class="relative group">
                <div class="w-9 h-9 rounded-full overflow-hidden bg-neutral-100 cursor-pointer border-2 border-transparent hover:border-neutral-300 transition-all duration-200">
                  <img v-if="userAvatar" :src="userAvatar" class="w-full h-full object-cover" />
                  <span v-else class="flex items-center justify-center w-full h-full text-sm font-medium text-neutral-500">
                    {{ currentUser.email?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
                <div class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div class="p-3 border-b border-neutral-100">
                    <p class="text-xs text-neutral-500 truncate">{{ currentUser.email }}</p>
                  </div>
                  <div class="p-2">
                    <label class="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md cursor-pointer transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="(e) => handleAvatarUpload(e, 'user')"
                      />
                      <svg class="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>选择新图片</span>
                    </label>
                    <button 
                      v-if="userAvatar"
                      @click="removeAvatar"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>移除头像</span>
                    </button>
                  </div>
                </div>
              </div>
              <button
                @click="startEdit"
                class="btn-edit text-sm text-neutral-600 hover:text-neutral-900 transition-all duration-200 hover:bg-neutral-100 px-3 py-1.5 rounded-md"
              >
                {{ currentUser.is_admin ? t('编辑') : t('设置') }}
              </button>
              <button
                @click="handleLogout"
                class="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {{ t('退出') }}
              </button>
            </template>
            <button
              v-else
              @click="showAuthDialog = true"
              class="btn-login text-sm text-neutral-600 hover:text-neutral-900 transition-all duration-200 hover:bg-neutral-100 px-3 py-1.5 rounded-md"
            >
              {{ t('登录') }}
            </button>
            
            <button
              @click="toggleLocale"
              class="text-sm text-neutral-500 hover:text-neutral-700 transition-colors px-2 py-1"
            >
              {{ currentLocale === 'zh' ? 'EN' : '中文' }}
            </button>
            
            <button
              v-if="currentUser?.is_admin"
              onclick="window.location.href='/modular'"
              class="text-sm text-neutral-600 hover:text-neutral-900 transition-colors px-2 py-1"
            >
              模块化页面
            </button>
            
            <button 
              @click="showMobileMenu = !showMobileMenu"
              class="sm:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            >
              <span 
                class="w-5 h-px bg-neutral-600 transition-all duration-300"
                :class="showMobileMenu ? 'rotate-45 translate-y-1' : ''"
              ></span>
              <span 
                class="w-5 h-px bg-neutral-600 transition-all duration-300"
                :class="showMobileMenu ? 'opacity-0' : ''"
              ></span>
              <span 
                class="w-5 h-px bg-neutral-600 transition-all duration-300"
                :class="showMobileMenu ? '-rotate-45 -translate-y-1' : ''"
              ></span>
            </button>
          </div>
        </div>
        
        <div 
          v-if="showMobileMenu"
          class="sm:hidden mt-4 pb-2 border-t border-neutral-100 pt-4"
        >
          <nav class="flex flex-col gap-2">
            <button
              v-for="item in menuItems"
              :key="item.id"
              @click="setActiveMenu(item.id); showMobileMenu = false"
              class="text-left text-sm py-2 px-3 rounded-md transition-colors"
              :class="activeMenu === item.id 
                ? 'text-neutral-900 font-medium bg-neutral-50' 
                : 'text-neutral-600 hover:bg-neutral-50'"
            >
              {{ t(item.label) }}
            </button>
            
            <button
              v-if="currentUser?.is_admin"
              onclick="window.location.href='/modular'"
              class="text-left text-sm py-2 px-3 rounded-md transition-colors text-neutral-600 hover:bg-neutral-50"
            >
              模块化页面
            </button>
          </nav>
        </div>
      </div>
    </header>

    <div v-if="isEditMode" class="fixed top-14 sm:top-16 left-0 right-0 z-40 bg-neutral-50 border-b border-neutral-200">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        <span class="text-sm text-neutral-600">{{ t('编辑模式') }}</span>
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="cancelEdit"
            class="px-3 sm:px-4 py-1.5 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            {{ t('取消') }}
          </button>
          <button
            @click="saveEdit"
            class="px-3 sm:px-4 py-1.5 text-sm bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
          >
            {{ t('保存') }}
          </button>
        </div>
      </div>
    </div>

    <main class="pt-20 sm:pt-24" :class="isEditMode ? 'sm:pt-32' : ''">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <div v-if="isEditMode" class="space-y-8">
          <template v-if="currentUser?.is_admin">
            <div class="border-t border-neutral-100 pt-8 space-y-6">
              <h2 class="text-lg font-medium text-neutral-800">个人信息</h2>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">{{ t('姓名') }}</label>
                  <div class="grid grid-cols-2 gap-2">
                    <input
                      :value="typeof configStore.personalInfo.value.name === 'object' ? configStore.personalInfo.value.name.zh : configStore.personalInfo.value.name"
                      @input="(e) => {
                        if (typeof configStore.personalInfo.value.name === 'object') {
                          configStore.personalInfo.value.name.zh = (e.target as HTMLInputElement).value
                        } else {
                          configStore.personalInfo.value.name = (e.target as HTMLInputElement).value
                        }
                      }"
                      class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                      placeholder="中文名"
                    />
                    <input
                      :value="typeof configStore.personalInfo.value.name === 'object' ? configStore.personalInfo.value.name.en : ''"
                      @input="(e) => {
                        if (typeof configStore.personalInfo.value.name === 'object') {
                          configStore.personalInfo.value.name.en = (e.target as HTMLInputElement).value
                        }
                      }"
                      class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                      placeholder="English name"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">{{ t('职位') }}</label>
                  <div class="grid grid-cols-2 gap-2">
                    <input
                      :value="typeof configStore.personalInfo.value.title === 'object' ? configStore.personalInfo.value.title.zh : configStore.personalInfo.value.title"
                      @input="(e) => {
                        if (typeof configStore.personalInfo.value.title === 'object') {
                          configStore.personalInfo.value.title.zh = (e.target as HTMLInputElement).value
                        } else {
                          configStore.personalInfo.value.title = (e.target as HTMLInputElement).value
                        }
                      }"
                      class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                      placeholder="中文职位"
                    />
                    <input
                      :value="typeof configStore.personalInfo.value.title === 'object' ? configStore.personalInfo.value.title.en : ''"
                      @input="(e) => {
                        if (typeof configStore.personalInfo.value.title === 'object') {
                          configStore.personalInfo.value.title.en = (e.target as HTMLInputElement).value
                        }
                      }"
                      class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                      placeholder="English title"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">{{ t('简介') }}</label>
                  <div class="grid grid-cols-2 gap-2">
                    <textarea
                      :value="typeof configStore.personalInfo.value.bio === 'object' ? configStore.personalInfo.value.bio.zh : configStore.personalInfo.value.bio"
                      @input="(e) => {
                        if (typeof configStore.personalInfo.value.bio === 'object') {
                          configStore.personalInfo.value.bio.zh = (e.target as HTMLTextAreaElement).value
                        } else {
                          configStore.personalInfo.value.bio = (e.target as HTMLTextAreaElement).value
                        }
                      }"
                      rows="3"
                      class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400 resize-none"
                      placeholder="中文简介"
                    ></textarea>
                    <textarea
                      :value="typeof configStore.personalInfo.value.bio === 'object' ? configStore.personalInfo.value.bio.en : ''"
                      @input="(e) => {
                        if (typeof configStore.personalInfo.value.bio === 'object') {
                          configStore.personalInfo.value.bio.en = (e.target as HTMLTextAreaElement).value
                        }
                      }"
                      rows="3"
                      class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400 resize-none"
                      placeholder="English bio"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-neutral-100 pt-8 space-y-4">
              <h2 class="text-lg font-medium text-neutral-800">联系方式</h2>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">邮箱</label>
                  <input
                    v-model="configStore.contactInfo.value!.email"
                    class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">GitHub</label>
                  <input
                    v-model="configStore.contactInfo.value!.github"
                    class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">B站</label>
                  <input
                    v-model="configStore.contactInfo.value!.bilibili"
                    class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>
            </div>

            <div class="border-t border-neutral-100 pt-8 space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-neutral-800">技能</h2>
                <button
                  @click="addSkillCategory"
                  class="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  + 添加分类
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(skill, sIndex) in configStore.skills.value" :key="sIndex" class="border border-neutral-100 p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="grid grid-cols-2 gap-2 flex-1">
                      <input
                        :value="typeof skill.category === 'object' ? skill.category.zh : skill.category"
                        @input="(e) => {
                          if (typeof skill.category === 'object') {
                            skill.category.zh = (e.target as HTMLInputElement).value
                          } else {
                            skill.category = (e.target as HTMLInputElement).value
                          }
                        }"
                        class="px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                        placeholder="中文分类"
                      />
                      <input
                        :value="typeof skill.category === 'object' ? skill.category.en : ''"
                        @input="(e) => {
                          if (typeof skill.category === 'object') {
                            skill.category.en = (e.target as HTMLInputElement).value
                          }
                        }"
                        class="px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                        placeholder="English category"
                      />
                    </div>
                    <button
                      @click="removeSkillCategory(sIndex)"
                      class="text-sm text-neutral-400 hover:text-red-500"
                    >
                      删除
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(item, iIndex) in skill.items"
                      :key="iIndex"
                      class="inline-flex items-center gap-1 px-2 py-1 bg-neutral-50 text-sm"
                    >
                      {{ item }}
                      <button @click="removeSkillItem(sIndex, iIndex)" class="text-neutral-400 hover:text-red-500">×</button>
                    </span>
                    <button
                      @click="addSkillItem(sIndex)"
                      class="px-2 py-1 text-sm text-neutral-400 hover:text-neutral-600"
                    >
                      + 添加
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-neutral-100 pt-8 space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-neutral-800">项目</h2>
                <button
                  @click="addProject"
                  class="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  + 添加项目
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(project, pIndex) in configStore.projects.value" :key="pIndex" class="border border-neutral-100 p-4">
                  <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-2">
                      <input
                        :value="typeof project.title === 'object' ? project.title.zh : project.title"
                        @input="(e) => {
                          if (typeof project.title === 'object') {
                            project.title.zh = (e.target as HTMLInputElement).value
                          } else {
                            project.title = (e.target as HTMLInputElement).value
                          }
                        }"
                        class="w-full px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                        placeholder="中文标题"
                      />
                      <input
                        :value="typeof project.title === 'object' ? project.title.en : ''"
                        @input="(e) => {
                          if (typeof project.title === 'object') {
                            project.title.en = (e.target as HTMLInputElement).value
                          }
                        }"
                        class="w-full px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                        placeholder="English title"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <textarea
                        :value="typeof project.description === 'object' ? project.description.zh : project.description"
                        @input="(e) => {
                          if (typeof project.description === 'object') {
                            project.description.zh = (e.target as HTMLTextAreaElement).value
                          } else {
                            project.description = (e.target as HTMLTextAreaElement).value
                          }
                        }"
                        rows="2"
                        class="w-full px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400 resize-none"
                        placeholder="中文描述"
                      ></textarea>
                      <textarea
                        :value="typeof project.description === 'object' ? project.description.en : ''"
                        @input="(e) => {
                          if (typeof project.description === 'object') {
                            project.description.en = (e.target as HTMLTextAreaElement).value
                          }
                        }"
                        rows="2"
                        class="w-full px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400 resize-none"
                        placeholder="English description"
                      ></textarea>
                    </div>
                    <div class="flex items-center justify-between">
                      <select
                        v-model="project.color"
                        class="px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                      >
                        <option value="blue">蓝色</option>
                        <option value="green">绿色</option>
                        <option value="purple">紫色</option>
                      </select>
                      <button
                        @click="removeProject(pIndex)"
                        class="text-sm text-neutral-400 hover:text-red-500"
                      >
                        删除项目
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <Transition name="fade" mode="out-in">
          <div v-if="!isEditMode" :key="staggerKey" class="space-y-16">
          
          <section v-if="activeMenu === 'home'" class="space-y-12 relative">
            <div class="text-center space-y-6">
              <div class="avatar-container w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 relative">
                <img v-if="configStore.personalInfo.value.avatar" :src="configStore.personalInfo.value.avatar" class="w-full h-full object-cover" />
                <span v-else class="flex items-center justify-center w-full h-full text-4xl text-neutral-400">?</span>
                <div v-if="currentUser?.is_admin" class="avatar-ring absolute inset-0 rounded-full border-2 border-neutral-300 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 class="text-3xl font-medium text-neutral-900 stagger-item">{{ displayName }}</h1>
              <p class="text-neutral-500 stagger-item">{{ displayTitle }}</p>
              <p class="text-sm text-neutral-400 stagger-item italic">"{{ t('Just for fun') }}"</p>
            </div>
            
            <div class="text-center max-w-lg mx-auto">
              <p class="text-neutral-600 leading-relaxed stagger-item">
                {{ displayBio }}
              </p>
            </div>

            <div class="grid grid-cols-4 gap-8 text-center">
              <div class="stat-item stagger-item transition-all duration-300 hover:scale-105">
                <div class="text-3xl font-semibold text-neutral-800">{{ displaySkills.reduce((sum, skill) => sum + skill.items.length, 0) }}</div>
                <div class="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{{ t('Skills') }}</div>
              </div>
              <div class="stat-item stagger-item transition-all duration-300 hover:scale-105">
                <div class="text-3xl font-semibold text-neutral-800">{{ displayProjects.length }}</div>
                <div class="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{{ t('Projects') }}</div>
              </div>
              <div class="stat-item stagger-item transition-all duration-300 hover:scale-105">
                <div class="text-3xl font-semibold text-neutral-800">3</div>
                <div class="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{{ t('Contact') }}</div>
              </div>
              <div class="stat-item stagger-item transition-all duration-300 hover:scale-105">
                <div class="text-3xl font-semibold text-neutral-800">∞</div>
                <div class="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{{ t('Passion') }}</div>
              </div>
            </div>
          </section>

          <section v-if="activeMenu === 'about'" class="space-y-8">
            <h2 class="text-xl font-medium text-neutral-900 stagger-item">{{ t('About') }}</h2>
            <p class="text-neutral-600 leading-relaxed stagger-item">{{ displayBio }}</p>
            
            <div class="space-y-6">
              <div class="space-y-2 stagger-item">
                <h3 class="text-xs font-medium text-neutral-400 uppercase tracking-wider">{{ t('Education') }}</h3>
                <div class="text-neutral-600">
                  <p class="font-medium">{{ t('Bachelor of Computer Science') }}</p>
                  <p class="text-sm text-neutral-500">{{ t('Years of industry experience') }}</p>
                </div>
              </div>

              <div class="space-y-2 stagger-item">
                <h3 class="text-xs font-medium text-neutral-400 uppercase tracking-wider">{{ t('Interests') }}</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="text-sm text-neutral-600 bg-neutral-50 px-3 py-1 rounded-full">{{ t('Programming') }}</span>
                  <span class="text-sm text-neutral-600 bg-neutral-50 px-3 py-1 rounded-full">{{ t('Reading') }}</span>
                  <span class="text-sm text-neutral-600 bg-neutral-50 px-3 py-1 rounded-full">{{ t('Travel') }}</span>
                  <span class="text-sm text-neutral-600 bg-neutral-50 px-3 py-1 rounded-full">{{ t('Photography') }}</span>
                </div>
              </div>
            </div>
          </section>

          <section v-if="activeMenu === 'skills'" class="space-y-8">
            <h2 class="text-xl font-medium text-neutral-900 stagger-item">{{ t('Skills') }}</h2>
            <div class="space-y-6">
              <div v-for="(skill, index) in displaySkills" :key="typeof skill.category === 'object' ? skill.category.zh || skill.category.en : skill.category" class="space-y-3 stagger-item" :style="{ animationDelay: `${index * 0.1}s` }">
                <h3 class="text-sm font-semibold text-neutral-700 pb-2 border-b border-neutral-200">{{ configStore.getLocalizedText(skill.category, currentLocale) }}</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(item, idx) in skill.items" 
                    :key="item" 
                    class="skill-tag text-sm text-neutral-600 bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-200 px-3 py-1.5 rounded-full"
                    :style="{ animationDelay: `${idx * 0.05}s` }"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section v-if="activeMenu === 'projects'" class="space-y-8">
            <h2 class="text-xl font-medium text-neutral-900 stagger-item">{{ t('Projects') }}</h2>
            <div class="space-y-6">
              <div 
                v-for="(project, index) in displayProjects" 
                :key="typeof project.title === 'object' ? project.title.zh || project.title.en : project.title" 
                class="project-card group p-4 -mx-4 rounded-lg transition-all duration-300 hover:bg-neutral-50 hover:shadow-md stagger-item"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <div class="space-y-2">
                  <h3 class="text-lg font-medium text-neutral-800">{{ configStore.getLocalizedText(project.title, currentLocale) }}</h3>
                  <p class="text-sm text-neutral-600 leading-relaxed">{{ configStore.getLocalizedText(project.description, currentLocale) }}</p>
                </div>
              </div>
            </div>
          </section>

          <section v-if="activeMenu === 'contact'" class="space-y-8">
            <h2 class="text-xl font-medium text-neutral-900 stagger-item">{{ t('Contact') }}</h2>
            <div class="space-y-3">
              <a 
                :href="`mailto:${displayContact.email}`" 
                class="contact-link flex items-center gap-3 py-2 text-neutral-600 hover:text-neutral-900 transition-all duration-200 border-b border-neutral-100 hover:border-neutral-300 stagger-item"
              >
                <span class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm">@</span>
                <span>{{ currentUser?.is_admin ? displayContact.email : t('Email') }}</span>
              </a>
              <a 
                :href="`https://${displayContact.github}`" 
                target="_blank"
                class="contact-link flex items-center gap-3 py-2 text-neutral-600 hover:text-neutral-900 transition-all duration-200 border-b border-neutral-100 hover:border-neutral-300 stagger-item"
              >
                <span class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm">G</span>
                <span>{{ currentUser?.is_admin ? displayContact.github : t('GitHub') }}</span>
              </a>
              <a 
                :href="`https://${displayContact.bilibili}`" 
                target="_blank"
                class="contact-link flex items-center gap-3 py-2 text-neutral-600 hover:text-neutral-900 transition-all duration-200 border-b border-neutral-100 hover:border-neutral-300 stagger-item"
              >
                <span class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm">B</span>
                <span>{{ currentUser?.is_admin ? displayContact.bilibili : t('Bilibili') }}</span>
              </a>
            </div>
          </section>
        </div>
        </Transition>

        <footer class="mt-24 pt-8 border-t border-neutral-100 text-center">
          <p class="text-sm text-neutral-400">
            © {{ new Date().getFullYear() }} {{ displayName }}
          </p>
          <p class="text-xs text-neutral-300 mt-2">
            <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-neutral-500 transition-colors">
              京ICP备XXXXXXXX号
            </a>
          </p>
        </footer>
      </div>
    </main>

    <AuthDialog
      :visible="showAuthDialog"
      @close="showAuthDialog = false"
      @success="handleAuthSuccess"
    />

    <LoginDialog
      :visible="showLoginDialog"
      @close="showLoginDialog = false"
      @success="showLoginDialog = false"
    />
  </div>
</template>

<style scoped>
.nav-link:hover .nav-underline {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.stagger-item {
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

.stagger-item:nth-child(1) { animation-delay: 0s; }
.stagger-item:nth-child(2) { animation-delay: 0.05s; }
.stagger-item:nth-child(3) { animation-delay: 0.1s; }
.stagger-item:nth-child(4) { animation-delay: 0.15s; }
.stagger-item:nth-child(5) { animation-delay: 0.2s; }
.stagger-item:nth-child(6) { animation-delay: 0.25s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.avatar-container:hover .avatar-ring {
  opacity: 1;
}

.project-card {
  position: relative;
}

.project-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: transparent;
  transition: background 0.3s ease;
}

.project-card:hover::before {
  background: #d4d4d4;
}

.contact-link {
  position: relative;
  padding-left: 0;
}

.contact-link::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background: #525252;
  transition: width 0.3s ease;
}

.contact-link:hover::before {
  width: 100%;
}

.decorative-dots {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.stat-item {
  position: relative;
}

.stat-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 1px;
  background: #d4d4d4;
  transition: width 0.3s ease;
}

.stat-item:hover::after {
  width: 100%;
}

.btn-login:hover,
.btn-edit:hover {
  transform: translateY(-1px);
}

.skill-tag {
  position: relative;
  overflow: hidden;
}

.skill-tag::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.skill-tag:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
</style>
