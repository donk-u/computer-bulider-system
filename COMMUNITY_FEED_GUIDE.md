# 社区动态流使用指南

完整的 Twitter 风格社区动态流系统。

## 目录

- [功能概述](#功能概述)
- [快速开始](#快速开始)
- [组件介绍](#组件介绍)
- [API 参考](#api-参考)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)

## 功能概述

### 核心功能

1. **动态流展示**
   - Twitter 风格的卡片设计
   - 支持帖子类型标签（构建、评测、指南、提问、讨论）
   - 难度级别标识（初级、中级、高级）
   - 性能雷达图展示

2. **排序功能**
   - 最新发布
   - 最受欢迎
   - 热门趋势
   - 最多点赞
   - 最多评论

3. **筛选功能**
   - 帖子类型筛选
   - 难度级别筛选
   - 价格范围筛选
   - 标签筛选
   - 筛选标签展示和移除

4. **布局模式**
   - 列表视图（默认）
   - 网格视图（2列/3列）
   - 紧凑视图

5. **交互功能**
   - 点赞/取消点赞
   - 收藏/取消收藏
   - 分享
   - 评论跳转
   - 更多操作（举报、隐藏、复制链接）

6. **无限滚动**
   - Intersection Observer 实现
   - 自动加载更多
   - 加载状态显示
   - 错误处理和重试

## 快速开始

### 1. 访问示例页面

```bash
npm run dev
# 访问 http://localhost:3000/examples/community-feed-demo
```

### 2. 基础使用

```tsx
import { CommunityFeed } from '@/components/community';

function CommunityPage() {
  return (
    <CommunityFeed
      onFetchPosts={fetchPosts}
      onLike={handleLike}
      onBookmark={handleBookmark}
      onShare={handleShare}
    />
  );
}
```

### 3. 自定义初始状态

```tsx
<CommunityFeed
  initialPosts={initialPosts}
  initialSort="popular"
  initialLayout="grid"
  onFetchPosts={fetchPosts}
/>
```

## 组件介绍

### CommunityFeed

主 Feed 组件，提供完整的动态流功能。

```typescript
interface CommunityFeedProps {
  initialPosts?: CommunityPost[];
  onFetchPosts?: (page, sort, filters) => Promise<PostsResponse>;
  onLike?: (postId) => Promise<void>;
  onBookmark?: (postId) => Promise<void>;
  onShare?: (postId) => Promise<void>;
  initialSort?: FeedSortOption;
  initialLayout?: FeedLayoutMode;
}
```

### FeedToolbar

工具栏组件，提供排序、筛选和布局切换功能。

```typescript
interface FeedToolbarProps {
  sortOption: FeedSortOption;
  onSortChange: (option: FeedSortOption) => void;
  filters: FeedFilterOptions;
  onFiltersChange: (filters: FeedFilterOptions) => void;
  layoutMode: FeedLayoutMode;
  onLayoutChange: (layout: FeedLayoutMode) => void;
  postCount?: number;
}
```

### BuildCard

构建卡片组件，展示用户分享的配置。

```typescript
interface BuildCardProps {
  post: CommunityPost;
  layout: FeedLayoutMode;
  onLike?: (postId) => void;
  onBookmark?: (postId) => void;
  onShare?: (postId) => void;
}
```

## API 参考

### 类型定义

#### CommunityPost

```typescript
interface CommunityPost {
  id: string;
  type: 'build' | 'review' | 'guide' | 'question' | 'discussion';
  author: PostAuthor;
  content: string;
  build?: BuildConfiguration;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  likedByCurrentUser: boolean;
  bookmarkedByCurrentUser: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  pinned?: boolean;
}
```

#### FeedSortOption

```typescript
type FeedSortOption = 'latest' | 'popular' | 'trending' | 'mostLiked' | 'mostCommented';
```

#### FeedFilterOptions

```typescript
interface FeedFilterOptions {
  postTypes: CommunityPostType[];
  priceRange: [number, number];
  components: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  tags: string[];
}
```

#### FeedLayoutMode

```typescript
type FeedLayoutMode = 'list' | 'grid' | 'compact';
```

#### PostsResponse

```typescript
interface PostsResponse {
  posts: CommunityPost[];
  total: number;
  hasMore: boolean;
  page: number;
}
```

## 使用示例

### 示例 1: 基础集成

```tsx
'use client';

import { CommunityFeed } from '@/components/community';
import type { PostsResponse } from '@/types/community';

async function fetchPosts(
  page: number,
  sort: FeedSortOption,
  filters: FeedFilterOptions
): Promise<PostsResponse> {
  const response = await fetch(`/api/posts?page=${page}&sort=${sort}`);
  return response.json();
}

function CommunityPage() {
  return (
    <div className="container mx-auto py-8">
      <CommunityFeed
        onFetchPosts={fetchPosts}
        onLike={async (postId) => {
          await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
        }}
        onBookmark={async (postId) => {
          await fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' });
        }}
        onShare={async (postId) => {
          navigator.share({ url: `/posts/${postId}` });
        }}
      />
    </div>
  );
}
```

### 示例 2: 预加载初始数据

```tsx
async function getServerSideProps() {
  const initialPosts = await fetch('/api/posts?page=1').then(r => r.json());

  return {
    props: {
      initialPosts: initialPosts.posts,
    },
  };
}

function CommunityPage({ initialPosts }) {
  return (
    <CommunityFeed
      initialPosts={initialPosts}
      onFetchPosts={fetchPosts}
    />
  );
}
```

### 示例 3: 自定义排序和布局

```tsx
function CommunityPage() {
  return (
    <CommunityFeed
      initialSort="popular"
      initialLayout="grid"
      onFetchPosts={fetchPosts}
    />
  );
}
```

### 示例 4: 集成 Supabase

```tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchPosts(
  page: number,
  sort: FeedSortOption,
  filters: FeedFilterOptions
): Promise<PostsResponse> {
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:author_id(*),
      build:build_id(*)
    `);

  // 应用筛选
  if (filters.postTypes.length > 0) {
    query = query.in('type', filters.postTypes);
  }

  // 应用排序
  const sortColumn = sort === 'latest' ? 'created_at' :
                    sort === 'mostLiked' ? 'likes' :
                    sort === 'mostCommented' ? 'comments' : 'popularity';

  query = query.order(sortColumn, { ascending: sort === 'latest' });

  // 分页
  const from = (page - 1) * 10;
  const to = from + 9;
  query = query.range(from, to);

  const { data, count } = await query;

  return {
    posts: data || [],
    total: count || 0,
    hasMore: to < (count || 0),
    page,
  };
}
```

## 最佳实践

### 1. 服务端数据获取

```tsx
// 使用 Next.js App Router
async function CommunityPage() {
  const initialPosts = await fetchPosts(1, 'latest', defaultFilters);

  return (
    <CommunityFeed
      initialPosts={initialPosts.posts}
      onFetchPosts={fetchPosts}
    />
  );
}
```

### 2. 错误处理

```tsx
const handleLike = async (postId: string) => {
  try {
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    toast.success('点赞成功');
  } catch (error) {
    console.error('点赞失败:', error);
    toast.error('操作失败，请重试');
  }
};
```

### 3. 性能优化

```tsx
// 使用 useCallback 避免不必要的重新渲染
const fetchPosts = useCallback(async (page, sort, filters) => {
  // ...
}, []);

// 使用 useMemo 缓存计算结果
const sortedPosts = useMemo(() => {
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}, [posts]);
```

### 4. 响应式设计

```tsx
// FeedContent 组件会自动根据布局模式调整
// 网格布局：1列（移动端）→ 2列（平板）→ 3列（桌面）
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {posts.map(post => <BuildCard key={post.id} post={post} />)}
</div>
```

## 总结

社区动态流系统提供：

✅ **Twitter 风格设计** - 熟悉的交互体验
✅ **5 种排序方式** - 最新、热门、趋势、点赞、评论
✅ **多维度筛选** - 类型、难度、价格、标签
✅ **3 种布局模式** - 列表、网格、紧凑
✅ **无限滚动** - Intersection Observer 实现
✅ **完整交互** - 点赞、收藏、分享、评论
✅ **性能雷达图** - 可视化构建性能
✅ **响应式设计** - 适配各种设备
✅ **类型安全** - 完整 TypeScript 支持
✅ **灵活集成** - 支持任何数据源
