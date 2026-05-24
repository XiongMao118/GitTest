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

// ============================================
// 状态管理
// ============================================
const contentVisible = ref(true)  // 内容可见性，用于淡入淡出动画
const staggerKey = ref(0)  // 用于触发动画重新播放

// ============================================
// 接口定义
// ============================================
interface Skill {
  category: string
  items: string[]
}

interface Project {
  title: string
  description: string
  color: string
}

interface Contact {
  email: string
  phone: string
  address: string
  linkedin: string
  github: string
  bilibili: string
}

interface PersonalInfo {
  avatar: string
  name: string
  title: string
  bio: string
  skills: Skill[]
  projects: Project[]
  contact: Contact
}

// ============================================
// Store
// ============================================
const authStore = useAuthStore()
const userStore = useUserStore()
const showAuthDialog = ref(false)
const currentUser = computed(() => userStore.currentUser.value)

// ============================================
// 双语支持
// ============================================
const currentLocale = ref<'zh' | 'en'>('zh')

const toggleLocale = () => {
  currentLocale.value = currentLocale.value === 'zh' ? 'en' : 'zh'
}

/**
 * 翻译函数
 * @param key - 翻译键，可以是字符串或双语对象
 * @returns 根据当前语言返回对应的翻译文本
 */
const t = (key: string | { zh: string; en: string }): string => {
  if (typeof key === 'object') {
    return key[currentLocale.value]
  }
  const translations: Record<string, { zh: string; en: string }> = {
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
    '添加技能': { zh: '添加技能', en: 'Add Skill' },
    '添加项目': { zh: '添加项目', en: 'Add Project' },
    'Email': { zh: '邮箱', en: 'Email' },
    'GitHub': { zh: 'GitHub', en: 'GitHub' },
    'Bilibili': { zh: 'B站', en: 'Bilibili' },
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
    'Passion': { zh: '热情', en: 'Passion' }
  }
  return translations[key]?.[currentLocale.value] || key
}

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

onMounted(() => {
  authStore.checkAuth()
  userStore.checkSession()
})

const loadPersonalInfo = (): PersonalInfo => {
  const saved = localStorage.getItem('personal_info')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return defaultPersonalInfo
    }
  }
  return defaultPersonalInfo
}

const defaultPersonalInfo: PersonalInfo = {
  avatar: '',
  name: '我的名字',
  title: '前端开发者',
  bio: '我是一名充满热情的开发者，专注于前端开发和用户体验设计。',
  skills: [
    { category: '前端技术', items: ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
    { category: '后端技术', items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'] },
    { category: '工具与框架', items: ['Webpack', 'Vite', 'Git', 'Docker'] },
    { category: '设计能力', items: ['Figma', 'Photoshop', 'UI/UX设计'] }
  ],
  projects: [
    { title: '个人博客系统', description: '基于 Vue3 + Node.js 构建的现代化博客平台，支持 Markdown 编辑和实时预览。', color: 'blue' },
    { title: '数据可视化仪表盘', description: '交互式数据展示平台，支持多种图表类型和实时数据更新。', color: 'green' },
    { title: '电商管理系统', description: '完整的电商后台管理系统，包含订单管理、库存管理和数据分析功能。', color: 'purple' }
  ],
  contact: {
    email: 'email@example.com',
    phone: '+86 123-4567-8900',
    address: '北京市朝阳区',
    linkedin: 'linkedin.com/in/username',
    github: 'github.com/XiongMao118',
    bilibili: 'space.bilibili.com/550003217'
  }
}

const personalInfo = reactive<PersonalInfo>(loadPersonalInfo())
const editedInfo = reactive<PersonalInfo>(JSON.parse(JSON.stringify(loadPersonalInfo())))

// ============================================
// 编辑模式
// ============================================
const isEditMode = ref(false)
const userAvatar = ref('')

/**
 * 开始编辑模式
 * 保存当前信息的副本用于编辑
 */
const startEdit = () => {
  Object.assign(editedInfo, JSON.parse(JSON.stringify(personalInfo)))
  userAvatar.value = currentUser.value?.avatar_url || ''
  isEditMode.value = true
}

/**
 * 保存编辑内容
 * 将编辑的信息保存到 localStorage 并更新用户头像
 */
const saveEdit = async () => {
  Object.assign(personalInfo, JSON.parse(JSON.stringify(editedInfo)))
  localStorage.setItem('personal_info', JSON.stringify(personalInfo))

  if (userAvatar.value !== currentUser.value?.avatar_url) {
    await userStore.updateProfile({ avatar_url: userAvatar.value })
  }

  isEditMode.value = false
}

/**
 * 取消编辑
 * 恢复到未编辑状态
 */
const cancelEdit = () => {
  isEditMode.value = false
}

// ============================================
// 头像上传
// ============================================

/**
 * 处理头像上传
 * @param event - 文件输入事件
 * @param target - 上传目标：'user' 表示用户头像，'personal' 表示个人信息头像
 */
const handleAvatarUpload = (event: Event, target: 'user' | 'personal' = 'personal') => {
  const targetEl = event.target as HTMLInputElement
  const file = targetEl.files?.[0]

  if (file) {
    // 检查文件大小（限制 2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (target === 'user') {
        userAvatar.value = result
      } else {
        editedInfo.avatar = result
      }
    }
    reader.readAsDataURL(file)
  }

  // 清空 input 以便下次选择相同文件
  targetEl.value = ''
}

// ============================================
// 用户认证
// ============================================

/**
 * 处理用户登出
 * 清除登录状态并关闭编辑模式
 */
const handleLogout = async () => {
  await userStore.signOut()
  authStore.logout()
  isEditMode.value = false
  showAuthDialog.value = false
  showLoginDialog.value = false
}

/**
 * 认证成功回调
 */
const handleAuthSuccess = () => {
  showAuthDialog.value = false
}

// ============================================
// 菜单导航
// ============================================

/**
 * 设置当前活动菜单
 * @param id - 菜单项 ID
 * 实现淡入淡出过渡效果
 */
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

/**
 * 添加新的技能分类
 */
const addSkillCategory = () => {
  editedInfo.skills.push({ category: '新技能', items: [] })
}

/**
 * 移除技能分类
 * @param index - 要移除的分类索引
 */
const removeSkillCategory = (index: number) => {
  editedInfo.skills.splice(index, 1)
}

/**
 * 添加技能项目到指定分类
 * @param categoryIndex - 分类索引
 */
const addSkillItem = (categoryIndex: number) => {
  const newItem = prompt('请输入技能名称')
  if (newItem && newItem.trim()) {
    editedInfo.skills[categoryIndex].items.push(newItem.trim())
  }
}

/**
 * 移除技能项目
 * @param categoryIndex - 分类索引
 * @param itemIndex - 项目索引
 */
const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
  editedInfo.skills[categoryIndex].items.splice(itemIndex, 1)
}

// ============================================
// 项目管理
// ============================================

/**
 * 添加新项目
 */
const addProject = () => {
  editedInfo.projects.push({ title: '新项目', description: '项目描述', color: 'blue' })
}

/**
 * 移除项目
 * @param index - 要移除的项目索引
 */
const removeProject = (index: number) => {
  editedInfo.projects.splice(index, 1)
}
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
          <div class="space-y-4">
            <h2 class="text-lg font-medium text-neutral-800">{{ t('我的头像') }}</h2>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-neutral-100 overflow-hidden">
                <img v-if="userAvatar" :src="userAvatar" class="w-full h-full object-cover" />
                <span v-else class="flex items-center justify-center w-full h-full text-2xl text-neutral-400">?</span>
              </div>
              <div class="flex-1 space-y-2">
                <input
                  v-model="userAvatar"
                  class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                  placeholder="输入图片URL"
                />
                <label class="inline-block text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">
                  选择本地图片
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleUserAvatarUpload"
                  />
                </label>
              </div>
            </div>
          </div>

          <template v-if="currentUser?.is_admin">
            <div class="border-t border-neutral-100 pt-8 space-y-6">
              <h2 class="text-lg font-medium text-neutral-800">个人信息</h2>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">头像</label>
                  <div class="flex items-center gap-3">
                    <input
                      v-model="editedInfo.avatar"
                      class="flex-1 px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                      placeholder="图片URL"
                    />
                    <label class="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">
                      上传
                      <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleAvatarUpload"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">{{ t('姓名') }}</label>
                  <input
                    v-model="editedInfo.name"
                    class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">{{ t('职位') }}</label>
                  <input
                    v-model="editedInfo.title"
                    class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">{{ t('简介') }}</label>
                  <textarea
                    v-model="editedInfo.bio"
                    rows="3"
                    class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-neutral-100 pt-8 space-y-4">
              <h2 class="text-lg font-medium text-neutral-800">联系方式</h2>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">邮箱</label>
                  <input
                    v-model="editedInfo.contact.email"
                    class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">GitHub</label>
                  <input
                    v-model="editedInfo.contact.github"
                    class="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label class="block text-sm text-neutral-500 mb-1">B站</label>
                  <input
                    v-model="editedInfo.contact.bilibili"
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
                <div v-for="(skill, sIndex) in editedInfo.skills" :key="sIndex" class="border border-neutral-100 p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <input
                      v-model="skill.category"
                      class="flex-1 px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                      placeholder="分类名称"
                    />
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
                <div v-for="(project, pIndex) in editedInfo.projects" :key="pIndex" class="border border-neutral-100 p-4">
                  <div class="space-y-3">
                    <input
                      v-model="project.title"
                      class="w-full px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
                      placeholder="项目标题"
                    />
                    <textarea
                      v-model="project.description"
                      rows="2"
                      class="w-full px-2 py-1 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400 resize-none"
                      placeholder="项目描述"
                    ></textarea>
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
                <img v-if="personalInfo.avatar" :src="personalInfo.avatar" class="w-full h-full object-cover" />
                <span v-else class="flex items-center justify-center w-full h-full text-4xl text-neutral-400">?</span>
                <div class="avatar-ring absolute inset-0 rounded-full border-2 border-neutral-300 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 class="text-3xl font-medium text-neutral-900 stagger-item">{{ personalInfo.name }}</h1>
              <p class="text-neutral-500 stagger-item">{{ personalInfo.title }}</p>
              <p class="text-sm text-neutral-400 stagger-item italic">"{{ t('Just for fun') }}"</p>
            </div>
            
            <div class="text-center max-w-lg mx-auto">
              <p class="text-neutral-600 leading-relaxed stagger-item">
                {{ personalInfo.bio }}
              </p>
            </div>

            <div class="grid grid-cols-4 gap-8 text-center">
              <div class="stat-item stagger-item transition-all duration-300 hover:scale-105">
                <div class="text-3xl font-semibold text-neutral-800">{{ personalInfo.skills.length * 6 }}</div>
                <div class="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{{ t('Skills') }}</div>
              </div>
              <div class="stat-item stagger-item transition-all duration-300 hover:scale-105">
                <div class="text-3xl font-semibold text-neutral-800">{{ personalInfo.projects.length }}</div>
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
            <p class="text-neutral-600 leading-relaxed stagger-item">{{ personalInfo.bio }}</p>
            
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
              <div v-for="(skill, index) in personalInfo.skills" :key="skill.category" class="space-y-3 stagger-item" :style="{ animationDelay: `${index * 0.1}s` }">
                <h3 class="text-xs font-medium text-neutral-400 uppercase tracking-wider">{{ skill.category }}</h3>
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
                v-for="(project, index) in personalInfo.projects" 
                :key="project.title" 
                class="project-card group flex gap-4 p-4 -mx-4 rounded-lg transition-all duration-300 hover:bg-neutral-50 hover:shadow-md hover:-translate-y-0.5 stagger-item"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <div class="w-20 h-20 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <div class="flex-1 space-y-2">
                  <h3 class="text-lg font-medium text-neutral-800">{{ project.title }}</h3>
                  <p class="text-sm text-neutral-600 leading-relaxed">{{ project.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <section v-if="activeMenu === 'contact'" class="space-y-8">
            <h2 class="text-xl font-medium text-neutral-900 stagger-item">{{ t('Contact') }}</h2>
            <div class="space-y-3">
              <a 
                :href="`mailto:${personalInfo.contact.email}`" 
                class="contact-link flex items-center gap-3 py-2 text-neutral-600 hover:text-neutral-900 transition-all duration-200 border-b border-neutral-100 hover:border-neutral-300 stagger-item"
              >
                <span class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm">@</span>
                <span>{{ currentUser?.is_admin ? personalInfo.contact.email : t('Email') }}</span>
              </a>
              <a 
                href="https://github.com/XiongMao118" 
                target="_blank"
                class="contact-link flex items-center gap-3 py-2 text-neutral-600 hover:text-neutral-900 transition-all duration-200 border-b border-neutral-100 hover:border-neutral-300 stagger-item"
              >
                <span class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm">G</span>
                <span>{{ currentUser?.is_admin ? personalInfo.contact.github : t('GitHub') }}</span>
              </a>
              <a 
                href="https://space.bilibili.com/550003217" 
                target="_blank"
                class="contact-link flex items-center gap-3 py-2 text-neutral-600 hover:text-neutral-900 transition-all duration-200 border-b border-neutral-100 hover:border-neutral-300 stagger-item"
              >
                <span class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm">B</span>
                <span>{{ currentUser?.is_admin ? personalInfo.contact.bilibili : t('Bilibili') }}</span>
              </a>
            </div>
          </section>
        </div>
        </Transition>

        <footer class="mt-24 pt-8 border-t border-neutral-100 text-center">
          <p class="text-sm text-neutral-400">
            © {{ new Date().getFullYear() }} {{ personalInfo.name }}
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
