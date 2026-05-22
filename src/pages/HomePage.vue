<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  id: string
  icon: string
  label: string
  description: string
}

const menuItems: MenuItem[] = [
  { id: 'home', icon: '🏠', label: '首页', description: '欢迎来到我的个人主页' },
  { id: 'about', icon: '👤', label: '关于我', description: '了解更多关于我的信息' },
  { id: 'skills', icon: '💼', label: '技能', description: '我的专业技能和专长' },
  { id: 'projects', icon: '📁', label: '项目', description: '我参与的项目和作品' },
  { id: 'contact', icon: '📧', label: '联系我', description: '与我取得联系' }
]

const activeMenu = ref('home')
const showStatusBar = ref(false)
const statusBarPage = ref('home')

const setActiveMenu = (id: string) => {
  activeMenu.value = id
}

const setStatusBarPage = (id: string) => {
  statusBarPage.value = id
  showStatusBar.value = false
  activeMenu.value = id
}

const contentData: Record<string, { title: string; content: string }> = {
  home: {
    title: '欢迎来到我的个人主页',
    content: `
      <p>感谢您访问我的个人主页！</p>
      <p>这里展示了我的技能、项目和联系方式。</p>
      <p>使用左侧菜单导航到不同页面，或悬停在顶部状态栏快速切换。</p>
    `
  },
  about: {
    title: '关于我',
    content: `
      <h3>个人简介</h3>
      <p>我是一名充满热情的开发者，专注于前端开发和用户体验设计。</p>
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
    content: `
      <h3>技术栈</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-100 rounded-lg p-4">
          <h4>前端技术</h4>
          <ul>Vue.js, React, TypeScript, JavaScript, HTML5, CSS3</ul>
        </div>
        <div class="bg-slate-100 rounded-lg p-4">
          <h4>后端技术</h4>
          <ul>Node.js, Express, MongoDB, PostgreSQL</ul>
        </div>
        <div class="bg-slate-100 rounded-lg p-4">
          <h4>工具与框架</h4>
          <ul>Webpack, Vite, Git, Docker</ul>
        </div>
        <div class="bg-slate-100 rounded-lg p-4">
          <h4>设计能力</h4>
          <ul>Figma, Photoshop, UI/UX设计</ul>
        </div>
      </div>
    `
  },
  projects: {
    title: '项目作品集',
    content: `
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <h4>🌐 个人博客系统</h4>
          <p>基于 Vue3 + Node.js 构建的现代化博客平台，支持 Markdown 编辑和实时预览。</p>
        </div>
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
          <h4>📊 数据可视化仪表盘</h4>
          <p>交互式数据展示平台，支持多种图表类型和实时数据更新。</p>
        </div>
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
          <h4>🛒 电商管理系统</h4>
          <p>完整的电商后台管理系统，包含订单管理、库存管理和数据分析功能。</p>
        </div>
      </div>
    `
  },
  contact: {
    title: '联系我',
    content: `
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-2xl">📧</span>
          <span>email@example.com</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-2xl">📱</span>
          <span>+86 123-4567-8900</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-2xl">📍</span>
          <span>北京市朝阳区</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-2xl">💼</span>
          <span>LinkedIn: linkedin.com/in/username</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-2xl">🐙</span>
          <span>GitHub: github.com/username</span>
        </div>
      </div>
    `
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <div
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

    <div
      class="fixed top-0 left-0 right-0 h-10 z-40 cursor-pointer"
      @mouseenter="showStatusBar = true"
    >
      <div class="flex items-center justify-center h-full">
        <span class="text-slate-400 text-sm animate-pulse">👆 悬停显示状态栏</span>
      </div>
    </div>

    <div class="pt-10 flex min-h-screen">
      <aside class="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200 flex-shrink-0">
        <div class="p-6">
          <div class="flex flex-col items-center mb-8">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
              👤
            </div>
            <h2 class="font-bold text-lg text-slate-800">我的名字</h2>
            <p class="text-sm text-slate-500">前端开发者</p>
          </div>

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

      <main class="flex-1 p-8">
        <div class="max-w-4xl mx-auto">
          <div 
            class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 transition-all duration-500 transform"
            :class="activeMenu === 'home' ? 'scale-100' : 'scale-95 hover:scale-100'"
          >
            <h1 class="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              {{ menuItems.find(m => m.id === activeMenu)?.icon }}
              {{ contentData[activeMenu].title }}
            </h1>
            <div 
              class="prose prose-slate max-w-none"
              v-html="contentData[activeMenu].content"
            ></div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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
