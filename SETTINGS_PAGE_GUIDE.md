# 用户设置页面使用指南

完整的用户设置系统，支持隐私设置、通知设置、主题设置和数据导出。

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [数据库设置](#数据库设置)
- [组件API](#组件api)
- [服务API](#服务api)
- [使用场景](#使用场景)
- [最佳实践](#最佳实践)

---

## 功能特性

### 1. 隐私设置

- ✅ **个人资料可见性** - 公开/私密
- ✅ **显示邮箱** - 控制是否显示邮箱
- ✅ **显示电话** - 控制是否显示电话
- ✅ **允许私信** - 控制是否接收私信
- ✅ **允许好友请求** - 控制是否接收好友请求
- ✅ **活动可见性** - 控制谁可以看到你的活动

### 2. 通知设置

- ✅ **邮件通知** - 启用/禁用邮件通知
- ✅ **推送通知** - 启用/禁用推送通知
- ✅ **新粉丝通知** - 新粉丝通知
- ✅ **新点赞通知** - 新点赞通知
- ✅ **新评论通知** - 新评论通知
- ✅ **新提及通知** - 新提及通知
- ✅ **周报** - 每周活动摘要
- ✅ **营销邮件** - 产品更新和促销

### 3. 主题设置

- ✅ **主题模式** - 浅色/深色/跟随系统
- ✅ **强调色** - 8种预设颜色
- ✅ **字体大小** - 小/中/大
- ✅ **减少动画** - 减少或禁用动画

### 4. 数据导出

- ✅ **选择导出内容** - 个人资料、配置、点赞、评论、关注
- ✅ **JSON格式** - 导出为JSON文件
- ✅ **一键下载** - 快速下载到设备

---

## 快速开始

### 1. 创建数据库表

运行 SQL 迁移脚本：

```sql
-- 创建用户设置表
supabase/migrations/create-user-settings-table.sql
```

### 2. 访问设置页面

```
http://localhost:3000/settings
```

### 3. 使用设置组件

```tsx
import { PrivacySettingsPanel, NotificationSettingsPanel, ThemeSettingsPanel, DataExportPanel } from '@/components/settings';

<PrivacySettingsPanel
  settings={settings.privacy}
  onChange={handlePrivacyChange}
/>

<NotificationSettingsPanel
  settings={settings.notifications}
  onChange={handleNotificationChange}
/>

<ThemeSettingsPanel
  settings={settings.theme}
  onChange={handleThemeChange}
/>

<DataExportPanel userId={userId} />
```

---

## 数据库设置

### user_settings 表（用户设置表）

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  privacy JSONB DEFAULT '{...}'::jsonb,
  notifications JSONB DEFAULT '{...}'::jsonb,
  theme JSONB DEFAULT '{...}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 字段说明

- `id` - 设置ID
- `user_id` - 用户ID（关联auth.users）
- `privacy` - 隐私设置（JSONB）
- `notifications` - 通知设置（JSONB）
- `theme` - 主题设置（JSONB）
- `created_at` - 创建时间
- `updated_at` - 更新时间

### RLS 策略

- ✅ 用户可以查看自己的设置
- ✅ 用户可以更新自己的设置
- ✅ 用户可以插入自己的设置

---

## 组件API

### PrivacySettingsPanel

隐私设置组件。

#### Props

```typescript
interface PrivacySettingsProps {
  settings: PrivacySettings;
  onChange: (settings: PrivacySettings) => void;
  disabled?: boolean;
}
```

#### 使用示例

```tsx
<PrivacySettingsPanel
  settings={settings.privacy}
  onChange={handlePrivacyChange}
/>
```

### NotificationSettingsPanel

通知设置组件。

#### Props

```typescript
interface NotificationSettingsProps {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
  disabled?: boolean;
}
```

#### 使用示例

```tsx
<NotificationSettingsPanel
  settings={settings.notifications}
  onChange={handleNotificationChange}
/>
```

### ThemeSettingsPanel

主题设置组件。

#### Props

```typescript
interface ThemeSettingsProps {
  settings: ThemeSettings;
  onChange: (settings: ThemeSettings) => void;
  disabled?: boolean;
}
```

#### 使用示例

```tsx
<ThemeSettingsPanel
  settings={settings.theme}
  onChange={handleThemeChange}
/>
```

### DataExportPanel

数据导出组件。

#### Props

```typescript
interface DataExportProps {
  userId: string;
}
```

#### 使用示例

```tsx
<DataExportPanel userId={userId} />
```

---

## 服务API

### UserSettingsService

用户设置服务类。

#### 获取设置

```typescript
const { data, error } = await UserSettingsService.getSettings(userId);
```

#### 获取或创建设置

```typescript
const { data, error } = await UserSettingsService.getOrCreateSettings(userId);
```

#### 更新隐私设置

```typescript
const { success, error } = await UserSettingsService.updatePrivacySettings(
  userId,
  privacySettings
);
```

#### 更新通知设置

```typescript
const { success, error } = await UserSettingsService.updateNotificationSettings(
  userId,
  notificationSettings
);
```

#### 更新主题设置

```typescript
const { success, error } = await UserSettingsService.updateThemeSettings(
  userId,
  themeSettings
);
```

#### 导出数据

```typescript
const { data, error } = await UserSettingsService.exportData(userId, {
  includeProfile: true,
  includeConfigs: true,
  includeLikes: true,
  includeComments: true,
  includeFollows: true,
});
```

---

## 使用场景

### 1. 设置页面

```tsx
// app/settings/page.tsx
import { PrivacySettingsPanel, NotificationSettingsPanel, ThemeSettingsPanel } from '@/components/settings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);

  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="privacy">隐私</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="theme">主题</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          <PrivacySettingsPanel
            settings={settings.privacy}
            onChange={(privacy) => setSettings({ ...settings, privacy })}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettingsPanel
            settings={settings.notifications}
            onChange={(notifications) => setSettings({ ...settings, notifications })}
          />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeSettingsPanel
            settings={settings.theme}
            onChange={(theme) => setSettings({ ...settings, theme })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 2. 应用主题设置

```tsx
const handleThemeChange = async (theme: ThemeSettings) => {
  await UserSettingsService.updateThemeSettings(userId, theme);

  // 应用主题
  if (theme.mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme.mode === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (theme.mode === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};
```

### 3. 导出用户数据

```tsx
<DataExportPanel userId={userId} />
```

---

## 最佳实践

### 1. 实时保存

设置更改时立即保存，提供即时反馈：

```tsx
const handlePrivacyChange = async (privacy: PrivacySettings) => {
  setSettings({ ...settings, privacy });
  await UserSettingsService.updatePrivacySettings(userId, privacy);
};
```

### 2. 错误处理

完整的错误处理和用户提示：

```tsx
try {
  const { success, error } = await UserSettingsService.updatePrivacySettings(userId, privacy);

  if (error) {
    throw new Error(error);
  }
} catch (error) {
  console.error('更新失败:', error);
  alert('更新失败，请重试');
}
```

### 3. 主题应用

主题设置更改后立即应用：

```tsx
const handleThemeChange = async (theme: ThemeSettings) => {
  await UserSettingsService.updateThemeSettings(userId, theme);

  // 应用主题到 DOM
  document.documentElement.setAttribute('data-theme', theme.mode);
};
```

---

## 总结

用户设置系统提供：

✅ **隐私设置** - 公开/私密、邮箱/电话显示、私信/好友请求、活动可见性
✅ **通知设置** - 邮件/推送通知、新粉丝/点赞/评论/提及、周报、营销邮件
✅ **主题设置** - 浅色/深色/系统、8种强调色、字体大小、减少动画
✅ **数据导出** - 选择导出内容、JSON格式、一键下载
✅ **实时保存** - 设置更改时立即保存
✅ **默认设置** - 自动创建默认设置
✅ **完整类型** - 完整的 TypeScript 类型定义
✅ **响应式设计** - 适配各种设备
✅ **标签导航** - 清晰的设置分类
✅ **错误处理** - 完整的错误提示
✅ **Supabase 集成** - 完整的数据库集成
✅ **RLS 策略** - 行级安全策略保护数据
✅ **JSONB 存储** - 灵活的设置存储

完整的用户设置页面系统！
