# 用户活动时间线使用指南

完整的用户活动时间线系统，支持查看和统计用户的所有活动。

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [组件使用](#组件使用)
- [最佳实践](#最佳实践)

---

## 功能特性

### 1. 活动类型

- ✅ **发布配置** - 用户发布了新配置
- ✅ **更新配置** - 用户更新了配置
- ✅ **删除配置** - 用户删除了配置
- ✅ **点赞** - 用户点赞了配置
- ✅ **评论** - 用户评论了配置
- ✅ **关注** - 用户关注了其他用户
- ✅ **收藏** - 用户收藏了配置
- ✅ **更新资料** - 用户更新了个人资料

### 2. 时间线功能

- ✅ **按时间排序** - 最新的活动显示在最前
- ✅ **日期分组** - 按日期分组显示（今天、昨天、具体日期）
- ✅ **实时加载** - 并发获取所有活动数据
- ✅ **分页加载** - 支持加载更多
- ✅ **类型筛选** - 可按活动类型筛选
- ✅ **活动图标** - 不同活动类型显示不同图标
- ✅ **时间显示** - 相对时间（如"5分钟前"）

### 3. 统计功能

- ✅ **总活动数** - 所有活动的总数
- ✅ **配置统计** - 发布的配置数量
- ✅ **点赞统计** - 点赞数量
- ✅ **评论统计** - 评论数量
- ✅ **关注统计** - 关注数量
- ✅ **收藏统计** - 收藏数量
- ✅ **月度趋势** - 按月显示活动趋势

---

## 快速开始

### 1. 使用活动服务

```typescript
import { ActivityService } from '@/lib/supabase/user-activity';

// 获取用户所有活动
const { data, error } = await ActivityService.getUserActivity(userId);

// 获取特定类型的活动
const { data, error } = await ActivityService.getUserActivity(userId, {
  type: 'like_given',
  limit: 50,
});

// 获取活动统计
const { data: stats, error } = await ActivityService.getActivityStats(userId);
```

### 2. 使用活动时间线组件

```tsx
import { ActivityTimeline } from '@/components/activity';

<ActivityTimeline
  activities={activities}
  loading={loading}
  onLoadMore={handleLoadMore}
  hasMore={hasMore}
/>
```

### 3. 使用活动统计组件

```tsx
import { ActivityStatsPanel } from '@/components/activity';

<ActivityStatsPanel stats={stats} />
```

---

## API 文档

### ActivityService

活动服务类，提供活动相关的操作。

#### getUserActivity

获取用户的所有活动。

```typescript
static async getUserActivity(
  userId: string,
  filters?: ActivityFilters
): Promise<{ data: Activity[]; error?: string }>
```

**参数**：
- `userId` - 用户ID
- `filters` - 可选的筛选条件

**返回**：
- `data` - 活动列表
- `error` - 错误信息

**示例**：

```typescript
const { data, error } = await ActivityService.getUserActivity(userId, {
  type: 'config_created',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  limit: 50,
  offset: 0,
});
```

#### getActivityStats

获取用户的活动统计。

```typescript
static async getActivityStats(
  userId: string
): Promise<{ data: ActivityStats | null; error?: string }>
```

**返回**：
- `data` - 活动统计数据
- `error` - 错误信息

**示例**：

```typescript
const { data: stats, error } = await ActivityService.getActivityStats(userId);

console.log('总活动:', stats?.totalActivities);
console.log('发布配置:', stats?.configsCreated);
console.log('点赞:', stats?.likesGiven);
console.log('按月统计:', stats?.activityByMonth);
```

---

## 组件使用

### ActivityTimeline

活动时间线组件，显示用户的所有活动。

#### Props

```typescript
interface ActivityTimelineProps {
  activities: Activity[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}
```

#### 使用示例

```tsx
import { ActivityTimeline } from '@/components/activity';

function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <ActivityTimeline
      activities={activities}
      loading={loading}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
    />
  );
}
```

### ActivityStatsPanel

活动统计组件，显示用户的统计数据。

#### Props

```typescript
interface ActivityStatsProps {
  stats: ActivityStats;
}
```

#### 使用示例

```tsx
import { ActivityStatsPanel } from '@/components/activity';

function StatsPage() {
  const [stats, setStats] = useState<ActivityStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = await ActivityService.getActivityStats(userId);
    setStats(data!);
  };

  return stats && <ActivityStatsPanel stats={stats} />;
}
```

---

## 最佳实践

### 1. 并发获取活动数据

使用 `Promise.allSettled` 并发获取所有活动数据，提高性能：

```typescript
const [configs, likes, comments] = await Promise.allSettled([
  getConfigs(userId),
  getLikes(userId),
  getComments(userId),
]);
```

### 2. 时间排序

所有活动按时间倒序排序，最新的活动显示在最前：

```typescript
activities.sort((a, b) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
```

### 3. 日期分组

按日期分组显示活动，提升用户体验：

```typescript
const isToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};

// 分组：今天、昨天、具体日期
```

### 4. 分页加载

使用分页避免一次性加载过多数据：

```typescript
const handleLoadMore = async () => {
  const newFilters = {
    ...filters,
    offset: activities.length,
  };

  const { data } = await ActivityService.getUserActivity(userId, newFilters);
  setActivities([...activities, ...data]);
};
```

### 5. 筛选活动

支持按类型、日期筛选活动：

```typescript
const filteredActivities = activities.filter(activity => {
  if (filters.type && activity.type !== filters.type) {
    return false;
  }

  if (filters.startDate && new Date(activity.createdAt) < filters.startDate) {
    return false;
  }

  if (filters.endDate && new Date(activity.createdAt) > filters.endDate) {
    return false;
  }

  return true;
});
```

---

## 总结

用户活动时间线系统提供：

✅ **8种活动类型** - 发布、更新、删除、点赞、评论、关注、收藏、更新资料
✅ **时间排序** - 最新的活动显示在最前
✅ **日期分组** - 按日期分组显示（今天、昨天、具体日期）
✅ **并发获取** - 并发获取所有活动数据，提高性能
✅ **分页加载** - 支持加载更多，避免一次性加载过多
✅ **类型筛选** - 可按活动类型筛选
✅ **活动统计** - 完整的统计数据（总数、按类型、按月）
✅ **活动图标** - 不同活动类型显示不同图标
✅ **时间显示** - 相对时间（如"5分钟前"）
✅ **图片预览** - 配置图片预览
✅ **完整类型** - 完整的 TypeScript 类型定义
✅ **响应式设计** - 适配各种设备
✅ **错误处理** - 完整的错误提示
✅ **性能优化** - 使用 Promise.allSettled 和索引

完整的用户活动时间线系统！
