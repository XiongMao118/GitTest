<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import LoginDialog from '@/components/LoginDialog.vue'
import { useAuthStore } from '@/store/auth'

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

const authStore = useAuthStore()

const menuItems = ref([
  { id: 'home', icon: '🏠', label: '首页', description: '欢迎来到我的个人主页' },
  { id: 'about', icon: '👤', label: '关于我', description: '了解更多关于我的信息' },
  { id: 'skills', icon: '💼', label: '技能', description: '我的专业技能和专长' },
  { id: 'projects', icon: '📁', label: '项目', description: '我参与的项目和作品' },
  { id: 'contact', icon: '📧', label: '联系我', description: '与我取得联系' }
])

const activeMenu = ref('home')
const showStatusBar = ref(false)
const statusBarPage = ref('home')
const showLoginDialog = ref(false)
const isEditMode = ref(false)

// Load saved data from localStorage or use defaults
const defaultPersonalInfo: PersonalInfo = {
  avatar: '👤',
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
    { title: '🌐 个人博客系统', description: '基于 Vue3 + Node.js 构建的现代化博客平台，支持 Markdown 编辑和实时预览。', color: 'blue' },
    { title: '📊 数据可视化仪表盘', description: '交互式数据展示平台，支持多种图表类型和实时数据更新。', color: 'green' },
    { title: '🛒 电商管理系统', description: '完整的电商后台管理系统，包含订单管理、库存管理和数据分析功能。', color: 'purple' }
  ],
  contact: {
    email: 'email@example.com',
    phone: '+86 123-4567-8900',
    address: '北京市朝阳区',
    linkedin: 'linkedin.com/in/username',
    github: 'github.com/XiongMao118',
    bilibili: 'space.bilibili.com/233396733'
  }
}

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

const personalInfo = reactive<PersonalInfo>(loadPersonalInfo())
const editedInfo = reactive<PersonalInfo>(JSON.parse(JSON.stringify(defaultPersonalInfo)))

// Edit mode handlers
const startEdit = () => {
  Object.assign(editedInfo, JSON.parse(JSON.stringify(personalInfo)))
  isEditMode.value = true
}

const saveEdit = () => {
  Object.assign(personalInfo, JSON.parse(JSON.stringify(editedInfo)))
  localStorage.setItem('personal_info', JSON.stringify(personalInfo))
  isEditMode.value = false
}

const cancelEdit = () => {
  isEditMode.value = false
}

const handleLogout = () => {
  authStore.logout()
  isEditMode.value = false
}

const setActiveMenu = (id: string) => {
  activeMenu.value = id
}

const setStatusBarPage = (id: string) => {
  statusBarPage.value = id
  showStatusBar.value = false
  activeMenu.value = id
}

onMounted(() => {
  authStore.checkAuth()
})

const contentData = ref({
  home: {
    title: '欢迎来到我的个人主页',
    content: (info: PersonalInfo) => `
      <p>感谢您访问我的个人主页！</p>
      <p>这里展示了我的技能、项目和联系方式。</p>
      <p>使用左侧菜单导航到不同页面，或悬停在顶部状态栏快速切换。</p>
    `
  },
  about: {
    title: '关于我',
    content: (info: PersonalInfo) => `
      <h3>个人简介</h3>
      <p>${info.bio}</p>
      <h3>教育背景</h3>
      <ul>
        <li>计算机科学学士</li>
        <li>多年行业经验</li>
      </ul>
      <h3>兴趣爱好</h3>
      <p>编程、阅读、旅行、摄影</p>
    `
  },
  skills: {
    title: '专业技能',
    content: (info: PersonalInfo) => `
      <h3>技术栈</h3>
      <div class="grid grid-cols-2 gap-4">
        ${info.skills.map(skill => `
          <div class="bg-slate-100 rounded-lg p-4">
            <h4>${skill.category}</h4>
            <ul>${skill.items.join(', ')}</ul>
          </div>
        `).join('')}
      </div>
    `
  },
  projects: {
    title: '项目作品集',
    content: (info: PersonalInfo) => `
      <div class="space-y-4">
        ${info.projects.map(project => `
          <div class="bg-gradient-to-r from-${project.color}-50 to-${project.color}-100 rounded-lg p-4 border border-${project.color}-100">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
          </div>
        `).join('')}
      </div>
    `
  },
  contact: {
    title: '联系我',
    content: (info: PersonalInfo) => `
      <div class="space-y-4">
        <a href="mailto:${info.contact.email}" class="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-pink-50 hover:shadow-md group">
          <div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-600">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </div>
          <span class="text-slate-700 group-hover:text-pink-600 transition-colors duration-300 font-medium">${info.contact.email}</span>
        </a>
        <div class="flex items-center gap-3 p-3">
          <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          </div>
          <span class="text-slate-700">${info.contact.phone}</span>
        </div>
        <div class="flex items-center gap-3 p-3">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <span class="text-slate-700">${info.contact.address}</span>
        </div>
        <a href="https://www.linkedin.com/in/username" target="_blank" class="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-md group">
          <div class="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-800">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          </div>
          <span class="text-slate-700 group-hover:text-blue-700 transition-colors duration-300 font-medium">LinkedIn: ${info.contact.linkedin}</span>
        </a>
        <a href="https://github.com/XiongMao118" target="_blank" class="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md group">
          <div class="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-800">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </div>
          <span class="text-slate-700 group-hover:text-gray-900 transition-colors duration-300 font-medium">GitHub: ${info.contact.github}</span>
        </a>
        <a href="https://space.bilibili.com/233396733" target="_blank" class="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-pink-50 hover:shadow-md group">
          <div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-600">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM12 8.76c-1.787 0-3.24 1.453-3.24 3.24s1.453 3.24 3.24 3.24 3.24-1.453 3.24-3.24-1.453-3.24-3.24-3.24zm0 5.24c-1.127 0-2-.853-2-2s.873-2 2-2 2 .853 2 2-.873 2-2 2z"/></svg>
          </div>
          <span class="text-slate-700 group-hover:text-pink-500 transition-colors duration-300 font-medium">B站: ${info.contact.bilibili}</span>
        </a>
      </div>
    `
  }
})

// Skills editing
const addSkillCategory = () => {
  editedInfo.skills.push({ category: '新技能', items: [] })
}

const removeSkillCategory = (index: number) => {
  editedInfo.skills.splice(index, 1)
}

const addSkillItem = (categoryIndex: number) => {
  const newItem = prompt('请输入技能名称')
  if (newItem && newItem.trim()) {
    editedInfo.skills[categoryIndex].items.push(newItem.trim())
  }
}

const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
  editedInfo.skills[categoryIndex].items.splice(itemIndex, 1)
}

// Projects editing
const addProject = () => {
  editedInfo.projects.push({ title: '新项目', description: '项目描述', color: 'blue' })
}

const removeProject = (index: number) => {
  editedInfo.projects.splice(index, 1)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <!-- Edit Mode Header -->
    <div v-if="isEditMode" class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <span class="font-bold">编辑模式</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="saveEdit"
              class="px-4 py-2 bg-white text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              保存
            </button>
            <button
              @click="cancelEdit"
              class="px-4 py-2 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div
      v-if="!isEditMode"
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
      :class="showStatusBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'"
      @mouseleave="showStatusBar = false"
    >
      <div class="bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🌟</span>
              <span class="font-bold text-slate-800">个人主页</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="setStatusBarPage(item.id)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100"
                :class="statusBarPage === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'"
              >
                {{ item.icon }} {{ item.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hover Trigger Area -->
    <div
      v-if="!isEditMode"
      class="fixed top-0 left-0 right-0 h-10 z-40 cursor-pointer"
      @mouseenter="showStatusBar = true"
    ></div>

    <!-- Top Right - User Info -->
    <div class="fixed top-0 right-0 z-40 p-4" :class="isEditMode ? 'pt-14' : 'pt-10'">
      <div class="flex items-center gap-3">
        <!-- Admin Button or Avatar -->
        <template v-if="authStore.isAuthenticated && !isEditMode">
          <button
            @click="startEdit"
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            编辑
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all shadow-lg flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            登出
          </button>
        </template>
        <button
          v-if="!authStore.isAuthenticated"
          @click="showLoginDialog = true"
          class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          管理员登录
        </button>
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg">
          {{ personalInfo.avatar }}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pt-10 flex min-h-screen">
      <aside class="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200 flex-shrink-0">
        <div class="p-6">
          <nav class="space-y-1">
            <button
              v-for="item in menuItems"
              :key="item.id"
              @click="setActiveMenu(item.id)"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group"
              :class="activeMenu === item.id 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-600 hover:bg-slate-100'"
            >
              <span class="text-xl transition-transform duration-300 group-hover:scale-110">{{ item.icon }}</span>
              <div class="flex-1">
                <div class="font-medium">{{ item.label }}</div>
                <div 
                  class="text-xs transition-opacity duration-300"
                  :class="activeMenu === item.id ? 'text-blue-100 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'"
                >
                  {{ item.description }}
                </div>
              </div>
              <svg 
                v-if="activeMenu === item.id"
                class="w-4 h-4 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </nav>
        </div>
      </aside>

      <main class="flex-1 p-8" :class="isEditMode ? 'pt-20' : ''">
        <div class="max-w-4xl mx-auto">
          <!-- Edit Mode Forms -->
          <div v-if="isEditMode" class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 class="text-2xl font-bold text-slate-800 border-b pb-4">基本信息编辑</h2>
            
            <!-- Avatar & Basic Info -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">头像 (emoji)</label>
                <input
                  v-model="editedInfo.avatar"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">姓名</label>
                <input
                  v-model="editedInfo.name"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">职位</label>
                <input
                  v-model="editedInfo.title"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">个人简介</label>
              <textarea
                v-model="editedInfo.bio"
                rows="3"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Contact Info -->
            <div class="border-t pt-6">
              <h3 class="text-xl font-bold text-slate-800 mb-4">联系方式</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">邮箱</label>
                  <input
                    v-model="editedInfo.contact.email"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">电话</label>
                  <input
                    v-model="editedInfo.contact.phone"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">地址</label>
                  <input
                    v-model="editedInfo.contact.address"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
                  <input
                    v-model="editedInfo.contact.linkedin"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">GitHub</label>
                  <input
                    v-model="editedInfo.contact.github"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">B站</label>
                  <input
                    v-model="editedInfo.contact.bilibili"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Skills -->
            <div class="border-t pt-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-slate-800">技能列表</h3>
                <button
                  @click="addSkillCategory"
                  class="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + 添加分类
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(skill, sIndex) in editedInfo.skills" :key="sIndex" class="bg-slate-50 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <input
                      v-model="skill.category"
                      class="flex-1 px-3 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="分类名称"
                    />
                    <button
                      @click="removeSkillCategory(sIndex)"
                      class="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(item, iIndex) in skill.items"
                      :key="iIndex"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded-full text-sm"
                    >
                      {{ item }}
                      <button @click="removeSkillItem(sIndex, iIndex)" class="text-red-500 hover:text-red-700">×</button>
                    </span>
                    <button
                      @click="addSkillItem(sIndex)"
                      class="px-2 py-1 border border-dashed border-slate-300 rounded-full text-sm text-slate-500 hover:border-blue-500 hover:text-blue-500"
                    >
                      + 添加
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Projects -->
            <div class="border-t pt-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-slate-800">项目列表</h3>
                <button
                  @click="addProject"
                  class="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + 添加项目
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(project, pIndex) in editedInfo.projects" :key="pIndex" class="bg-slate-50 rounded-lg p-4">
                  <div class="space-y-2">
                    <input
                      v-model="project.title"
                      class="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="项目标题"
                    />
                    <textarea
                      v-model="project.description"
                      rows="2"
                      class="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="项目描述"
                    ></textarea>
                    <div class="flex items-center gap-2">
                      <label class="text-sm text-slate-600">颜色:</label>
                      <select
                        v-model="project.color"
                        class="px-3 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="blue">蓝色</option>
                        <option value="green">绿色</option>
                        <option value="purple">紫色</option>
                        <option value="pink">粉色</option>
                        <option value="yellow">黄色</option>
                      </select>
                      <button
                        @click="removeProject(pIndex)"
                        class="ml-auto px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        删除项目
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Display Mode -->
          <div 
            v-else
            class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 transition-all duration-500 transform"
            :class="activeMenu === 'home' ? 'scale-100' : 'scale-95 hover:scale-100'"
          >
            <h1 class="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              {{ menuItems.find(m => m.id === activeMenu)?.icon }}
              {{ contentData[activeMenu as keyof typeof contentData].title }}
            </h1>
            <div 
              class="prose prose-slate max-w-none"
              v-html="contentData[activeMenu as keyof typeof contentData].content(personalInfo)"
            ></div>
          </div>
        </div>
      </main>
    </div>

    <!-- Login Dialog -->
    <LoginDialog
      :visible="showLoginDialog"
      @close="showLoginDialog = false"
      @success="showLoginDialog = false"
    />
  </div>
</template>

<style scoped>
.prose h3 {
  color: #1e293b;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.prose h4 {
  color: #334155;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.prose p {
  color: #475569;
  margin-bottom: 1rem;
}

.prose ul {
  color: #475569;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.25rem;
}
</style>
