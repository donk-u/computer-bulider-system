# 布局组件使用指南

## 概述

本项目包含5个核心页面骨架组件，用于构建完整的PC配置器应用。

## 组件列表

### 1. AppShell（应用外壳）

全应用布局外壳，包含导航和主题切换。

#### 功能特性

- ✅ 顶部导航栏：Logo、搜索、通知、用户菜单
- ✅ 左侧边栏（桌面端）：导航菜单、热门标签、广告位
- ✅ 底部导航（移动端）：主要功能入口
- ✅ 暗黑/亮色主题切换（动画过渡）
- ✅ 响应式设计（桌面端、平板、移动端）

#### 基础用法

```tsx
import { AppShell } from '@/components/layouts/app-shell'

export default function Page() {
  return (
    <AppShell>
      <div>你的页面内容</div>
    </AppShell>
  )
}
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `children` | `React.ReactNode` | - | 页面内容（必填） |
| `className` | `string` | - | 自定义类名 |

#### 断点

- **桌面端**（1024px+）: 显示侧边栏
- **平板端**（768-1023px）: 隐藏侧边栏
- **移动端**（<768px）: 显示底部导航栏

#### 自定义侧边栏

修改 `components/layouts/app-shell.tsx` 中的 `navItems` 数组：

```tsx
const navItems = [
  { icon: Home, label: '首页', href: '/' },
  { icon: Cpu, label: '配置器', href: '/builder' },
  // 添加你的导航项
]
```

---

### 2. BuilderLayout（配置器布局）

三栏响应式布局，用于PC配置器页面。

#### 功能特性

- ✅ 三栏布局：分类、预览、详情
- ✅ 左侧侧边栏可折叠
- ✅ 右侧面板可折叠
- ✅ 性能评分圆环动画
- ✅ 组件预览列表
- ✅ 配置详情标签页
- ✅ 快捷操作按钮

#### 基础用法

```tsx
import { BuilderLayout } from '@/components/layouts/builder-layout'

export default function BuilderPage() {
  return (
    <BuilderLayout>
      <div>你的配置器内容</div>
    </BuilderLayout>
  )
}
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `children` | `React.ReactNode` | - | 页面内容（必填） |
| `className` | `string` | - | 自定义类名 |

#### 响应式断点

- **桌面端**（1024px+）: 完整三栏布局
- **平板/移动端**: 显示简化版本

#### 自定义组件分类

修改 `categories` 数组添加新分类：

```tsx
const categories = [
  { id: 'cpu' as ComponentCategory, name: 'CPU', icon: '🧠', count: 45 },
  // 添加你的分类
]
```

---

### 3. CommunityFeed（社区动态流）

社区动态展示组件，支持多种布局。

#### 功能特性

- ✅ 三种布局模式：列表、网格、瀑布流
- ✅ 无限滚动加载
- ✅ 排序和筛选工具栏
- ✅ 骨架屏加载状态
- ✅ 空状态显示
- ✅ 标签筛选

#### 基础用法

```tsx
import { CommunityFeed } from '@/components/layouts/community-feed'

export default function CommunityPage() {
  return (
    <CommunityFeed>
      <div>你的社区内容</div>
    </CommunityFeed>
  )
}
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `children` | `React.ReactNode` | - | 页面内容（必填） |
| `className` | `string` | - | 自定义类名 |

#### 布局类型

- `list`: 列表视图
- `grid`: 网格视图（4列）
- `masonry`: 瀑布流视图（响应式列数）

#### 自定义帖子卡片

修改 `PostCard` 组件来自定义帖子展示：

```tsx
function PostCard({ index }: { index: number }) {
  return (
    <Card>
      {/* 自定义你的帖子内容 */}
    </Card>
  )
}
```

---

### 4. UserProfileLayout（用户个人中心布局）

用户个人中心布局，包含封面和用户信息。

#### 功能特性

- ✅ 顶部封面图片（可编辑）
- ✅ 用户头像（可更换）
- ✅ 左侧信息卡片（统计、成就）
- ✅ 右侧多标签页（配置、收藏、成就、设置）
- ✅ 成就徽章展示
- ✅ 响应式布局调整

#### 基础用法

```tsx
import { UserProfileLayout } from '@/components/layouts/user-profile-layout'

export default function ProfilePage() {
  return (
    <UserProfileLayout userName="John Doe" userAvatar="/avatar.jpg">
      <div>你的个人中心内容</div>
    </UserProfileLayout>
  )
}
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `children` | `React.ReactNode` | - | 页面内容（必填） |
| `className` | `string` | - | 自定义类名 |
| `userName` | `string` | `'John Doe'` | 用户名 |
| `userAvatar` | `string` | `'/placeholder-avatar.jpg'` | 头像URL |

#### 标签页

默认包含4个标签页：
- **配置方案**: 显示用户的配置
- **收藏**: 收藏的配置列表
- **成就**: 用户成就和徽章
- **设置**: 账户管理选项

---

### 5. ModalManager（模态框管理器）

统一的模态框管理系统，支持叠加和动画。

#### 功能特性

- ✅ 统一管理所有模态框
- ✅ 支持叠加多个模态框
- ✅ 从底部滑入/淡入淡出动画
- ✅ 键盘快捷键（ESC关闭）
- ✅ 点击遮罩层关闭
- ✅ 三种模态框类型：确认、警告、表单

#### 基础用法

```tsx
import { ModalManagerProvider, useConfirmModal, useAlertModal, useFormModal } from '@/components/shared/modal-manager'

// 1. 在应用根部包裹 Provider
export default function App() {
  return (
    <ModalManagerProvider>
      {/* 你的应用 */}
    </ModalManagerProvider>
  )
}

// 2. 在组件中使用钩子
function MyComponent() {
  const { confirm } = useConfirmModal()
  const { alert } = useAlertModal()
  const { openForm } = useFormModal()

  const handleDelete = () => {
    confirm(
      '确认删除',
      '此操作无法撤销，是否继续？',
      () => {
        // 确认后的操作
        console.log('Deleted')
      }
    )
  }

  const handleAlert = () => {
    alert(
      '注意',
      '此操作可能影响系统性能',
      () => console.log('Alerted')
    )
  }

  const handleOpenForm = () => {
    openForm(
      '表单标题',
      '表单描述',
      <div>表单内容</div>,
      <div>表单底部</div>
    )
  }

  return (
    <div>
      <Button onClick={handleDelete}>删除</Button>
      <Button onClick={handleAlert}>警告</Button>
      <Button onClick={handleOpenForm}>打开表单</Button>
    </div>
  )
}
```

#### 钩子函数

##### useConfirmModal()

```tsx
const { confirm } = useConfirmModal()

confirm(
  title: string,
  description?: string,
  onConfirm?: () => void
)
```

##### useAlertModal()

```tsx
const { alert } = useAlertModal()

alert(
  title: string,
  description?: string,
  onConfirm?: () => void
)
```

##### useFormModal()

```tsx
const { openForm } = useFormModal()

openForm(
  title: string,
  description?: string,
  children: React.ReactNode,
  footer?: React.ReactNode
)
```

##### useModalManager()

```tsx
const { closeAllModals, isModalOpen } = useModalManager()

// 关闭所有模态框
closeAllModals()

// 检查模态框是否打开
if (isModalOpen('modal-id')) {
  // 模态框是打开的
}
```

#### 键盘快捷键

- **ESC**: 关闭最上层的模态框
- 需要在应用根部包裹 `ModalManagerProvider`

#### 模态框类型

- `confirm`: 确认对话框（红色边框，确认按钮）
- `alert`: 警告对话框（黄色边框，确认按钮）
- `form`: 表单对话框（最大宽度更大，自定义内容）
- `info`: 信息对话框（蓝色边框）

## 使用示例

查看完整示例：`app/examples/layouts-demo.tsx`

运行示例：
```bash
npm run dev
# 访问 http://localhost:3000/examples/layouts-demo
```

## 集成指南

### 1. 应用层级结构

在 `app/layout.tsx` 中包裹 `ModalManagerProvider`：

```tsx
import { ModalManagerProvider } from '@/components/shared/modal-manager'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ModalManagerProvider>
          {children}
        </ModalManagerProvider>
      </body>
    </html>
  )
}
```

### 2. 页面路由集成

#### app/page.tsx - 使用 AppShell

```tsx
import { AppShell } from '@/components/layouts/app-shell'

export default function HomePage() {
  return (
    <AppShell>
      <div>首页内容</div>
    </AppShell>
  )
}
```

#### app/builder/page.tsx - 使用 BuilderLayout

```tsx
import { BuilderLayout } from '@/components/layouts/builder-layout'

export default function BuilderPage() {
  return (
    <BuilderLayout>
      <div>配置器内容</div>
    </BuilderLayout>
  )
}
```

#### app/community/page.tsx - 使用 CommunityFeed

```tsx
import { CommunityFeed } from '@/components/layouts/community-feed'

export default function CommunityPage() {
  return (
    <CommunityFeed>
      <div>社区内容</div>
    </CommunityFeed>
  )
}
```

#### app/profile/page.tsx - 使用 UserProfileLayout

```tsx
import { UserProfileLayout } from '@/components/layouts/user-profile-layout'

export default function ProfilePage() {
  return (
    <UserProfileLayout userName="用户名" userAvatar="/avatar.jpg">
      <div>个人中心内容</div>
    </UserProfileLayout>
  )
}
```

## 响应式设计

### 断点系统

```css
sm: 640px    /* 移动端 */
md: 768px    /* 平板 */
lg: 1024px   /* 桌面 */
xl: 1280px   /* 大屏幕 */
2xl: 1536px  /* 超大屏幕 */
```

### 布局适配策略

- **移动优先**: 默认布局适配小屏幕
- **渐进增强**: 大屏幕添加更多功能（侧边栏、多列）
- **折叠策略**: 可折叠的面板默认可收起

## 动画系统

### Framer Motion 使用

所有布局组件使用 `framer-motion` 提供流畅动画：

```tsx
import { motion, AnimatePresence } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  内容
</motion.div>
```

### 常用动画效果

- `whileHover`: 悬停效果
- `whileTap`: 点击反馈
- `layout`: 布局变化动画
- `AnimatePresence`: 进入/退出动画

## 主题系统

### 暗色模式

所有布局组件支持暗色/亮色切换，基于 CSS 变量：

```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}

.dark {
  --background: 17 17% 18%;
  --foreground: 210 40% 98%;
}
```

## 最佳实践

1. **保持组件独立性**: 每个布局组件可独立使用
2. **响应式优先**: 确保在所有设备上可用
3. **性能优化**: 使用 `layout` prop 避免不必要的重渲染
4. **无障碍**: 添加适当的 ARIA 标签
5. **动画流畅**: 使用 GPU 加速的动画属性（transform, opacity）

## 故障排除

### 模态框无法打开

确保在应用根部包裹了 `ModalManagerProvider`：

```tsx
// ✅ 正确
<ModalManagerProvider>
  <AppShell>
    {/* 你的应用 */}
  </AppShell>
</ModalManagerProvider>

// ❌ 错误 - 缺少 Provider
<AppShell>
  {/* 无法使用模态框钩子 */}
</AppShell>
```

### 布局错位

检查 CSS 网格列数配置：

```tsx
// 桌面端三栏
className="grid grid-cols-1 lg:grid-cols-12 gap-4"

// 移动端单列
className="col-span-1"
```

## 扩展指南

### 添加新的布局类型

1. 在 `components/layouts/` 创建新组件
2. 遵循现有的命名和结构规范
3. 使用 TypeScript 定义 Props 接口
4. 添加响应式断点
5. 包含 Framer Motion 动画

### 自定义主题

修改 `app/globals.css` 中的 CSS 变量：

```css
:root {
  --primary: your-color;
  /* 更多自定义颜色 */
}
```

## 技术栈

- **React 18+** - 组件框架
- **Framer Motion** - 动画库
- **Radix UI** - 基础组件
- **Shadcn/ui** - UI 组件
- **Lucide React** - 图标库
- **Tailwind CSS** - 样式系统
- **TypeScript** - 类型安全
