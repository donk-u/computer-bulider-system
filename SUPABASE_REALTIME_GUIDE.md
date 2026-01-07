# Supabase 实时订阅指南

## 📚 目录

- [概述](#概述)
- [快速开始](#快速开始)
- [基础订阅](#基础订阅)
- [特定订阅](#特定订阅)
- [高级功能](#高级功能)
- [最佳实践](#最佳实践)
- [API 参考](#api-参考)

## 概述

Supabase 实时订阅模块提供了一套完整的实时数据订阅功能，包括：

- ✅ **多种订阅类型** - 帖子、评论、点赞、收藏、用户
- ✅ **灵活的过滤** - 支持复杂的过滤条件
- ✅ **多表订阅** - 同时监听多个表
- ✅ **状态管理** - 完整的订阅状态跟踪
- ✅ **自动清理** - 组件卸载时自动取消订阅
- ✅ **错误处理** - 完善的错误处理和重试机制

## 快速开始

### 1. 基础订阅

```tsx
import { usePostSubscription } from '@/lib/realtime';

function PostList() {
  const { state } = usePostSubscription(
    { enabled: true, eventType: 'UPDATE' },
    (payload) => {
      if (payload.eventType === 'UPDATE') {
        console.log('Post updated:', payload.new);
        updatePost(payload.new);
      }
    }
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        {state.connected ? (
          <span className="text-green-500">已连接</span>
        ) : (
          <span className="text-red-500">未连接</span>
        )}
      </div>
      {/* 帖子列表 */}
    </div>
  );
}
```

### 2. 监听所有事件

```tsx
const { state } = usePostSubscription(
  { enabled: true, eventType: '*' },
  (payload) => {
    switch (payload.eventType) {
      case 'INSERT':
        console.log('新帖子:', payload.new);
        addPost(payload.new);
        break;
      case 'UPDATE':
        console.log('帖子更新:', payload.new);
        updatePost(payload.new);
        break;
      case 'DELETE':
        console.log('帖子删除:', payload.old);
        removePost(payload.old.id);
        break;
    }
  }
);
```

## 基础订阅

### useSupabaseRealtime

基础订阅 Hook，支持任意表。

```tsx
import { useSupabaseRealtime } from '@/lib/realtime';

const { state, unsubscribe, resubscribe } = useSupabaseRealtime(
  {
    table: 'posts',
    eventType: '*',           // INSERT | UPDATE | DELETE | '*'
    schema: 'public',
    filter: 'author_id=eq.123',  // 可选过滤条件
    column: 'title',         // 可选：只监听特定列
  },
  (payload) => {
    console.log('Change:', payload);
  }
);
```

**配置选项**:
- `table` - 表名（必需）
- `eventType` - 事件类型（默认 '*'）
- `schema` - schema（默认 'public'）
- `filter` - 过滤条件（可选）
- `column` - 列名（可选）

**返回值**:
- `state` - 订阅状态
  - `connected` - 是否已连接
  - `subscribing` - 是否正在订阅
  - `error` - 错误信息
  - `connectedAt` - 连接时间
  - `lastReceivedAt` - 最后接收时间
- `unsubscribe` - 取消订阅
- `resubscribe` - 重新订阅

### useMultiRealtime

多表订阅 Hook，同时监听多个表。

```tsx
import { useMultiRealtime } from '@/lib/realtime';

const { state } = useMultiRealtime(
  [
    { table: 'posts', eventType: 'INSERT' },
    { table: 'comments', eventType: 'INSERT' },
    { table: 'likes', eventType: '*' },
  ],
  {
    posts: (payload) => console.log('Post:', payload),
    comments: (payload) => console.log('Comment:', payload),
    likes: (payload) => console.log('Like:', payload),
  }
);
```

### useFilteredRealtime

带过滤条件的订阅 Hook。

```tsx
import { useFilteredRealtime } from '@/lib/realtime';

const { state } = useFilteredRealtime(
  { table: 'posts', eventType: 'UPDATE' },
  'author_id=eq.123',  // 过滤条件
  (payload) => {
    console.log('Change:', payload);
  }
);
```

## 特定订阅

### 帖子订阅

```tsx
import { usePostSubscription } from '@/lib/realtime';

// 监听所有帖子
const { state } = usePostSubscription(
  { enabled: true, eventType: '*' },
  (payload) => {
    console.log('Post:', payload);
  }
);

// 监听特定作者的帖子
const { state } = usePostSubscription(
  { enabled: true, authorId: '123', eventType: '*' },
  (payload) => {
    console.log('Post:', payload);
  }
);

// 监听特定帖子
const { state } = usePostSubscription(
  { enabled: true, postId: '456', eventType: 'UPDATE' },
  (payload) => {
    console.log('Post updated:', payload.new);
  }
);
```

### 评论订阅

```tsx
import { useCommentSubscription } from '@/lib/realtime';

// 监听所有评论
const { state } = useCommentSubscription(
  { enabled: true, eventType: 'INSERT' },
  (payload) => {
    console.log('New comment:', payload.new);
    addComment(payload.new);
  }
);

// 监听特定帖子的评论
const { state } = useCommentSubscription(
  { enabled: true, postId: '123', eventType: 'INSERT' },
  (payload) => {
    console.log('New comment on post:', payload.new.post_id);
    addCommentToPost(payload.new.post_id, payload.new);
  }
);

// 监听特定用户的评论
const { state } = useCommentSubscription(
  { enabled: true, userId: '456', eventType: '*' },
  (payload) => {
    console.log('User comment:', payload);
  }
);
```

### 点赞订阅

```tsx
import { useLikeSubscription } from '@/lib/realtime';

// 监听帖子的点赞
const { state } = useLikeSubscription(
  { enabled: true, postId: '123', eventType: '*' },
  (payload) => {
    if (payload.eventType === 'INSERT') {
      console.log('New like:', payload.new);
      incrementLikeCount(payload.new.post_id);
    } else if (payload.eventType === 'DELETE') {
      console.log('Unlike:', payload.old);
      decrementLikeCount(payload.old.post_id);
    }
  }
);

// 监听用户的点赞
const { state } = useLikeSubscription(
  { enabled: true, userId: '456', eventType: '*' },
  (payload) => {
    console.log('User like:', payload);
  }
);
```

### 收藏订阅

```tsx
import { useBookmarkSubscription } from '@/lib/realtime';

// 监听用户的收藏
const { state } = useBookmarkSubscription(
  { enabled: true, userId: '123', eventType: '*' },
  (payload) => {
    if (payload.eventType === 'INSERT') {
      console.log('New bookmark:', payload.new);
      addBookmark(payload.new);
    } else if (payload.eventType === 'DELETE') {
      console.log('Remove bookmark:', payload.old);
      removeBookmark(payload.old.id);
    }
  }
);

// 监听特定收藏夹的收藏
const { state } = useBookmarkSubscription(
  { enabled: true, folderId: '456', eventType: '*' },
  (payload) => {
    console.log('Bookmark:', payload);
  }
);
```

### 用户订阅

```tsx
import { useUserSubscription } from '@/lib/realtime';

// 监听用户信息更新
const { state } = useUserSubscription(
  { enabled: true, userId: '123', eventType: 'UPDATE' },
  (payload) => {
    console.log('User updated:', payload.new);
    updateUser(payload.new);
  }
);

// 只监听关注者数量变化
const { state } = useUserSubscription(
  { enabled: true, userId: '123', column: 'followers', eventType: 'UPDATE' },
  (payload) => {
    console.log('Followers changed:', payload.new.followers);
    updateFollowersCount(payload.new.followers);
  }
);
```

### Feed 订阅

```tsx
import { useFeedRealtime } from '@/lib/realtime';

// 监听 Feed 动态（新帖子、新评论等）
const { state } = useFeedRealtime(
  (payload, table) => {
    console.log(`Feed update from ${table}:`, payload);
    
    if (table === 'posts' && payload.eventType === 'INSERT') {
      // 新帖子
      prependToFeed(payload.new);
    } else if (table === 'comments' && payload.eventType === 'INSERT') {
      // 新评论
      showNotification('新评论', payload.new.content);
    }
  }
);
```

### 通知订阅

```tsx
import { useNotificationSubscription } from '@/lib/realtime';

// 监听用户通知
const { state } = useNotificationSubscription(
  'current-user-id',
  (payload) => {
    console.log('New notification:', payload.new);
    showNotification(payload.new.title, payload.new.body);
  }
);
```

## 高级功能

### 1. 过滤条件

使用 Supabase 的过滤语法：

```tsx
// 简单等于
filter: 'author_id=eq.123'

// 多个条件
filter: 'author_id=eq.123&status=eq.published'

// 不等于
filter: 'status=neq.draft'

// 大于
filter: 'likes=gt.100'

// 小于
filter: 'likes=lt.1000'

// 大于等于
filter: 'likes=gte.100'

// 小于等于
filter: 'likes=lte.1000'

// 包含
filter: 'title=cs.search-term'

// 不区分大小写的包含
filter: 'title=ilike.%search-term%'
```

### 2. 特定列监听

只监听特定列的变化：

```tsx
const { state } = useSupabaseRealtime(
  {
    table: 'posts',
    eventType: 'UPDATE',
    column: 'likes',  // 只监听 likes 列的变化
  },
  (payload) => {
    console.log('Likes changed:', payload.new);
  }
);
```

### 3. 动态切换订阅

根据条件启用/禁用订阅：

```tsx
const [enabled, setEnabled] = useState(true);

const { state } = usePostSubscription(
  { enabled },  // 根据状态启用/禁用
  (payload) => {
    console.log('Post:', payload);
  }
);

// 切换订阅
<Button onClick={() => setEnabled(!enabled)}>
  {enabled ? '禁用订阅' : '启用订阅'}
</Button>
```

### 4. 错误处理

处理订阅错误：

```tsx
const { state } = usePostSubscription(
  { enabled: true, eventType: '*' },
  (payload) => {
    console.log('Post:', payload);
  }
);

// 监听错误状态
useEffect(() => {
  if (state.error) {
    console.error('Subscription error:', state.error);
    // 显示错误提示
    toast.error('订阅失败，请刷新页面');
  }
}, [state.error]);
```

### 5. 重新订阅

手动重新订阅：

```tsx
const { state, unsubscribe, resubscribe } = usePostSubscription(
  { enabled: true, eventType: '*' },
  (payload) => {
    console.log('Post:', payload);
  }
);

// 取消订阅
<Button onClick={unsubscribe}>取消订阅</Button>

// 重新订阅
<Button onClick={resubscribe}>重新订阅</Button>
```

## 最佳实践

### 1. 组件卸载时自动清理

React Hook 自动处理清理，无需手动操作：

```tsx
// ✅ 正确：使用 Hook，自动清理
function MyComponent() {
  const { state } = usePostSubscription(
    { enabled: true },
    (payload) => console.log(payload)
  );
  return <div>...</div>;
}

// ❌ 错误：手动管理订阅
function MyComponent() {
  useEffect(() => {
    const channel = supabase.channel('posts').subscribe();
    return () => supabase.removeChannel(channel);
  }, []);
  return <div>...</div>;
}
```

### 2. 条件订阅

只在需要时启用订阅：

```tsx
const [isActive, setIsActive] = useState(false);

// 只在激活时订阅
const { state } = usePostSubscription(
  { enabled: isActive },
  (payload) => console.log(payload)
);

<Button onClick={() => setIsActive(!isActive)}>
  {isActive ? '停止监听' : '开始监听'}
</Button>
```

### 3. 优化性能

只订阅需要的数据：

```tsx
// ❌ 不好的做法：订阅所有事件
usePostSubscription(
  { eventType: '*' },
  (payload) => console.log(payload)
);

// ✅ 好的做法：只订阅需要的事件
usePostSubscription(
  { eventType: 'INSERT' },  // 只监听新帖子
  (payload) => console.log(payload)
);

// ✅ 好的做法：只监听特定用户
usePostSubscription(
  { authorId: currentUserId, eventType: 'UPDATE' },
  (payload) => console.log(payload)
);
```

### 4. 避免重复订阅

使用过滤条件避免重复订阅：

```tsx
// ❌ 不好的做法：订阅所有帖子
usePostSubscription(
  { enabled: true, eventType: '*' },
  (payload) => {
    if (payload.new.author_id === currentUserId) {
      // 手动过滤
    }
  }
);

// ✅ 好的做法：使用过滤条件
usePostSubscription(
  { enabled: true, authorId: currentUserId, eventType: '*' },
  (payload) => console.log(payload)
);
```

### 5. 状态同步

使用状态管理库同步数据：

```tsx
import { create } from 'zustand';

interface PostStore {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
}

const usePostStore = create<PostStore>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === post.id ? post : p)),
    })),
}));

function PostFeed() {
  const addPost = usePostStore((state) => state.addPost);
  const updatePost = usePostStore((state) => state.updatePost);

  usePostSubscription(
    { enabled: true, eventType: '*' },
    (payload) => {
      if (payload.eventType === 'INSERT') {
        addPost(payload.new);
      } else if (payload.eventType === 'UPDATE') {
        updatePost(payload.new);
      }
    }
  );

  const posts = usePostStore((state) => state.posts);
  return <div>{/* 渲染帖子 */}</div>;
}
```

## API 参考

### useSupabaseRealtime

```typescript
function useSupabaseRealtime<T = any>(
  config: SubscriptionConfig,
  callback: SubscriptionCallback<T>
): {
  state: SubscriptionState;
  unsubscribe: () => void;
  resubscribe: () => void;
}
```

### SubscriptionConfig

```typescript
interface SubscriptionConfig {
  enabled?: boolean;       // 是否启用
  eventType?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;         // 默认 'public'
  table: string;          // 必需
  filter?: string;        // 过滤条件
  column?: string;        // 列名
}
```

### SubscriptionState

```typescript
interface SubscriptionState {
  connected: boolean;      // 是否已连接
  subscribing: boolean;    // 是否正在订阅
  error: Error | null;     // 错误信息
  connectedAt?: Date;      // 连接时间
  lastReceivedAt?: Date;   // 最后接收时间
}
```

### ChangePayload

```typescript
interface ChangePayload<T = any> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  old: T | null;
  new: T | null;
  table: string;
  schema: string;
  column?: string;
}
```

### usePostSubscription

```typescript
function usePostSubscription(
  config: PostSubscriptionConfig,
  callback: (payload: PostChangePayload) => void
): {
  state: SubscriptionState;
  unsubscribe: () => void;
  resubscribe: () => void;
}
```

### PostSubscriptionConfig

```typescript
interface PostSubscriptionConfig {
  enabled?: boolean;
  authorId?: string;    // 只监听特定作者
  postId?: string;      // 只监听特定帖子
  eventType?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
}
```

## 示例页面

访问完整示例：

```bash
npm run dev
# 访问 http://localhost:3000/examples/realtime-demo
```

示例包含：
- ✅ 帖子订阅
- ✅ 评论订阅
- ✅ 点赞订阅
- ✅ Feed 订阅
- ✅ 多表订阅
- ✅ 实时日志
- ✅ 订阅状态展示

## 总结

Supabase 实时订阅模块提供：

✅ **多种订阅类型** - 帖子、评论、点赞、收藏、用户
✅ **灵活过滤** - 支持复杂的过滤条件
✅ **多表订阅** - 同时监听多个表
✅ **状态管理** - 完整的订阅状态跟踪
✅ **自动清理** - 组件卸载时自动取消订阅
✅ **错误处理** - 完善的错误处理
✅ **类型安全** - 完整 TypeScript 支持
✅ **简单易用** - 高级 Hook 抽象
✅ **性能优化** - 按需订阅
✅ **完整文档** - 详细 API 和最佳实践

适用于任何需要实时更新的场景！
