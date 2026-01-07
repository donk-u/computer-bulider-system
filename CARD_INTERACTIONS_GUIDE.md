# 卡片交互功能指南

## 📚 目录

- [概述](#概述)
- [快速开始](#快速开始)
- [点赞功能](#点赞功能)
- [收藏功能](#收藏功能)
- [分享功能](#分享功能)
- [评论预览](#评论预览)
- [用户卡片](#用户卡片)
- [最佳实践](#最佳实践)
- [API 参考](#api-参考)

## 概述

卡片交互功能模块提供了一套完整的卡片交互组件，包括：

- ✅ **点赞动画** - 使用 Framer Motion 实现心跳效果
- ✅ **收藏功能** - 支持多个收藏夹管理
- ✅ **分享功能** - 支持复制链接和多平台分享
- ✅ **评论预览** - 显示最新评论和互动
- ✅ **用户卡片** - Hover 时显示用户详细信息

## 快速开始

### 1. 基础使用

```tsx
import {
  LikeButton,
  BookmarkButton,
  ShareButton,
  CommentPreview,
  UserCard,
} from '@/components/interactions';

function PostCard({ post, user }) {
  return (
    <Card>
      {/* 用户卡片 */}
      <UserCard
        user={user}
        trigger={<Avatar src={user.avatar} />}
      />

      {/* 互动按钮 */}
      <LikeButton likeState={post.likeState} onLike={handleLike} />
      <BookmarkButton bookmarkState={post.bookmarkState} onBookmark={handleBookmark} />
      <ShareButton shareOptions={shareOptions} />

      {/* 评论预览 */}
      <CommentPreview comments={post.comments} />
    </Card>
  );
}
```

## 点赞功能

### LikeButton 组件

点赞按钮组件，使用 Framer Motion 实现多种动画效果。

#### 基础用法

```tsx
import { LikeButton } from '@/components/interactions';

<LikeButton
  likeState={{
    isLiked: false,
    count: 234,
  }}
  onLike={(isLiked) => console.log(isLiked)}
  showCount
  size="md"
/>
```

#### 动画配置

```tsx
<LikeButton
  likeState={likeState}
  onLike={handleLike}
  animationConfig={{
    type: 'heartbeat',      // 动画类型
    duration: 0.6,         // 动画持续时间
    intensity: 1.5,        // 动画强度
    enableParticles: true,   // 启用粒子效果
    particleCount: 6,       // 粒子数量
    particleColors: [       // 粒子颜色
      '#ff0000',
      '#ff4444',
      '#ff8888',
    ],
  }}
  showCount
/>
```

#### 动画类型

| 类型 | 说明 | 效果 |
|-----|------|------|
| `heartbeat` | 心跳效果 | 缩放 + 旋转 + 粒子 |
| `burst` | 爆发效果 | 快速缩放 |
| `bounce` | 弹跳效果 | 上下弹跳 |
| `scale` | 缩放效果 | 简单缩放 |

#### 自定义样式

```tsx
<LikeButton
  likeState={likeState}
  onLike={handleLike}
  color={{
    unliked: 'text-purple-500 hover:text-purple-600',
    liked: 'text-purple-600 fill-purple-600',
  }}
  variant="filled"
  showCount
/>
```

#### 紧凑型

```tsx
import { CompactLikeButton } from '@/components/interactions';

<CompactLikeButton
  likeState={likeState}
  onLike={handleLike}
  size="sm"
/>
```

## 收藏功能

### BookmarkButton 组件

收藏按钮组件，支持多个收藏夹管理。

#### 基础用法

```tsx
import { BookmarkButton } from '@/components/interactions';

<BookmarkButton
  bookmarkState={{
    isBookmarked: false,
  }}
  onBookmark={(isBookmarked, folderId) => {
    console.log('Bookmarked:', isBookmarked, 'Folder:', folderId);
  }}
  showText
  size="md"
/>
```

#### 收藏夹管理

```tsx
<BookmarkButton
  bookmarkState={bookmarkState}
  onBookmark={handleBookmark}
  folders={[
    {
      id: '1',
      name: '我的收藏',
      description: '常用的配置和帖子',
      count: 15,
    },
    {
      id: '2',
      name: '稍后阅读',
      description: '待阅读的内容',
      count: 8,
    },
  ]}
  onCreateFolder={async (name) => {
    const newFolder = await createFolder(name);
    return newFolder;
  }}
  showText
/>
```

#### 收藏夹结构

```typescript
interface BookmarkFolder {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  count: number;
  createdAt: string;
  isPublic?: boolean;
}
```

#### 紧凑型

```tsx
import { CompactBookmarkButton } from '@/components/interactions';

<CompactBookmarkButton
  bookmarkState={bookmarkState}
  onBookmark={handleBookmark}
  size="md"
/>
```

## 分享功能

### ShareButton 组件

分享按钮组件，支持复制链接和多平台分享。

#### 基础用法

```tsx
import { ShareButton } from '@/components/interactions';

<ShareButton
  shareOptions={{
    title: '4K 游戏终极配置',
    description: '这是一套完美的 4K 游戏配置',
    url: 'https://example.com/post/123',
    tags: ['游戏', '4K', '配置'],
  }}
  onShare={(platform, options) => {
    console.log('Share to:', platform);
  }}
  showText
  size="md"
/>
```

#### 支持的平台

```tsx
<ShareButton
  shareOptions={shareOptions}
  platforms={[
    'twitter',    // Twitter/X
    'facebook',   // Facebook
    'linkedin',   // LinkedIn
    'whatsapp',   // WhatsApp
    'telegram',   // Telegram
    'reddit',     // Reddit
    'pinterest',  // Pinterest
    'email',      // Email
    'copy',       // 复制链接
  ]}
  showText
/>
```

#### SharePanel 组件

分享面板，适合移动端使用。

```tsx
import { SharePanel } from '@/components/interactions';

function MyComponent() {
  const [sharePanelOpen, setSharePanelOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setSharePanelOpen(true)}>
        分享
      </Button>

      <SharePanel
        shareOptions={shareOptions}
        open={sharePanelOpen}
        onClose={() => setSharePanelOpen(false)}
        platforms={[
          'twitter',
          'facebook',
          'linkedin',
          'whatsapp',
          'telegram',
          'copy',
        ]}
      />
    </>
  );
}
```

#### 紧凑型

```tsx
import { CompactShareButton } from '@/components/interactions';

<CompactShareButton
  shareOptions={shareOptions}
  size="md"
/>
```

## 评论预览

### CommentPreview 组件

评论预览组件，显示最新评论和互动。

#### 基础用法

```tsx
import { CommentPreview } from '@/components/interactions';

<CommentPreview
  comments={comments}
  config={{
    limit: 3,
    showReplies: true,
    showTime: true,
    showLikes: true,
  }}
  onLikeComment={(commentId) => {
    console.log('Like comment:', commentId);
  }}
  onReplyComment={(commentId) => {
    console.log('Reply to comment:', commentId);
  }}
  onViewAll={() => {
    console.log('View all comments');
  }}
/>
```

#### 评论结构

```typescript
interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
    verified?: boolean;
  };
  createdAt: string;
  likes: number;
  replies: number;
  isReply?: boolean;
  parentId?: string;
}
```

#### 自定义配置

```tsx
<CommentPreview
  comments={comments}
  config={{
    limit: 5,                          // 显示数量
    showReplies: true,                  // 显示回复
    showTime: true,                     // 显示时间
    showLikes: true,                    // 显示点赞
    onCommentClick: (commentId) => {    // 点击评论
      console.log('Click comment:', commentId);
    },
    onAuthorClick: (authorId) => {      // 点击作者
      console.log('Click author:', authorId);
    },
  }}
/>
```

#### 紧凑型

```tsx
import { CompactCommentPreview } from '@/components/interactions';

<CompactCommentPreview
  comments={comments}
  maxComments={2}
  onClick={() => console.log('View all comments')}
/>
```

## 用户卡片

### UserCard 组件

用户卡片组件，Hover 时显示用户详细信息。

#### 基础用法

```tsx
import { UserCard } from '@/components/interactions';

<UserCard
  user={{
    id: '1',
    name: 'Tech Master',
    username: 'techmaster',
    avatar: 'https://example.com/avatar.jpg',
    verified: true,
    bio: '技术爱好者',
    followers: 5000,
    following: 200,
    postsCount: 150,
    joinedAt: '2023-01-15T00:00:00Z',
  }}
  trigger={<Avatar src={user.avatar} />}
  config={{
    showFollowButton: true,
    showStats: true,
    showBio: true,
    showSocialLinks: true,
  }}
  delayDuration={200}
/>
```

#### 用户信息结构

```typescript
interface UserCardInfo {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  verified?: boolean;
  bio?: string;
  followers?: number;
  following?: number;
  postsCount?: number;
  joinedAt?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}
```

#### 交互回调

```tsx
<UserCard
  user={user}
  trigger={<Avatar src={user.avatar} />}
  config={{
    showFollowButton: true,
    showStats: true,
    showBio: true,
    showSocialLinks: true,
    onFollow: async (userId) => {
      await followUser(userId);
    },
    onUnfollow: async (userId) => {
      await unfollowUser(userId);
    },
    onMessage: async (userId) => {
      await openChat(userId);
    },
  }}
  onOpen={() => console.log('Card opened')}
  onClose={() => console.log('Card closed')}
/>
```

#### 紧凑型

```tsx
import { CompactUserCard } from '@/components/interactions';

<CompactUserCard
  user={user}
  size="md"
  trigger={<Avatar src={user.avatar} />}
/>
```

#### 文字触发器

```tsx
<UserCard
  user={user}
  trigger={
    <span className="text-blue-600 hover:underline cursor-pointer">
      @{user.username}
    </span>
  }
  config={{
    showFollowButton: false,
    showStats: false,
    showBio: false,
  }}
/>
```

## 最佳实践

### 1. 状态管理

建议使用状态管理库（如 Zustand）管理复杂的交互状态：

```tsx
import { create } from 'zustand';

interface InteractionStore {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
}

const useInteractionStore = create<InteractionStore>((set) => ({
  likes: {},
  bookmarks: {},
  toggleLike: (postId) =>
    set((state) => ({
      likes: { ...state.likes, [postId]: !state.likes[postId] },
    })),
  toggleBookmark: (postId) =>
    set((state) => ({
      bookmarks: { ...state.bookmarks, [postId]: !state.bookmarks[postId] },
    })),
}));

function PostCard({ post }) {
  const { likes, bookmarks, toggleLike, toggleBookmark } = useInteractionStore();

  return (
    <>
      <LikeButton
        likeState={{ isLiked: likes[post.id], count: post.likes }}
        onLike={() => toggleLike(post.id)}
      />
      <BookmarkButton
        bookmarkState={{ isBookmarked: bookmarks[post.id] }}
        onBookmark={() => toggleBookmark(post.id)}
      />
    </>
  );
}
```

### 2. 错误处理

处理异步操作的错误：

```tsx
const handleLike = async (isLiked: boolean) => {
  try {
    await likePost(postId, isLiked);
    setLikeState({ isLiked, count: isLiked ? count + 1 : count - 1 });
  } catch (error) {
    console.error('Failed to like:', error);
    // 显示错误提示
    toast.error('点赞失败，请重试');
    // 恢复状态
    setLikeState({ isLiked: !isLiked, count });
  }
};
```

### 3. 性能优化

对于大量卡片，可以禁用某些动画：

```tsx
<LikeButton
  likeState={likeState}
  onLike={handleLike}
  animationConfig={{
    type: 'scale',           // 使用简单动画
    enableParticles: false,   // 禁用粒子效果
  }}
/>
```

### 4. 响应式设计

根据屏幕尺寸选择组件：

```tsx
const isMobile = useMediaQuery('(max-width: 768px)');

return (
  <>
    {isMobile ? (
      <CompactLikeButton likeState={likeState} onLike={handleLike} />
    ) : (
      <LikeButton likeState={likeState} onLike={handleLike} showCount />
    )}
  </>
);
```

### 5. 可访问性

添加适当的 ARIA 属性：

```tsx
<LikeButton
  likeState={likeState}
  onLike={handleLike}
  aria-label={likeState.isLiked ? '取消点赞' : '点赞'}
  aria-pressed={likeState.isLiked}
/>
```

## API 参考

### LikeButtonProps

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `likeState` | `Partial<LikeState>` | `{}` | 点赞状态 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 尺寸 |
| `onLike` | `(isLiked: boolean) => void \| Promise<void>` | - | 点赞回调 |
| `showCount` | `boolean` | `false` | 显示计数 |
| `animationConfig` | `LikeAnimationConfig` | `{}` | 动画配置 |
| `variant` | `'outline' \| 'filled' \| 'ghost'` | `'ghost'` | 变体样式 |

### BookmarkButtonProps

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `bookmarkState` | `Partial<BookmarkState>` | `{}` | 收藏状态 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `onBookmark` | `(isBookmarked: boolean, folderId?: string) => void` | - | 收藏回调 |
| `folders` | `BookmarkFolder[]` | `[]` | 可用的收藏夹 |
| `onCreateFolder` | `(name: string) => Promise<BookmarkFolder>` | - | 创建收藏夹 |
| `showText` | `boolean` | `false` | 显示文本 |
| `variant` | `'outline' \| 'filled' \| 'ghost'` | `'ghost'` | 变体样式 |

### ShareButtonProps

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `shareOptions` | `ShareOptions` | - | 分享选项（必需） |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `onShare` | `(platform: SocialPlatform, options: ShareOptions) => void` | - | 分享回调 |
| `showText` | `boolean` | `false` | 显示文本 |
| `platforms` | `SocialPlatform[]` | `['twitter', 'facebook', 'linkedin', 'whatsapp', 'telegram', 'copy']` | 可用平台 |
| `variant` | `'outline' \| 'filled' \| 'ghost'` | `'ghost'` | 变体样式 |

### CommentPreviewProps

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `comments` | `Comment[]` | `[]` | 评论列表（必需） |
| `config` | `CommentPreviewConfig` | `{}` | 配置选项 |
| `onLikeComment` | `(commentId: string) => void` | - | 点赞评论 |
| `onReplyComment` | `(commentId: string) => void` | - | 回复评论 |
| `onViewAll` | `() => void` | - | 查看所有评论 |

### UserCardProps

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `user` | `UserCardInfo` | - | 用户信息（必需） |
| `trigger` | `React.ReactNode` | - | 触发器元素（必需） |
| `config` | `UserCardConfig` | `{}` | 配置选项 |
| `delayDuration` | `number` | `200` | 延迟显示（毫秒） |
| `onOpen` | `() => void` | - | 打开时的回调 |
| `onClose` | `() => void` | - | 关闭时的回调 |

## 示例页面

访问完整示例：

```bash
npm run dev
# 访问 http://localhost:3000/examples/card-interactions-demo
```

示例包含：
- ✅ 点赞功能（4 种动画类型，4 种尺寸）
- ✅ 收藏功能（收藏夹管理，新建收藏夹）
- ✅ 分享功能（9 种平台，分享面板）
- ✅ 评论预览（标准型、紧凑型）
- ✅ 用户卡片（标准型、紧凑型、完整版）

## 总结

卡片交互功能模块提供：

✅ **点赞动画** - 4 种动画类型，粒子效果
✅ **收藏功能** - 多收藏夹管理，创建收藏夹
✅ **分享功能** - 9 种平台，复制链接
✅ **评论预览** - 显示最新评论，互动功能
✅ **用户卡片** - Hover 预览，关注功能
✅ **紧凑型** - 适合移动端和小空间
✅ **自定义** - 颜色、样式、动画
✅ **类型安全** - 完整 TypeScript 支持
✅ **响应式** - 适配各种设备
✅ **完整文档** - 详细 API 和最佳实践

适用于任何需要卡片交互的场景！
