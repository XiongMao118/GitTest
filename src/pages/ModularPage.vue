<script setup lang="ts">
/**
 * 模块化页面组件
 * 功能：展示模块化的个人作品集页面，包含 Hero、About、Skills、Projects、Contact 等模块
 * 支持中英双语切换
 */
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'

// ============================================
// Store
// ============================================
const authStore = useAuthStore()
const userStore = useUserStore()
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
 * @param key - 翻译键
 * @returns 根据当前语言返回对应的翻译文本
 */
const t = (key: string): string => {
  const translations: Record<string, { zh: string; en: string }> = {
    'Portfolio': { zh: '作品集', en: 'Portfolio' },
    'Hero': { zh: '首页', en: 'Hero' },
    'About': { zh: '关于', en: 'About' },
    'Skills': { zh: '技能', en: 'Skills' },
    'Projects': { zh: '项目', en: 'Projects' },
    'Contact': { zh: '联系', en: 'Contact' },
    'Dashboard': { zh: '控制台', en: 'Dashboard' },
    'Profile': { zh: '个人资料', en: 'Profile' },
    'Login': { zh: '登录', en: 'Login' },
    'Logout': { zh: '退出', en: 'Logout' },
    'Building beautiful interfaces': { zh: '构建美丽的界面', en: 'Building beautiful interfaces' },
    'Hi, I': { zh: '你好，我是', en: 'Hi, I' },
    'm': { zh: '', en: 'm' },
    'Frontend Developer': { zh: '前端开发者', en: 'Frontend Developer' },
    'Passionate about creating exceptional digital experiences with modern web technologies.': { zh: '热衷于使用现代Web技术创造卓越的数字体验。', en: 'Passionate about creating exceptional digital experiences with modern web technologies.' },
    'Years Experience': { zh: '年经验', en: 'Years Experience' },
    'Projects Completed': { zh: '完成项目', en: 'Projects Completed' },
    'Clients Served': { zh: '服务客户', en: 'Clients Served' },
    'Lines of Code': { zh: '代码行数', en: 'Lines of Code' },
    'View Portfolio': { zh: '查看作品集', en: 'View Portfolio' },
    'Download Resume': { zh: '下载简历', en: 'Download Resume' },
    'About Me': { zh: '关于我', en: 'About Me' },
    'Who Am I?': { zh: '我是谁？', en: 'Who Am I?' },
    "I'm a passionate frontend developer with years of experience building beautiful and functional web applications. I specialize in creating user-centered designs that deliver exceptional experiences.": { zh: '我是一名充满热情的前端开发者，拥有多年构建美观且功能强大的Web应用的经验。我专注于创建以用户为中心的设计，提供卓越的体验。', en: "I'm a passionate frontend developer with years of experience building beautiful and functional web applications. I specialize in creating user-centered designs that deliver exceptional experiences." },
    'My expertise spans from responsive design to complex single-page applications. I believe in writing clean, maintainable code and continuously learning new technologies.': { zh: '我的专长涵盖从响应式设计到复杂的单页应用。我相信编写干净、可维护的代码，并不断学习新技术。', en: 'My expertise spans from responsive design to complex single-page applications. I believe in writing clean, maintainable code and continuously learning new technologies.' },
    'Goal Oriented': { zh: '目标导向', en: 'Goal Oriented' },
    'Creative': { zh: '创意', en: 'Creative' },
    'Problem Solver': { zh: '问题解决者', en: 'Problem Solver' },
    'Team Player': { zh: '团队合作', en: 'Team Player' },
    'What I Can Do': { zh: '我能做什么', en: 'What I Can Do' },
    'Frontend': { zh: '前端', en: 'Frontend' },
    'Backend': { zh: '后端', en: 'Backend' },
    'Language': { zh: '语言', en: 'Language' },
    'Styling': { zh: '样式', en: 'Styling' },
    'Tools': { zh: '工具', en: 'Tools' },
    'My Work': { zh: '我的作品', en: 'My Work' },
    'E-commerce Platform': { zh: '电商平台', en: 'E-commerce Platform' },
    'A modern e-commerce solution with real-time inventory management.': { zh: '一个现代化的电商解决方案，支持实时库存管理。', en: 'A modern e-commerce solution with real-time inventory management.' },
    'Data Visualization Dashboard': { zh: '数据可视化仪表盘', en: 'Data Visualization Dashboard' },
    'Interactive dashboard for business analytics and reporting.': { zh: '交互式商业分析和报告仪表盘。', en: 'Interactive dashboard for business analytics and reporting.' },
    'Task Management App': { zh: '任务管理应用', en: 'Task Management App' },
    'Collaborative task management with team workflows.': { zh: '支持团队工作流程的协作任务管理。', en: 'Collaborative task management with team workflows.' },
    'View All Projects': { zh: '查看所有项目', en: 'View All Projects' },
    'Get In Touch': { zh: '联系我', en: 'Get In Touch' },
    'Email': { zh: '邮箱', en: 'Email' },
    'GitHub': { zh: 'GitHub', en: 'GitHub' },
    'LinkedIn': { zh: 'LinkedIn', en: 'LinkedIn' },
    'Twitter': { zh: 'Twitter', en: 'Twitter' },
    'Your Name': { zh: '你的名字', en: 'Your Name' },
    'Your Email': { zh: '你的邮箱', en: 'Your Email' },
    'Subject': { zh: '主题', en: 'Subject' },
    'Your Message': { zh: '你的消息', en: 'Your Message' },
    'Send Message': { zh: '发送消息', en: 'Send Message' },
    'All rights reserved.': { zh: '保留所有权利。', en: 'All rights reserved.' },
    'EN': { zh: 'EN', en: '中文' },
    '中文': { zh: 'EN', en: '中文' }
  }
  return translations[key]?.[currentLocale.value] || key
}

// ============================================
// 导航
// ============================================
const activeModule = ref('hero')

const modules = ref([
  { id: 'hero', label: { zh: '首页', en: 'Hero' }, icon: '✨' },
  { id: 'about', label: { zh: '关于', en: 'About' }, icon: '📝' },
  { id: 'skills', label: { zh: '技能', en: 'Skills' }, icon: '🛠️' },
  { id: 'projects', label: { zh: '项目', en: 'Projects' }, icon: '📦' },
  { id: 'contact', label: { zh: '联系', en: 'Contact' }, icon: '📬' }
])

/**
 * 滚动到指定模块
 * @param moduleId - 模块 ID
 */
const scrollToModule = (moduleId: string) => {
  activeModule.value = moduleId
  const element = document.getElementById(moduleId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// ============================================
// 数据
// ============================================
const heroData = ref({
  name: { zh: '我的名字', en: 'My Name' },
  title: { zh: '前端开发者', en: 'Frontend Developer' },
  subtitle: { zh: '构建美丽的界面', en: 'Building beautiful interfaces' },
  description: { zh: '热衷于使用现代Web技术创造卓越的数字体验。', en: 'Passionate about creating exceptional digital experiences with modern web technologies.' }
})

const stats = ref([
  { value: '5+', label: { zh: '年经验', en: 'Years Experience' } },
  { value: '30+', label: { zh: '完成项目', en: 'Projects Completed' } },
  { value: '100+', label: { zh: '服务客户', en: 'Clients Served' } },
  { value: '50K+', label: { zh: '代码行数', en: 'Lines of Code' } }
])

const skills = ref([
  { name: 'Vue.js', level: 95, category: { zh: '前端', en: 'Frontend' } },
  { name: 'React', level: 85, category: { zh: '前端', en: 'Frontend' } },
  { name: 'TypeScript', level: 90, category: { zh: '语言', en: 'Language' } },
  { name: 'Node.js', level: 80, category: { zh: '后端', en: 'Backend' } },
  { name: 'Tailwind CSS', level: 95, category: { zh: '样式', en: 'Styling' } },
  { name: 'Git', level: 85, category: { zh: '工具', en: 'Tools' } }
])

const projects = ref([
  {
    id: 1,
    title: { zh: '电商平台', en: 'E-commerce Platform' },
    description: { zh: '一个现代化的电商解决方案，支持实时库存管理。', en: 'A modern e-commerce solution with real-time inventory management.' },
    tags: ['Vue3', 'Node.js', 'MongoDB'],
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 2,
    title: { zh: '数据可视化仪表盘', en: 'Data Visualization Dashboard' },
    description: { zh: '交互式商业分析和报告仪表盘。', en: 'Interactive dashboard for business analytics and reporting.' },
    tags: ['React', 'D3.js', 'PostgreSQL'],
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 3,
    title: { zh: '任务管理应用', en: 'Task Management App' },
    description: { zh: '支持团队工作流程的协作任务管理。', en: 'Collaborative task management with team workflows.' },
    tags: ['Vue3', 'TypeScript', 'Firebase'],
    image: 'https://via.placeholder.com/300x200'
  }
])

const contactInfo = ref({
  email: 'hello@example.com',
  github: 'github.com/username',
  linkedin: 'linkedin.com/in/username',
  twitter: '@username'
})

// ============================================
// 工具函数
// ============================================

/**
 * 获取技能分类的颜色
 * @param category - 技能分类（支持双语对象）
 * @returns Tailwind CSS 类名
 */
const getCategoryColor = (category: string | { zh: string; en: string }) => {
  const categoryEn = typeof category === 'object' ? category.en : category
  const colors: Record<string, string> = {
    Frontend: 'bg-blue-100 text-blue-600',
    Backend: 'bg-green-100 text-green-600',
    Language: 'bg-purple-100 text-purple-600',
    Styling: 'bg-pink-100 text-pink-600',
    Tools: 'bg-orange-100 text-orange-600'
  }
  return colors[categoryEn] || 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold text-neutral-800">
            <span class="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {{ t('Portfolio') }}
            </span>
          </div>
          
          <nav class="hidden sm:flex items-center gap-6">
            <button
              v-for="module in modules"
              :key="module.id"
              @click="scrollToModule(module.id)"
              class="text-sm transition-all duration-200 relative"
              :class="activeModule === module.id ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-700'"
            >
              {{ typeof module.label === 'object' ? module.label[currentLocale] : module.label }}
              <span 
                v-if="activeModule === module.id"
                class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              ></span>
            </button>
          </nav>

          <div class="flex items-center gap-3">
            <button
              @click="toggleLocale"
              class="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              {{ currentLocale === 'zh' ? 'EN' : '中文' }}
            </button>
            <button
              v-if="currentUser"
              class="text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              {{ currentUser.is_admin ? t('Dashboard') : t('Profile') }}
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              {{ currentUser ? t('Logout') : t('Login') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="pt-20">
      <section id="hero" class="min-h-screen flex items-center justify-center px-4 py-16">
        <div class="max-w-3xl mx-auto text-center space-y-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
            <span class="text-sm font-medium text-blue-600">{{ typeof heroData.subtitle === 'object' ? heroData.subtitle[currentLocale] : heroData.subtitle }}</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
            {{ currentLocale === 'zh' ? '你好，我是' : "Hi, I'm" }} <span class="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{{ typeof heroData.name === 'object' ? heroData.name[currentLocale] : heroData.name }}</span>
          </h1>
          
          <p class="text-xl text-neutral-600 max-w-xl mx-auto">
            {{ typeof heroData.title === 'object' ? heroData.title[currentLocale] : heroData.title }}
          </p>
          
          <p class="text-neutral-500 max-w-lg mx-auto">
            {{ typeof heroData.description === 'object' ? heroData.description[currentLocale] : heroData.description }}
          </p>

          <div class="flex flex-wrap justify-center gap-8 pt-8">
            <div
              v-for="stat in stats"
              :key="typeof stat.label === 'object' ? stat.label.en : stat.label"
              class="text-center group"
            >
              <div class="text-3xl font-bold text-neutral-800 group-hover:text-blue-500 transition-colors">
                {{ stat.value }}
              </div>
              <div class="text-sm text-neutral-500">{{ typeof stat.label === 'object' ? stat.label[currentLocale] : stat.label }}</div>
            </div>
          </div>

          <div class="flex flex-wrap justify-center gap-4 pt-4">
            <button class="px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5">
              {{ t('View Portfolio') }}
            </button>
            <button class="px-6 py-3 font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:border-blue-300 hover:text-blue-500 transition-all duration-300">
              {{ t('Download Resume') }}
            </button>
          </div>
        </div>
      </section>

      <section id="about" class="py-20 px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">
              {{ t('About Me') }}
            </span>
            <h2 class="text-3xl font-bold text-neutral-900">{{ t('Who Am I?') }}</h2>
          </div>

          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div class="relative">
              <div class="aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-neutral-200/50">
                <img 
                  src="https://via.placeholder.com/400x400" 
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span class="text-white text-4xl">👨‍💻</span>
              </div>
            </div>

            <div class="space-y-6">
              <p class="text-neutral-600 leading-relaxed">
                {{ t("I'm a passionate frontend developer with years of experience building beautiful and functional web applications. I specialize in creating user-centered designs that deliver exceptional experiences.") }}
              </p>
              <p class="text-neutral-600 leading-relaxed">
                {{ t('My expertise spans from responsive design to complex single-page applications. I believe in writing clean, maintainable code and continuously learning new technologies.') }}
              </p>
              
              <div class="grid grid-cols-2 gap-4 pt-4">
                <div class="p-4 bg-neutral-50 rounded-xl">
                  <div class="text-2xl font-bold text-blue-500">🎯</div>
                  <div class="text-sm text-neutral-600 mt-2">{{ t('Goal Oriented') }}</div>
                </div>
                <div class="p-4 bg-neutral-50 rounded-xl">
                  <div class="text-2xl font-bold text-purple-500">💡</div>
                  <div class="text-sm text-neutral-600 mt-2">{{ t('Creative') }}</div>
                </div>
                <div class="p-4 bg-neutral-50 rounded-xl">
                  <div class="text-2xl font-bold text-green-500">🔧</div>
                  <div class="text-sm text-neutral-600 mt-2">{{ t('Problem Solver') }}</div>
                </div>
                <div class="p-4 bg-neutral-50 rounded-xl">
                  <div class="text-2xl font-bold text-orange-500">🤝</div>
                  <div class="text-sm text-neutral-600 mt-2">{{ t('Team Player') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" class="py-20 px-4 bg-white">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-3 py-1 text-sm font-medium text-purple-600 bg-purple-100 rounded-full mb-4">
              {{ t('Skills') }}
            </span>
            <h2 class="text-3xl font-bold text-neutral-900">{{ t('What I Can Do') }}</h2>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="skill in skills"
              :key="skill.name"
              class="p-6 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group"
            >
              <div class="flex items-center justify-between mb-4">
                <span class="font-medium text-neutral-800">{{ skill.name }}</span>
                <span :class="['text-xs font-medium px-2 py-1 rounded-full', getCategoryColor(skill.category)]">
                  {{ typeof skill.category === 'object' ? skill.category[currentLocale] : skill.category }}
                </span>
              </div>
              
              <div class="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: `${skill.level}%` }"
                ></div>
              </div>
              
              <div class="text-right mt-2">
                <span class="text-sm font-medium text-neutral-500">{{ skill.level }}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" class="py-20 px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full mb-4">
              {{ t('Projects') }}
            </span>
            <h2 class="text-3xl font-bold text-neutral-900">{{ t('My Work') }}</h2>
          </div>

          <div class="space-y-8">
            <div
              v-for="project in projects"
              :key="project.id"
              class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div class="grid md:grid-cols-2">
                <div class="aspect-video bg-neutral-100 relative overflow-hidden">
                  <img 
                    :src="project.image" 
                    :alt="typeof project.title === 'object' ? project.title[currentLocale] : project.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div class="p-6 flex flex-col justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-neutral-900 mb-2">{{ typeof project.title === 'object' ? project.title[currentLocale] : project.title }}</h3>
                    <p class="text-neutral-600 mb-4">{{ typeof project.description === 'object' ? project.description[currentLocale] : project.description }}</p>
                  </div>
                  
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in project.tags"
                      :key="tag"
                      class="px-3 py-1 text-sm bg-neutral-100 text-neutral-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-12">
            <button class="px-6 py-3 font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300">
              {{ t('View All Projects') }}
            </button>
          </div>
        </div>
      </section>

      <section id="contact" class="py-20 px-4 bg-white">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-3 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full mb-4">
              {{ t('Contact') }}
            </span>
            <h2 class="text-3xl font-bold text-neutral-900">{{ t('Get In Touch') }}</h2>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <a 
              href="mailto:{{ contactInfo.email }}"
              class="group p-6 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div class="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                <span class="text-xl">📧</span>
              </div>
              <div class="font-medium text-neutral-800">{{ t('Email') }}</div>
              <div class="text-sm text-neutral-500 mt-1">{{ contactInfo.email }}</div>
            </a>

            <a 
              :href="`https://${contactInfo.github}`"
              target="_blank"
              class="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div class="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-700 group-hover:scale-110 transition-all duration-300">
                <span class="text-xl">💻</span>
              </div>
              <div class="font-medium text-neutral-800">{{ t('GitHub') }}</div>
              <div class="text-sm text-neutral-500 mt-1">{{ contactInfo.github }}</div>
            </a>

            <a 
              :href="`https://${contactInfo.linkedin}`"
              target="_blank"
              class="group p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div class="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <span class="text-xl">💼</span>
              </div>
              <div class="font-medium text-neutral-800">{{ t('LinkedIn') }}</div>
              <div class="text-sm text-neutral-500 mt-1">{{ contactInfo.linkedin }}</div>
            </a>

            <a 
              :href="`https://twitter.com/${contactInfo.twitter.replace('@', '')}`"
              target="_blank"
              class="group p-6 bg-gradient-to-br from-sky-50 to-white rounded-2xl border border-sky-100 hover:border-sky-300 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div class="w-12 h-12 mx-auto mb-4 bg-sky-100 rounded-full flex items-center justify-center group-hover:bg-sky-500 group-hover:scale-110 transition-all duration-300">
                <span class="text-xl">🐦</span>
              </div>
              <div class="font-medium text-neutral-800">{{ t('Twitter') }}</div>
              <div class="text-sm text-neutral-500 mt-1">{{ contactInfo.twitter }}</div>
            </a>
          </div>

          <form class="max-w-xl mx-auto space-y-6">
            <div class="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                :placeholder="t('Your Name')"
                class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <input
                type="email"
                :placeholder="t('Your Email')"
                class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <input
              type="text"
              :placeholder="t('Subject')"
              class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <textarea
              rows="4"
              :placeholder="t('Your Message')"
              class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            ></textarea>
            <button
              type="submit"
              class="w-full py-3 font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
            >
              {{ t('Send Message') }}
            </button>
          </form>
        </div>
      </section>

      <footer class="py-12 px-4 bg-neutral-900 text-center">
        <div class="max-w-4xl mx-auto">
          <div class="text-lg font-semibold text-white mb-4">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {{ t('Portfolio') }}
            </span>
          </div>
          <p class="text-neutral-400 text-sm">
            © {{ new Date().getFullYear() }} {{ t('All rights reserved.') }}
          </p>
          <p class="text-neutral-500 text-xs mt-3">
            <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-neutral-300 transition-colors">
              京ICP备XXXXXXXX号
            </a>
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>