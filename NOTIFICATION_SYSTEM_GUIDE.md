# 通知系统使用指南

完整的通知系统，支持实时通知、通知中心、通知管理等功能。

## 📦 功能特性

### 核心功能

- ✅ **实时通知** - 基于 Supabase Realtime 的实时推送
- ✅ **多种类型** - 评论、点赞、@提及、回复、关注、收藏、系统、成就
- ✅ **通知下拉** - 快速查看最近通知
- ✅ **通知中心** - 完整的通知管理界面
- ✅ **标记已读** - 单个或批量标记已读
- ✅ **删除通知** - 单个或批量删除通知
- ✅ **搜索功能** - 按关键词搜索通知
- ✅ **类型筛选** - 按通知类型筛选
- ✅ **未读计数** - 实时显示未读数量
- ✅ **桌面通知** - 支持浏览器原生通知

### 通知类型

- ✅ `comment` - 评论通知
- ✅ `like` - 点赞通知
- ✅ `mention` - @提及通知
- ✅ `reply` - 回复通知
- ✅ `follow` - 关注通知
- ✅ `bookmark` - 收藏通知
- ✅ `system` - 系统通知
- ✅ `achievement` - 成就通知

## 📁 文件结构

```
types/
└── notification.ts             # 通知类型定义

components/notification/
├── notification-item.tsx        # 通知项组件（8KB）
├── notification-dropdown.tsx     # 通知下拉组件（10KB）
├── notification-center.tsx      # 通知中心组件（12KB）
└── index.ts                   # 组件导出

lib/supabase/
└── notifications.ts          # 通知服务（16KB）

app/examples/
└── notification-demo.tsx      # 示例页面（18KB）
```

## 🚀 快速开始

### 1. 基础使用

```tsx
import { NotificationDropdown } from '@/components/notification';
import { useNotifications } from '@/lib/supabase/notifications';

function Header() {
  const { notifications, unreadCount } = useNotifications(userId);

  return (
    <header>
      <NotificationDropdown
        notifications={notifications}
        unreadCount={unreadCount}
        onClick={(notification) => {
          // 导航到对应页面
          router.push(`/posts/${notification.data.postId}`);
        }}
      />
    </header>
  );
}
```

### 2. 通知中心

```tsx
import { NotificationCenter } from '@/components/notification';

function NotificationsPage() {
  return (
    <NotificationCenter
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={async (notificationId) => {
        await NotificationService.markAsRead(notificationId);
      }}
      onDelete={async (notificationId) => {
        await NotificationService.deleteNotification(notificationId);
      }}
      onClick={(notification) => {
        router.push(`/posts/${notification.data.postId}`);
      }}
    />
  );
}
```

### 3. 创建通知

```tsx
import { NotificationService } from '@/lib/supabase/notifications';

// 创建评论通知
await NotificationService.createCommentNotification(
  fromUserId,
  toUserId,
  postId,
  postTitle,
  commentContent
);

// 创建点赞通知
await NotificationService.createLikeNotification(
  fromUserId,
  toUserId,
  postId,
  postTitle
);

// 创建@提及通知
await NotificationService.createMentionNotification(
  fromUserId,
  toUserId,
  postId,
  postTitle,
  commentContent
);
```

### 4. 订阅实时通知

```tsx
import { NotificationService } from '@/lib/supabase/notifications';

function App() {
  useEffect(() => {
    const unsubscribe = NotificationService.subscribeToNotifications(
      userId,
      (notification) => {
        console.log('收到新通知:', notification);
        // 更新通知列表
        setNotifications(prev => [notification, ...prev]);
      }
    );

    return () => unsubscribe();
  }, [userId]);
}
```

## 🎨 组件 API

### NotificationDropdown

通知下拉组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `notifications` | `Notification[]` | *必需* | 通知列表 |
| `unreadCount` | `number` | *必需* | 未读数量 |
| `loading` | `boolean` | `false` | 是否加载中 |
| `onMarkAsRead` | `(id) => void` | - | 标记已读回调 |
| `onMarkAllAsRead` | `() => void` | - | 标记全部已读回调 |
| `onDelete` | `(id) => void` | - | 删除通知回调 |
| `onDeleteAll` | `() => void` | - | 删除全部通知回调 |
| `onClick` | `(notification) => void` | - | 点击通知回调 |
| `maxDisplayed` | `number` | `5` | 最大显示数量 |
| `onShowMore` | `() => void` | - | 显示更多回调 |

### NotificationCenter

通知中心组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `notifications` | `Notification[]` | *必需* | 通知列表 |
| `unreadCount` | `number` | *必需* | 未读数量 |
| `loading` | `boolean` | `false` | 是否加载中 |
| `onMarkAsRead` | `(id) => void` | - | 标记已读回调 |
| `onMarkAllAsRead` | `() => void` | - | 标记全部已读回调 |
| `onDelete` | `(id) => void` | - | 删除通知回调 |
| `onDeleteAll` | `() => void` | - | 删除全部通知回调 |
| `onClick` | `(notification) => void` | - | 点击通知回调 |
| `onSearch` | `(query) => void` | - | 搜索通知回调 |

## 🔧 服务 API

### NotificationService

通知服务类。

#### 方法

##### createNotification
创建单个通知。

```typescript
static async createNotification(
  params: CreateNotificationParams
): Promise<Notification>
```

##### createNotifications
批量创建通知。

```typescript
static async createNotifications(
  notifications: CreateNotificationParams[]
): Promise<Notification[]>
```

##### getNotifications
获取通知列表。

```typescript
static async getNotifications(
  userId: string,
  limit?: number,
  offset?: number
): Promise<{ notifications: Notification[]; total: number }>
```

##### getUnreadCount
获取未读数量。

```typescript
static async getUnreadCount(userId: string): Promise<number>
```

##### markAsRead
标记已读。

```typescript
static async markAsRead(notificationId: string): Promise<void>
```

##### markAllAsRead
标记全部已读。

```typescript
static async markAllAsRead(userId: string): Promise<void>
```

##### deleteNotification
删除通知。

```typescript
static async deleteNotification(notificationId: string): Promise<void>
```

##### subscribeToNotifications
订阅实时通知。

```typescript
static subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
): () => void
```

## 🎯 使用场景

### 1. 帖子被评论

```tsx
// 当用户评论帖子时
await NotificationService.createNotification({
  userId: post.authorId,
  type: 'comment',
  data: {
    fromUserId: currentUser.id,
    fromUsername: currentUser.username,
    fromUserAvatar: currentUser.avatar,
    postId: post.id,
    postTitle: post.title,
    commentContent: comment.content,
  },
});
```

### 2. 帖子被点赞

```tsx
// 当用户点赞帖子时
await NotificationService.createNotification({
  userId: post.authorId,
  type: 'like',
  data: {
    fromUserId: currentUser.id,
    fromUsername: currentUser.username,
    fromUserAvatar: currentUser.avatar,
    postId: post.id,
    postTitle: post.title,
  },
});
```

### 3. 评论中被@提及

```tsx
// 提取@提及的用户名
const mentions = comment.content.match(/@(\w+)/g);

for (const mention of mentions) {
  const username = mention.substring(1);
  const user = await getUserByUsername(username);

  if (user) {
    await NotificationService.createNotification({
      userId: user.id,
      type: 'mention',
      data: {
        fromUserId: currentUser.id,
        fromUsername: currentUser.username,
        fromUserAvatar: currentUser.avatar,
        postId: post.id,
        postTitle: post.title,
        commentContent: comment.content,
      },
    });
  }
}
```

### 4. 评论被回复

```tsx
// 当用户回复评论时
await NotificationService.createNotification({
  userId: parentComment.authorId,
  type: 'reply',
  data: {
    fromUserId: currentUser.id,
    fromUsername: currentUser.username,
    fromUserAvatar: currentUser.avatar,
    postId: post.id,
    postTitle: post.title,
    commentId: parentComment.id,
    commentContent: reply.content,
  },
});
```

## 📊 数据库表结构

### notifications 表

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  data jsonb not null,
  is_read boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- 创建索引
create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_is_read on notifications(is_read);
create index idx_notifications_created_at on notifications(created_at desc);
```

## 🔐 权限控制

```sql
-- 用户只能查看自己的通知
create policy "Users can view own notifications"
on notifications for select
using (auth.uid() = user_id);

-- 服务可以创建通知
create policy "Service can create notifications"
on notifications for insert
with check (true);

-- 用户可以标记自己的通知为已读
create policy "Users can update own notifications"
on notifications for update
using (auth.uid() = user_id);

-- 用户可以删除自己的通知
create policy "Users can delete own notifications"
on notifications for delete
using (auth.uid() = user_id);
```

## 💡 最佳实践

### 1. 批量创建通知

```tsx
// 通知多个被@提及的用户
const mentions = comment.content.match(/@(\w+)/g);
const notificationPromises = mentions.map(async mention => {
  const username = mention.substring(1);
  const user = await getUserByUsername(username);

  if (user) {
    return NotificationService.createNotification({
      userId: user.id,
      type: 'mention',
      data: {
        fromUserId: currentUser.id,
        fromUsername: currentUser.username,
        postId: post.id,
        commentContent: comment.content,
      },
    });
  }
});

await Promise.all(notificationPromises);
```

### 2. 防止重复通知

```tsx
// 检查是否已存在类似通知
const existing = await supabase
  .from('notifications')
  .select('id')
  .eq('user_id', userId)
  .eq('type', type)
  .eq('data->>postId', postId)
  .single();

if (!existing) {
  await NotificationService.createNotification({ userId, type, data });
}
```

### 3. 合并通知

```tsx
// 如果短时间内收到多个相同类型的通知，可以合并
const lastNotification = notifications.find(n =>
  n.type === 'like' &&
  n.data.postId === postId &&
  Date.now() - n.createdAt.getTime() < 60000 // 1分钟内
);

if (lastNotification) {
  // 更新现有通知而不是创建新通知
  await updateNotification(lastNotification.id, {
    data: {
      ...lastNotification.data,
      count: (lastNotification.data.count || 1) + 1,
    },
  });
} else {
  await createNewNotification();
}
```

### 4. 通知去重

```tsx
// 使用消息去重
const deduplicatedNotifications = notifications.reduce((acc, notification) => {
  const key = `${notification.type}_${notification.data.postId}`;
  if (!acc.has(key)) {
    acc.set(key, notification);
  }
  return acc;
}, new Map());
```

## 🚀 性能优化

### 1. 分页加载

```tsx
const [page, setPage] = useState(1);
const pageSize = 20;

const loadMore = async () => {
  const result = await NotificationService.getNotifications(
    userId,
    pageSize,
    (page - 1) * pageSize
  );

  setNotifications(prev => [...prev, ...result.notifications]);
  setPage(prev => prev + 1);
};
```

### 2. 虚拟滚动

```tsx
import { VirtualList } from 'react-virtual';

<VirtualList
  height={600}
  itemCount={notifications.length}
  itemSize={100}
  renderItem={({ index, style }) => (
    <div style={style}>
      <NotificationItem notification={notifications[index]} />
    </div>
  )}
/>
```

### 3. 缓存未读数量

```tsx
const [unreadCount, setUnreadCount] = useState(0);

// 定期刷新未读数量
useEffect(() => {
  const interval = setInterval(async () => {
    const count = await NotificationService.getUnreadCount(userId);
    setUnreadCount(count);
  }, 60000); // 每分钟刷新

  return () => clearInterval(interval);
}, [userId]);
```

## 📚 相关文档

- [评论排序指南](./COMMENT_SORTING_GUIDE.md)
- [富文本支持指南](./RICH_TEXT_GUIDE.md)
- [评论发布指南](./COMMENT_SUBMIT_GUIDE.md)
- [Supabase 实时文档](https://supabase.com/docs/guides/realtime)

## 🎉 总结

通知系统提供：

✅ **实时通知** - Supabase Realtime 实时推送
✅ **多种类型** - 8 种通知类型
✅ **通知下拉** - 快速查看最近通知
✅ **通知中心** - 完整的管理界面
✅ **标记已读** - 单个或批量标记
✅ **删除通知** - 单个或批量删除
✅ **搜索功能** - 按关键词搜索
✅ **类型筛选** - 按类型筛选
✅ **未读计数** - 实时显示未读数量
✅ **桌面通知** - 浏览器原生通知
✅ **完整文档** - 详细的使用指南和示例
✅ **类型安全** - 完整 TypeScript 支持
✅ **性能优化** - 分页、虚拟滚动、缓存

现在你可以在项目中使用完整的通知系统了！🎉
