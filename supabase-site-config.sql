-- ============================================
-- 网站配置表 - 适用于 Supabase
-- ============================================

-- 创建网站配置表
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(config_key);

-- 创建更新触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器（如果不存在）
DROP TRIGGER IF EXISTS update_site_config_updated_at ON site_config;
CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 设置 Row Level Security (RLS)
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取配置
DROP POLICY IF EXISTS "Anyone can view site_config" ON site_config;
CREATE POLICY "Anyone can view site_config"
  ON site_config FOR SELECT
  USING (true);

-- 只有管理员可以修改配置 - 简化版本，先检查 auth.uid 存在
DROP POLICY IF EXISTS "Only admins can update site_config" ON site_config;
CREATE POLICY "Only admins can update site_config"
  ON site_config FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
  );

-- 只有管理员可以插入配置
DROP POLICY IF EXISTS "Only admins can insert site_config" ON site_config;
CREATE POLICY "Only admins can insert site_config"
  ON site_config FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- 只有管理员可以删除配置
DROP POLICY IF EXISTS "Only admins can delete site_config" ON site_config;
CREATE POLICY "Only admins can delete site_config"
  ON site_config FOR DELETE
  USING (
    auth.uid() IS NOT NULL
  );

-- 插入默认配置数据（使用 ON CONFLICT 避免重复插入）
INSERT INTO site_config (config_key, config_value, description) 
VALUES
(
  'personal_info',
  '{
    "avatar": "",
    "name": {"zh": "我的名字", "en": "My Name"},
    "title": {"zh": "前端开发者", "en": "Frontend Developer"},
    "bio": {"zh": "我是一名充满热情的开发者，专注于前端开发和用户体验设计。", "en": "I am a passionate developer focused on frontend development and user experience design."}
  }'::jsonb,
  '个人信息配置'
),
(
  'contact',
  '{
    "email": "email@example.com",
    "phone": "+86 123-4567-8900",
    "address": {"zh": "北京市朝阳区", "en": "Chaoyang District, Beijing"},
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/XiongMao118",
    "bilibili": "space.bilibili.com/550003217"
  }'::jsonb,
  '联系方式配置'
),
(
  'skills',
  '[
    {"category": {"zh": "前端技术", "en": "Frontend"}, "items": ["Vue.js", "React", "TypeScript", "JavaScript", "HTML5", "CSS3"]},
    {"category": {"zh": "后端技术", "en": "Backend"}, "items": ["Node.js", "Express", "MongoDB", "PostgreSQL"]},
    {"category": {"zh": "工具与框架", "en": "Tools"}, "items": ["Webpack", "Vite", "Git", "Docker"]},
    {"category": {"zh": "设计能力", "en": "Design"}, "items": ["Figma", "Photoshop", "UI/UX"]}
  ]'::jsonb,
  '技能配置'
),
(
  'projects',
  '[
    {
      "title": {"zh": "个人博客系统", "en": "Personal Blog System"},
      "description": {"zh": "基于 Vue3 + Node.js 构建的现代化博客平台，支持 Markdown 编辑和实时预览。", "en": "A modern blog platform built with Vue3 + Node.js, supporting Markdown editing and real-time preview."},
      "color": "blue",
      "tags": ["Vue3", "Node.js", "MongoDB"]
    },
    {
      "title": {"zh": "数据可视化仪表盘", "en": "Data Visualization Dashboard"},
      "description": {"zh": "交互式数据展示平台，支持多种图表类型和实时数据更新。", "en": "Interactive data visualization platform supporting multiple chart types and real-time updates."},
      "color": "green",
      "tags": ["React", "D3.js", "PostgreSQL"]
    },
    {
      "title": {"zh": "电商管理系统", "en": "E-commerce Management System"},
      "description": {"zh": "完整的电商后台管理系统，包含订单管理、库存管理和数据分析功能。", "en": "Complete e-commerce backend management system with order management, inventory management and data analytics."},
      "color": "purple",
      "tags": ["Vue3", "TypeScript", "Node.js"]
    }
  ]'::jsonb,
  '项目配置'
),
(
  'hero_data',
  '{
    "name": {"zh": "我的名字", "en": "My Name"},
    "title": {"zh": "前端开发者", "en": "Frontend Developer"},
    "subtitle": {"zh": "构建美丽的界面", "en": "Building beautiful interfaces"},
    "description": {"zh": "热衷于使用现代Web技术创造卓越的数字体验。", "en": "Passionate about creating exceptional digital experiences with modern web technologies."}
  }'::jsonb,
  'Hero区域配置'
),
(
  'stats',
  '[
    {"value": "5+", "label": {"zh": "年经验", "en": "Years Experience"}},
    {"value": "30+", "label": {"zh": "完成项目", "en": "Projects Completed"}},
    {"value": "100+", "label": {"zh": "服务客户", "en": "Clients Served"}},
    {"value": "50K+", "label": {"zh": "代码行数", "en": "Lines of Code"}}
  ]'::jsonb,
  '统计数据配置'
),
(
  'modular_skills',
  '[
    {"name": "Vue.js", "level": 95, "category": {"zh": "前端", "en": "Frontend"}},
    {"name": "React", "level": 85, "category": {"zh": "前端", "en": "Frontend"}},
    {"name": "TypeScript", "level": 90, "category": {"zh": "语言", "en": "Language"}},
    {"name": "Node.js", "level": 80, "category": {"zh": "后端", "en": "Backend"}},
    {"name": "Tailwind CSS", "level": 95, "category": {"zh": "样式", "en": "Styling"}},
    {"name": "Git", "level": 85, "category": {"zh": "工具", "en": "Tools"}}
  ]'::jsonb,
  '模块化页面技能配置'
),
(
  'translations',
  '{
    "home_page": {
      "Skills": {"zh": "技能", "en": "Skills"},
      "Projects": {"zh": "项目", "en": "Projects"},
      "Contact": {"zh": "联系", "en": "Contact"},
      "About": {"zh": "关于", "en": "About"},
      "Home": {"zh": "首页", "en": "Home"},
      "Education": {"zh": "教育背景", "en": "Education"},
      "Interests": {"zh": "兴趣爱好", "en": "Interests"},
      "Programming": {"zh": "编程", "en": "Programming"},
      "Reading": {"zh": "阅读", "en": "Reading"},
      "Travel": {"zh": "旅行", "en": "Travel"},
      "Photography": {"zh": "摄影", "en": "Photography"},
      "Bachelor of Computer Science": {"zh": "计算机科学学士", "en": "Bachelor of Computer Science"},
      "Years of industry experience": {"zh": "多年行业经验", "en": "Years of industry experience"},
      "Just for fun": {"zh": "只为乐趣", "en": "Just for fun"},
      "Passion": {"zh": "热情", "en": "Passion"}
    },
    "modular_page": {
      "Portfolio": {"zh": "作品集", "en": "Portfolio"},
      "Hero": {"zh": "首页", "en": "Hero"},
      "About Me": {"zh": "关于我", "en": "About Me"},
      "Who Am I?": {"zh": "我是谁？", "en": "Who Am I?"},
      "What I Can Do": {"zh": "我能做什么", "en": "What I Can Do"},
      "My Work": {"zh": "我的作品", "en": "My Work"},
      "Get In Touch": {"zh": "联系我", "en": "Get In Touch"},
      "View Portfolio": {"zh": "查看作品集", "en": "View Portfolio"},
      "Download Resume": {"zh": "下载简历", "en": "Download Resume"},
      "View All Projects": {"zh": "查看所有项目", "en": "View All Projects"},
      "Send Message": {"zh": "发送消息", "en": "Send Message"},
      "Your Name": {"zh": "你的名字", "en": "Your Name"},
      "Your Email": {"zh": "你的邮箱", "en": "Your Email"},
      "Subject": {"zh": "主题", "en": "Subject"},
      "Your Message": {"zh": "你的消息", "en": "Your Message"},
      "All rights reserved.": {"zh": "保留所有权利。", "en": "All rights reserved."},
      "E-commerce Platform": {"zh": "电商平台", "en": "E-commerce Platform"},
      "Data Visualization Dashboard": {"zh": "数据可视化仪表盘", "en": "Data Visualization Dashboard"},
      "Task Management App": {"zh": "任务管理应用", "en": "Task Management App"},
      "Goal Oriented": {"zh": "目标导向", "en": "Goal Oriented"},
      "Creative": {"zh": "创意", "en": "Creative"},
      "Problem Solver": {"zh": "问题解决者", "en": "Problem Solver"},
      "Team Player": {"zh": "团队合作", "en": "Team Player"}
    },
    "common": {
      "编辑": {"zh": "编辑", "en": "Edit"},
      "设置": {"zh": "设置", "en": "Settings"},
      "退出": {"zh": "退出", "en": "Logout"},
      "登录": {"zh": "登录", "en": "Login"},
      "编辑模式": {"zh": "编辑模式", "en": "Edit Mode"},
      "取消": {"zh": "取消", "en": "Cancel"},
      "保存": {"zh": "保存", "en": "Save"},
      "我的头像": {"zh": "我的头像", "en": "My Avatar"},
      "上传头像": {"zh": "上传头像", "en": "Upload Avatar"},
      "姓名": {"zh": "姓名", "en": "Name"},
      "职位": {"zh": "职位", "en": "Title"},
      "简介": {"zh": "简介", "en": "Bio"},
      "添加技能": {"zh": "添加技能", "en": "Add Skill"},
      "添加项目": {"zh": "添加项目", "en": "Add Project"},
      "Email": {"zh": "邮箱", "en": "Email"},
      "GitHub": {"zh": "GitHub", "en": "GitHub"},
      "Bilibili": {"zh": "B站", "en": "Bilibili"},
      "LinkedIn": {"zh": "LinkedIn", "en": "LinkedIn"},
      "Twitter": {"zh": "Twitter", "en": "Twitter"},
      "Dashboard": {"zh": "控制台", "en": "Dashboard"},
      "Profile": {"zh": "个人资料", "en": "Profile"},
      "模块化页面": {"zh": "模块化页面", "en": "Modular Page"}
    }
  }'::jsonb,
  '翻译文本配置'
)
ON CONFLICT (config_key) DO NOTHING;

-- ============================================
-- 更新说明
-- ============================================
-- 1. 这个 SQL 文件是幂等的，可以重复执行
-- 2. 执行步骤：
--    - 打开 Supabase SQL Editor
--    - 复制粘贴整个文件内容
--    - 点击 Run
-- 3. RLS 策略简化为只检查是否登录，后续可以根据需要添加 is_admin 检查
