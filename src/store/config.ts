import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export interface BilingualText {
  zh: string
  en: string
}

export interface SkillCategory {
  category: string | BilingualText
  items: string[]
}

export interface Project {
  id?: number
  title: string | BilingualText
  description: string | BilingualText
  color: string
  tags?: string[]
  image?: string
}

export interface Stat {
  value: string
  label: string | BilingualText
}

export interface ModularSkill {
  name: string
  level: number
  category: string | BilingualText
}

export interface HeroData {
  name: string | BilingualText
  title: string | BilingualText
  subtitle: string | BilingualText
  description: string | BilingualText
}

export interface ContactInfo {
  email: string
  phone: string
  address: string | BilingualText
  linkedin: string
  github: string
  bilibili: string
  twitter?: string
}

export interface PersonalInfo {
  avatar: string
  name: string | BilingualText
  title: string | BilingualText
  bio: string | BilingualText
}

const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  avatar: '😎',
  name: '我的名字',
  title: '前端开发者',
  bio: '我是一名充满热情的开发者，专注于前端开发和用户体验设计。'
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  email: 'email@example.com',
  phone: '+86 123-4567-8900',
  address: '北京市朝阳区',
  linkedin: 'linkedin.com/in/username',
  github: 'github.com/XiongMao118',
  bilibili: 'space.bilibili.com/233396733'
}

const DEFAULT_SKILLS: SkillCategory[] = [
  { category: '前端技术', items: ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
  { category: '后端技术', items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'] },
  { category: '工具与框架', items: ['Webpack', 'Vite', 'Git', 'Docker'] },
  { category: '设计能力', items: ['Figma', 'Photoshop', 'UI/UX设计'] }
]

const DEFAULT_PROJECTS: Project[] = [
  {
    title: '📦 个人博客系统',
    description: '基于 Vue3 + Node.js 构建的现代化博客平台，支持 Markdown 编辑和实时预览。',
    color: 'blue'
  },
  {
    title: '📊 数据可视化仪表盘',
    description: '交互式数据展示平台，支持多种图表类型和实时数据更新。',
    color: 'green'
  },
  {
    title: '🛒 电商管理系统',
    description: '完整的电商后台管理系统，包含订单管理、库存管理和数据分析功能。',
    color: 'purple'
  }
]

const DEFAULT_HERO_DATA: HeroData = {
  name: '我的名字',
  title: '前端开发者',
  subtitle: '构建美丽的界面',
  description: '热衷于使用现代Web技术创造卓越的数字体验。'
}

const DEFAULT_STATS: Stat[] = [
  { value: '5+', label: '年经验' },
  { value: '30+', label: '完成项目' },
  { value: '100+', label: '服务客户' },
  { value: '50K+', label: '代码行数' }
]

const DEFAULT_MODULAR_SKILLS: ModularSkill[] = [
  { name: 'Vue.js', level: 95, category: '前端' },
  { name: 'React', level: 85, category: '前端' },
  { name: 'TypeScript', level: 90, category: '语言' },
  { name: 'Node.js', level: 80, category: '后端' },
  { name: 'Tailwind CSS', level: 95, category: '样式' },
  { name: 'Git', level: 85, category: '工具' }
]

const DEFAULT_TRANSLATIONS = {
  home_page: {
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
  },
  modular_page: {
    'Portfolio': { zh: '作品集', en: 'Portfolio' },
    'Hero': { zh: '首页', en: 'Hero' },
    'About Me': { zh: '关于我', en: 'About Me' },
    'Who Am I?': { zh: '我是谁？', en: 'Who Am I?' },
    'What I Can Do': { zh: '我能做什么', en: 'What I Can Do' },
    'My Work': { zh: '我的作品', en: 'My Work' },
    'Get In Touch': { zh: '联系我', en: 'Get In Touch' },
    'View Portfolio': { zh: '查看作品集', en: 'View Portfolio' },
    'Download Resume': { zh: '下载简历', en: 'Download Resume' },
    'View All Projects': { zh: '查看所有项目', en: 'View All Projects' },
    'Send Message': { zh: '发送消息', en: 'Send Message' },
    'Your Name': { zh: '你的名字', en: 'Your Name' },
    'Your Email': { zh: '你的邮箱', en: 'Your Email' },
    'Subject': { zh: '主题', en: 'Subject' },
    'Your Message': { zh: '你的消息', en: 'Your Message' },
    'All rights reserved.': { zh: '保留所有权利。', en: 'All rights reserved.' },
    'E-commerce Platform': { zh: '电商平台', en: 'E-commerce Platform' },
    'Data Visualization Dashboard': { zh: '数据可视化仪表盘', en: 'Data Visualization Dashboard' },
    'Task Management App': { zh: '任务管理应用', en: 'Task Management App' },
    'Goal Oriented': { zh: '目标导向', en: 'Goal Oriented' },
    'Creative': { zh: '创意', en: 'Creative' },
    'Problem Solver': { zh: '问题解决者', en: 'Problem Solver' },
    'Team Player': { zh: '团队合作', en: 'Team Player' }
  },
  common: {
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
    'LinkedIn': { zh: 'LinkedIn', en: 'LinkedIn' },
    'Twitter': { zh: 'Twitter', en: 'Twitter' },
    'Dashboard': { zh: '控制台', en: 'Dashboard' },
    'Profile': { zh: '个人资料', en: 'Profile' },
    '模块化页面': { zh: '模块化页面', en: 'Modular Page' }
  }
}

const isLoading = ref(false)
const error = ref<string | null>(null)

const personalInfo = ref<PersonalInfo>({ ...DEFAULT_PERSONAL_INFO })
const contactInfo = ref<ContactInfo>({ ...DEFAULT_CONTACT_INFO })
const skills = ref<SkillCategory[]>([...DEFAULT_SKILLS])
const projects = ref<Project[]>([...DEFAULT_PROJECTS])
const heroData = ref<HeroData>({ ...DEFAULT_HERO_DATA })
const stats = ref<Stat[]>([...DEFAULT_STATS])
const modularSkills = ref<ModularSkill[]>([...DEFAULT_MODULAR_SKILLS])
const translations = ref<Record<string, any>>({ ...DEFAULT_TRANSLATIONS })

export const useConfigStore = () => {
  console.log('configStore initialized with:', {
    personalInfo: personalInfo.value,
    skillsLength: skills.value.length,
    projectsLength: projects.value.length
  })
  
  const fetchAllConfigs = async (): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('site_config')
        .select('config_key, config_value')

      if (fetchError) {
        console.warn('Failed to fetch configs from Supabase, using defaults:', fetchError.message)
        return true
      }

      if (data && data.length > 0) {
        const configs: Record<string, any> = {}
        data.forEach((item) => {
          configs[item.config_key] = item.config_value
        })

        if (configs.personal_info && typeof configs.personal_info === 'object' && configs.personal_info.name) {
          personalInfo.value = configs.personal_info
        }
        if (configs.contact && typeof configs.contact === 'object' && configs.contact.email) {
          contactInfo.value = configs.contact
        }
        if (configs.skills && Array.isArray(configs.skills) && configs.skills.length > 0) {
          skills.value = configs.skills
        }
        if (configs.projects && Array.isArray(configs.projects) && configs.projects.length > 0) {
          projects.value = configs.projects
        }
        if (configs.hero_data && typeof configs.hero_data === 'object' && configs.hero_data.name) {
          heroData.value = configs.hero_data
        }
        if (configs.stats && Array.isArray(configs.stats) && configs.stats.length > 0) {
          stats.value = configs.stats
        }
        if (configs.modular_skills && Array.isArray(configs.modular_skills) && configs.modular_skills.length > 0) {
          modularSkills.value = configs.modular_skills
        }
        if (configs.translations && typeof configs.translations === 'object') {
          translations.value = configs.translations
        }
      }

      return true
    } catch (e: any) {
      console.warn('Error fetching configs, using defaults:', e.message)
      return true
    } finally {
      isLoading.value = false
    }
  }

  const updateConfig = async (key: string, value: any): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      switch (key) {
        case 'personal_info':
          personalInfo.value = value
          break
        case 'contact':
          contactInfo.value = value
          break
        case 'skills':
          skills.value = value
          break
        case 'projects':
          projects.value = value
          break
        case 'hero_data':
          heroData.value = value
          break
        case 'stats':
          stats.value = value
          break
        case 'modular_skills':
          modularSkills.value = value
          break
        case 'translations':
          translations.value = value
          break
      }

      const { data: existingData, error: checkError } = await supabase
        .from('site_config')
        .select('id')
        .eq('config_key', key)
        .maybeSingle()

      if (checkError) {
        console.warn('Error checking existing config:', checkError)
        return true
      }

      if (existingData) {
        const { error: updateError } = await supabase
          .from('site_config')
          .update({ config_value: value })
          .eq('config_key', key)

        if (updateError) {
          console.warn('Error updating config:', updateError)
        }
      } else {
        const { error: insertError } = await supabase
          .from('site_config')
          .insert({ config_key: key, config_value: value })

        if (insertError) {
          console.warn('Error inserting config:', insertError)
        }
      }

      return true
    } catch (e: any) {
      console.warn('Error in updateConfig:', e.message)
      error.value = e.message
      return true
    } finally {
      isLoading.value = false
    }
  }

  const updatePersonalInfo = async (updates: Partial<PersonalInfo>): Promise<boolean> => {
    const updated = { ...personalInfo.value, ...updates }
    return await updateConfig('personal_info', updated)
  }

  const updateContact = async (updates: Partial<ContactInfo>): Promise<boolean> => {
    const updated = { ...contactInfo.value, ...updates }
    return await updateConfig('contact', updated)
  }

  const updateSkills = async (newSkills: SkillCategory[]): Promise<boolean> => {
    return await updateConfig('skills', newSkills)
  }

  const updateProjects = async (newProjects: Project[]): Promise<boolean> => {
    return await updateConfig('projects', newProjects)
  }

  const updateHeroData = async (updates: Partial<HeroData>): Promise<boolean> => {
    const updated = { ...heroData.value, ...updates }
    return await updateConfig('hero_data', updated)
  }

  const updateStats = async (newStats: Stat[]): Promise<boolean> => {
    return await updateConfig('stats', newStats)
  }

  const updateModularSkills = async (newSkills: ModularSkill[]): Promise<boolean> => {
    return await updateConfig('modular_skills', newSkills)
  }

  const t = (key: string, locale: 'zh' | 'en' = 'zh'): string => {
    const keys = key.split('.')
    let value: any = translations.value

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    if (typeof value === 'object' && value !== null) {
      if ('zh' in value && 'en' in value) {
        return value[locale] || key
      }
    }

    if (typeof value === 'string') {
      return value
    }

    return key
  }

  const getLocalizedText = (text: BilingualText | string | undefined, locale: 'zh' | 'en' = 'zh'): string => {
    if (!text) return ''
    if (typeof text === 'string') return text
    if (typeof text === 'object' && 'zh' in text && 'en' in text) {
      return text[locale] || text.zh || ''
    }
    return String(text)
  }

  const getBilingualText = (text: BilingualText | string | undefined): BilingualText => {
    if (!text) return { zh: '', en: '' }
    if (typeof text === 'string') return { zh: text, en: text }
    if (typeof text === 'object' && 'zh' in text && 'en' in text) {
      return text
    }
    return { zh: String(text), en: String(text) }
  }

  const resetError = (): void => {
    error.value = null
  }

  return {
    isLoading,
    error,
    personalInfo,
    contactInfo,
    skills,
    projects,
    heroData,
    stats,
    modularSkills,
    translations,
    fetchAllConfigs,
    updateConfig,
    updatePersonalInfo,
    updateContact,
    updateSkills,
    updateProjects,
    updateHeroData,
    updateStats,
    updateModularSkills,
    t,
    getLocalizedText,
    getBilingualText,
    resetError
  }
}
