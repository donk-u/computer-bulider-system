# 组件使用指南

## InteractiveStat 组件

交互式统计组件，支持点赞和收藏功能，带动画效果。

### 基础用法

```tsx
import { InteractiveStat } from '@/components/shared/interactive-stat'

// 点赞按钮
<InteractiveStat
  type="like"
  count={42}
  isActive={isLiked}
  onClick={() => setIsLiked(!isLiked)}
/>

// 收藏按钮
<InteractiveStat
  type="save"
  count={28}
  isActive={isSaved}
  onClick={() => setIsSaved(!isSaved)}
/>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|---------|------|
| `type` | `'like' \| 'save'` | `'like'` | 组件类型，影响图标和颜色 |
| `count` | `number` | - | 当前计数（必填） |
| `isActive` | `boolean` | - | 是否已激活（必填） |
| `onClick` | `() => void` | - | 点击事件处理函数 |
| `className` | `string` | - | 自定义类名 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 组件尺寸 |

### 尺寸变化

- `sm`: 小号（16px 图标）
- `md`: 中号（20px 图标）
- `lg`: 大号（24px 图标）

### 动画效果

- 悬停时轻微缩放（scale 1.05）
- 点击时微缩放（scale 0.95）
- 激活时图标缩放+旋转动画
- 激活时计数器缩放动画
- 激活时有扩散波纹效果

### 颜色方案

- **Like**: 红色（red-500）
- **Save**: 琥珀色（amber-500）
- **未激活**: 次要文字颜色（text-muted-foreground）

## CSS 样式规范

### 主题色变量

```css
/* 主色调 - blue-600 */
--color-blue-500
--color-blue-600
--color-blue-700

/* 状态色 */
--color-green-500  /* 成功 */
--color-yellow-500 /* 警告 */
--color-red-500   /* 错误 */
--color-cyan-500  /* 信息 */
```

### 响应式断点

```css
/* 使用方式 */
@sm:block  /* 640px+ */
@md:block  /* 768px+ */
@lg:block  /* 1024px+ */
@xl:block  /* 1280px+ */
@2xl:block /* 1536px+ */

/* 隐藏对应 */
@sm:hidden
@md:hidden
@lg:hidden
@xl:hidden
```

### 阴影系统

```css
.shadow-custom-sm   /* 小阴影 */
.shadow-custom-md   /* 中阴影 */
.shadow-custom-lg   /* 大阴影 */
.shadow-custom-xl   /* 超大阴影 */
```

### 彩色阴影

```css
.shadow-primary   /* 主色阴影 */
.shadow-success   /* 成功色阴影 */
.shadow-warning   /* 警告色阴影 */
.shadow-danger    /* 错误色阴影 */
```

### 动画类

```css
/* 入场动画 */
.animate-fade-in      /* 淡入 */
.animate-slide-in     /* 滑入 */
.animate-scale-in     /* 缩放入场 */

/* 出场动画 */
.animate-fade-out     /* 淡出 */
.animate-slide-out    /* 滑出 */
.animate-scale-out    /* 缩放出场 */

/* 交互动画 */
.animate-bounce-short   /* 弹跳 */
.animate-pulse-fast    /* 脉冲 */
.animate-spin-slow     /* 缓慢旋转 */
.animate-shake        /* 摇晃 */
.animate-heartbeat    /* 心跳（点赞） */
.animate-starburst    /* 星爆（收藏） */
.animate-loading      /* 加载 */
```

### 微交互动画

```css
.click-effect  /* 点击波纹效果 */
```

## 使用示例

查看完整示例：`app/examples/interactive-stat-example.tsx`

运行示例：
```bash
npm run dev
# 访问 http://localhost:3000/examples/interactive-stat-example
```

## 技术栈

- **React 18+** - 组件框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库
- **Tailwind CSS** - 样式系统
- **clsx + tailwind-merge** - 类名合并

## 自定义扩展

### 添加新的动画类

编辑 `app/globals.css`:

```css
@layer utilities {
  .animate-custom {
    animation: customAnim 0.5s ease-in-out;
  }

  @keyframes customAnim {
    from { /* 起始状态 */ }
    to { /* 结束状态 */ }
  }
}
```

### 添加新的阴影等级

编辑 `app/globals.css`:

```css
@layer utilities {
  .shadow-custom-2xl {
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
}
```

## 注意事项

1. **性能优化**: 所有动画使用 CSS transform 和 opacity，避免使用 left/top/right/bottom
2. **可访问性**: 按钮支持键盘导航和屏幕阅读器
3. **响应式**: 组件在不同屏幕尺寸下自动适配
4. **深色模式**: 自动适配深色主题（基于 CSS 变量）
5. **动画控制**: 通过 `framer-motion` 提供的 `transition` prop 控制

## 最佳实践

1. 在列表中使用时，添加 `key` prop 用于 React 调度
2. 对于大量数据的列表，考虑使用虚拟滚动
3. 禁用状态应设置 `disabled={true}` 而非移除 `onClick`
4. 使用 `size` prop 而非自定义 CSS 调整大小
5. 动画类可以组合使用，如 `animate-fade-in animate-scale-in`
